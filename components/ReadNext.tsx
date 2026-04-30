import Link from "next/link";

import { AudiencePill } from "./AudiencePill";
import { TypePill } from "./TypePill";
import type { ContentRecord } from "@/lib/content";

/**
 * "Read next" — exactly two recommendations under the article body.
 *
 * This component is presentation-only. The picking logic lives in
 * lib/content.ts so it can be unit-tested independently.
 *
 * Renders nothing if there are no recommendations (e.g. the very first
 * article in the library). Better silence than a sad empty section.
 */
export function ReadNext({ items }: { items: ContentRecord[] }) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="read-next-heading"
      className="mt-20 pt-12 border-t-hairline border-rule dark:border-rule-dark"
    >
      <p className="eyebrow mb-2">read next</p>
      <h2
        id="read-next-heading"
        className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mb-8"
      >
        Two more, if you have a moment.
      </h2>
      <ul className="border-t-hairline border-rule dark:border-rule-dark">
        {items.map((item) => (
          <li
            key={item.slug}
            className="py-6 border-b-hairline border-rule dark:border-rule-dark"
          >
            <Link
              href={`/${item.type}/${item.slug}`}
              className="block text-ink hover:no-underline group dark:text-ink-dark"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <AudiencePill audience={item.audience} />
                <TypePill type={item.type} />
                <span className="text-caption text-ink-3 ml-auto">
                  {item.readingTime} min
                </span>
              </div>
              <p className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark group-hover:underline" style={{ textUnderlineOffset: "0.2em", textDecorationThickness: "0.5px" }}>
                {item.title}
              </p>
              <p className="text-small text-ink-2 dark:text-ink-dark-2 mt-1 max-w-prose">
                {item.dek ?? item.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
