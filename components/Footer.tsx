import Link from "next/link";
import { Container } from "./Container";
import { NAV_FOOTER, SITE } from "@/lib/site";

/**
 * Site footer. Sober and sparse — wordmark, three utility links, ministry
 * address, copyright. No social icons (the site invites slow reading).
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-site-footer
      className="mt-24 border-t-hairline border-rule dark:border-rule-dark py-12"
    >
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-h3">{SITE.name}</p>
            <p className="text-small text-ink-3 mt-1 max-w-xs">{SITE.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-small">
              {NAV_FOOTER.map((item) => (
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
          </nav>
        </div>
        <p className="text-caption text-ink-3 mt-12">
          {SITE.ministryAddress ? (
            <>
              {SITE.ministryAddress} &middot; &copy; {year}
            </>
          ) : (
            <>&copy; {year}</>
          )}
        </p>
      </Container>
    </footer>
  );
}
