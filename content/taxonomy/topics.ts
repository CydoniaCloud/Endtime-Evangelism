/**
 * Topic axis — controlled vocabulary of ~25 slugs.
 *
 * Resist adding new topics casually. If two pieces would warrant a new topic,
 * see if an existing one fits first. Topics are an index, not a tag cloud.
 */

export const TOPICS = [
  // Core Gospel
  "who-is-jesus",
  "the-gospel",
  "salvation",
  "new-birth",
  "the-cross",
  "the-resurrection",
  // Doctrine of God
  "the-godhead",
  "the-holy-spirit",
  "the-name",
  // Anthropology & sin
  "original-sin",
  "the-fall",
  "the-image-of-god",
  // Scripture & revelation
  "scripture",
  "prophecy",
  "revelation",
  // Christian life
  "prayer",
  "discipleship",
  "the-church",
  "suffering",
  "doubt",
  "hope",
  // Eschatology
  "end-times",
  "the-bride",
  "the-second-coming",
  // Tradition-specific (Deeper Studies primarily)
  "serpent-seed",
  "seven-church-ages",
] as const;

export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  "who-is-jesus": "Who is Jesus",
  "the-gospel": "The Gospel",
  salvation: "Salvation",
  "new-birth": "The new birth",
  "the-cross": "The cross",
  "the-resurrection": "The resurrection",
  "the-godhead": "The Godhead",
  "the-holy-spirit": "The Holy Spirit",
  "the-name": "The Name",
  "original-sin": "Original sin",
  "the-fall": "The fall",
  "the-image-of-god": "The image of God",
  scripture: "Scripture",
  prophecy: "Prophecy",
  revelation: "Revelation",
  prayer: "Prayer",
  discipleship: "Discipleship",
  "the-church": "The church",
  suffering: "Suffering",
  doubt: "Doubt",
  hope: "Hope",
  "end-times": "End times",
  "the-bride": "The Bride",
  "the-second-coming": "The second coming",
  "serpent-seed": "Serpent seed",
  "seven-church-ages": "Seven church ages",
};

export function isTopic(value: unknown): value is Topic {
  return typeof value === "string" && (TOPICS as readonly string[]).includes(value);
}
