import { type ReactNode } from "react";
import { ScriptureRef, formatScriptureSlug } from "./ScriptureRef";

/**
 * Pull quote — styled by `.pullquote` in globals.css. Used for key Scripture
 * verses near the top of an article, and exposed to MDX so authors can drop
 * `<PullQuote ref="john-3" verse="16">…</PullQuote>` inline.
 */
export function PullQuote({
  children,
  scriptureRef,
  verse,
}: {
  children: ReactNode;
  /** Frontmatter-style slug, e.g. "genesis-3" or "1-corinthians-13". */
  scriptureRef?: string;
  verse?: string;
}) {
  return (
    // data-breakout="medium" promotes this to the 44rem grid track
    // inside .prose-article. See globals.css.
    <figure className="my-12" data-breakout="medium">
      <blockquote className="pullquote my-0">{children}</blockquote>
      {scriptureRef ? (
        <figcaption>
          <ScriptureRef slug={scriptureRef} verse={verse} />
        </figcaption>
      ) : null}
    </figure>
  );
}

export { formatScriptureSlug };
