import Link from "next/link";
import { SAMPLE_ANALYSIS, STATUS_COPY } from "@/lib/analysis";

export function SampleReport() {
  const status = STATUS_COPY[SAMPLE_ANALYSIS.status];

  return (
    <section className="fade-up delay-1 mx-auto mt-4 max-w-xl">
      <p className="mb-3 text-center text-xs uppercase tracking-[0.2em] text-muted">
        Example ghosting report
      </p>
      <div className="glass rounded-4xl p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-lavender">Ghosting probability</p>
            <p className="display mt-1 text-7xl font-extrabold leading-none">
              {SAMPLE_ANALYSIS.ghostingProbability}
              <span className="text-3xl text-muted">%</span>
            </p>
          </div>
          <div className="rounded-full border border-lavender/40 bg-lavender/10 px-3 py-1 text-sm text-lavender">
            {status.emoji} {status.label}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-muted">Interest</p>
            <p className="mt-1 text-2xl font-semibold">{SAMPLE_ANALYSIS.interestLevel} / 100</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-muted">Effort</p>
            <p className="mt-1 text-sm">
              You {SAMPLE_ANALYSIS.effortYou}% · Them {SAMPLE_ANALYSIS.effortThem}%
            </p>
          </div>
        </div>
        <blockquote className="mt-6 border-l-2 border-mint/70 pl-4 text-lg leading-snug">
          “{SAMPLE_ANALYSIS.verdict}”
        </blockquote>
        <Link href="/results?sample=1" className="mt-6 inline-block text-sm text-mint">
          Open this sample report
        </Link>
      </div>
    </section>
  );
}
