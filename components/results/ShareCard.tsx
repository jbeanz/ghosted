"use client";

import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import { STATUS_COPY, type Analysis } from "@/lib/analysis";
import { getShareUrl } from "@/lib/session";
import { trackEvent } from "@/lib/track";
import { GhostMark } from "../GhostMark";

type ShareCardProps = {
  analysis: Analysis;
};

export function ShareCard({ analysis }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = STATUS_COPY[analysis.status];
  const shareUrl = getShareUrl();

  async function makeImage() {
    if (!cardRef.current) throw new Error("Share card is not ready.");
    return toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      width: 360,
      height: 450,
    });
  }

  async function share() {
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await makeImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "ghosted-verdict.png", { type: "image/png" });
      const payload = {
        files: [file],
        title: "Ghosted verdict",
        text: `${analysis.ghostingProbability}% · ${status.label}. ${shareUrl}`,
      };

      trackEvent("share_verdict", { status: status.label, score: analysis.ghostingProbability });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share(payload);
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "ghosted-verdict.png";
        link.click();
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Could not create the share card. Try downloading instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="overflow-hidden">
        <div
          ref={cardRef}
          className="relative mx-auto flex h-[450px] w-[360px] flex-col justify-between overflow-hidden rounded-[28px] p-7 text-left"
          style={{
            background: "linear-gradient(165deg, #161221 0%, #0b0912 55%, #1a1230 100%)",
            color: "#f6f1ff",
          }}
        >
          <div className="flex items-center gap-2">
            <GhostMark size={34} />
            <span className="display text-lg font-bold">Ghosted</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#c9b6ff]">Ghosting probability</p>
            <p className="display text-[84px] font-extrabold leading-none">
              {analysis.ghostingProbability}
              <span className="text-3xl text-[#b8adc9]">%</span>
            </p>
            <p className="mt-2 text-sm text-[#c9b6ff]">
              {status.emoji} {status.label.toUpperCase()}
            </p>
          </div>
          <p className="display text-xl font-semibold leading-snug">“{analysis.verdict}”</p>
          <p className="text-sm text-[#7dffc3]">{shareUrl.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void share()}
        disabled={busy}
        className="mt-5 w-full rounded-full bg-mint py-3.5 font-semibold text-night disabled:opacity-60"
      >
        {busy ? "Making the card..." : "Share My Verdict"}
      </button>
      {error && <p className="mt-2 text-center text-sm text-rose">{error}</p>}
    </div>
  );
}
