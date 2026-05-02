import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { ArticleList } from "@/components/ArticleListItem";
import { getAllContent, getContentByTopic } from "@/lib/content";
import {
  TOPIC_LABELS,
  isTopic,
  type Topic,
} from "@/content/taxonomy/topics";

/**
 * Topic index — `/topics/[slug]`.
 *
 * Static-generated only for topics that have at least one tagged piece.
 * Empty topics produce no route, so a reader never lands on a sad empty
 * "no articles yet" page.
 */

interface RouteParams {
  slug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  // Collect topics that actually appear in content; skip empty ones.
  const used = new Set<Topic>();
  for (const r of getAllContent()) {
    for (const t of r.topics) used.add(t);
  }
  return [...used].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isTopic(slug)) return {};
  const label = TOPIC_LABELS[slug];
  return {
    title: label,
    description: `Pieces tagged ${label.toLowerCase()}.`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  if (!isTopic(slug)) notFound();
  const records = getContentByTopic(slug);
  if (records.length === 0) notFound();

  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">topic</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          {TOPIC_LABELS[slug]}
        </h1>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6">
          {records.length === 1
            ? "One piece tagged with this topic."
            : `${records.length} pieces tagged with this topic.`}
        </p>
        <div className="mt-12">
          <ArticleList records={records} />
        </div>
      </Container>
    </section>
  );
}
