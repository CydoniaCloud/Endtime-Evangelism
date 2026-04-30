import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { ArticleList } from "@/components/ArticleListItem";
import { getAllContent, getContentBySeries } from "@/lib/content";

/**
 * Series index — `/series/[slug]`.
 *
 * Series slugs are free-form strings stored in frontmatter (e.g.
 * "genesis-walks", "lent-2026"). Static-generated only for series that
 * have at least one piece. The display name is derived by humanising the
 * slug; if a series ever needs a curated label or description, promote it
 * to /content/taxonomy/series.ts.
 *
 * Within a series, articles render in publishedAt order (oldest first)
 * so multi-part teachings read sequentially rather than reverse-chrono.
 */

interface RouteParams {
  slug: string;
}

function humanise(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const seen = new Set<string>();
  for (const r of getAllContent()) {
    if (r.series) seen.add(r.series);
  }
  return [...seen].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const records = getContentBySeries(slug);
  if (records.length === 0) return {};
  const label = humanise(slug);
  return {
    title: label,
    description: `The ${label} series.`,
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const records = getContentBySeries(slug);
  if (records.length === 0) notFound();

  // Sort within a series: oldest first so multi-part teachings read in
  // publication order. getAllContent's default sort is reverse-chrono.
  const ordered = [...records].sort((a, b) =>
    a.publishedAt < b.publishedAt ? -1 : 1,
  );

  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">series</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          {humanise(slug)}
        </h1>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6">
          {ordered.length === 1
            ? "One piece in this series."
            : `${ordered.length} pieces in this series, in reading order.`}
        </p>
        <div className="mt-12">
          <ArticleList records={ordered} />
        </div>
      </Container>
    </section>
  );
}
