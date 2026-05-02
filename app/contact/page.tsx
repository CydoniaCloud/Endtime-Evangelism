import type { Metadata } from "next";

import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach the editorial team.",
};

/**
 * Contact page (stub).
 *
 * Uses the Bible Tabernacle email since that is the only verified contact
 * channel currently available. Replace with whatever channel(s) the
 * ministry wants public before launch.
 */
export default function ContactPage() {
  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">contact</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          A way to reach us.
        </h1>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            The full contact page is being prepared. For now, the simplest
            way to reach the editorial team is by email at{" "}
            <a href="mailto:info@endtimevangelism.org">
              info@endtimevangelism.org
            </a>
            .
          </p>
          <p>
            For prayer requests, questions about a piece you've read, or
            corrections, the same address is fine — every message is read.
          </p>
        </div>
      </Container>
    </section>
  );
}
