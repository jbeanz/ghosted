export type AnalysisMode = "ghosted";

export type GhostStatus =
  | "probably_not"
  | "mixed_signals"
  | "pulling_away"
  | "soft_ghosting"
  | "hard_ghosting";

export type Analysis = {
  mode: AnalysisMode;
  ghostingProbability: number;
  status: GhostStatus;
  interestLevel: number;
  effortYou: number;
  effortThem: number;
  evidence: string[];
  verdict: string;
  explanation: string;
  recommendedMove: string;
  overthinking: boolean;
  uncertainty: string | null;
};

export type AnalyzeRequest = {
  text?: string;
  images?: { mimeType: string; data: string }[];
};

export const STATUS_COPY: Record<
  GhostStatus,
  { label: string; emoji: string; tone: string }
> = {
  probably_not: {
    label: "Probably Not Ghosting",
    emoji: "🟢",
    tone: "mint",
  },
  mixed_signals: {
    label: "Mixed Signals",
    emoji: "🟡",
    tone: "gold",
  },
  pulling_away: {
    label: "Pulling Away",
    emoji: "🟠",
    tone: "orange",
  },
  soft_ghosting: {
    label: "Soft Ghosting",
    emoji: "👻",
    tone: "lavender",
  },
  hard_ghosting: {
    label: "Hard Ghosting",
    emoji: "💀",
    tone: "rose",
  },
};

export const SAMPLE_ANALYSIS: Analysis = {
  mode: "ghosted",
  ghostingProbability: 87,
  status: "soft_ghosting",
  interestLevel: 31,
  effortYou: 78,
  effortThem: 22,
  evidence: [
    "Their replies became significantly slower after Thursday.",
    "They stopped asking follow-up questions.",
    "You initiated the last three conversations.",
    "Their messages got shorter — one or two words, no plans.",
    "They have not attempted to continue the conversation.",
  ],
  verdict:
    "Bestie... they're not exactly ghosting you yet. But they've definitely started turning the lights off.",
  explanation:
    "Based on the conversation, their engagement appears to have decreased. There isn't enough evidence to know why, but the recent pattern suggests you should stop initiating for now and see whether they reach out.",
  recommendedMove:
    "Don't double text. Give them some space and see whether they initiate.",
  overthinking: false,
  uncertainty: null,
};

export const ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "mode",
    "ghostingProbability",
    "status",
    "interestLevel",
    "effortYou",
    "effortThem",
    "evidence",
    "verdict",
    "explanation",
    "recommendedMove",
    "overthinking",
    "uncertainty",
  ],
  properties: {
    mode: { type: "string", enum: ["ghosted"] },
    ghostingProbability: { type: "integer", minimum: 0, maximum: 100 },
    status: {
      type: "string",
      enum: [
        "probably_not",
        "mixed_signals",
        "pulling_away",
        "soft_ghosting",
        "hard_ghosting",
      ],
    },
    interestLevel: { type: "integer", minimum: 0, maximum: 100 },
    effortYou: { type: "integer", minimum: 0, maximum: 100 },
    effortThem: { type: "integer", minimum: 0, maximum: 100 },
    evidence: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" },
    },
    verdict: { type: "string" },
    explanation: { type: "string" },
    recommendedMove: { type: "string" },
    overthinking: { type: "boolean" },
    uncertainty: { type: ["string", "null"] },
  },
} as const;

export const SYSTEM_PROMPT = `You are Ghosted, a funny, slightly savage, but never cruel dating-text analyst.

Your only job in this MVP is to answer: "Am I being ghosted?"

Personality:
- Conversational, meme-aware, supportive
- Funny without being mean
- Never pretend to know someone's actual feelings
- Never make definitive psychological claims
- Clear when evidence is ambiguous
- Use phrases like "Based on the conversation..." and "The pattern suggests..." and "There's not enough evidence to know for sure..."
- Never say "They definitely don't like you."

Screenshot / OCR rules:
- Extract visible messages in order if images are provided
- Attempt to identify two participants (You vs Them). If the uploader's side is unclear, infer the more eager / initiating side as You and say so in uncertainty
- Preserve message order
- Extract timestamps only when visible
- Do NOT invent missing messages
- If OCR is uncertain, incomplete, or screenshots are cropped, set uncertainty and only use what you can actually see
- Never fabricate evidence. Every evidence bullet must be grounded in the provided conversation

Analysis rules:
- ghostingProbability: 0-100
- status must be one of the allowed enum values
- interestLevel: 0-100 based on their engagement, not the user's
- effortYou + effortThem should add up to 100
- evidence: 3-5 specific observations
- verdict: one short, shareable, funny line (1-2 sentences)
- explanation: a useful, grounded paragraph under the joke
- recommendedMove: one clear next action
- overthinking: true if the chat still looks mutually engaged and the user is likely spiraling
- If the conversation is too short or unreadable, lower confidence via uncertainty and avoid extreme scores unless the silence/pattern is obvious

Return ONLY the JSON object matching the schema.`;

export function validateAnalysis(value: unknown): Analysis {
  if (!value || typeof value !== "object") {
    throw new Error("Analysis response was empty.");
  }

  const data = value as Partial<Analysis>;
  const status = data.status;
  const allowed: GhostStatus[] = [
    "probably_not",
    "mixed_signals",
    "pulling_away",
    "soft_ghosting",
    "hard_ghosting",
  ];

  if (!status || !allowed.includes(status)) {
    throw new Error("Analysis was missing a valid status.");
  }

  const clamp = (n: unknown, fallback = 0) => {
    const num = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : fallback;
    return Math.min(100, Math.max(0, num));
  };

  const evidence = Array.isArray(data.evidence)
    ? data.evidence.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 5)
    : [];

  if (evidence.length < 3) {
    throw new Error("Analysis did not include enough grounded evidence.");
  }

  let effortYou = clamp(data.effortYou, 50);
  let effortThem = clamp(data.effortThem, 50);
  if (effortYou + effortThem !== 100) {
    const total = Math.max(1, effortYou + effortThem);
    effortYou = Math.round((effortYou / total) * 100);
    effortThem = 100 - effortYou;
  }

  return {
    mode: "ghosted",
    ghostingProbability: clamp(data.ghostingProbability),
    status,
    interestLevel: clamp(data.interestLevel),
    effortYou,
    effortThem,
    evidence,
    verdict: typeof data.verdict === "string" ? data.verdict.trim() : "The receipts are... inconclusive.",
    explanation:
      typeof data.explanation === "string"
        ? data.explanation.trim()
        : "Based on the conversation, there is not enough evidence to know for sure.",
    recommendedMove:
      typeof data.recommendedMove === "string"
        ? data.recommendedMove.trim()
        : "Pause. Don't double text until they initiate.",
    overthinking: Boolean(data.overthinking),
    uncertainty: typeof data.uncertainty === "string" && data.uncertainty.trim() ? data.uncertainty.trim() : null,
  };
}
