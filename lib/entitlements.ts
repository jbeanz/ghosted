const COUNT_KEY = "ghosted:analysis-count";

export function getAnalysisCount() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(COUNT_KEY);
  const count = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(count) ? count : 0;
}

export function recordAnalysis() {
  if (typeof window === "undefined") return 1;
  const next = getAnalysisCount() + 1;
  window.localStorage.setItem(COUNT_KEY, String(next));
  return next;
}

export function shouldShowPaywall() {
  return getAnalysisCount() >= 1;
}

export const PREMIUM_TEASE = {
  monthly: { price: "$4.99", period: "month", label: "Unlimited analyses" },
  pass: { price: "$2.99", period: "24 hours", label: "24-hour unlimited pass" },
} as const;
