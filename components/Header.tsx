import Link from "next/link";
import { Container } from "./Container";
import { NAV_PRIMARY, SITE } from "@/lib/site";

/**
 * Site header. Two rows on mobile (wordmark, then nav scrolls horizontally
 * if needed); single row on desktop. No logo image — the wordmark in the
 * serif font is the mark.
 */
export function Header() {
  return (
    <header
      data-site-header
      className="border-b-hairline border-rule dark:border-rule-dark"
    >
      <Container>
        <div className="flex flex-col gap-3 py-8 md:flex-row md:items-baseline md:justify-between md:py-10">
          <Link
            href="/"
            className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark hover:no-underline"
            aria-label={`${SITE.name} — home`}
          >
            {SITE.name}
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-x-6 gap-y-2">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-small">
              {NAV_PRIMARY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Search — small magnifying glass linking to /search. Inline
                SVG so we don't pull in an icon library. */}
            <Link
              href="/search"
              aria-label="Search the library"
              className="text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="5" />
                <line x1="16" y1="16" x2="11.5" y2="11.5" />
              </svg>
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
