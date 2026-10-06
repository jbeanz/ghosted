import OpenAI from "openai";

type OrgSpend = {
  dailyUsd: number;
  monthlyUsd: number;
};

type Cache = {
  value: OrgSpend | null;
  expiresAt: number;
};

const g = globalThis as typeof globalThis & { __ghostedOpenAISpend?: Cache };

function cache() {
  if (!g.__ghostedOpenAISpend) {
    g.__ghostedOpenAISpend = { value: null, expiresAt: 0 };
  }
  return g.__ghostedOpenAISpend;
}

function startOfUtcDay(now = new Date()) {
  return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000);
}

function startOfUtcMonth(now = new Date()) {
  return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1000);
}

function bucketUsd(results: Array<{ object: string; amount?: { value?: number | null } | null }>) {
  return results.reduce((sum, result) => {
    if (result.object === "organization.costs.result" && typeof result.amount?.value === "number") {
      return sum + result.amount.value;
    }
    return sum;
  }, 0);
}

export async function getOpenAIOrgSpend(): Promise<OrgSpend | null> {
  const cached = cache();
  if (cached.value && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const apiKey = process.env.OPENAI_ADMIN_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  try {
    const openai = new OpenAI({ apiKey });
    const now = new Date();
    const monthStart = startOfUtcMonth(now);
    const dayStart = startOfUtcDay(now);
    const costs = await openai.admin.organization.usage.costs({
      start_time: monthStart,
      bucket_width: "1d",
      limit: 31,
    });

    let monthlyUsd = 0;
    let dailyUsd = 0;
    for (const bucket of costs.data) {
      const usd = bucketUsd(bucket.results);
      monthlyUsd += usd;
      if (bucket.start_time >= dayStart) dailyUsd += usd;
    }

    const value = {
      dailyUsd: Number(dailyUsd.toFixed(4)),
      monthlyUsd: Number(monthlyUsd.toFixed(4)),
    };
    cached.value = value;
    cached.expiresAt = Date.now() + 60_000;
    return value;
  } catch {
    return cached.value;
  }
}
