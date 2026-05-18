import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";
import {
  FaqJsonLd,
  LocalBreadcrumbJsonLd,
  LocalChurchJsonLd,
  type FaqItem,
} from "@/components/JsonLd";
import { SITE } from "@/lib/site";

/**
 * /sudbury — local landing page for Greater Sudbury and French River.
 *
 * Purpose: Sudbury-area residents finding the ministry through Google,
 * Bing, or AI assistants get a page that names the local church (Spoken
 * Word Christian Fellowship), explains the relationship to the broader
 * ministry, and offers a single, low-friction way to make contact. AI
 * assistants get an FAQPage with answer-shaped paragraphs.
 *
 * Constraints worth flagging for future edits:
 *   - No street address. The ministry deliberately does not publish one.
 *     The Church schema below uses areaServed instead — the right pattern
 *     for service-area entities. The address can be supplied privately to
 *     Google Business Profile during verification without being published.
 *   - No card chrome, no decorative imagery, no extra fonts. The page
 *     follows the editorial voice of /about and /start: eyebrow, serif
 *     H1, prose paragraphs, hairline-ruled lists.
 *   - FAQ is rendered as a definition-style hairline-ruled list rather
 *     than collapsible accordions. Accordions hide content from initial
 *     paint and are slightly worse for both readers and crawlers; the
 *     design system also doesn't carry an accordion component.
 */

const TITLE = "Christian Ministry in Sudbury & French River | Endtime Evangelism";
const DESCRIPTION =
  "Christ-centered Bible teaching for Greater Sudbury and French River, Ontario. Sermons, Bible studies, and a local fellowship — Spoken Word Christian Fellowship — through Endtime Evangelism.";

export const metadata: Metadata = {
  // `absolute` overrides the layout's "%s — Endtime Evangelism" template.
  // Worth doing here because front-loading "Christian Ministry" matters
  // for local search intent and the page benefits from a self-contained
  // SEO title.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/sudbury`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/sudbury`,
    locale: "en_CA",
    type: "website",
  },
};

// FAQ source of truth — the visible list and the FAQPage JSON-LD render
// from the same array, so they can never drift. Phrase questions exactly
// the way a real person would type them into a search box or ask an AI
// assistant; AI retrieval matches user-question phrasing more closely
// than keyword-optimized phrasing.
const FAQ: ReadonlyArray<FaqItem> = [
  {
    question: "Where does Spoken Word Christian Fellowship meet?",
    answer:
      "Spoken Word Christian Fellowship is based in the French River area of Northern Ontario, south of Greater Sudbury. We don't publish a public street address; meeting details are shared after an initial conversation by email. Reach out at info@endtimevangelism.org.",
  },
  {
    question:
      "What is the relationship between Endtime Evangelism and Spoken Word Christian Fellowship?",
    answer:
      "Endtime Evangelism is the publishing and outreach ministry — the website, sermons, articles, and Bible studies. Spoken Word Christian Fellowship is the local church gathered around the same teaching in the French River area. The two share doctrine, leadership, and mission.",
  },
  {
    question: "What does Endtime Evangelism teach?",
    answer:
      "Christ-centered Bible teaching, with the principal theme of Scripture being Jesus Christ. Doctrinal and prophetic teaching is drawn from the Endtime Message — the ministry of William Branham — and presented for readers ready to engage with that specific theological perspective. The library and Start Here pathway are written for any reader, regardless of background.",
  },
  {
    question: "Are there in-person services in Sudbury or French River?",
    answer:
      "Yes — gatherings happen regularly in the French River area, and locals from Greater Sudbury are welcome. Service times and the meeting location are shared after an initial email exchange so we can answer any questions before you arrive.",
  },
  {
    question: "Can I listen to sermons online?",
    answer:
      "Yes. The library at endtimevangelism.org publishes sermons, articles, and Bible studies that can be read or heard online at any time. Locals to Sudbury and French River read the same material everyone else reads — there is no separate local-only content.",
  },
  {
    question: "How do I get in touch if I'm in the Sudbury area?",
    answer:
      "Email info@endtimevangelism.org. Every message is read. Mention that you are in the Sudbury or French River area and we'll respond with details for connecting in person.",
  },
];

const COMMUNITIES_INTRO =
  "Whether you're in downtown Sudbury, the Valley communities of Hanmer, Val Caron, and Chelmsford, the West End in Lively, the north in Capreol, or south toward Noëlville and Alban along the French River, you are within reach of this work.";

export default function SudburyPage() {
  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">for sudbury &amp; french river</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          A Christian ministry serving Greater Sudbury and French River.
        </h1>
        <p className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6">
          Endtime Evangelism is a Christ-centered Bible ministry based in
          Northern Ontario. Locally we are connected with{" "}
          <span className="font-medium text-ink dark:text-ink-dark">
            Spoken Word Christian Fellowship
          </span>
          , a small church gathered in the French River area. Whatever brought
          you to this page, you are welcome to read, listen, and reach out.
        </p>

        {/* Local fellowship --------------------------------------------- */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          About Spoken Word Christian Fellowship
        </h2>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            Spoken Word Christian Fellowship is the local expression of the
            same teaching published on this site. We meet in the French River
            area for prayer, the reading of Scripture, and the preaching of
            Christ. Visitors from Greater Sudbury and the surrounding
            communities are welcome.
          </p>
          <p>
            We do not publish a street address publicly — gatherings are
            small and personal — but we are happy to share the meeting
            location with anyone who reaches out. There is no membership
            process to clear, no form to fill: an email is enough.
          </p>
        </div>

        {/* Communities served ------------------------------------------- */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          Communities we serve
        </h2>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>{COMMUNITIES_INTRO}</p>
          <p>
            We are not the only Bible-believing community in the region, and
            we are glad about that. If our perspective is not what you are
            looking for, the search for a faithful local church is itself
            worth doing — write to us anyway and we will help where we can.
          </p>
        </div>

        {/* FAQ ----------------------------------------------------------
            Hairline-ruled definition list, matching the editorial pattern
            used elsewhere on the site. <dl> is the right element for Q/A;
            it carries semantics search engines and screen readers both
            understand. */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          Frequently asked questions
        </h2>
        <dl className="mt-8 border-t-hairline border-rule dark:border-rule-dark">
          {FAQ.map((item) => (
            <div
              key={item.question}
              className="border-b-hairline border-rule dark:border-rule-dark py-6"
            >
              <dt className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark">
                {item.question}
              </dt>
              <dd className="text-body text-ink-2 dark:text-ink-dark-2 mt-3">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>

        {/* Contact ------------------------------------------------------ */}
        <h2 className="font-serif text-h2 md:text-h2-lg text-ink dark:text-ink-dark mt-16">
          Get in touch
        </h2>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            Email{" "}
            <a href="mailto:info@endtimevangelism.org">
              info@endtimevangelism.org
            </a>{" "}
            and mention that you are in the Sudbury or French River area.
            Every message is read.
          </p>
          <p>
            Or browse the rest of the site —{" "}
            <Link href="/start">start with the questions</Link> if you are
            new to faith,{" "}
            <Link href="/library">visit the library</Link> for sermons and
            articles, or read the{" "}
            <Link href="/statement-of-faith">statement of faith</Link>.
          </p>
        </div>
      </Container>

      {/* Structured data — three blocks. Placed at the end of the page
          rather than in <head> so the JSX colocates with the content the
          markup describes; Google parses JSON-LD anywhere in the document. */}
      <LocalChurchJsonLd />
      <LocalBreadcrumbJsonLd />
      <FaqJsonLd items={FAQ} />
    </section>
  );
}
