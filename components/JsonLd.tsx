import { CONTENT_TYPE_META } from "@/content/taxonomy/types";
import { SITE } from "@/lib/site";
import type { ContentRecord } from "@/lib/content";

/**
 * JSON-LD structured data for search-engine consumption.
 *
 * Three schemas in use:
 *   - Organization in the root layout (one entry, site-wide)
 *   - Article (or its Sermon variant when type=sermon) in /[type]/[slug]
 *   - BreadcrumbList in the article page
 *
 * Rendered as `<script type="application/ld+json">` blocks. We use
 * dangerouslySetInnerHTML because Next.js renders objects as text otherwise
 * and that breaks search-engine parsing. The content is generated from
 * frontmatter — no user input goes into these blocks.
 */

function emit(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return emit({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    sameAs: [],
  });
}

export function ArticleJsonLd({ record }: { record: ContentRecord }) {
  const url = `${SITE.url}/${record.type}/${record.slug}`;
  // Sermon entries get the more specific @type so podcast directories and
  // audio-aware indexes can pick them up. Everything else is Article.
  const isSermon = record.type === "sermon";

  return emit({
    "@context": "https://schema.org",
    "@type": isSermon ? "Sermon" : "Article",
    headline: record.title,
    description: record.dek ?? record.description,
    datePublished: record.publishedAt,
    dateModified: record.updatedAt,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${url}/opengraph-image`,
    url,
    ...(isSermon && record.audioUrl ? { audio: record.audioUrl } : {}),
    ...(record.videoUrl ? { video: record.videoUrl } : {}),
  });
}

export function BreadcrumbJsonLd({ record }: { record: ContentRecord }) {
  const typeLabel = CONTENT_TYPE_META[record.type].plural;
  return emit({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Library",
        item: `${SITE.url}/library`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: typeLabel,
        item: `${SITE.url}/library?type=${record.type}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: record.title,
        item: `${SITE.url}/${record.type}/${record.slug}`,
      },
    ],
  });
}
