import Link from "next/link";
import { Container } from "@/components/Container";

/**
 * 404 page — written in the same restraint as the rest of the site.
 */
export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <Container width="prose">
        <p className="eyebrow mb-4">page not found</p>
        <h1 className="font-serif text-h1 md:text-h1-lg text-ink dark:text-ink-dark">
          That page is no longer where it was.
        </h1>
        <p className="text-body text-ink-2 dark:text-ink-dark-2 mt-6">
          Try the home page, or begin reading from the start.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10">
          <Link href="/" className="btn-secondary">
            Home
          </Link>
          <Link href="/start" className="btn-primary">
            Start here
          </Link>
        </div>
      </Container>
    </section>
  );
}
