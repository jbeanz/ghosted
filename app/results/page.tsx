"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GhostReport } from "@/components/results/GhostReport";
import { PaywallTease } from "@/components/results/PaywallTease";
import { ShareCard } from "@/components/results/ShareCard";
import { ViralLoop } from "@/components/results/ViralLoop";
import type { Analysis } from "@/lib/analysis";
import { shouldShowPaywall } from "@/lib/entitlements";
import { loadAnalysis, loadSampleAnalysis } from "@/lib/session";

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [ready, setReady] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAnalysis(params.get("sample") === "1" ? loadSampleAnalysis() : loadAnalysis());
    setShowPaywall(shouldShowPaywall());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-[50vh]" />;
  }

  if (!analysis) {
    return (
      <div className="mx-auto max-w-md pt-20 text-center">
        <h1 className="display text-3xl font-bold">No receipts in evidence.</h1>
        <p className="mt-3 text-muted">Analyze a conversation first and we&apos;ll keep the report here.</p>
        <Link href="/analyze" className="mt-6 inline-flex rounded-full bg-mint px-6 py-3 font-semibold text-night">
          Analyze My Texts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_360px]">
      <GhostReport analysis={analysis} />
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <ShareCard analysis={analysis} />
        <ViralLoop analysis={analysis} />
        {showPaywall && <PaywallTease />}
      </aside>
    </div>
  );
}
