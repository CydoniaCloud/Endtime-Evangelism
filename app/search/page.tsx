import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { PagefindSearch } from "@/components/PagefindSearch";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across every published tract, sermon, article, and study.",
};

/**
 * Search page. The Pagefind index is built at build time
 * (`npm run search:index`, also wired into `npm run build`) and lives at
 * /pagefind/. The PagefindSearch client component loads it on demand.
 */
export default function SearchPage() {
  return (
    <section className="pt-16 md:pt-24 pb-20">
      <Container width="prose">
        <p className="eyebrow mb-4">search</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark mb-10">
          Find a piece.
        </h1>
        <PagefindSearch />
      </Container>
    </section>
  );
}
