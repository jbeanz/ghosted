"use client";

import { PREMIUM_TEASE } from "@/lib/entitlements";

type PaywallTeaseProps = {
  title?: string;
  body?: string;
};

export function PaywallTease({
  title = "Come back tomorrow",
  body = "You get one free investigation a day. Payments aren't live yet — when they are, unlimited receipts will be $4.99/mo or $2.99 for 24 hours.",
}: PaywallTeaseProps) {
  return (
    <section className="glass rounded-3xl p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Daily free used</p>
      <h2 className="display mt-2 text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{body}</p>
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
