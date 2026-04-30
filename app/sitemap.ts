import type { MetadataRoute } from "next";

import { getAllContent } from "@/lib/content";
import { SITE } from "@/lib/site";
import { splitScriptureSlug } from "@/content/taxonomy/scripture";
import type { Topic } from "@/content/taxonomy/topics";

/**
 * Sitemap. Lists every static route and every dynamic index that has
 * content. Content URLs use `updatedAt` as `lastModified`.
 *
 * Routes intentionally excluded:
 *   - /search (no content of its own; deep-linked queries don't need
 *     individual sitemap entries)
 *   - /feed.xml (a feed, not a page)
 *   - /content/_examples (documentation-only path)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE.url}${path}`;
  const all = getAllContent();
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1.0, lastModified: now },
    { url: url("/start"), changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: url("/library"), changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: url("/studies"), changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: url("/scripture"), changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.5, lastModified: now },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.4, lastModified: now },
    { url: url("/statement-of-faith"), changeFrequency: "yearly", priority: 0.5, lastModified: now },
  ];

  const articleRoutes: MetadataRoute.Sitemap = all.map((r) => ({
    url: url(`/${r.type}/${r.slug}`),
    lastModified: r.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Topic indexes — only ones with content.
  const usedTopics = new Set<Topic>();
  for (const r of all) for (const t of r.topics) usedTopics.add(t);
  const topicRoutes: MetadataRoute.Sitemap = [...usedTopics].map((t) => ({
    url: url(`/topics/${t}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Scripture chapter indexes — only chapters with content.
  const seenScripture = new Set<string>();
  const scriptureRoutes: MetadataRoute.Sitemap = [];
  for (const r of all) {
    for (const ref of r.scripture) {
      if (seenScripture.has(ref)) continue;
      seenScripture.add(ref);
      const split = splitScriptureSlug(ref);
      if (!split) continue;
      scriptureRoutes.push({
        url: url(`/scripture/${split.book}/${split.chapter}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // Series indexes — only series with content.
  const usedSeries = new Set<string>();
  for (const r of all) if (r.series) usedSeries.add(r.series);
  const seriesRoutes: MetadataRoute.Sitemap = [...usedSeries].map((s) => ({
    url: url(`/series/${s}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...topicRoutes,
    ...scriptureRoutes,
    ...seriesRoutes,
  ];
}
