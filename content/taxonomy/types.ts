/**
 * Type axis — drives page layout (e.g. sermons get audio players, tracts
 * get PDF download buttons, studies get section navigation).
 */

export const CONTENT_TYPES = [
  "tract",
  "sermon",
  "article",
  "study",
  "devotional",
  "testimony",
  "qa",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_TYPE_META: Record<ContentType, { label: string; plural: string }> = {
  tract: { label: "Tract", plural: "Tracts" },
  sermon: { label: "Sermon", plural: "Sermons" },
  article: { label: "Article", plural: "Articles" },
  study: { label: "Study", plural: "Studies" },
  devotional: { label: "Devotional", plural: "Devotionals" },
  testimony: { label: "Testimony", plural: "Testimonies" },
  qa: { label: "Q&A", plural: "Q&A" },
};

export function isContentType(value: unknown): value is ContentType {
  return (
    typeof value === "string" && (CONTENT_TYPES as readonly string[]).includes(value)
  );
}
