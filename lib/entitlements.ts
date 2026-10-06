export const PREMIUM_TEASE = {
  monthly: { price: "$4.99", period: "month", label: "Unlimited analyses" },
  pass: { price: "$2.99", period: "24 hours", label: "24-hour unlimited pass" },
} as const;

export type LimitCode = "daily_free_used" | "rate_limited" | "budget_capped";

const COUNT_KEY = "ghosted:analysis-count";
const DAY_KEY = "ghosted:free-day";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getAnalysisCount() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(COUNT_KEY);
  const count = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(count) ? count : 0;
}

export function recordAnalysis() {
  if (typeof window === "undefined") return 1;
  window.localStorage.setItem(DAY_KEY, today());
  const next = getAnalysisCount() + 1;
  window.localStorage.setItem(COUNT_KEY, String(next));
  return next;
}

export function usedFreeToday() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DAY_KEY) === today();
}

export function shouldShowPaywall() {
  return usedFreeToday() || getAnalysisCount() >= 1;
}
