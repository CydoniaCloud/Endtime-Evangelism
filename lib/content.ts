import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { isAudience, type Audience } from "@/content/taxonomy/audiences";
import { isContentType, type ContentType } from "@/content/taxonomy/types";
import { isTopic, type Topic } from "@/content/taxonomy/topics";
import { splitScriptureSlug } from "@/content/taxonomy/scripture";

/**
 * The frontmatter contract for every piece of content. Five independent axes
 * (audience, type, topics, scripture, series) plus presentation metadata.
 *
 * If a field here changes, update the frontmatter in every MDX file.
 *
 * `description` is the SEO meta-description (kept short, ~150 chars) shown
 * in search results and OG cards. `dek` is the on-page subtitle that appears
 * under the headline — a single sentence framing the piece for the reader.
 * If `dek` is omitted, the article page falls back to `description`.
 *
 * `readNext` lets editors hand-pick two follow-on pieces by slug. If
 * omitted, the renderer picks the two articles with the highest topic
 * overlap. Always exactly two — see the build prompt.
 */
export interface ContentFrontmatter {
  title: string;
  slug: string;
  audience: Audience;
  type: ContentType;
  topics: Topic[];
  scripture: string[]; // e.g. ["genesis-3", "john-3"]
  series: string | null;
  description: string;
  dek: string | null;
  publishedAt: string;
  updatedAt: string;
  audioUrl: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  readNext: [string, string] | null;
  readingTime: number;
}

export interface ContentRecord extends ContentFrontmatter {
  /** Filesystem path relative to /content. Used for routing & debugging. */
  filePath: string;
  /** Raw MDX body — useful for search indexing. */
  body: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function isMdxFile(filename: string): boolean {
  return filename.endsWith(".mdx") || filename.endsWith(".md");
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    // Skip the taxonomy directory and any underscore-prefixed dirs.
    if (entry.name.startsWith("_") || entry.name === "taxonomy") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (isMdxFile(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Validate frontmatter at parse time. Cheap to run; catches bad tags early.
 * Throws with a clear message rather than silently coercing.
 */
function validate(data: Record<string, unknown>, filePath: string): ContentFrontmatter {
  const fail = (msg: string): never => {
    throw new Error(`[content] ${filePath}: ${msg}`);
  };

  const must = <T,>(key: string, predicate: (v: unknown) => v is T): T => {
    const value = data[key];
    if (!predicate(value)) fail(`invalid \`${key}\` (got ${JSON.stringify(value)})`);
    return value as T;
  };

  const isString = (v: unknown): v is string => typeof v === "string" && v.length > 0;
  const isNumber = (v: unknown): v is number => typeof v === "number";
  const isArrayOf = <T,>(check: (v: unknown) => v is T) => (v: unknown): v is T[] =>
    Array.isArray(v) && v.every(check);

  const audience = must("audience", isAudience);
  const type = must("type", isContentType);
  const topics = must("topics", isArrayOf(isTopic));
  const scripture = must("scripture", isArrayOf(isString));
  const publishedAt = must("publishedAt", isString);

  // Each scripture ref must split into a recognized book + chapter.
  // Catches typos ("revelations-1" rather than "revelation-1") at build.
  for (const ref of scripture) {
    if (!splitScriptureSlug(ref)) {
      throw new Error(
        `[content] ${filePath}: scripture reference \`${ref}\` is not in the canonical book list (see content/taxonomy/scripture.ts)`,
      );
    }
  }

  // updatedAt is optional. If present, it must be a non-empty string;
  // anything else (e.g. a Date object from yaml parsing) fails loudly
  // rather than silently coercing.
  let updatedAt: string;
  if (data.updatedAt === undefined || data.updatedAt === null) {
    updatedAt = publishedAt;
  } else if (isString(data.updatedAt)) {
    updatedAt = data.updatedAt;
  } else {
    throw new Error(
      `[content] ${filePath}: invalid \`updatedAt\` (got ${JSON.stringify(data.updatedAt)})`,
    );
  }

  // readNext, when present, must be exactly two non-empty slug strings.
  // Anything else fails loudly so editors don't ship a one-item or
  // five-item recommendation by accident.
  let readNext: [string, string] | null = null;
  if (data.readNext !== undefined && data.readNext !== null) {
    if (
      Array.isArray(data.readNext) &&
      data.readNext.length === 2 &&
      data.readNext.every(isString)
    ) {
      readNext = [data.readNext[0], data.readNext[1]];
    } else {
      throw new Error(
        `[content] ${filePath}: \`readNext\` must be exactly two slug strings (got ${JSON.stringify(data.readNext)})`,
      );
    }
  }

  return {
    title: must("title", isString),
    slug: must("slug", isString),
    audience,
    type,
    topics,
    scripture,
    series: typeof data.series === "string" ? data.series : null,
    description: must("description", isString),
    dek: typeof data.dek === "string" ? data.dek : null,
    publishedAt,
    updatedAt,
    audioUrl: typeof data.audioUrl === "string" ? data.audioUrl : null,
    videoUrl: typeof data.videoUrl === "string" ? data.videoUrl : null,
    pdfUrl: typeof data.pdfUrl === "string" ? data.pdfUrl : null,
    readNext,
    readingTime: must("readingTime", isNumber),
  };
}

let cache: ContentRecord[] | null = null;

/**
 * Load every MDX file under /content and return a sorted, validated list.
 * Memoised across calls in the same Node process — Next.js caches per build.
 */
export function getAllContent(): ContentRecord[] {
  if (cache) return cache;

  const files = walk(CONTENT_ROOT);
  const records: ContentRecord[] = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = validate(data, path.relative(CONTENT_ROOT, file));
    return {
      ...frontmatter,
      filePath: path.relative(CONTENT_ROOT, file),
      body: content,
    };
  });

  records.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  cache = records;
  return records;
}

export function getContentBySlug(slug: string): ContentRecord | undefined {
  return getAllContent().find((r) => r.slug === slug);
}

export function getContentByAudience(audience: Audience): ContentRecord[] {
  return getAllContent().filter((r) => r.audience === audience);
}

export function getContentByTopic(topic: Topic): ContentRecord[] {
  return getAllContent().filter((r) => r.topics.includes(topic));
}

export function getContentByScripture(slug: string): ContentRecord[] {
  return getAllContent().filter((r) => r.scripture.includes(slug));
}

export function getContentBySeries(series: string): ContentRecord[] {
  return getAllContent().filter((r) => r.series === series);
}

export function getLatestContent(limit = 3): ContentRecord[] {
  return getAllContent().slice(0, limit);
}

/**
 * Pick the article's "Read next" recommendations.
 *
 * If the article's frontmatter has `readNext` set, fetch those two by slug.
 * Otherwise, score every other article by shared topics with the source —
 * one point per shared topic, tie-break by newest — and return the top two.
 *
 * Always returns exactly two items, or fewer if the library is too small.
 */
export function getReadNextFor(record: ContentRecord): ContentRecord[] {
  const all = getAllContent();

  if (record.readNext) {
    const [a, b] = record.readNext;
    return [getContentBySlug(a), getContentBySlug(b)].filter(
      (r): r is ContentRecord => r !== undefined,
    );
  }

  const scored = all
    .filter((r) => r.slug !== record.slug)
    .map((r) => {
      const sharedTopics = r.topics.filter((t) => record.topics.includes(t)).length;
      return { record: r, score: sharedTopics };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.record.publishedAt < b.record.publishedAt ? 1 : -1;
    });

  return scored.slice(0, 2).map((s) => s.record);
}
