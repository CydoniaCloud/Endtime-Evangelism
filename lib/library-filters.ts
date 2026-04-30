import { type ContentRecord } from "./content";
import { isAudience, type Audience } from "@/content/taxonomy/audiences";
import { isContentType, type ContentType } from "@/content/taxonomy/types";
import { isTopic, type Topic } from "@/content/taxonomy/topics";

/**
 * Library filter shape. Audience and type are multi-select (checkboxes);
 * topic is single-select (dropdown); q is a free-text query matched
 * case-insensitively against title and dek.
 *
 * URL ↔ state mapping is the spine of this module — anything that can be
 * filtered is also a shareable link.
 */
export interface LibraryFilters {
  audience: Audience[];
  type: ContentType[];
  topic: Topic | null;
  q: string;
}

export const EMPTY_FILTERS: LibraryFilters = {
  audience: [],
  type: [],
  topic: null,
  q: "",
};

/** Normalise URL searchParams into a strict LibraryFilters object. */
export function readFiltersFromSearchParams(
  raw: Record<string, string | string[] | undefined>,
): LibraryFilters {
  const audienceList = toArray(raw.audience).filter(isAudience);
  const typeList = toArray(raw.type).filter(isContentType);
  const topicCandidate = toArray(raw.topic)[0];
  const topic = topicCandidate && isTopic(topicCandidate) ? topicCandidate : null;
  const q = (toArray(raw.q)[0] ?? "").trim();

  return { audience: audienceList, type: typeList, topic, q };
}

/** Inverse — turn filters back into URLSearchParams for navigation. */
export function writeFiltersToSearchParams(filters: LibraryFilters): URLSearchParams {
  const params = new URLSearchParams();
  for (const a of filters.audience) params.append("audience", a);
  for (const t of filters.type) params.append("type", t);
  if (filters.topic) params.set("topic", filters.topic);
  if (filters.q) params.set("q", filters.q);
  return params;
}

export function isFilterActive(filters: LibraryFilters): boolean {
  return (
    filters.audience.length > 0 ||
    filters.type.length > 0 ||
    filters.topic !== null ||
    filters.q !== ""
  );
}

/**
 * Apply filters. Multi-select fields use OR within field, AND across fields:
 *   audience=[seeker, believer]      → audience IN those
 *   type=[tract]                     → type IN those
 *   ⇒ a record matches if its audience is one of the selected AND its type
 *     is one of the selected.
 *
 * Empty fields are ignored (don't restrict the result set).
 *
 * Text query is a simple case-insensitive substring match against
 * title + dek + description. No fuzzy matching here — Pagefind handles
 * full-text search at /search.
 */
export function filterRecords(
  records: ContentRecord[],
  filters: LibraryFilters,
): ContentRecord[] {
  const q = filters.q.toLowerCase();
  return records.filter((r) => {
    if (filters.audience.length > 0 && !filters.audience.includes(r.audience)) {
      return false;
    }
    if (filters.type.length > 0 && !filters.type.includes(r.type)) {
      return false;
    }
    if (filters.topic && !r.topics.includes(filters.topic)) {
      return false;
    }
    if (q) {
      const haystack = `${r.title} ${r.dek ?? ""} ${r.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function toArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}
