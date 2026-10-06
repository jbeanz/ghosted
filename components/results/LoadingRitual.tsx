"use client";

import { useEffect, useState } from "react";
import { GhostMark } from "../GhostMark";

const MESSAGES = [
  "Reviewing the evidence...",
  "Checking response times...",
  "Looking for suspicious behavior...",
  "Consulting the ghost detector...",
  "This isn't looking great...",
];

export function LoadingRitual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % MESSAGES.length);
    }, 1700);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <div className="ghost-float">
        <GhostMark size={88} />
      </div>
      <p className="display mt-8 text-3xl font-bold" key={MESSAGES[index]}>
        {MESSAGES[index]}
      </p>
      <div className="mt-6 flex gap-2">
        {MESSAGES.map((message, i) => (
          <span
            key={message}
            className={`h-1.5 w-8 rounded-full ${i === index ? "bg-mint" : "bg-white/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
