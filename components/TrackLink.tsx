"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/track";

type TrackLinkProps = ComponentProps<typeof Link> & {
  event: string;
};

export function TrackLink({ event, onClick, ...props }: TrackLinkProps) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        trackEvent(event, { href: String(props.href) });
        onClick?.(clickEvent);
      }}
    />
  );
}
