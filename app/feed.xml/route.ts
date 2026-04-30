import { getAllContent } from "@/lib/content";
import { SITE } from "@/lib/site";

/**
 * Minimal RSS 2.0 feed.
 *
 * Phase 4 of the build prompt expands this with full SEO plumbing
 * (Atom alternative, structured tags, etc). For now this stub:
 *   - Returns a valid RSS 2.0 document with proper MIME type
 *   - Lists every published piece in reverse chronological order
 *   - Uses the article description as the item description
 *
 * The feed is regenerated on every request rather than at build time,
 * which is the right call while the content count is small. If the
 * library grows past ~100 pieces, switch to ISR or a build-time write.
 */

export const dynamic = "force-static";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toUTCString();
}

export async function GET() {
  const items = getAllContent();

  const itemsXml = items
    .map((item) => {
      const url = `${SITE.url}/${item.type}/${item.slug}`;
      return `    <item>
      <title>${escape(item.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <description>${escape(item.description)}</description>
      <pubDate>${rfc822(item.publishedAt)}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${escape(SITE.url)}</link>
    <description>${escape(SITE.tagline)}</description>
    <language>en</language>
    <atom:link href="${escape(SITE.url)}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
