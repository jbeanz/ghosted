import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-5 py-8 text-sm text-muted sm:px-8">
      <div className="mx-auto flex w-full max-w-content flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>Your conversations are private. We only analyze what you choose to upload.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
