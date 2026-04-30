import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { AudiencePill } from "@/components/AudiencePill";
import { TypePill } from "@/components/TypePill";
import { getContentByAudience } from "@/lib/content";

export const metadata: Metadata = {
  title: "Deeper studies",
  description:
    "Doctrinal teaching, including content drawn from the ministry of William Branham and the Message tradition. Transparently labeled.",
};

/**
 * Deeper Studies landing page.
 *
 * Lists student-tagged content — doctrinal studies, expositions, deeper
 * reads. Phase 5 may add a longer introduction to the section; for now,
 * the page is straightforward.
 */
export default function StudiesPage() {
  const studies = getContentByAudience("student");

  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">deeper studies</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          For readers ready to go further.
        </h1>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            Studies, sermons, and tracts written for readers ready to
            engage with deeper doctrine.
          </p>
        </div>

        {studies.length > 0 ? (
          <>
            <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16 mb-6">
              Currently published.
            </h2>
            <ul className="border-t-hairline border-rule dark:border-rule-dark">
              {studies.map((item) => (
                <li
                  key={item.slug}
                  className="border-b-hairline border-rule dark:border-rule-dark"
                >
                  <Link
                    href={`/${item.type}/${item.slug}`}
                    className="block py-6 text-ink hover:no-underline group dark:text-ink-dark"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <AudiencePill audience={item.audience} />
                      <TypePill type={item.type} />
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
                    <p className="text-small text-ink-2 dark:text-ink-dark-2 mt-1">
                      {item.dek ?? item.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Container>
    </section>
  );
}
