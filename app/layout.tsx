import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { SITE } from "@/lib/site";

import "./globals.css";

// Load with `display: swap` and Latin subset only — keeps the font payload
// small and prevents invisible-text-during-fontload blink.
//
// Note: `axes` (e.g. opsz) is only available when `weight` is unset/variable.
// We deliberately fix the weights to 400 and 500 — the design system permits
// no others — so we forgo the optical-size axis. Static is also smaller.
const fontSerif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500"],
});

const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.tagline,
  openGraph: {
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSerif.variable} ${fontSans.variable}`}>
      {/* suppressHydrationWarning on <body> guards against attribute
          injection by browser extensions (Grammarly, ColorZilla, password
          managers) which write to the body element before React hydrates.
          The mismatch is the extension's, not ours — React's escape hatch
          for exactly this case. */}
      <body suppressHydrationWarning>
        <SkipLink />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <OrganizationJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
