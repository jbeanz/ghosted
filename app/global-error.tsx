"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#07060c", color: "#f6f1ff", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 420, margin: "20vh auto", textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Ghosted hit a wall.</h1>
          <p style={{ color: "#b8adc9", marginBottom: 24 }}>
            A required page error boundary failed to load. Refresh or try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#7dffc3",
              color: "#07060c",
              border: 0,
              borderRadius: 999,
              padding: "10px 18px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
