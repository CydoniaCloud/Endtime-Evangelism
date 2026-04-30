"use client";

import { useTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  AUDIENCES,
  AUDIENCE_META,
  type Audience,
} from "@/content/taxonomy/audiences";
import {
  CONTENT_TYPES,
  CONTENT_TYPE_META,
  type ContentType,
} from "@/content/taxonomy/types";
import {
  TOPICS,
  TOPIC_LABELS,
  type Topic,
} from "@/content/taxonomy/topics";
import {
  EMPTY_FILTERS,
  isFilterActive,
  writeFiltersToSearchParams,
  type LibraryFilters,
} from "@/lib/library-filters";

/**
 * Library filter UI. Owns the inputs; pushes URL changes via router.replace
 * so initial state, navigation, and the back button stay coherent.
 *
 * The text input is debounced with useDeferredValue so we don't push a URL
 * change on every keystroke — the URL settles a short moment after the
 * user stops typing.
 */
export function LibraryFiltersUI({
  initialFilters,
  availableTopics,
}: {
  initialFilters: LibraryFilters;
  availableTopics: Topic[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [filters, setFilters] = useState<LibraryFilters>(initialFilters);
  const deferredQ = useDeferredValue(filters.q);

  // Push URL changes as filters move. router.replace (not push) keeps the
  // browser history clean — back button skips intermediate filter states.
  useEffect(() => {
    const next: LibraryFilters = { ...filters, q: deferredQ };
    const params = writeFiltersToSearchParams(next);
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deferredQ,
    filters.audience.join(","),
    filters.type.join(","),
    filters.topic,
    pathname,
  ]);

  function toggleAudience(a: Audience) {
    setFilters((s) => ({
      ...s,
      audience: s.audience.includes(a)
        ? s.audience.filter((x) => x !== a)
        : [...s.audience, a],
    }));
  }

  function toggleType(t: ContentType) {
    setFilters((s) => ({
      ...s,
      type: s.type.includes(t) ? s.type.filter((x) => x !== t) : [...s.type, t],
    }));
  }

  function setTopic(t: Topic | null) {
    setFilters((s) => ({ ...s, topic: t }));
  }

  function setQ(q: string) {
    setFilters((s) => ({ ...s, q }));
  }

  function clear() {
    setFilters(EMPTY_FILTERS);
  }

  return (
    <div className="space-y-6">
      {/* Search box */}
      <div>
        <label htmlFor="library-q" className="eyebrow block mb-2">
          search
        </label>
        <input
          id="library-q"
          type="search"
          value={filters.q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles and descriptions"
          className="w-full bg-transparent border border-rule dark:border-rule-dark px-3 py-3 text-small text-ink dark:text-ink-dark placeholder:text-ink-3"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Audience checkboxes */}
        <fieldset>
          <legend className="eyebrow mb-2">audience</legend>
          <div className="space-y-2">
            {AUDIENCES.map((a) => (
              <label key={a} className="flex items-center gap-2 text-small text-ink dark:text-ink-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.audience.includes(a)}
                  onChange={() => toggleAudience(a)}
                  className="accent-accent"
                />
                {AUDIENCE_META[a].label.toLowerCase()}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Type checkboxes */}
        <fieldset>
          <legend className="eyebrow mb-2">type</legend>
          <div className="space-y-2">
            {CONTENT_TYPES.map((t) => (
              <label key={t} className="flex items-center gap-2 text-small text-ink dark:text-ink-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.type.includes(t)}
                  onChange={() => toggleType(t)}
                  className="accent-accent"
                />
                {CONTENT_TYPE_META[t].label.toLowerCase()}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Topic dropdown — only topics actually used in the library */}
        <div>
          <label htmlFor="library-topic" className="eyebrow block mb-2">
            topic
          </label>
          <select
            id="library-topic"
            value={filters.topic ?? ""}
            onChange={(e) => setTopic((e.target.value || null) as Topic | null)}
            className="w-full bg-transparent border border-rule dark:border-rule-dark px-3 py-2.5 text-small text-ink dark:text-ink-dark"
          >
            <option value="">All topics</option>
            {availableTopics.map((t) => (
              <option key={t} value={t}>
                {TOPIC_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear button — only visible when something is filtered. */}
      {isFilterActive(filters) ? (
        <button
          type="button"
          onClick={clear}
          className="text-small text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark"
        >
          Clear filters ×
        </button>
      ) : null}
    </div>
  );
}

// Suppress an unused-vars lint by using TOPICS at module level if needed.
// (Kept for tree-shaking parity with the rest of the codebase.)
export const _allTopics = TOPICS;
