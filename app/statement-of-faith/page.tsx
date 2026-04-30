import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Statement of faith",
  description:
    "What we believe — the universal core of the Christian faith first, with tradition-specific positions clearly marked below.",
};

/**
 * Statement of Faith page (stub).
 *
 * Phase 5 builds the full statement. The build prompt requires this page
 * to lead with the universal core (deity of Christ, atonement,
 * resurrection, salvation by faith) before any tradition-specific
 * positions. The stub establishes that intent without yet committing to
 * the wording.
 */
export default function StatementOfFaithPage() {
  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">statement of faith</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          What we believe.
        </h1>
        <div className="text-body md:text-body-lg text-ink-2 dark:text-ink-dark-2 mt-6 space-y-5">
          <p>
            This page will set out the universal core of the Christian
            faith first — the deity of Christ, His atoning death and bodily
            resurrection, the authority of Scripture, salvation by grace
            through faith — and then, clearly marked below, the
            tradition-specific positions held in this ministry.
          </p>
          <p>
            It is being prepared with care. Wording on a statement like
            this matters more than wording on a stub.
          </p>
        </div>
        <p className="mt-10">
          <Link href="/library" className="text-small">
            Read what's published →
          </Link>
        </p>
      </Container>
    </section>
  );
}
