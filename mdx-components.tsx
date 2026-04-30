import type { MDXComponents } from "mdx/types";

import { PullQuote } from "@/components/PullQuote";
import { PrayWithMe } from "@/components/PrayWithMe";
import { ScriptureRef } from "@/components/ScriptureRef";

/**
 * MDX component overrides.
 *
 * The `prose-article` class in globals.css handles spacing, the drop cap,
 * and rhythm — so the per-element overrides here stay minimal. Anything
 * editorial (PullQuote, PrayWithMe, ScriptureRef) is exposed by name so
 * authors can drop it inline in MDX:
 *
 *   <PullQuote scriptureRef="john-3" verse="16">For God so loved…</PullQuote>
 *   <ScriptureRef slug="genesis-3" verse="15" />
 *   <PrayWithMe>Father…</PrayWithMe>
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    PullQuote,
    PrayWithMe,
    ScriptureRef,
  };
}
