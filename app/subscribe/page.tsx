import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getContentBySlug } from "@/lib/content";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "One short reflection on Christ each Sunday. No spam, no marketing, no clutter.",
};

/**
 * Subscribe page.
 *
 * Dedicated landing for direct visits to /subscribe (e.g. from a printed
 * tract, a sermon QR code, or a manual link share). Pairs the form with
 * a curated reading list of Start Here essays so a new subscriber has
 * something to read while waiting for the next Sunday letter.
 *
 * Per the build prompt, this is also the natural confirmation
 * destination — for now the form posts in place and shows an inline
 * "thanks" message; no redirect.
 */

const FEATURED_SLUGS = [
  "who-is-jesus",
  "what-is-the-gospel",
  "how-do-i-become-a-christian",
];

export default function SubscribePage() {
  const featured = FEATURED_SLUGS.map((s) => getContentBySlug(s)).filter(
    (r): r is NonNullable<typeof r> => r !== undefined,
  );

  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">stay close</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          A short letter, every Sunday.
        </h1>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            One reflection on Christ to start your week. No spam, no
            marketing, no clutter. Unsubscribe at any time, in one click.
          </p>
        </div>

        <div className="mt-10">
          <NewsletterForm />
        </div>

        {featured.length > 0 ? (
          <section className="mt-20 pt-12 border-t-hairline border-rule dark:border-rule-dark">
            <p className="eyebrow mb-2">while you wait for sunday</p>
            <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mb-8">
              Three short essays to begin with.
            </h2>
            <ul className="border-t-hairline border-rule dark:border-rule-dark">
              {featured.map((item) => (
                <li
                  key={item.slug}
                  className="border-b-hairline border-rule dark:border-rule-dark"
                >
                  <Link
                    href={`/${item.type}/${item.slug}`}
                    className="block py-6 text-ink hover:no-underline group dark:text-ink-dark"
                  >
                    <p className="text-caption text-ink-3 mb-1">
                      {item.readingTime} min read
                    </p>
                    <p
                      className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark group-hover:underline"
                      style={{
                        textUnderlineOffset: "0.2em",
                        textDecorationThickness: "0.5px",
                      }}
                    >
                      {item.title}
                    </p>
                    <p className="text-small text-ink-2 dark:text-ink-dark-2 mt-1">
                      {item.dek ?? item.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </section>
  );
}
