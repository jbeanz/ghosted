import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <article className="mx-auto max-w-2xl fade-up">
      <h1 className="display text-4xl font-extrabold">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted">{children}</div>
    </article>
  );
}
