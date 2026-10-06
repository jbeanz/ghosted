import OpenAI from "openai";
import {
  ANALYSIS_JSON_SCHEMA,
  SYSTEM_PROMPT,
  validateAnalysis,
  type Analysis,
  type AnalyzeRequest,
} from "./analysis";

const MODEL = "gpt-4o";

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey === "sk-your-key-here") {
    throw new Error("Add your OpenAI API key to .env.local as OPENAI_API_KEY, then restart the server.");
  }
  return apiKey;
}

function explainOpenAIError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("OPENAI_API_KEY") || message.includes(".env.local")) return message;
  if (message === "Connection error." || message.toLowerCase().includes("connection error")) {
    return "Couldn't reach OpenAI. Check your internet connection, then confirm OPENAI_API_KEY in .env.local.";
  }
  if (message.toLowerCase().includes("incorrect api key") || message.toLowerCase().includes("invalid api key")) {
    return "That OpenAI API key was rejected. Replace OPENAI_API_KEY in .env.local with a real key and restart.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "The ghost detector glitched.";
}

export async function analyzeConversation(input: AnalyzeRequest): Promise<Analysis> {
  const apiKey = getApiKey();

  const images = input.images ?? [];
  const text = input.text?.trim() ?? "";

  if (!text && images.length === 0) {
    throw new Error("Upload screenshots or paste a conversation.");
  }

  const openai = new OpenAI({ apiKey });

  const content: OpenAI.Chat.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: buildUserPrompt(text, images.length),
    },
    ...images.map((image) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:${image.mimeType};base64,${image.data}`,
        detail: "high" as const,
      },
    })),
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.6,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ghosted_analysis",
          strict: true,
          schema: ANALYSIS_JSON_SCHEMA,
        },
      },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("The ghost detector came back empty.");
    }

    return validateAnalysis(JSON.parse(raw));
  } catch (error) {
    throw new Error(explainOpenAIError(error));
  }
}

function buildUserPrompt(text: string, imageCount: number) {
  const parts = [
    "Analyze this dating/text conversation for ghosting.",
    "Return the JSON analysis only.",
  ];

  if (imageCount > 0) {
    parts.push(
      `${imageCount} screenshot${imageCount === 1 ? "" : "s"} attached, in chronological order unless the UI said otherwise.`,
      "Read the bubbles carefully. Do not invent messages that are not visible.",
    );
  }

  if (text) {
    parts.push("Pasted conversation:\n\n" + text);
  }

  return parts.join("\n\n");
}
