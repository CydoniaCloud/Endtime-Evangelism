/**
 * Audience axis — drives site-wide color coding and pathway membership.
 * This is one of three controlled vocabularies (audiences, types, topics).
 */

export const AUDIENCES = ["seeker", "believer", "student"] as const;

export type Audience = (typeof AUDIENCES)[number];

export const AUDIENCE_META: Record<
  Audience,
  { label: string; description: string; pillClass: string }
> = {
  seeker: {
    label: "Seeker",
    description:
      "For readers new to Christianity. Plain language, no jargon, lead with Jesus.",
    pillClass: "pill-seeker",
  },
  believer: {
    label: "Believer",
    description:
      "For Christians from any tradition looking for devotional and topical content.",
    pillClass: "pill-believer",
  },
  student: {
    label: "Student",
    description:
      "For readers ready for deeper doctrinal teaching, including Message-tradition material.",
    pillClass: "pill-student",
  },
};

export function isAudience(value: unknown): value is Audience {
  return typeof value === "string" && (AUDIENCES as readonly string[]).includes(value);
}
