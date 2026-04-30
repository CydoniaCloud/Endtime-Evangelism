import Link from "next/link";
import type { Audience } from "@/content/taxonomy/audiences";

const DOT_COLOR: Record<Audience, string> = {
  seeker: "var(--seeker-ink)",
  believer: "var(--believer-ink)",
  student: "var(--student-ink)",
};

/**
 * Pathway card — one for each audience on the homepage and Start Here page.
 * The audience color appears as a small dot, never a full fill (per design).
 */
export function PathwayCard({
  audience,
  title,
  description,
  href,
}: {
  audience: Audience;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block border-hairline border-rule dark:border-rule-dark p-6 md:p-8 hover:bg-surface dark:hover:bg-surface-dark hover:no-underline transition-colors"
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          aria-hidden="true"
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: DOT_COLOR[audience] }}
        />
        <span className="eyebrow">For {audience}s</span>
      </div>
      <h3 className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark group-hover:underline" style={{ textUnderlineOffset: "0.2em", textDecorationThickness: "0.5px" }}>
        {title}
      </h3>
      <p className="text-small text-ink-2 dark:text-ink-dark-2 mt-2">{description}</p>
    </Link>
  );
}
