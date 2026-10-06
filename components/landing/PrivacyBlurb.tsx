import Link from "next/link";

export function PrivacyBlurb() {
  return (
    <section className="mx-auto mt-20 max-w-2xl text-center">
      <div className="glass rounded-4xl px-6 py-10">
        <h2 className="display text-2xl font-bold sm:text-3xl">Your conversations are private.</h2>
        <p className="mt-3 text-muted">
          We only analyze what you choose to upload. Screenshots are processed for the analysis,
          then discarded. Share cards never include the conversation.
        </p>
        <Link href="/privacy" className="mt-5 inline-block text-sm text-mint underline-offset-4 hover:underline">
          Read the privacy policy
        </Link>
      </div>
    </section>
  );
}
