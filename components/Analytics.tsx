import Script from "next/script";

/**
 * Privacy-respecting analytics. Renders Plausible OR Umami based on
 * environment variables. No script is added if neither is configured.
 *
 * Plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 *   e.g. NEXT_PUBLIC_PLAUSIBLE_DOMAIN=endtimevangelism.org
 *
 * Umami:    NEXT_PUBLIC_UMAMI_WEBSITE_ID + NEXT_PUBLIC_UMAMI_SCRIPT_URL
 *   e.g. NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *        NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
 *
 * Both are loaded with `strategy="afterInteractive"` so they don't
 * block initial render and don't tank Lighthouse scores.
 */
export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

  if (plausibleDomain) {
    return (
      <Script
        defer
        strategy="afterInteractive"
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
      />
    );
  }

  if (umamiId && umamiSrc) {
    return (
      <Script
        defer
        strategy="afterInteractive"
        data-website-id={umamiId}
        src={umamiSrc}
      />
    );
  }

  return null;
}
