"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { getVisitorId, trackEvent } from "@/lib/track";

export function Analytics() {
  useEffect(() => {
    getVisitorId();
    trackEvent("session_start", { path: window.location.pathname });
  }, []);

  return <VercelAnalytics />;
}
