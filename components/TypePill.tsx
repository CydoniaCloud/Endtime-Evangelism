import { CONTENT_TYPE_META, type ContentType } from "@/content/taxonomy/types";

/**
 * Type pill — neutral fill. Tells the reader at a glance whether a piece is
 * a tract, sermon, study, etc.
 */
export function TypePill({ type }: { type: ContentType }) {
  const meta = CONTENT_TYPE_META[type];
  return (
    <span className="pill pill-neutral" aria-label={`Type: ${meta.label}`}>
      {meta.label.toLowerCase()}
    </span>
  );
}
