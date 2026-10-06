import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { getOpenAIOrgSpend } from "./openai-spend";

export const DAILY_BUDGET_USD = Number(process.env.DAILY_BUDGET_USD ?? 5);
export const MONTHLY_BUDGET_USD = Number(process.env.MONTHLY_BUDGET_USD ?? 20);
export const FREE_PER_DAY = 1;
export const RATE_LIMIT_PER_HOUR = 5;
const RESERVE_USD = 0.15;

const COOKIE_VISITOR = "ghosted_vid";
const COOKIE_FREE_DAY = "ghosted_free_day";
const STORE_PATH = path.join("/tmp", "ghosted-limits.json");

export type LimitCode = "daily_free_used" | "rate_limited" | "budget_capped";

export class LimitError extends Error {
  code: LimitCode;
  status: number;

  constructor(code: LimitCode, message: string, status = 429) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

type Store = {
  rate: Record<string, number[]>;
  freeVisitor: Record<string, string>;
  // Site-wide OpenAI spend, never keyed by visitor.
  globalSpendDay: Record<string, number>;
  globalSpendMonth: Record<string, number>;
};

type GlobalLimits = {
  store: Store;
  loaded: boolean;
  loadPromise: Promise<void> | null;
};

function globals() {
  const g = globalThis as typeof globalThis & { __ghostedLimits?: GlobalLimits };
  if (!g.__ghostedLimits) {
    g.__ghostedLimits = {
      store: { rate: {}, freeVisitor: {}, globalSpendDay: {}, globalSpendMonth: {} },
      loaded: false,
      loadPromise: null,
    };
  }
  return g.__ghostedLimits;
}

async function loadStore() {
  const g = globals();
  if (g.loaded) return;
  if (!g.loadPromise) {
    g.loadPromise = fs
      .readFile(STORE_PATH, "utf8")
      .then((raw) => {
        const parsed = JSON.parse(raw) as Store;
        const legacy = parsed as Store & { spendDay?: Record<string, number>; spendMonth?: Record<string, number> };
        g.store = {
          rate: legacy.rate ?? {},
          freeVisitor: legacy.freeVisitor ?? {},
          globalSpendDay: legacy.globalSpendDay ?? legacy.spendDay ?? {},
          globalSpendMonth: legacy.globalSpendMonth ?? legacy.spendMonth ?? {},
        };
      })
      .catch(() => undefined)
      .finally(() => {
        g.loaded = true;
      });
  }
  await g.loadPromise;
}

async function saveStore() {
  const { store } = globals();
  try {
    await fs.writeFile(STORE_PATH, JSON.stringify(store));
  } catch {
    // /tmp can be missing in some runtimes; in-memory still applies.
  }
}

export function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function monthKey(now = new Date()) {
  return now.toISOString().slice(0, 7);
}

export function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export function readCookies(request: Request) {
  const header = request.headers.get("cookie") ?? "";
  const map = new Map<string, string>();
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) map.set(key, decodeURIComponent(rest.join("=")));
  }
  return {
    visitorId: map.get(COOKIE_VISITOR) ?? null,
    freeDay: map.get(COOKIE_FREE_DAY) ?? null,
  };
}

export function cookieHeaders(visitorId: string, freeDay: string | null) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const base = `Path=/; SameSite=Lax; HttpOnly${secure}`;
  const headers = [`${COOKIE_VISITOR}=${visitorId}; Max-Age=31536000; ${base}`];
  if (freeDay) {
    headers.push(`${COOKIE_FREE_DAY}=${freeDay}; Max-Age=172800; ${base}`);
  }
  return headers;
}

export async function assertCanAnalyze(input: {
  visitorId: string | null;
  cookieFreeDay: string | null;
  ip: string;
}) {
  await loadStore();
  const store = globals().store;
  const now = Date.now();
  const day = todayKey();
  const month = monthKey();
  const visitorId = input.visitorId ?? crypto.randomUUID();
  const ipKey = hashIp(input.ip);

  const recent = (store.rate[ipKey] ?? []).filter((ts) => now - ts < 60 * 60 * 1000);
  store.rate[ipKey] = recent;
  if (recent.length >= RATE_LIMIT_PER_HOUR) {
    throw new LimitError(
      "rate_limited",
      "Easy, ghost hunter. That's too many tries in one hour. Come back a little later.",
    );
  }

  const usedToday = input.cookieFreeDay === day || store.freeVisitor[visitorId] === day;
  if (usedToday) {
    throw new LimitError(
      "daily_free_used",
      "You've used today's free analysis. Come back tomorrow — or grab the unlimited pass when payments go live.",
    );
  }

  const spend = await getGlobalOpenAISpend(store, day, month);
  if (spend.daily + RESERVE_USD > DAILY_BUDGET_USD || spend.monthly + RESERVE_USD > MONTHLY_BUDGET_USD) {
    throw new LimitError(
      "budget_capped",
      "Ghosted is taking a nap to keep the lights on. Try again tomorrow.",
      503,
    );
  }

  store.rate[ipKey] = [...recent, now];
  await saveStore();

  return { visitorId, day };
}

export async function recordSuccessfulAnalysis(visitorId: string, costUsd: number) {
  await loadStore();
  const store = globals().store;
  const day = todayKey();
  const month = monthKey();
  store.freeVisitor[visitorId] = day;
  store.globalSpendDay[day] = (store.globalSpendDay[day] ?? 0) + costUsd;
  store.globalSpendMonth[month] = (store.globalSpendMonth[month] ?? 0) + costUsd;
  await saveStore();
}

async function getGlobalOpenAISpend(store: Store, day: string, month: string) {
  const localDaily = store.globalSpendDay[day] ?? 0;
  const localMonthly = store.globalSpendMonth[month] ?? 0;
  const billed = await getOpenAIOrgSpend();
  return {
    daily: Math.max(localDaily, billed?.dailyUsd ?? 0),
    monthly: Math.max(localMonthly, billed?.monthlyUsd ?? 0),
  };
}

export function estimateCostUsd(usage?: { prompt_tokens?: number; completion_tokens?: number } | null) {
  const input = usage?.prompt_tokens ?? 2500;
  const output = usage?.completion_tokens ?? 400;
  const inputUsd = (input / 1_000_000) * 2.5;
  const outputUsd = (output / 1_000_000) * 10;
  return Math.max(0.01, Number((inputUsd + outputUsd).toFixed(4)));
}
