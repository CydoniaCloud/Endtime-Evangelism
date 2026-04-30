import { AUDIENCE_META, type Audience } from "@/content/taxonomy/audiences";

/**
 * Audience pill — text + soft fill. The single visual marker that tells a
 * reader which pathway a piece belongs to. Used in lists and on article
 * pages near the title.
 */
export function AudiencePill({ audience }: { audience: Audience }) {
  const meta = AUDIENCE_META[audience];
  return (
    <span className={`pill ${meta.pillClass}`} aria-label={`Audience: ${meta.label}`}>
      {meta.label.toLowerCase()}
    </span>
  );
}
