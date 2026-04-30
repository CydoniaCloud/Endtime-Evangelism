/**
 * Site-wide constants. The single source of truth for the site's name,
 * tagline, URL, and primary navigation. Edit here, not in the components.
 */

export const SITE = {
  name: "Endtime Evangelism",
  shortName: "Endtime Evangelism",
  tagline: "The principal theme of the Bible is Jesus Christ.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://endtimeevangelism.example",
  // Set to a real street address before launch. While null, the footer
  // hides the address line entirely — placeholder text never ships.
  ministryAddress: null as string | null,
} as const;

export const NAV_PRIMARY = [
  { href: "/start", label: "Start here" },
  { href: "/library", label: "Read & listen" },
  { href: "/studies", label: "Deeper studies" },
  { href: "/about", label: "About" },
] as const;

export const NAV_FOOTER = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/statement-of-faith", label: "Statement of faith" },
  { href: "/feed.xml", label: "RSS" },
] as const;
