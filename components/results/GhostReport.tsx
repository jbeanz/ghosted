"use client";

import { useEffect, useState } from "react";
import { STATUS_COPY, type Analysis } from "@/lib/analysis";

function useCountUp(value: number) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return shown;
}

function EffortBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function GhostReport({ analysis }: { analysis: Analysis }) {
  const score = useCountUp(analysis.ghostingProbability);
  const status = STATUS_COPY[analysis.status];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-lavender">Ghosting report</p>
        <h1 className="display mt-2 text-3xl font-extrabold sm:text-4xl">👻 GHOSTING REPORT</h1>
      </div>

      <section className="glass fade-up rounded-4xl p-6 text-center sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Ghosting probability</p>
        <p className="display mt-2 text-8xl font-extrabold leading-none sm:text-9xl">
          {score}
          <span className="text-4xl text-muted">%</span>
        </p>
        <p className="mt-3 text-2xl">{Array.from({ length: Math.min(3, Math.ceil(analysis.ghostingProbability / 34)) }, () => "👻").join("")}</p>
        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
          {status.emoji} {status.label.toUpperCase()}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="glass fade-up delay-1 rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Interest level</p>
          <p className="display mt-2 text-4xl font-bold">
            {analysis.interestLevel} <span className="text-lg text-muted">/ 100</span>
          </p>
        </section>
        <section className="glass fade-up delay-2 rounded-3xl p-5">
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Effort balance</p>
          <div className="space-y-3">
            <EffortBar label="You" value={analysis.effortYou} color="bg-lavender" />
            <EffortBar label="Them" value={analysis.effortThem} color="bg-mint" />
          </div>
        </section>
      </div>

      {analysis.uncertainty && (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
          {analysis.uncertainty}
        </p>
      )}

      <section className="glass fade-up delay-3 rounded-3xl p-6">
        <h2 className="display text-xl font-bold">Evidence</h2>
        <ul className="mt-4 space-y-3">
          {analysis.evidence.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="glass fade-up delay-4 rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-mint">The verdict</p>
        <blockquote className="display mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
          “{analysis.verdict}”
        </blockquote>
        <p className="mt-4 text-sm leading-relaxed text-muted">{analysis.explanation}</p>
        {analysis.overthinking && (
          <p className="mt-4 rounded-2xl bg-white/5 px-4 py-3 text-sm">
            🤡 Based on the conversation, you might be overthinking this one.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-mint/30 bg-mint/10 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-mint">Recommended move</p>
        <p className="mt-2 text-lg font-semibold">{analysis.recommendedMove}</p>
      </section>
    </div>
  );
}
