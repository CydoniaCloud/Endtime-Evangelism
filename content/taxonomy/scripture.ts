/**
 * Canonical Scripture book taxonomy — all 66 books of the Protestant
 * canon, in canonical order, with slug ↔ label lookups.
 *
 * Frontmatter stores Scripture references as `book-chapter` slugs:
 *   "genesis-3"          → Genesis 3
 *   "1-corinthians-13"   → 1 Corinthians 13
 *
 * URLs use two segments per the build prompt:
 *   /scripture/genesis/3
 *   /scripture/1-corinthians/13
 *
 * The split point is the LAST hyphen before a numeric chapter; everything
 * before it is the book slug. Books with numeric prefixes (1-2 Samuel,
 * Kings, Chronicles, Corinthians, etc.) keep their leading digit attached
 * to the book slug so the chapter parses correctly.
 */

export interface BibleBook {
  slug: string;
  label: string;
  testament: "old" | "new";
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Pentateuch
  { slug: "genesis", label: "Genesis", testament: "old" },
  { slug: "exodus", label: "Exodus", testament: "old" },
  { slug: "leviticus", label: "Leviticus", testament: "old" },
  { slug: "numbers", label: "Numbers", testament: "old" },
  { slug: "deuteronomy", label: "Deuteronomy", testament: "old" },
  // Historical
  { slug: "joshua", label: "Joshua", testament: "old" },
  { slug: "judges", label: "Judges", testament: "old" },
  { slug: "ruth", label: "Ruth", testament: "old" },
  { slug: "1-samuel", label: "1 Samuel", testament: "old" },
  { slug: "2-samuel", label: "2 Samuel", testament: "old" },
  { slug: "1-kings", label: "1 Kings", testament: "old" },
  { slug: "2-kings", label: "2 Kings", testament: "old" },
  { slug: "1-chronicles", label: "1 Chronicles", testament: "old" },
  { slug: "2-chronicles", label: "2 Chronicles", testament: "old" },
  { slug: "ezra", label: "Ezra", testament: "old" },
  { slug: "nehemiah", label: "Nehemiah", testament: "old" },
  { slug: "esther", label: "Esther", testament: "old" },
  // Wisdom & poetry
  { slug: "job", label: "Job", testament: "old" },
  { slug: "psalms", label: "Psalms", testament: "old" },
  { slug: "proverbs", label: "Proverbs", testament: "old" },
  { slug: "ecclesiastes", label: "Ecclesiastes", testament: "old" },
  { slug: "song-of-solomon", label: "Song of Solomon", testament: "old" },
  // Major prophets
  { slug: "isaiah", label: "Isaiah", testament: "old" },
  { slug: "jeremiah", label: "Jeremiah", testament: "old" },
  { slug: "lamentations", label: "Lamentations", testament: "old" },
  { slug: "ezekiel", label: "Ezekiel", testament: "old" },
  { slug: "daniel", label: "Daniel", testament: "old" },
  // Minor prophets
  { slug: "hosea", label: "Hosea", testament: "old" },
  { slug: "joel", label: "Joel", testament: "old" },
  { slug: "amos", label: "Amos", testament: "old" },
  { slug: "obadiah", label: "Obadiah", testament: "old" },
  { slug: "jonah", label: "Jonah", testament: "old" },
  { slug: "micah", label: "Micah", testament: "old" },
  { slug: "nahum", label: "Nahum", testament: "old" },
  { slug: "habakkuk", label: "Habakkuk", testament: "old" },
  { slug: "zephaniah", label: "Zephaniah", testament: "old" },
  { slug: "haggai", label: "Haggai", testament: "old" },
  { slug: "zechariah", label: "Zechariah", testament: "old" },
  { slug: "malachi", label: "Malachi", testament: "old" },
  // Gospels
  { slug: "matthew", label: "Matthew", testament: "new" },
  { slug: "mark", label: "Mark", testament: "new" },
  { slug: "luke", label: "Luke", testament: "new" },
  { slug: "john", label: "John", testament: "new" },
  // Acts
  { slug: "acts", label: "Acts", testament: "new" },
  // Pauline epistles
  { slug: "romans", label: "Romans", testament: "new" },
  { slug: "1-corinthians", label: "1 Corinthians", testament: "new" },
  { slug: "2-corinthians", label: "2 Corinthians", testament: "new" },
  { slug: "galatians", label: "Galatians", testament: "new" },
  { slug: "ephesians", label: "Ephesians", testament: "new" },
  { slug: "philippians", label: "Philippians", testament: "new" },
  { slug: "colossians", label: "Colossians", testament: "new" },
  { slug: "1-thessalonians", label: "1 Thessalonians", testament: "new" },
  { slug: "2-thessalonians", label: "2 Thessalonians", testament: "new" },
  { slug: "1-timothy", label: "1 Timothy", testament: "new" },
  { slug: "2-timothy", label: "2 Timothy", testament: "new" },
  { slug: "titus", label: "Titus", testament: "new" },
  { slug: "philemon", label: "Philemon", testament: "new" },
  // General epistles
  { slug: "hebrews", label: "Hebrews", testament: "new" },
  { slug: "james", label: "James", testament: "new" },
  { slug: "1-peter", label: "1 Peter", testament: "new" },
  { slug: "2-peter", label: "2 Peter", testament: "new" },
  { slug: "1-john", label: "1 John", testament: "new" },
  { slug: "2-john", label: "2 John", testament: "new" },
  { slug: "3-john", label: "3 John", testament: "new" },
  { slug: "jude", label: "Jude", testament: "new" },
  // Apocalypse
  { slug: "revelation", label: "Revelation", testament: "new" },
];

const BOOK_BY_SLUG: Record<string, BibleBook> = Object.fromEntries(
  BIBLE_BOOKS.map((b) => [b.slug, b]),
);

const BOOK_INDEX: Record<string, number> = Object.fromEntries(
  BIBLE_BOOKS.map((b, i) => [b.slug, i]),
);

export function getBook(slug: string): BibleBook | undefined {
  return BOOK_BY_SLUG[slug];
}

export function bookCanonicalIndex(slug: string): number {
  return BOOK_INDEX[slug] ?? Number.MAX_SAFE_INTEGER;
}

/**
 * Split a frontmatter scripture slug like "genesis-3" or "1-corinthians-13"
 * into book + chapter parts. The book is whatever matches the canonical
 * book table; the rest is the chapter. Returns null for unrecognized
 * slugs so callers can surface a clear validation error.
 */
export function splitScriptureSlug(
  slug: string,
): { book: string; chapter: string } | null {
  const segments = slug.split("-");
  // Walk from longest to shortest book candidate so "1-corinthians-13"
  // matches "1-corinthians" before "1".
  for (let i = segments.length - 1; i >= 1; i--) {
    const candidate = segments.slice(0, i).join("-");
    if (BOOK_BY_SLUG[candidate]) {
      return {
        book: candidate,
        chapter: segments.slice(i).join("-"),
      };
    }
  }
  return null;
}

/**
 * Inverse — assemble a frontmatter slug from URL segments. Used by the
 * dynamic chapter route to find matching content.
 */
export function joinScriptureSlug(book: string, chapter: string): string {
  return `${book}-${chapter}`;
}

/**
 * Format a frontmatter slug as a human-readable reference.
 */
export function formatScriptureSlug(slug: string): string {
  const split = splitScriptureSlug(slug);
  if (!split) return slug;
  const book = getBook(split.book);
  return book ? `${book.label} ${split.chapter}` : slug;
}
