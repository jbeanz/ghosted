import type { Metadata } from "next";
import { Geist, Syne } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ghosted — Am I Being Ghosted?",
  description: "Upload the receipts. We'll tell you how cooked you are.",
  metadataBase: new URL("https://ghosted.app"),
  openGraph: {
    title: "Ghosted — Am I Being Ghosted?",
    description: "Upload the receipts. We'll tell you how cooked you are.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${syne.variable} antialiased`}>
        <Nav />
        <main className="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-content px-5 pb-16 pt-8 sm:px-8">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
