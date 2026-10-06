import { SAMPLE_ANALYSIS, type Analysis } from "./analysis";

const RESULT_KEY = "ghosted:last-result";
const SITE_URL = "https://ghosted.app";

export function saveAnalysis(analysis: Analysis) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(analysis));
}

export function loadAnalysis(): Analysis | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Analysis;
  } catch {
    return null;
  }
}

export function clearAnalysis() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESULT_KEY);
}

export function loadSampleAnalysis(): Analysis {
  saveAnalysis(SAMPLE_ANALYSIS);
  return SAMPLE_ANALYSIS;
}

export function getShareUrl() {
  if (typeof window === "undefined") return SITE_URL;
  return window.location.origin;
}

export function getShareText(analysis: Analysis) {
  return `${analysis.ghostingProbability}% chance I'm being ghosted. Status: ${analysis.status.replaceAll("_", " ")}. Check Ghosted.`;
}
