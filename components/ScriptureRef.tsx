import { formatScriptureSlug } from "@/content/taxonomy/scripture";

export { formatScriptureSlug };

/**
 * Inline scripture reference rendered as small caps with a hairline rule
 * above. Use after a verse to attribute it.
 */
export function ScriptureRef({ slug, verse }: { slug: string; verse?: string }) {
  const ref = formatScriptureSlug(slug);
  return (
    <p className="scripture-ref">
      {ref}
      {verse ? `:${verse}` : ""}
    </p>
  );
}
