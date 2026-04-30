# Endtime Evangelism

A Christ-centered evangelism site, built with restraint.

> Whoever you are, He has something to say to you.

---

## Build status

**Phase 1 — Foundation:** ✅ Complete.
**Phase 2 — Content infrastructure:** ✅ Complete.
**Phase 3 — Discovery:** ✅ Complete.
**Phase 4 — Polish:** ✅ Complete (pending deploy-time validation).
**Phase 5 — Launch:** ⏳ Next.

## After Phase 4

**SEO.** Per-page metadata flowing from frontmatter (title, description,
OpenGraph, Twitter cards). JSON-LD structured data — Article (or Sermon)
schema on every content page, BreadcrumbList navigation, Organization
site-wide. `app/sitemap.ts` generates a complete sitemap including content,
topic indexes, scripture chapters, and series. `app/robots.ts` advertises
it. `/feed.xml` is a real RSS 2.0 feed.

**Open Graph images.** `app/[type]/[slug]/opengraph-image.tsx` and
`app/opengraph-image.tsx` use `next/og` to generate per-article and
default OG cards at the edge — title in Fraunces (loaded from Google's
CDN at build), warm-paper background, accent-colored hairline rule,
wordmark. No image files to maintain.

**Newsletter.** Server action at `app/actions/newsletter.ts` handles
submission, picks the provider from env vars (Buttondown gets native
double opt-in; Resend is single opt-in), validates the email, and
returns useful error messages. The form uses React 19's
`useActionState` to thread results back into the UI without a full
page reload. `/subscribe` is a dedicated landing page with the form
and three featured Start Here essays.

**Analytics.** `components/Analytics.tsx` renders Plausible or Umami
based on env vars. Renders nothing if neither is configured.

**Accessibility.** Tertiary text color was darkened from `#9A968D` to
`#706B65` (and dark-mode `#807B71` → `#8A857A`) to meet WCAG 2.1 AA
contrast against the warm background — the original spec values
measured ~2.76:1 and would have failed every audit. The new values
test at ~4.83:1 light / ~4.53:1 dark, both above the 4.5:1 minimum.
`prefers-reduced-motion` is honored. `autoFocus` removed from the
search input. Form errors announced via `role="alert"`. Skip-to-content
link present site-wide.

## Environment variables

Copy `.env.local.example` to `.env.local` and fill what you want.
Everything is optional — the site builds without any of it.

```sh
NEXT_PUBLIC_SITE_URL=https://your-domain.example

# Newsletter — pick one
BUTTONDOWN_API_KEY=...                 # native double opt-in, recommended
# or:
RESEND_API_KEY=...
RESEND_AUDIENCE_ID=...

# Analytics — pick one or leave blank
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=livingword.example
# or:
NEXT_PUBLIC_UMAMI_WEBSITE_ID=...
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
```

## Pre-launch checklist (Phase 5)

These items can only be validated against a deployed URL:

1. **Lighthouse** — run against the production domain. Targets per the
   build prompt: 95+ in all four categories on every page. The static
   signals are good (no third-party scripts, fonts via `next/font` with
   `display: swap`, one client component per page); a real measurement
   confirms.
2. **Core Web Vitals** — LCP under 2.5s, CLS under 0.1, INP under 200ms.
3. **Newsletter end-to-end** — submit a real email, confirm via the
   double-opt-in link, verify Buttondown received it.
4. **Analytics confirmation** — load any page, watch the analytics
   dashboard register a pageview.
5. **Cross-browser/device** — Safari, Chrome, Firefox; iOS Safari,
   Chrome Android. The CSS Grid breakouts in `.prose-article`, the
   newsletter form behavior, and the search page all want a real-device
   pass.
6. **Screen reader** — VoiceOver (macOS/iOS) or NVDA (Windows): tab
   through the homepage, an article, the library filters, and search
   results.
7. **Print** — `Cmd-P` on an article page; the print stylesheet should
   strip nav/footer, increase body size, and append URLs after links.

## What's in place earlier in the build

What's in place after Phase 1:

- Next.js 15 (App Router) + TypeScript + Tailwind, configured.
- MDX wired through `@next/mdx` with GFM and smartypants.
- Frontmatter loader with strict validation (`lib/content.ts`).
- Three-axis controlled vocabulary in `content/taxonomy/`:
  audiences, types, ~25 topics.
- Design system: warm-paper palette, two-weight type scale,
  drop cap, pull quote, scripture reference, audience pills.
