import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { ArticleList } from "@/components/ArticleListItem";
import { getAllContent, getContentByScripture } from "@/lib/content";
import {
  getBook,
  joinScriptureSlug,
  splitScriptureSlug,
} from "@/content/taxonomy/scripture";

/**
 * Scripture chapter index — `/scripture/[book]/[chapter]`.
 *
 * Static-generated only for chapters that have at least one tagged piece.
 * URL pattern is two segments per the build prompt; the frontmatter slug
 * format is `book-chapter` and is reconstructed inside the route handler.
 */

interface RouteParams {
  book: string;
  chapter: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const seen = new Set<string>();
  for (const record of getAllContent()) {
    for (const ref of record.scripture) {
      const split = splitScriptureSlug(ref);
      if (!split) continue;
      const key = `${split.book}/${split.chapter}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
  }
  return [...seen].map((key) => {
    const [book, chapter] = key.split("/");
    return { book, chapter };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { book, chapter } = await params;
  const bookMeta = getBook(book);
  if (!bookMeta) return {};
  const ref = `${bookMeta.label} ${chapter}`;
  return {
    title: ref,
    description: `Pieces in the library tagged with ${ref}.`,
  };
}

export default async function ScriptureChapterPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { book, chapter } = await params;
  const bookMeta = getBook(book);
  if (!bookMeta) notFound();

  const slug = joinScriptureSlug(book, chapter);
  const records = getContentByScripture(slug);
  if (records.length === 0) notFound();

  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">scripture</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          {bookMeta.label} {chapter}
        </h1>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6">
          {records.length === 1
            ? "One piece tagged with this chapter."
            : `${records.length} pieces tagged with this chapter.`}
        </p>
        <div className="mt-12">
          <ArticleList records={records} />
        </div>
      </Container>
    </section>
  );
}
