import { CONTENT_TYPE_META } from "@/content/taxonomy/types";
import { SITE } from "@/lib/site";
import type { ContentRecord } from "@/lib/content";

/**
 * JSON-LD structured data for search-engine consumption.
 *
 * Schemas in use:
 *   - Organization in the root layout (one entry, site-wide)
 *   - Article (or its Sermon variant when type=sermon) in /[type]/[slug]
 *   - BreadcrumbList in the article page
 *   - Church + FAQPage + BreadcrumbList on /sudbury (local landing)
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

/**
 * Local-landing schemas for /sudbury.
 *
 * Three blocks:
 *   1. Church (Spoken Word Christian Fellowship) with parentOrganization
 *      referencing the layout-level Organization by @id. We omit the
 *      address (the ministry's preference) and instead use areaServed —
 *      the right pattern for service-area entities. Google's local
 *      ranking still uses the verified address from Google Business
 *      Profile; areaServed is what's published.
 *   2. WebPage tying the page itself to the Church entity. Helps search
 *      engines and AI assistants understand "this page is about that
 *      organization."
 *   3. BreadcrumbList placing the page under the homepage.
 *
 * Towns covered are kept in one array so the list stays in sync between
 * schema and the visible page copy when updates happen.
 */
export const SUDBURY_AREA_SERVED = [
  "Greater Sudbury",
  "French River",
  "Lively",
  "Val Caron",
  "Hanmer",
  "Chelmsford",
  "Capreol",
  "Noëlville",
  "Alban",
] as const;

export function LocalChurchJsonLd() {
  const pageUrl = `${SITE.url}/sudbury`;
  return (
    <>
      {emit({
        "@context": "https://schema.org",
        "@type": "Church",
        "@id": `${pageUrl}#church`,
        name: "Spoken Word Christian Fellowship",
        url: pageUrl,
        description:
          "Local Christian fellowship in the French River area of Northern Ontario, connected to the work of Endtime Evangelism.",
        parentOrganization: { "@id": `${SITE.url}#organization` },
        areaServed: SUDBURY_AREA_SERVED.map((name) => ({
          "@type": "City",
          name,
        })),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "general inquiry",
          url: `${SITE.url}/contact`,
          availableLanguage: "English",
        },
      })}
      {emit({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: "Christian ministry in Sudbury and French River",
        isPartOf: { "@id": `${SITE.url}#website` },
        about: { "@id": `${pageUrl}#church` },
        inLanguage: "en-CA",
      })}
    </>
  );
}

export function LocalBreadcrumbJsonLd() {
  return emit({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sudbury & French River",
        item: `${SITE.url}/sudbury`,
      },
    ],
  });
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage schema. AI assistants (ChatGPT, Perplexity, Google AI Overviews)
 * weight FAQ-shaped content heavily — each Q/A pair becomes a directly
 * quotable answer. Keep `answer` plain text; HTML tags inside the answer
 * are not parsed by all consumers and break some validators.
 */
export function FaqJsonLd({ items }: { items: ReadonlyArray<FaqItem> }) {
  return emit({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}
