import { ImageResponse } from "next/og";

import { getContentBySlug } from "@/lib/content";
import { SITE } from "@/lib/site";

/**
 * Per-article Open Graph image, generated at build time by next/og.
 *
 * Composition: warm-paper background (#FAF8F4), eyebrow (small lowercase
 * tracked label), serif headline (article title), site name attribution,
 * thin accent rule. No images — typography and whitespace only, matching
 * the site's design system.
 *
 * The serif font is loaded from Google's CDN at build time. If the build
 * environment has no network, we fall back to a system serif — still
 * legible, just not on-brand for the few seconds it would matter.
 */

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Endtime Evangelism";

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

export default async function Image({
  params,
}: {
  params: { type: string; slug: string };
}) {
  const record = getContentBySlug(params.slug);
  const title = record?.title ?? SITE.name;
  const eyebrow =
    record?.audience === "seeker"
      ? "for those just arriving"
      : record?.audience === "believer"
        ? "for the journey"
        : record?.audience === "student"
          ? "deeper studies"
          : SITE.tagline;

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
        {/* Eyebrow */}
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
          {eyebrow}
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#1A1A1A",
            display: "flex",
            maxWidth: "100%",
          }}
        >
          {title}
        </div>

        {/* Footer — accent rule + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #E8E4DA",
            paddingTop: 32,
            fontSize: 24,
            color: "#5C5A55",
          }}
        >
          <span style={{ color: "#2A4365", fontWeight: 500 }}>
            {SITE.name}
          </span>
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 18,
              letterSpacing: "0.04em",
            }}
          >
            {record ? `${record.readingTime} min` : ""}
          </span>
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
