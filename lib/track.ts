"use client";

import { track } from "@vercel/analytics";

const VISITOR_KEY = "ghosted:visitor-id";

export function getVisitorId() {
  if (typeof window === "undefined") return "server";
  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(VISITOR_KEY, id);
  return id;
}

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean | null>,
) {
  const visitor = getVisitorId();
  track(name, {
    visitor,
    ...props,
  });
}