- Dark mode tokens (read-by-lamplight feel, not dev-tool black).
- Print stylesheet baked in.
- Base layout: `Header`, `Footer`, `Container`, `SkipLink`.
- Placeholder homepage: hero, three pathway cards, latest teachings
  (placeholder rows), newsletter form (UI-only for now), footer.
- 404 page in the same voice.

## Getting started

```sh
cp .env.local.example .env.local
npm install
npm run dev
```

The site runs at http://localhost:3000.

```sh
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
```

## Project layout

```
app/
  layout.tsx          Root layout — fonts, header, footer, skip link
  page.tsx            Homepage
  globals.css         Tailwind + design tokens + drop cap + print
  not-found.tsx       404
components/
  Container.tsx       prose (65ch) | page (max-w-page) wrapper
  Header.tsx          Wordmark + primary nav
  Footer.tsx          Wordmark + utility nav + ministry address
  SkipLink.tsx        Keyboard-only skip to #main
  PathwayCard.tsx     One per audience on the homepage
  AudiencePill.tsx    seeker | believer | student
  TypePill.tsx        tract | sermon | article | study | …
  NewsletterForm.tsx  Email-only, double opt-in stub (Phase 4 wires it)
content/
  taxonomy/           Controlled vocabularies (audiences, types, topics)
  *.mdx               Articles live here (Phase 2)
lib/
  content.ts          MDX frontmatter loader & validation
  site.ts             Site-wide constants and nav arrays
mdx-components.tsx    MDX element overrides (intentionally minimal)
tailwind.config.ts    Custom palette, type scale, spacing — locked
postcss.config.mjs
next.config.mjs
```

## Design system (locked)

These are the rules — change them only with intention.

**Color.** Background `#FAF8F4`, ink `#1A1A1A`, accent `#2A4365`.
Audience tag colors used only for tagging UI, never as page backgrounds:
seeker `#185FA5/#E6F1FB`, believer `#0F6E56/#E1F5EE`, student `#534AB7/#EEEDFE`.
No gradients, no shadows, no glow. One hairline border (0.5px) is the
only divider style allowed.

**Typography.** Fraunces (serif) for headings & pull quotes,
Inter (sans) for body & UI. Two weights only — 400 and 500. Sentence case
throughout. Body 18px mobile / 19px desktop, line-height 1.7.

**Reading column.** 65ch (≈36rem). Articles never span the full viewport.

**Distinctive detail.** A drop cap on the first letter of every article
body, set in Fraunces in the accent color, ~3 lines tall. This is the
only visual flourish. Don't add a second one.

## Adding content (preview)

When Phase 2 lands, you'll add a tract by dropping a file into `/content`:

```mdx
---
title: "Was it really an apple that Eve ate?"
slug: "was-it-an-apple"
audience: student
type: tract
topics: [new-birth, original-sin]
scripture: [genesis-3]
series: null
description: "A short SEO description, 150 chars max."
publishedAt: "2026-04-29"
updatedAt: "2026-04-29"
audioUrl: null
videoUrl: null
pdfUrl: "/pdfs/was-it-an-apple.pdf"
readingTime: 8
---

The Bible never says the fruit was an apple…
```

Frontmatter is validated at build time. Bad audience, bad type, or
unknown topic slug throws a clear error.

## Editorial cautions

The source tradition includes Message-tradition material. Several
non-negotiables apply when authoring:

1. **Christ first, doctrine second.** Every page a seeker can land on
   must point to Jesus before pointing to any specific theological
   position.
2. **No medical or scientific claims.** Frame fall-and-redemption
   theologically and pastorally, not medically.
3. **Branham quotes ≤15 words**, with sermon name + date + paragraph
   reference. Voice of God Recordings holds rights to most material —
   check their permissions before extensive quotation.
4. **Message-tradition content is transparently labeled** in
   `/studies` only. Honest framing converts; ambushing repels.

See `build-prompt.md` (the source spec) for the full set.

## What's next — Phase 2

In order:

1. Article/tract page template (`app/[type]/[slug]/page.tsx`).
2. Dynamic index pages: `/topics/[slug]`, `/scripture/[book]/[chapter]`,
   `/series/[slug]`.
3. Print stylesheet refinements + per-tract PDF generation.
4. Migrate 5 existing tracts as a content baseline.

## Deployment

This project is shaped for Vercel. After `vercel link`:

```sh
vercel deploy --prod
```

Set the environment variables from `.env.local.example` in the Vercel
project settings before the first production deploy.
