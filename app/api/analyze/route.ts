import { NextResponse } from "next/server";
import { analyzeConversation } from "@/lib/openai";
import type { AnalyzeRequest } from "@/lib/analysis";

export const maxDuration = 60;
export const runtime = "nodejs";

const MAX_IMAGES = 6;
const MAX_IMAGE_CHARS = 2_400_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const images = Array.isArray(body.images) ? body.images.slice(0, MAX_IMAGES) : [];

    const cleanedImages = images
      .filter((image) => image && typeof image.data === "string" && typeof image.mimeType === "string")
      .map((image) => ({
        mimeType: image.mimeType.startsWith("image/") ? image.mimeType : "image/jpeg",
        data: image.data.replace(/^data:image\/[a-zA-Z+]+;base64,/, ""),
      }));

    if (!text && cleanedImages.length === 0) {
      return NextResponse.json(
        { error: "Upload screenshots or paste a conversation." },
        { status: 400 },
      );
    }

    const payloadSize = cleanedImages.reduce((sum, image) => sum + image.data.length, 0);
    if (payloadSize > MAX_IMAGE_CHARS) {
      return NextResponse.json(
        { error: "Those screenshots are a little too heavy. Try fewer or crop them." },
        { status: 413 },
      );
    }

    const analysis = await analyzeConversation({
      text: text || undefined,
      images: cleanedImages,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The ghost detector glitched.";
    const status =
      message.includes("OPENAI_API_KEY") || message.includes(".env.local") || message.includes("Couldn't reach OpenAI")
        ? 503
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
