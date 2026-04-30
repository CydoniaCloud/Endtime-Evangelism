import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

/**
 * Default Open Graph image — used for any page that doesn't define its
 * own. Composition matches the per-article image but with the site
 * tagline as the headline.
 */

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = SITE.name;

async function loadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:wght@500&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    const css = await res.text();
    const url = css.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    if (!url) return null;
    const fontRes = await fetch(url);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const fraunces = await loadFraunces();
  const fontFamily = fraunces ? "Fraunces" : "Georgia, serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF8F4",
          color: "#1A1A1A",
          padding: "80px 96px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#9A968D",
            letterSpacing: "0.08em",
            textTransform: "lowercase",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          jesus christ — the same yesterday, today, and forever
        </div>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#1A1A1A",
            maxWidth: "100%",
            display: "flex",
          }}
        >
          {SITE.tagline}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            borderTop: "1px solid #E8E4DA",
            paddingTop: 32,
            fontSize: 28,
            color: "#2A4365",
            fontWeight: 500,
          }}
        >
          {SITE.name}
        </div>
      </div>
    ),
    {
      ...size,
      ...(fraunces
        ? { fonts: [{ name: "Fraunces", data: fraunces, weight: 500 }] }
        : {}),
    },
  );
}
