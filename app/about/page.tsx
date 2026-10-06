import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export default function AboutPage() {
  return (
    <LegalPage title="About Ghosted">
      <p>
        Ghosted answers one question: <strong className="text-ink">Am I being ghosted?</strong> Upload screenshots
        or paste a conversation. We look at effort, response patterns, and momentum, then give you a funny but
        useful verdict.
      </p>
      <p>
        This is a dating-text companion, not a therapist and not a mind reader. We never claim to know how someone
        actually feels. We only talk about the pattern in the conversation you uploaded.
      </p>
      <p>No accounts. No profiles. No feed. You should be able to get a verdict in under a minute.</p>
      <p>
        Future modes — Do they like me? What should I reply? Red flags — are coming later. The MVP is just the
        ghost detector.
      </p>
      <p>
        <Link href="/analyze" className="text-mint">
          Analyze a conversation
        </Link>
      </p>
    </LegalPage>
  );
}
