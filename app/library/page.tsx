import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { ArticleList } from "@/components/ArticleListItem";
import { LibraryFiltersUI } from "@/components/LibraryFilters";
import { getAllContent } from "@/lib/content";
import {
  filterRecords,
  isFilterActive,
  readFiltersFromSearchParams,
} from "@/lib/library-filters";
import type { Topic } from "@/content/taxonomy/topics";

export const metadata: Metadata = {
  title: "Read & listen",
  description:
    "Every published tract, sermon, article, and study — filterable by audience, type, topic, and full-text search.",
};

/**
 * Library — the master filterable index.
 *
 * Server component. Reads filter state from the URL, filters the full
 * library, and renders both the filter UI (client) and the resulting list.
 * The filter UI pushes URL updates via router.replace; this page re-runs
 * with the new searchParams.
 *
 * The topic dropdown only shows topics that actually appear in the
 * library so the UI doesn't list 25 options that all yield empty results.
 */

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = readFiltersFromSearchParams(params);

  const all = getAllContent();
  const filtered = filterRecords(all, filters);

  // Only offer topics that appear in the (unfiltered) library, sorted to
  // match the canonical TOPICS order. Avoids "no results" surprises in the
  // dropdown.
  const usedTopics = new Set<Topic>();
  for (const r of all) for (const t of r.topics) usedTopics.add(t);
  const availableTopics = [...usedTopics];

  const total = all.length;
  const shown = filtered.length;
  const active = isFilterActive(filters);

  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">the library</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          Every published piece, in one column.
        </h1>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6">
          Filter by audience, type, or topic; search title and description.
          Filter state lives in the URL, so links are shareable.
        </p>

        <div className="mt-12">
          <LibraryFiltersUI
            initialFilters={filters}
            availableTopics={availableTopics}
          />
        </div>

        <div className="mt-12">
          <p className="text-caption text-ink-3 mb-4">
            {active
              ? `${shown} of ${total} ${total === 1 ? "piece" : "pieces"}`
              : `${total} ${total === 1 ? "piece" : "pieces"}`}
          </p>
          {filtered.length > 0 ? (
            <ArticleList records={filtered} />
          ) : (
            <p className="text-body text-ink-2 dark:text-ink-dark-2">
              No matches. Try removing a filter.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
