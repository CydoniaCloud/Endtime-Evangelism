import { type ReactNode } from "react";

/**
 * "Pray with me" block — a subtle surface card containing a 3–5 sentence
 * prayer the reader can pray. Skippable. Editorially optional, never
 * required, and never reading like a script.
 *
 * Renders only its children — no decoration except the surface background
 * and a serif heading. Designed to feel like a printed insert, not a CTA.
 */
export function PrayWithMe({ children }: { children: ReactNode }) {
  return (
    <aside
      className="my-16 px-6 py-8 md:px-8 md:py-10 bg-surface dark:bg-surface-dark"
      aria-label="A prayer you can pray"
    >
      <p className="font-serif text-h3 md:text-h3-lg text-ink dark:text-ink-dark mb-4">
        Pray with me.
      </p>
      <div className="text-body text-ink-2 dark:text-ink-dark-2 [&>p+p]:mt-3">
        {children}
      </div>
    </aside>
  );
}
