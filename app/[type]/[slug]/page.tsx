import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

import { ArticleHeader } from "@/components/ArticleHeader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ReadNext } from "@/components/ReadNext";
import { NewsletterForm } from "@/components/NewsletterForm";
import { PullQuote } from "@/components/PullQuote";
import { PrayWithMe } from "@/components/PrayWithMe";
import { ScriptureRef } from "@/components/ScriptureRef";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

import {
  getAllContent,
  getContentBySlug,
  getReadNextFor,
  type ContentRecord,
} from "@/lib/content";
import { isContentType, type ContentType } from "@/content/taxonomy/types";

/**
 * Dynamic article route — `/[type]/[slug]`. Generates a static page for
 * every content record at build time. Type is part of the URL so a piece
 * is reachable at `/tract/was-it-an-apple`, `/sermon/the-shepherd`, etc.
 *
 * If a record's `type` doesn't match the URL segment (e.g. someone hits
 * `/sermon/was-it-an-apple` for a tract), we 404. The slug is unique
 * across the library.
 */

interface RouteParams {
  type: string;
  slug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllContent().map((r) => ({ type: r.type, slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug, type } = await params;
  const record = resolveRecord(type, slug);
  if (!record) return {};
  return {
    title: record.title,
    description: record.description,
    openGraph: {
      title: record.title,
      description: record.description,
      type: "article",
      publishedTime: record.publishedAt,
      modifiedTime: record.updatedAt,
    },
  };
}

function resolveRecord(type: string, slug: string): ContentRecord | null {
  if (!isContentType(type as ContentType)) return null;
  const record = getContentBySlug(slug);
  if (!record) return null;
  if (record.type !== type) return null;
  return record;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { type, slug } = await params;
  const record = resolveRecord(type, slug);
  if (!record) notFound();

  // Compile the MDX body with the same plugins the file-based @next/mdx
  // configuration uses, plus the editorial components exposed by name.
  const { content } = await compileMDX({
    source: record.body,
    components: { PullQuote, PrayWithMe, ScriptureRef },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkSmartypants],
        rehypePlugins: [],
      },
    },
  });

  const readNext = getReadNextFor(record);

  return (
    // The outer wrapper provides only the 56rem chrome cap — NO horizontal
    // padding, because the .prose-article grid (below) manages its own
    // gutters internally so wide breakouts can extend to the full 56rem.
    // Sections that aren't the body grid (header chrome, audio, newsletter,
    // read-next) add their own px-5 md:px-8 gutter.
    <article className="pt-12 md:pt-16 pb-8 max-w-page mx-auto">
      <ArticleJsonLd record={record} />
      <BreadcrumbJsonLd record={record} />

      {/* Article masthead — body width (36rem), centered, so its left
          edge aligns with the prose-article body grid below. The outer
          chrome wrapper provides the gutter; the inner max-w-prose mx-auto
          centers the masthead block. */}
      <div className="px-5 md:px-8">
        <div className="max-w-prose mx-auto">
          <ArticleHeader record={record} />
        </div>
      </div>

      {/* Audio player stays at full chrome width (up to 56rem). */}
      {record.audioUrl ? (
        <div className="px-5 md:px-8">
          <AudioPlayer src={record.audioUrl} title={record.title} />
        </div>
      ) : null}

      {/* Article body. The .has-dropcap class triggers the drop cap on the
          first paragraph; .prose-article is the grid container that lays
          out body (36rem), medium (44rem), and wide (56rem) tracks. */}
      <div className="prose-article has-dropcap">{content}</div>

      {/* Inline newsletter capture — body width (36rem), centered inside
          the 56rem chrome. */}
      <div className="px-5 md:px-8">
        <aside className="max-w-prose mx-auto mt-20 pt-12 border-t-hairline border-rule dark:border-rule-dark">
          <p className="eyebrow mb-2">stay close</p>
          <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mb-3">
            Has this stirred something in you?
          </h2>
          <p className="text-body text-ink-2 dark:text-ink-dark-2 mb-6">
            One reflection on Christ each Sunday. No spam, no marketing, no
            clutter.
          </p>
          <NewsletterForm variant="inline" />
        </aside>
      </div>

      {/* Read next — wide (56rem) within the chrome. */}
      <div className="px-5 md:px-8">
        <ReadNext items={readNext} />
      </div>
    </article>
  );
}
