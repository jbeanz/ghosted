import { LegalPage } from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms">
      <p>
        Ghosted is an entertainment and pattern-reading tool. It does not provide medical, legal, or professional
        relationship advice. Verdicts are generated from the conversation you provide and can be wrong.
      </p>
      <p>
        You are responsible for only uploading conversations you have a right to share. Do not upload other
        people&apos;s private messages without their permission if that would violate the law or a platform&apos;s
        rules.
      </p>
      <p>
        Ghosted does not guarantee accuracy. Response-time reads depend on what is visible in your screenshots or
        paste. Incomplete receipts can produce incomplete reports.
      </p>
      <p>The first analysis is free. Paid unlimited analysis may be offered later. Pricing can change.</p>
      <p>Use Ghosted for fun, then go touch grass.</p>
    </LegalPage>
  );
}
