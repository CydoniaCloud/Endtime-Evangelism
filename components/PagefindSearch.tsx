"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Pagefind-backed search UI.
 *
 * The Pagefind runtime lives at /pagefind/pagefind.js as a static asset
 * (built by `npm run search:index`). It's loaded at runtime via dynamic
 * import with a webpackIgnore hint so the bundler doesn't try to follow
 * the path during build.
 *
 * Search results render in our design system — hairline rules, serif
 * titles, secondary-color excerpts. No third-party UI chrome.
 */

interface PagefindResultData {
  url: string;
  raw_url?: string;
  excerpt: string;
  meta: {
    title?: string;
    description?: string;
    type?: string;
    audience?: string;
  };
  filters?: Record<string, string[]>;
  word_count: number;
}

interface PagefindModule {
  search: (query: string) => Promise<{
    results: { data: () => Promise<PagefindResultData> }[];
  }>;
  options?: (opts: Record<string, unknown>) => Promise<void>;
}

let pagefindPromise: Promise<PagefindModule> | null = null;

function loadPagefind(): Promise<PagefindModule> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Pagefind only loads in the browser"));
  }
  if (!pagefindPromise) {
    pagefindPromise = import(
      // The Pagefind bundle lives at /pagefind/pagefind.js as a static
      // asset built outside the bundler. webpackIgnore tells webpack not
      // to follow this path; @ts-expect-error tells TS that the path is
      // intentionally not declared (the module is loaded at runtime only).
      /* webpackIgnore: true */
      // @ts-expect-error — runtime-only path, no static module exists
      "/pagefind/pagefind.js"
    ) as Promise<PagefindModule>;
  }
  return pagefindPromise;
}

export function PagefindSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PagefindResultData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const pagefind = await loadPagefind();
      const search = await pagefind.search(q);
      const data = await Promise.all(
        search.results.slice(0, 30).map((r) => r.data()),
      );
      setResults(data);
    } catch (e) {
      console.error("[search]", e);
      setError(
        "Search isn't ready yet. If you're running `npm run dev`, run `npm run build` first to generate the index.",
      );
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the search + URL sync. Both fire on the same trailing edge so
  // the URL and the result list stay aligned.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(query);
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("q", query);
      else params.delete("q");
      const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
      <label htmlFor="pagefind-q" className="eyebrow block mb-2">
        search the library
      </label>
      {/* No autoFocus — that pattern moves focus on page load and
          disorients screen-reader and keyboard users. The input is the
          first interactive element on /search; users tab to it naturally. */}
      <input
        id="pagefind-q"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a word, a phrase, a question"
        autoComplete="off"
        className="w-full bg-transparent border border-rule dark:border-rule-dark px-3 py-3 text-body text-ink dark:text-ink-dark placeholder:text-ink-3"
      />

      <div className="mt-10 min-h-[8rem]">
        {error ? (
          <p className="text-small text-ink-2 dark:text-ink-dark-2">{error}</p>
        ) : isLoading ? (
          <p className="text-caption text-ink-3">Searching…</p>
        ) : results === null ? (
          <p className="text-small text-ink-2 dark:text-ink-dark-2">
            Type a few letters to search across every published piece.
          </p>
        ) : results.length === 0 ? (
          <p className="text-small text-ink-2 dark:text-ink-dark-2">
            Nothing matches that query.
          </p>
        ) : (
          <>
            <p className="text-caption text-ink-3 mb-4">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <ul className="border-t-hairline border-rule dark:border-rule-dark">
              {results.map((r) => (
                <li
                  key={r.url}
                  className="border-b-hairline border-rule dark:border-rule-dark"
                >
                  <a
                    href={r.url}
                    className="block py-6 text-ink hover:no-underline group dark:text-ink-dark"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1 text-caption text-ink-3">
                      {r.meta.audience ? (
                        <span className="lowercase">{r.meta.audience}</span>
                      ) : null}
                      {r.meta.type ? (
                        <span aria-hidden="true">·</span>
                      ) : null}
                      {r.meta.type ? (
                        <span className="lowercase">{r.meta.type}</span>
                      ) : null}
                    </div>
                    <p
                      className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark group-hover:underline"
                      style={{
                        textUnderlineOffset: "0.2em",
                        textDecorationThickness: "0.5px",
                      }}
                    >
                      {r.meta.title}
                    </p>
                    <p
                      className="text-small text-ink-2 dark:text-ink-dark-2 mt-1"
                      // Pagefind returns excerpts with <mark> tags around
                      // matched terms. We render that HTML directly because
                      // the source is our own indexer, not user input.
                      dangerouslySetInnerHTML={{ __html: r.excerpt }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
