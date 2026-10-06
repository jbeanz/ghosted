const examples = [
  {
    score: 18,
    status: "Probably Not Ghosting",
    verdict: "They're texting back like a functioning human. You might just be spiraling.",
  },
  {
    score: 64,
    status: "Pulling Away",
    verdict: "The vibe didn't die. It just started leaving early and not saying goodbye.",
  },
  {
    score: 94,
    status: "Hard Ghosting",
    verdict: "This isn't mixed signals. This is a haunted house with the Wi-Fi turned off.",
  },
];

export function ExampleVerdicts() {
  return (
    <section className="mx-auto mt-20 max-w-4xl">
      <h2 className="display text-center text-3xl font-bold sm:text-4xl">Fake receipts. Real energy.</h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-muted">
        A few example verdicts so you know what you&apos;re walking into.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {examples.map((example) => (
          <article key={example.status} className="glass rounded-3xl p-5">
            <p className="display text-4xl font-extrabold">{example.score}%</p>
            <p className="mt-2 text-sm text-lavender">{example.status}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">“{example.verdict}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
