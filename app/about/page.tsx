import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { PullQuote } from "@/components/PullQuote";

export const metadata: Metadata = {
  title: "About",
  description:
    "Endtime Evangelism — a non-profit outreach ministry supported by Message believers, with works in Sudbury, Ontario and Margarita Island, Venezuela.",
};

/**
 * About page.
 *
 * Lays out the ministry's identity, mission, vision, support paths, and
 * scriptural foundation in the editorial voice. Bullet-point structure
 * from source copy was converted to prose where prose worked; H3
 * subsections kept where each line of action wanted its own emphasis.
 */
export default function AboutPage() {
  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">about</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          A non-profit outreach ministry, supported by Message believers.
        </h1>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-4">
          Sudbury, Ontario, Canada &middot; Margarita Island, Venezuela
        </p>

        {/* Mission ------------------------------------------------------ */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          Mission
        </h2>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            Endtime Evangelism is dedicated to promoting the Endtime
            Message, supporting evangelistic and humanitarian outreach,
            and establishing and strengthening local works in key regions
            — beginning with Greater Sudbury and Margarita Island.
          </p>
          <p>
            The purpose is to serve both the spiritual and practical
            needs of communities: preparing hearts, strengthening
            believers, and reaching souls with the Word of God.
          </p>
        </div>

        {/* Vision ------------------------------------------------------- */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          Vision
        </h2>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6">
          To see lives transformed through the Gospel of Jesus Christ,
          and to raise up local outreach efforts that reflect faith,
          compassion, and truth in action.
        </p>

        {/* Support ------------------------------------------------------ */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          How you can support
        </h2>

        <h3 className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark mt-10">
          Pray with us
        </h3>
        <p className="text-body text-ink-2 dark:text-ink-dark-2 mt-3">
          Add this ministry to your daily prayer list. Prayer is the
          foundation of every soul reached and every life changed.
        </p>

        <h3 className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark mt-8">
          Partner with us
        </h3>
        <p className="text-body text-ink-2 dark:text-ink-dark-2 mt-3">
          Support outreach initiatives in Canada and Venezuela as the
          work expands into new regions.
        </p>

        <h3 className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark mt-8">
          Share the vision
        </h3>
        <p className="text-body text-ink-2 dark:text-ink-dark-2 mt-3">
          Help spread the message by sharing this ministry with others
          who carry a burden for end-time evangelism.
        </p>

        {/* Scriptural foundation --------------------------------------- */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          Scriptural foundation
        </h2>

        <PullQuote scriptureRef="malachi-4" verse="5">
          Behold, I will send you Elijah the prophet before the coming of
          the great and dreadful day of the LORD.
        </PullQuote>

        <PullQuote scriptureRef="revelation-10" verse="7">
          But in the days of the voice of the seventh angel, when he
          shall begin to sound, the mystery of God should be finished, as
          he hath declared to his servants the prophets.
        </PullQuote>
      </Container>
    </section>
  );
}
