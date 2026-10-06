const steps = [
  {
    n: "1",
    title: "Upload the receipts",
    body: "Upload screenshots or paste your conversation.",
  },
  {
    n: "2",
    title: "We investigate",
    body: "Ghosted analyzes the conversation, response patterns, and effort.",
  },
  {
    n: "3",
    title: "Get your verdict",
    body: "Find out whether you're being ghosted, overthinking, or somewhere in between.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto mt-20 max-w-4xl">
      <h2 className="display text-center text-3xl font-bold sm:text-4xl">How it works</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.n} className="glass rounded-3xl p-6">
            <p className="display text-mint text-sm font-semibold">0{step.n}</p>
            <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
