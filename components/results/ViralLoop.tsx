"use client";

import Link from "next/link";
import { useState } from "react";
import type { Analysis } from "@/lib/analysis";
import { getShareText, getShareUrl } from "@/lib/session";
import { trackEvent } from "@/lib/track";

export function ViralLoop({ analysis }: { analysis: Analysis }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl();

  async function sendToFriend() {
    trackEvent("send_to_friend", { status: analysis.status });
    const text = `${getShareText(analysis)} ${shareUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ghosted", text, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="space-y-4">
      <p className="text-center text-sm text-muted">Think we&apos;re wrong? Send this to your best friend.</p>
      <div className="glass rounded-3xl p-6">
        <h2 className="display text-2xl font-bold">Need a second opinion?</h2>
        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={() => void sendToFriend()}
            className="rounded-full border border-white/15 bg-white/5 py-3 font-medium"
          >
            {copied ? "Link copied" : "Send to Friend"}
          </button>
          <Link href="/analyze" className="rounded-full border border-white/15 bg-white/5 py-3 text-center font-medium">
            Analyze Another Conversation
          </Link>
          <Link href="/" className="rounded-full bg-lavender/15 py-3 text-center font-medium text-lavender">
            Is YOUR friend being ghosted?
          </Link>
        </div>
      </div>
    </section>
  );
}
