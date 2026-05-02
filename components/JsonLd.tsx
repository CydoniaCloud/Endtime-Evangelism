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
  return (
    <>
      {emit({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE.url}#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/icon.svg`,
        description: SITE.tagline,
        // Pointer to the page that describes the organization in human
        // form — schema.org/about — gives crawlers a way to ground the
        // entity beyond the bare metadata fields.
        mainEntityOfPage: { "@type": "AboutPage", "@id": `${SITE.url}/about` },
        sameAs: [],
      })}
      {/* WebSite schema with SearchAction lets Google show the site
          search box directly in search results. Points at /search with
          the user's query interpolated. */}
      {emit({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}#website`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.tagline,
        publisher: { "@id": `${SITE.url}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      })}
    </>
  );
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
    // Reference the layout-rendered Organization by @id rather than
    // duplicating its fields here. Single source of truth for the
    // entity; smaller payload per article page; cleaner for crawlers
    // that follow @id references.
    author: { "@id": `${SITE.url}#organization` },
    publisher: { "@id": `${SITE.url}#organization` },
    isPartOf: { "@id": `${SITE.url}#website` },
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
