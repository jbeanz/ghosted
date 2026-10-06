import { LegalPage } from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        <strong className="text-ink">Your conversations are private.</strong> We only analyze what you choose to
        upload.
      </p>
      <p>
        Screenshots and pasted text are sent to our analysis API so we can extract visible messages and generate a
        report. They are processed in memory for that request and are not written to a database or shown publicly.
      </p>
      <p>
        We do not include conversation contents in share cards. A share card only has your score, status, a short
        verdict, and the Ghosted URL.
      </p>
      <p>
        The result lives in your browser session so you can view and share it. Refreshing later or using another
        device will not recover an old conversation.
      </p>
      <p>
        Analysis currently uses OpenAI to read screenshots and write the verdict. Do not upload anything you are
        not comfortable sending through that processing step.
      </p>
      <p>We do not sell conversation data. We do not build a public social graph from your receipts.</p>
    </LegalPage>
  );
}
