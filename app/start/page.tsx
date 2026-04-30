import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import { getContentBySlug } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start here",
  description:
    "Short essays answering the questions a reader might bring to faith for the first time — who Jesus is, what the Gospel means, what happens next.",
};

/**
 * Start Here landing.
 *
 * The curated seeker pathway — ten plain-language essays answering core
 * questions in order. The 10 questions are a fixed editorial list (per the
 * build prompt); each card links to its essay if written, or sits as a
 * "being written" stub if not. Cards are numbered to convey the suggested
 * reading order without being prescriptive — readers can jump in anywhere.
 */

interface Question {
  number: number;
  question: string;
  slug: string;
}

const QUESTIONS: Question[] = [
  { number: 1, question: "Who is Jesus?", slug: "who-is-jesus" },
  { number: 2, question: "What is the Gospel?", slug: "what-is-the-gospel" },
  {
    number: 3,
    question: "What does it mean to be born again?",
    slug: "born-again",
  },
  {
    number: 4,
    question: "Why does the world feel broken?",
    slug: "the-world-feels-broken",
  },
  { number: 5, question: "Is the Bible reliable?", slug: "is-the-bible-reliable" },
  {
    number: 6,
    question: "How do I become a Christian?",
    slug: "how-do-i-become-a-christian",
  },
  {
    number: 7,
    question: "What happens after I die?",
    slug: "what-happens-after-i-die",
  },
  { number: 8, question: "I have doubts. Is that okay?", slug: "doubt" },
  { number: 9, question: "What is the church for?", slug: "what-is-the-church-for" },
  { number: 10, question: "What's next?", slug: "whats-next" },
];

export default function StartPage() {
  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">start here</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          A handful of questions, asked plainly.
        </h1>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            If you are arriving with questions about Jesus, the Gospel, or
            what it means to follow Him, this is the place to begin. The
            essays are short, written in plain language, and meant to be
            read in any order you like — though the numbering reflects a
            sequence that has helped others.
          </p>
        </div>

        {/* Only render questions whose essay is published. Canonical
            numbering is preserved (01, 02, 06, etc.) so when more
            essays land they'll slot in at their correct position. */}
        <ol className="mt-12 border-t-hairline border-rule dark:border-rule-dark">
          {QUESTIONS.map((q) => {
            const article = getContentBySlug(q.slug);
            if (!article) return null;
            const number = String(q.number).padStart(2, "0");
            return (
              <li
                key={q.slug}
                className="border-b-hairline border-rule dark:border-rule-dark"
              >
                <Link
                  href={`/${article.type}/${article.slug}`}
                  className="block py-6 text-ink hover:no-underline group dark:text-ink-dark"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-caption text-ink-3 tabular-nums">
                      {number}
                    </span>
                    <p
                      className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark group-hover:underline flex-1"
                      style={{
                        textUnderlineOffset: "0.2em",
                        textDecorationThickness: "0.5px",
                      }}
                    >
                      {q.question}
                    </p>
                    <span className="text-caption text-ink-3">
                      {article.readingTime} min
                    </span>
                  </div>
                  {article.dek ? (
                    <p className="text-small text-ink-2 dark:text-ink-dark-2 mt-1 ml-12">
                      {article.dek}
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ol>

        {/* Graceful exits — for readers who landed in the wrong section. */}
        <div className="mt-16 pt-12 border-t-hairline border-rule dark:border-rule-dark space-y-3 text-small">
          <p>
            <Link href="/library" className="text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark">
              Already a believer? Visit the library →
            </Link>
          </p>
          <p>
            <Link href="/studies" className="text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark">
              Looking for deeper teaching? Visit Deeper Studies →
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
