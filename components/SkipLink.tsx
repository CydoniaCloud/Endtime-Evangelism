/**
 * Skip-to-content link. Hidden until keyboard-focused. Required for WCAG.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-bg focus:text-ink focus:px-3 focus:py-2 focus:border-hairline focus:border-rule"
    >
      Skip to content
    </a>
  );
}
