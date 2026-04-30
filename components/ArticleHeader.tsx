import Link from "next/link";

import { AudiencePill } from "./AudiencePill";
import { TypePill } from "./TypePill";
import { ShareLink } from "./ShareLink";
import { CONTENT_TYPE_META } from "@/content/taxonomy/types";
import {
  formatScriptureSlug,
  splitScriptureSlug,
} from "@/content/taxonomy/scripture";
import type { ContentRecord } from "@/lib/content";

/**
 * Article header — breadcrumb, tags row, headline, dek, meta row.
 * Assembled in the spec's exact order:
 *   1. Breadcrumb
 *   2. Tags row (audience, type, primary scripture)
 *   3. Headline
 *   4. Dek (subtitle)
 *   5. Meta row (reading time, last updated, share, optional PDF)
 *
 * Audio player and pull quote are NOT here — they belong above the body
 * but after the header, so the article page composes them separately.
 */
export function ArticleHeader({ record }: { record: ContentRecord }) {
  const typeMeta = CONTENT_TYPE_META[record.type];
  const primaryScripture = record.scripture[0];
  const dek = record.dek ?? record.description;

  // ISO date for <time> machine-readable; human formatting for display.
  const updatedAtISO = record.updatedAt;
  const updatedAtDisplay = formatDate(record.updatedAt);

  return (
    <header className="mb-10 md:mb-12">
      {/* Breadcrumb — small, tertiary, single line. Library is the parent
          for every content type; the type segment links to the filtered
          library view. */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 text-caption text-ink-3">
          <li>
            <Link href="/library" className="text-ink-3 hover:text-ink-2">
              Library
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/library?type=${record.type}`}
              className="text-ink-3 hover:text-ink-2"
            >
              {typeMeta.plural}
            </Link>
          </li>
        </ol>
      </nav>

      {/* Tags row — audience, type, primary scripture. The scripture
          pill links to the two-segment chapter route, e.g.
          /scripture/genesis/3, per the build prompt. */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <AudiencePill audience={record.audience} />
        <TypePill type={record.type} />
        {primaryScripture
          ? (() => {
              const split = splitScriptureSlug(primaryScripture);
              if (!split) return null;
              return (
                <Link
                  href={`/scripture/${split.book}/${split.chapter}`}
                  className="pill pill-neutral hover:no-underline"
                >
                  {formatScriptureSlug(primaryScripture).toLowerCase()}
                </Link>
              );
            })()
          : null}
      </div>

      {/* Headline */}
      <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark max-w-prose">
        {record.title}
      </h1>

      {/* Dek — single sentence, sans, secondary color. */}
      {dek ? (
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-4 max-w-prose">
          {dek}
        </p>
      ) : null}

      {/* Meta row — reading time, last updated, share, optional PDF. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-small text-ink-2 dark:text-ink-dark-2">
        <span>{record.readingTime} min read</span>
        <span aria-hidden="true">&middot;</span>
        <span>
          Updated{" "}
          <time dateTime={updatedAtISO}>{updatedAtDisplay}</time>
        </span>
        <span aria-hidden="true">&middot;</span>
        <ShareLink title={record.title} />
        {record.pdfUrl ? (
          <>
            <span aria-hidden="true">&middot;</span>
            <a
              href={record.pdfUrl}
              className="text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark"
              data-no-print
            >
              PDF
            </a>
          </>
        ) : null}
      </div>
    </header>
  );
}

/**
 * Format an ISO date string ("2026-04-29") as the long form ("29 April 2026").
 * Locale-independent — uses Intl with a fixed locale.
 */
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
