import { TrackLink } from "../TrackLink";
import { GhostMark } from "../GhostMark";

export function Hero() {
  return (
    <section className="fade-up relative overflow-hidden pb-10 pt-6 sm:pt-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="ghost-float mb-6">
          <GhostMark size={92} />
        </div>
        <p className="mb-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-lavender">
          Am I being ghosted?
        </p>
        <h1 className="display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Are they busy... or are you being ghosted? 👻
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
          Upload the receipts. We&apos;ll tell you how cooked you are.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <TrackLink
            event="click_analyze_cta"
            href="/analyze"
            className="rounded-full bg-mint px-7 py-3.5 text-base font-semibold text-night shadow-[0_10px_40px_rgba(125,255,195,0.25)] transition hover:translate-y-[-1px] hover:bg-[#9dffd3]"
          >
            Analyze My Texts
          </TrackLink>
          <p className="text-sm text-muted">No account required.</p>
        </div>
      </div>
    </section>
  );
}
