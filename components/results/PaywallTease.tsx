"use client";

import { PREMIUM_TEASE } from "@/lib/entitlements";

export function PaywallTease() {
  return (
    <section className="glass rounded-3xl p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">First analysis free</p>
      <h2 className="display mt-2 text-2xl font-bold">Need unlimited investigations?</h2>
      <p className="mt-2 text-sm text-muted">
        Payments aren&apos;t live yet. When they are, you&apos;ll be able to keep running receipts.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-lg font-semibold">{PREMIUM_TEASE.monthly.price}/mo</p>
          <p className="text-sm text-muted">{PREMIUM_TEASE.monthly.label}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-lg font-semibold">{PREMIUM_TEASE.pass.price}</p>
          <p className="text-sm text-muted">{PREMIUM_TEASE.pass.label}</p>
        </div>
      </div>
    </section>
  );
}
