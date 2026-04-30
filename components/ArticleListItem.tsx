import Link from "next/link";

import { AudiencePill } from "./AudiencePill";
import { TypePill } from "./TypePill";
import type { ContentRecord } from "@/lib/content";

/**
 * Single row in any list of articles — homepage "latest teachings",
 * /library, /studies, /topics/[slug], /scripture/[book]/[chapter],
 * /series/[slug], and the article page's "Read next" recommendations.
 *
 * Renders as a single block-level link so the entire row is clickable.
 * Hairline rule lives on the row itself, not on a parent <ul>, so the
 * caller controls top/bottom rule placement to taste.
 *
 * Pass `showDek={false}` to suppress the dek line — useful where the
 * surrounding context (e.g. the homepage's three-row latest list) wants
 * a tighter look.
 */
export function ArticleListItem({
  record,
  showDek = true,
}: {
  record: ContentRecord;
  showDek?: boolean;
}) {
  return (
    <li className="border-b-hairline border-rule dark:border-rule-dark">
      <Link
        href={`/${record.type}/${record.slug}`}
        className="block py-6 text-ink hover:no-underline group dark:text-ink-dark"
      >
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <AudiencePill audience={record.audience} />
          <TypePill type={record.type} />
          <span className="text-caption text-ink-3 ml-auto">
            {record.readingTime} min
          </span>
        </div>
        <p
          className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark group-hover:underline"
          style={{
            textUnderlineOffset: "0.2em",
            textDecorationThickness: "0.5px",
          }}
        >
          {record.title}
        </p>
        {showDek ? (
          <p className="text-small text-ink-2 dark:text-ink-dark-2 mt-1">
            {record.dek ?? record.description}
          </p>
        ) : null}
      </Link>
    </li>
  );
}

/**
 * Convenience wrapper that wraps a list of records in a <ul> with a top
 * hairline rule (matching the bottom rule each item already provides).
 * Most index pages want this exact treatment.
 */
export function ArticleList({
  records,
  showDek = true,
}: {
  records: ContentRecord[];
  showDek?: boolean;
}) {
  if (records.length === 0) return null;
  return (
    <ul className="border-t-hairline border-rule dark:border-rule-dark">
      {records.map((r) => (
        <ArticleListItem key={r.slug} record={r} showDek={showDek} />
      ))}
    </ul>
  );
}
