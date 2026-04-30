import Link from "next/link";

import { Container } from "@/components/Container";
import { PathwayCard } from "@/components/PathwayCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getLatestContent } from "@/lib/content";

/**
 * Homepage. Reverent landing — eyebrow + serif headline + subhead, two
 * buttons, three pathway cards, latest teachings placeholder, newsletter.
 *
 * Latest teachings is a placeholder until Phase 2 brings in real MDX
 * content. The shape is set so swapping to real data is a one-line change.
 */
export default function HomePage() {
  const latest = getLatestContent(3);

  return (
    <>
      {/* Hero ------------------------------------------------------------
          Page-width container so the left edge aligns with the sections
          below ("three paths in", etc). Headline and subhead are constrained
          by max-w-prose so lines stay readable, but the LEFT edge is shared
          across the page. Editorial alignment, not centered marketing. */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-20">
        <Container>
          {/* Scripture epigraph — a different typographic register from the
              other eyebrows on the page. Serif italic, sentence case, in the
              secondary text color. The lowercase letter-spaced eyebrow style
              is reserved for navigational labels ("three paths in", "stay
              close"); content lines like this one read as content. */}
          <p className="font-serif italic text-small text-ink-2 dark:text-ink-dark-2 mb-6 max-w-prose">
            Jesus Christ — the same yesterday, today, and forever
          </p>
          <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark max-w-prose">
            Whoever you are, He has something to say to you.
          </h1>
          <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 max-w-prose">
            To the hungry He is bread. To the lost, the way. To the weary,
            rest. The story of Jesus Christ is the story the whole Bible is
            telling — and the story your life is asking to be part of.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10">
            <Link href="/start" className="btn-primary">
              Start here
            </Link>
            <Link href="/library?type=sermon" className="btn-secondary">
              Listen to a sermon
            </Link>
          </div>
        </Container>
      </section>

      {/* Three paths in -------------------------------------------------- */}
      <section className="py-16 md:py-24 border-t-hairline border-rule dark:border-rule-dark">
        <Container>
          <div className="mb-10">
            <p className="eyebrow mb-2">three paths in</p>
            <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark max-w-prose">
              Wherever you are on the road, there is a place to begin reading.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <PathwayCard
              audience="seeker"
              title="Start with the questions"
              description="Who is Jesus, what did He come to do, and why does any of it matter? Honest answers for anyone — even if you're still deciding what you believe."
              href="/start"
            />
            <PathwayCard
              audience="believer"
              title="Walking with Christ"
              description="Devotionals, sermons, and studies for those who already know Him and want to keep walking. Christ-centered, not personality-centered."
              href="/library?audience=believer"
            />
            <PathwayCard
              audience="student"
              title="Going deeper"
              description="Doctrinal studies, prophecy, and teaching drawn from the ministry of William Branham. For readers ready to engage with a specific theological perspective."
              href="/studies"
            />
          </div>
        </Container>
      </section>

      {/* Latest teachings (placeholder) ---------------------------------- */}
      <section className="py-16 md:py-24 border-t-hairline border-rule dark:border-rule-dark">
        <Container>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="eyebrow mb-2">latest teachings</p>
              <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark">
                From the desk this week.
              </h2>
            </div>
            {/* Secondary text color + arrow — accent is reserved for primary
                buttons and active in-body links. */}
            <Link
              href="/library"
              className="text-small text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark"
            >
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          {/* Plain hairline-ruled rows. No background, no card chrome. The
              top and bottom rules and the inter-item rules all use the same
              0.5px hairline color so the list reads as a single editorial
              column, not a card grid. Sourced from getLatestContent. */}
          {latest.length > 0 ? (
            <ul className="border-t-hairline border-rule dark:border-rule-dark">
              {latest.map((item) => (
                <li
                  key={item.slug}
                  className="border-b-hairline border-rule dark:border-rule-dark"
                >
                  <Link
                    href={`/${item.type}/${item.slug}`}
                    className="block py-6 text-ink hover:no-underline group dark:text-ink-dark"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`pill pill-${item.audience}`}>
                        {item.audience}
                      </span>
                      <span className="pill pill-neutral">{item.type}</span>
                      <span className="text-caption text-ink-3 ml-auto">
                        {item.readingTime} min
                      </span>
                    </div>
                    <p
                      className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark group-hover:underline"
                      style={{
                        textUnderlineOffset: "0.2em",
                        textDecorationThickness: "0.5px",
                      }}
                    >
                      {item.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-ink-2 dark:text-ink-dark-2">
              The first pieces are being prepared. Check back soon.
            </p>
          )}
        </Container>
      </section>

      {/* Newsletter ------------------------------------------------------
          Page-width container so the left edge aligns with the sections
          above. The headline, subhead, and form are body-width via
          max-w-prose so reading and form input stay editorial. */}
      <section className="py-16 md:py-24 bg-surface dark:bg-surface-dark border-t-hairline border-rule dark:border-rule-dark">
        <Container>
          <p className="eyebrow mb-2">stay close</p>
          <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark max-w-prose">
            A short letter, every Sunday.
          </h2>
          <p className="text-body text-ink-2 dark:text-ink-dark-2 mt-4 mb-8 max-w-prose">
            One reflection on Christ to start your week. No spam, no
            marketing, no clutter.
          </p>
          <div className="max-w-prose">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </>
  );
}
