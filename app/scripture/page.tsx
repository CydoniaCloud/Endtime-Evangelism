import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { getAllContent } from "@/lib/content";
import {
  BIBLE_BOOKS,
  bookCanonicalIndex,
  splitScriptureSlug,
  type BibleBook,
} from "@/content/taxonomy/scripture";

export const metadata: Metadata = {
  title: "Scripture index",
  description:
    "Every Bible book and chapter referenced in the library, in canonical order.",
};

/**
 * Scripture landing — `/scripture`.
 *
 * Lists every book that has tagged content, in canonical order, with the
 * count of pieces tagged for each chapter. Books with no content are
 * omitted. Within each book, chapters are ordered numerically.
 */

interface BookEntry {
  book: BibleBook;
  chapters: { chapter: string; count: number }[];
}

function buildIndex(): BookEntry[] {
  // tally — bookSlug → chapterSlug → count
  const tally = new Map<string, Map<string, number>>();
  for (const record of getAllContent()) {
    for (const ref of record.scripture) {
      const split = splitScriptureSlug(ref);
      if (!split) continue;
      const byChapter = tally.get(split.book) ?? new Map<string, number>();
      byChapter.set(split.chapter, (byChapter.get(split.chapter) ?? 0) + 1);
      tally.set(split.book, byChapter);
    }
  }

  const entries: BookEntry[] = [];
  for (const book of BIBLE_BOOKS) {
    const byChapter = tally.get(book.slug);
    if (!byChapter) continue;
    const chapters = [...byChapter.entries()]
      .map(([chapter, count]) => ({ chapter, count }))
      .sort((a, b) => Number(a.chapter) - Number(b.chapter));
    entries.push({ book, chapters });
  }
  // Already in canonical order because we iterated BIBLE_BOOKS.
  return entries.sort(
    (a, b) => bookCanonicalIndex(a.book.slug) - bookCanonicalIndex(b.book.slug),
  );
}

export default function ScriptureIndexPage() {
  const entries = buildIndex();

  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">scripture index</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          By book and chapter.
        </h1>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6">
          Every Bible book referenced in the library so far, in canonical
          order. Click a chapter to read what's been written about it.
        </p>

        {entries.length === 0 ? (
          <p className="text-body text-ink-2 dark:text-ink-dark-2 mt-12">
            No Scripture references yet.
          </p>
        ) : (
          <ul className="mt-12 space-y-8">
            {entries.map(({ book, chapters }) => (
              <li key={book.slug}>
                <h2 className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark">
                  {book.label}
                </h2>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {chapters.map(({ chapter, count }) => (
                    <li key={chapter}>
                      <Link
                        href={`/scripture/${book.slug}/${chapter}`}
                        className="text-small text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark"
                      >
                        Chapter {chapter}{" "}
                        <span className="text-ink-3">({count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
