import { getAllContent } from "@/lib/content";
import { SITE } from "@/lib/site";
import { CONTENT_TYPE_META } from "@/content/taxonomy/types";
import { AUDIENCE_META } from "@/content/taxonomy/audiences";

/**
 * /llms.txt — an emerging convention (see llmstxt.org) that gives
 * AI crawlers and assistants a quick, structured map of the site.
 *
 * Format is plain markdown:
 *   - H1 with the site name and a one-line summary
 *   - Sections grouping URLs by purpose
 *   - Each line is a link followed by a short description
 *
 * Regenerated on every request from frontmatter so it stays current
 * without manual upkeep.
 */

export const dynamic = "force-static";

export async function GET() {
  const all = getAllContent();
  const startHere = all.filter((r) => r.series === "start-here");
  const studies = all.filter((r) => r.audience === "student");
  const other = all.filter(
    (r) => r.series !== "start-here" && r.audience !== "student",
  );

  const formatLine = (record: (typeof all)[number]): string => {
    const url = `${SITE.url}/${record.type}/${record.slug}`;
    const summary = record.dek ?? record.description;
    const tags = `${AUDIENCE_META[record.audience].label} · ${CONTENT_TYPE_META[record.type].label} · ${record.readingTime} min`;
    return `- [${record.title}](${url}): ${summary} _(${tags})_`;
  };

  const sections: string[] = [];

  sections.push(`# ${SITE.name}\n`);
  sections.push(`> ${SITE.tagline} A non-profit outreach ministry publishing tracts, sermons, articles, and Bible studies. Locations: Sudbury, Ontario, Canada and Margarita Island, Venezuela.\n`);

  if (startHere.length > 0) {
    sections.push(`## Start Here\n`);
    sections.push(
      `Curated entry-point essays for those new to the Christian faith.\n`,
    );
    sections.push(startHere.map(formatLine).join("\n"));
    sections.push("");
  }

  if (studies.length > 0) {
    sections.push(`## Deeper Studies\n`);
    sections.push(
      `Doctrinal and prophetic teaching — Endtime Message tradition.\n`,
    );
    sections.push(studies.map(formatLine).join("\n"));
    sections.push("");
  }

  if (other.length > 0) {
    sections.push(`## Library\n`);
    sections.push(`Other published pieces.\n`);
    sections.push(other.map(formatLine).join("\n"));
    sections.push("");
  }

  sections.push(`## Index pages\n`);
  sections.push(`- [Library](${SITE.url}/library): every published piece, filterable by audience, type, and topic`);
  sections.push(`- [Scripture index](${SITE.url}/scripture): articles grouped by Bible book and chapter`);
  sections.push(`- [Search](${SITE.url}/search): full-text search across all published content`);
  sections.push(`- [RSS feed](${SITE.url}/feed.xml): subscribe to new pieces`);
  sections.push(`- [Sitemap](${SITE.url}/sitemap.xml)\n`);

  sections.push(`## Site info\n`);
  sections.push(`- [About](${SITE.url}/about): mission, vision, and how to support the work`);
  sections.push(`- [Statement of faith](${SITE.url}/statement-of-faith)`);
  sections.push(`- [Contact](${SITE.url}/contact)\n`);

  const body = sections.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
