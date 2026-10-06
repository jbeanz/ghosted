"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasteBox } from "@/components/analyzer/PasteBox";
import { Uploader } from "@/components/analyzer/Uploader";
import { LoadingRitual } from "@/components/results/LoadingRitual";
import type { Analysis } from "@/lib/analysis";
import { recordAnalysis } from "@/lib/entitlements";
import type { PreparedImage } from "@/lib/images";
import { saveAnalysis } from "@/lib/session";
import { trackEvent } from "@/lib/track";

type Mode = "screenshots" | "paste";

export default function AnalyzePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("screenshots");
  const [images, setImages] = useState<PreparedImage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = mode === "screenshots" ? images.length > 0 : text.trim().length > 8;

  async function analyze() {
    setLoading(true);
    setError(null);
    trackEvent("analyze_submit", {
      mode,
      screenshots: images.length,
    });
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: mode === "paste" ? text : undefined,
          images:
            mode === "screenshots"
              ? images.map((image) => ({ mimeType: image.mimeType, data: image.data }))
              : undefined,
        }),
      });
      let payload: (Analysis & { error?: string }) | null = null;
      try {
        payload = (await response.json()) as Analysis & { error?: string };
      } catch {
        throw new Error("The analyzer dropped the connection. Try fewer screenshots or paste the text instead.");
      }
      if (!response.ok || !payload) {
        throw new Error(payload?.error || "The ghost detector glitched.");
      }
      saveAnalysis(payload);
      recordAnalysis();
      trackEvent("analyze_success", { status: payload.status, score: payload.ghostingProbability });
      router.push("/results");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went sideways.";
      trackEvent("analyze_error", { message: message.slice(0, 80) });
      setError(message);
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingRitual />;
  }

  return (
    <div className="mx-auto max-w-2xl fade-up">
      <p className="text-xs uppercase tracking-[0.22em] text-lavender">Investigate</p>
      <h1 className="display mt-2 text-4xl font-extrabold">Am I Being Ghosted?</h1>
      <p className="mt-3 text-muted">Upload the receipts. We&apos;ll investigate.</p>

      <div className="mt-6 grid grid-cols-2 rounded-full bg-white/5 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("screenshots")}
          className={`rounded-full py-2.5 ${mode === "screenshots" ? "bg-white text-night" : "text-muted"}`}
        >
          Analyze My Conversation
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`rounded-full py-2.5 ${mode === "paste" ? "bg-white text-night" : "text-muted"}`}
        >
          Paste Text Instead
        </button>
      </div>

      <div className="mt-6">
        {mode === "screenshots" ? (
          <Uploader images={images} onChange={setImages} />
        ) : (
          <PasteBox value={text} onChange={setText} />
        )}
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => void analyze()}
        className="mt-6 w-full rounded-full bg-mint py-3.5 text-base font-semibold text-night disabled:cursor-not-allowed disabled:opacity-40"
      >
        Analyze Conversation 👻
      </button>
      {error && <p className="mt-3 text-center text-sm text-rose">{error}</p>}
      <p className="mt-5 text-center text-sm text-muted">
        Your conversations are private. We only analyze what you choose to upload.
      </p>
    </div>
  );
}
