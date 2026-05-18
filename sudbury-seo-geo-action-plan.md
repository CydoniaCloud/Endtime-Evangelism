# Sudbury Landing Page — SEO + GEO Action Plan

Page: `/sudbury` on endtimevangelism.org
Audience: Greater Sudbury and French River, Ontario
Last updated: 2026-05-07

This plan covers code changes (now shipped) and operational follow-ups (still to do). Items already implemented in the repo are marked **[shipped]**; everything else is for the operator.

## What shipped in code (2026-05-07)

1. `app/sudbury/page.tsx` — new landing page with eyebrow + serif H1, intro, "About Spoken Word Christian Fellowship" section, "Communities we serve" paragraph naming all eight townships, six-question FAQ rendered as a hairline-ruled `<dl>`, and a contact section. Metadata uses an absolute title (`Christian Ministry in Sudbury & French River | Endtime Evangelism`), canonical URL, and Open Graph fields with `en_CA` locale.
2. `components/JsonLd.tsx` — three new exports: `LocalChurchJsonLd` (emits Church + WebPage entities, with `areaServed` covering all eight townships and `parentOrganization` referencing the layout-level Organization @id), `LocalBreadcrumbJsonLd`, and `FaqJsonLd`. The same `FAQ` array drives both the visible list and the JSON-LD, so they cannot drift.
3. `app/sitemap.ts` — `/sudbury` added at priority `0.9`, monthly change frequency.
4. `app/llms.txt/route.ts` — new "Local outreach" section pointing AI crawlers at `/sudbury` with a one-line factual description of the page's contents.
5. `lib/site.ts` — `/sudbury` added to `NAV_FOOTER` as "Sudbury & French River". Footer placement gives the page an internal link from every page on the site without crowding primary nav.
6. `app/about/page.tsx` — the existing "Sudbury, Ontario, Canada" line in the location subhead is now a contextual link to `/sudbury`. Editorial, light-touch, gives `/sudbury` an internal link from a high-authority site page.

`npm run typecheck` passes. The page can be viewed at `/sudbury` once deployed.

---

## 1. On-Page SEO

### Recommended title, description, H1, headings

1. **Page title** (55–60 chars): `Christian Ministry in Sudbury & French River | Endtime Evangelism`
   - Front-loads "Christian Ministry" (intent), names both geographies, brand last.
   - Avoid stuffing "Spoken Word Christian Fellowship" into the title — too long, dilutes click-through. Mention it in the H2 and body instead.

2. **Meta description** (150–160 chars): Keep what you have if it answers *who, where, and what they'll find*. A working pattern: `Bible teaching, sermons, and Bible studies serving Greater Sudbury and French River. Connect with Spoken Word Christian Fellowship online or by contact.`

3. **H1** (singular, distinct from title): `A Christian ministry serving Greater Sudbury and French River`

4. **Heading structure** (only one H1, then H2s; H3s under those):
   - H2: About Endtime Evangelism
   - H2: The local church — Spoken Word Christian Fellowship
   - H2: What we believe (one short paragraph + link to a /beliefs page)
   - H2: For people in Greater Sudbury and French River
     - H3: Communities we serve (list towns)
     - H3: How to connect with us
   - H2: Sermons and Bible studies
   - H2: Frequently asked questions
   - H2: Contact

### Keywords and long-tail phrases by intent

5. **Local-intent (primary)** — these are where the page should rank:
   - `Christian ministry Sudbury`
   - `Bible-believing church Sudbury Ontario`
   - `Bible study Sudbury`
   - `Christian church French River Ontario`
   - `Christian ministry Northern Ontario`
   - `church Greater Sudbury` and the variants for Lively, Val Caron, Hanmer, Chelmsford, Capreol, Noëlville, Alban
   - `Spoken Word Christian Fellowship` (branded, will rank quickly)

6. **Long-tail informational** — write supporting articles that target these and link back to /sudbury:
   - `what does it mean to be a Bible-believing Christian`
   - `how to find a Christian church in Northern Ontario`
   - `Christian Bible study online Canada`
   - `end times prophecy explained` (matches your ministry name; high informational value)
   - `expository preaching versus topical preaching`

7. **Navigational** — for people who heard the name and are searching it:
   - `Endtime Evangelism Sudbury`
   - `Spoken Word Christian Fellowship French River`
   - `endtimevangelism.org`

8. **Avoid** broad terms like `Christianity`, `Bible`, `evangelism` — you won't rank on them and they don't bring local intent.

### Schema.org structured data

9. Use `ChurchOrganization` (more specific than `Organization` for AI assistants) for the ministry, with `subOrganization` pointing to the local church. Drop `address` and use `areaServed`. Example to drop into the page (JSON-LD, in `<script type="application/ld+json">`):

```json
{
  "@context": "https://schema.org",
  "@type": "ChurchOrganization",
  "name": "Endtime Evangelism",
  "url": "https://www.endtimevangelism.org/sudbury",
  "logo": "https://www.endtimevangelism.org/logo.png",
  "description": "Christ-centered Bible teaching, sermons, and Bible studies serving Greater Sudbury and French River, Ontario.",
  "areaServed": [
    {"@type": "City", "name": "Greater Sudbury"},
    {"@type": "AdministrativeArea", "name": "French River, Ontario"},
    {"@type": "City", "name": "Lively"},
    {"@type": "City", "name": "Val Caron"},
    {"@type": "City", "name": "Hanmer"},
    {"@type": "City", "name": "Chelmsford"},
    {"@type": "City", "name": "Capreol"},
    {"@type": "City", "name": "Noëlville"},
    {"@type": "City", "name": "Alban"}
  ],
  "subOrganization": {
    "@type": "Church",
    "name": "Spoken Word Christian Fellowship",
    "areaServed": {"@type": "AdministrativeArea", "name": "French River, Ontario"}
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "general inquiry",
    "url": "https://www.endtimevangelism.org/contact",
    "availableLanguage": "English"
  }
}
```

10. Add a separate `FAQPage` schema block once the FAQ section exists (see item 14). Each Q/A as a `Question` / `acceptedAnswer` pair. Validate at `validator.schema.org` and Google's Rich Results Test before pushing.

11. Add `BreadcrumbList` schema if /sudbury sits under a /locations or similar parent — even if there's no visible breadcrumb, the markup helps.

### Internal linking

12. **From the homepage**: a single, prominent link in the body (not just the footer) — something like "Local to Greater Sudbury or French River? Start here." Footer link too.

13. **From every blog/sermon post**: a small "Local to Sudbury?" callout box at the bottom linking to /sudbury. Standardize this as a component so it appears everywhere automatically.

14. **From /sudbury outward**: link to your most evergreen, high-quality teaching pages — sermons, the "what we believe" page, top Bible studies. The /sudbury page should *receive* most of the link equity, but it should pass some out to your best content so locals discover it.

15. **Anchor text**: vary it. Don't use "click here." Use phrases like "our teaching on [topic]" or "Spoken Word Christian Fellowship in French River." Natural, descriptive anchors help both Google and AI retrieval.

### Content additions for local relevance

16. **A "Communities we serve" paragraph** that names each town in prose, not just a list. Example sentence to adapt: "Whether you're in downtown Sudbury, the Valley communities of Hanmer, Val Caron, and Chelmsford, the West End in Lively, or south toward Noëlville and Alban along the French River, we'd love to connect." This is mentioned-everywhere local relevance without keyword stuffing.

17. **An FAQ section** with these specific questions:
    - "Where is Spoken Word Christian Fellowship located?" (answer: French River area; meeting details available by contacting the ministry — this addresses the question without publishing an address)
    - "What does Endtime Evangelism teach?"
    - "Is this an evangelical church?"
    - "How is Spoken Word Christian Fellowship related to Endtime Evangelism?"
    - "How do I get in touch if I'm in Sudbury?"
    - "Do you have online sermons I can listen to?"
    - "What's the difference between Endtime Evangelism and other Christian ministries in Northern Ontario?"

18. **A short "About the area" paragraph** mentioning that Sudbury is the regional hub and French River township sits to the south — this gives the page geographic context that helps both human readers from outside the area and AI assistants understand the relationship between the two locations.

19. **A statement of beliefs summary** (3–5 sentences) on /sudbury itself, with a link to a full /beliefs page. AI assistants quote from pages that state things plainly.

---

## 2. Technical SEO

### URL, sitemap, robots

1. **URL**: `/sudbury` is good. Short, descriptive, matches search behavior. Don't change it.

2. **Sitemap**: ensure `/sudbury` is in `sitemap.xml` with `<priority>0.9</priority>` (homepage = 1.0, secondary pages = 0.5–0.7, this one is your most important after home). In Next.js, generate this with `next-sitemap` or the App Router's `sitemap.ts`. Set `<changefreq>monthly</changefreq>`.

3. **robots.txt**: confirm it's not blocking `/sudbury` or any of its subresources. Add `Sitemap: https://www.endtimevangelism.org/sitemap.xml` at the bottom.

4. **Canonical tag**: add `<link rel="canonical" href="https://www.endtimevangelism.org/sudbury">` to head off any duplicate-content issues from URL parameters.

### Mobile, speed, Core Web Vitals

5. **Mobile-first** is non-negotiable. Most local "near me" searches happen on phones. Test the page in Chrome DevTools mobile emulation and on a real phone.

6. **Largest Contentful Paint (LCP) target: <2.5s**. The main hero text should render fast. If you have a hero image, use `next/image` with `priority` set on the LCP element only. Don't lazy-load the hero.

7. **Cumulative Layout Shift (CLS) target: <0.1**. Reserve space for images and embedded content with explicit dimensions. Tailwind's `aspect-ratio` utilities help.

8. **Interaction to Next Paint (INP) target: <200ms**. Audit any client-side JS — for a content page like this, you probably don't need interactivity beyond the contact form. Keep JS minimal.

9. **Run Lighthouse** (Chrome DevTools → Lighthouse → Mobile → Performance + SEO + Accessibility). Aim for 90+ on each. Re-run after changes.

10. **PageSpeed Insights** (`pagespeed.web.dev`) gives field data from real Chrome users — check it monthly. Lab data from Lighthouse alone can mislead.

### Submit to search consoles

11. **Google Search Console**: add the property (use the domain-level property via DNS verification, not URL prefix — covers all subdomains and protocols). Submit `sitemap.xml`. Use URL Inspection on `/sudbury` and "Request Indexing." Check the Coverage report weekly for the first month.

12. **Bing Webmaster Tools**: add the site, import settings from Google Search Console (it has a one-click import). Bing's share is small but it powers DuckDuckGo, ChatGPT search, and some other AI retrieval — non-trivial for GEO.

13. **IndexNow** (Bing's protocol, also adopted by Yandex): if you want faster indexing of new content, look at the `next-indexnow` library or hit the IndexNow API on publish. Low-effort win.

---

## 3. Local SEO

### Google Business Profile

1. **Create the profile** at `business.google.com`. Category: choose "Religious organization" or "Christian church" — pick the more specific one that exists in the dropdown for your country.

2. **Address**: select **"I deliver goods and services to my customers"** during setup, then **hide your address** (the option appears as "Clear your address" or similar). This makes you a service-area business — your address won't show publicly, but Google still uses it for local ranking. You must give Google a real address to verify, but it stays private.

3. **Service areas**: list Greater Sudbury, French River, and the surrounding towns from the list. Maximum is usually 20 — use them.

4. **Business name**: `Endtime Evangelism` (don't keyword-stuff with city names — Google penalizes this).

5. **Phone number**: a number where someone actually answers or returns calls. If you don't have one, leave blank — wrong is worse than empty.

6. **Website**: link directly to `/sudbury`, not the homepage. This is a small but real ranking signal.

7. **Description** (750 chars): mention what you do, who you serve, and the affiliated church. Plain prose, no keyword stuffing.

8. **Hours**: "By appointment" if there are no public service times you want to publish. Or leave blank.

9. **Photos**: upload 5–10 — building exterior (if appropriate without revealing the address — interior shots, generic outdoor shots, logo, small group photos with permission). Update quarterly.

10. **Posts**: GBP has a "Posts" feature like a mini blog. Once a month is enough — share a sermon, a study series announcement, an Easter or Christmas message. Posts decay after 7 days but they signal activity.

11. **Verification**: Google may require postcard verification (slow), video verification (fast), or both. Be patient; the verification gate is genuinely the hardest part.

### Citation directories worth listing in

12. **Canadian general directories** (free):
    - Yellow Pages Canada (`yp.ca`)
    - Canada411
    - Yelp Canada
    - Apple Business Connect (for Apple Maps — increasingly important as Apple Maps grows)
    - Bing Places for Business

13. **Christian / ministry directories**:
    - ChurchFinder.com
    - FaithStreet
    - ChurchAngel.com
    - OurChurch.com
    - The Evangelical Fellowship of Canada members directory (only if you join — paid, but legitimacy boost)
    - Christian Connector
    - Hopecasting

14. **Sudbury / Northern Ontario directories**:
    - Greater Sudbury Chamber of Commerce (paid membership, but listing is a strong local signal)
    - Sudbury.com business directory (free listings)
    - Up Here Sudbury (events/community)
    - Northern Ontario Business directory

15. **Critical for citations**: NAP consistency. Whatever name, "address" (or service area), phone, and website you use, use them *identically* across every directory. Even minor inconsistencies (`St.` vs `Street`, `&` vs `and`) hurt local ranking. Pick one canonical version, document it in a doc, and copy-paste from there.

### Review strategy

16. **Don't ask for reviews directly** — for a church, that crosses into transactional territory and can feel off. Instead:
    - Once contact starts happening, mention casually that "if our content has been helpful, a Google review really helps others in the area find us."
    - Add a small "Was this helpful?" or "Connect with us" footer on sermon pages with a link to leave a review.
    - Never offer anything in exchange for reviews — Google penalizes this and it's spiritually questionable for a ministry.

17. **Respond to every review**, positive or negative, within a week. Tone: warm, not defensive. For negative reviews, acknowledge, don't argue.

### NAP consistency considerations

18. Since you're not publishing a street address: keep "service area: Greater Sudbury and French River, Ontario" as your standard "where" string everywhere. Never publish a partial address in one place and a city in another — pick the city/region-only format and stick to it.

19. Phone number: if you do publish one, use the same format everywhere (e.g., `(705) 555-1234` not mixing with `705.555.1234`).

---

## 4. GEO (Generative Engine Optimization)

### Why GEO is different

1. Classic SEO optimizes for *blue links*. GEO optimizes for *being quoted in an answer*. AI assistants (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) read web pages and synthesize answers. They prefer pages that:
   - Make plain, declarative statements ("Endtime Evangelism is a Christian ministry serving Greater Sudbury…")
   - Have clear authorship and identity
   - Are mentioned by other authoritative sources
   - Use FAQ and Q&A formats that map cleanly to user questions

2. The single biggest difference: **AI assistants reward third-party mentions much more heavily than classic Google does**. A paragraph about your ministry on a Sudbury news site or a Wikipedia-adjacent reference site is worth more for GEO than ten high-quality backlinks would be for SEO.

### How to structure the page for AI retrieval

3. **Lead with a one-sentence definition**: the very first paragraph of /sudbury should answer "What is Endtime Evangelism?" in a single sentence. AI assistants pull this kind of opening sentence as the canonical definition.

4. **Use the "X is Y" pattern explicitly**: sentences like "Endtime Evangelism is a Christian ministry based in Northern Ontario, Canada." "Spoken Word Christian Fellowship is a Christian church located in the French River area of Ontario." Plain, factual, easily extracted.

5. **Add a "Quick facts" or "At a glance" section** with bulleted key facts — name, location, focus, audience. AI tools love these.

6. **FAQ section is the highest-value GEO addition** (see item 17 above for the questions). Each answer should be 2–4 sentences, complete on its own. Don't write "see above" — write the full answer in each one.

7. **Include comparison/disambiguation language**: "Unlike broader denominations, our focus is…" or "While many Northern Ontario churches focus on X, we…". When users ask AI assistants to recommend a church *for them*, the assistant looks for these distinguishing phrases.

8. **Date your content**. AI assistants weight recent content. Add "Last updated: [date]" at the bottom of /sudbury and refresh it (with real changes) every quarter.

### What pages and FAQs to add

9. **Build a small "/about" page** with this exact content shape:
   - Who we are (ministry + church relationship)
   - Where we are (region only, not address)
   - What we believe (3–5 sentences plus link to fuller statement)
   - Who leads us (names, brief bios — AI loves identifiable humans)
   - How we got started (2–3 paragraph story — narrative is highly retrievable)

10. **Build a "/locations/sudbury" or keep /sudbury** as the canonical local page. Pick one URL pattern; don't have both.

11. **Build a "/beliefs" page** with a structured doctrinal statement. AI assistants asked "what does this church teach" will pull from here.

12. **Build a "/contact" page** that lists ways to reach you (form, email, phone if applicable) but doesn't require the user to fill out a form to see basic info.

### Where to get mentioned (AI training and retrieval pipelines)

13. **Wikipedia**: a Wikipedia article about Endtime Evangelism is unlikely to survive notability standards. Don't try. But — a mention in the Wikipedia article on French River, Ontario, in a "Religion" or "Community" section, *if you can substantiate it with a third-party reference*, is gold. Same for Greater Sudbury's article.

14. **Local news**: Sudbury.com, The Sudbury Star, CBC Sudbury, Northern Life. Even one short feature ("Local ministry launches new Bible study series") gets crawled by AI training pipelines and feeds into Perplexity-style retrieval. Pitch a story angle, not a press release. (See section 5 for more.)

15. **Reddit threads**: organic mentions in r/Sudbury, r/Ontario, r/Christianity, r/TrueChristian, etc. AI assistants quote Reddit heavily. Don't post promotionally — answer questions where your ministry is genuinely relevant. (See section 5.)

16. **Christian directories with editorial content**: ChurchFinder, FaithStreet, OurChurch — listings count, but ones where you can write a longer profile count more.

17. **Podcasts and interviews**: even a small Christian podcast in Ontario interviewing the pastor would generate a transcribable audio file plus show notes — both of which feed retrieval systems.

18. **Your own writing on third-party platforms**: Substack, Medium, or a guest post on a Christian blog. A piece by the pastor titled something like "Why we plant churches in small Northern Ontario communities" with a link back to /sudbury creates exactly the kind of identity-anchored content AI retrieval loves.

### Differences from classic SEO that matter

19. **Keyword density doesn't matter for GEO; clarity does.** Stop thinking about keywords; think about whether a 12-year-old could read your page and answer "what is this and who is it for?" in one sentence.

20. **Backlinks matter less; mentions matter more.** A blog that mentions "Endtime Evangelism" by name without linking still feeds AI retrieval. Track unlinked brand mentions, not just backlinks.

21. **Freshness matters more.** Classic SEO tolerates static pages. AI assistants weight recent dates heavily — partly to avoid outdated information, partly because they're trained to.

22. **Author identity matters more.** Classic SEO doesn't care who wrote the page (E-E-A-T trends are pushing this direction, but slowly). AI assistants explicitly look for author bios, named contributors, and identifiable institutions.

---

## 5. Off-Site Promotion

### Sudbury-area Facebook groups, subreddits, forums

1. **Reddit** (verify each is still active before posting):
   - `r/Sudbury` — active local community. Answer questions about life in Sudbury where Christian community is genuinely the topic. Don't drop links cold.
   - `r/Ontario` and `r/NorthernOntario` — broader, useful for "moved to Sudbury" / "looking for community" threads.
   - `r/Christianity` and `r/TrueChristian` — national/international, but threads about finding a church in specific Canadian regions come up.

2. **Facebook groups** (search Facebook directly to confirm — groups change names and turnover is high):
   - "Greater Sudbury News and Events"
   - "Sudbury Community" / "What's Happening in Sudbury"
   - "French River Community" or French River township groups
   - "Buy Nothing Sudbury" — surprisingly good for community visibility, and you can occasionally offer a free book or resource

3. **Local online forums**: Sudbury.com has a comments section that locals read. Engage there (under your real name) on stories about community, faith, or social issues — not promotionally.

4. **Posting rules of thumb for any of these**:
   - Spend 20–30 posts being genuinely helpful before ever mentioning your ministry
   - When you do mention it, do so when it's *the actual answer* to someone's question, not a self-insert
   - Use your real name and identify the ministry in your profile bio, not in every post
   - If a moderator asks you to stop, stop

### Outreach to local pastors and Christian organizations

5. **Make a list** of 15–25 churches and Christian organizations within 1 hour of Sudbury. Note: denominational alignment, size, and whether they have a public contact email.

6. **Reach out individually**, not as a mass mailing. A short email — "Hello Pastor [Name], I lead Endtime Evangelism, a small online ministry serving the Sudbury/French River area connected with Spoken Word Christian Fellowship. I noticed your church does X — wanted to introduce myself and ask about [specific thing]. No agenda beyond meeting other believers in the area."

7. **Don't ask for anything in the first email.** Build relationships before asking for backlinks, joint events, or referrals. The follow-up two months later is the one that matters.

8. **Show up in person** when possible — pastors' associations, prayer meetings, ecumenical events. Sudbury has a small Christian community; in-person matters more than digital here.

9. **Christian organizations specifically worth contacting**:
   - The Evangelical Fellowship of Canada (national, has Ontario regional contacts)
   - Northern Ontario Christian counselors / pastoral associations (search Google for current names)
   - Local seminary or Bible college alumni networks if any leadership has connections
   - Christian radio stations in the region (CJTK 95.5 FM in Sudbury exists — verify; they sometimes interview local ministry leaders)

### Content ideas that earn local backlinks naturally

10. **"A guide to Christian community in Greater Sudbury"** — a long, generous post that lists multiple churches in the area (yours and others), with brief honest descriptions. Other churches link to it because it links to them. This is the highest-leverage piece you can write.

11. **Sermon series tied to local context** — e.g., a Bible study on "faith in a resource town" that genuinely engages with Sudbury's mining history. Local interest = local shareability.

12. **Interview a local Christian** — a teacher, a nurse, a miner — about their faith. Real names, real stories. They share it; their network sees it.

13. **A response to local news** — when something significant happens in Sudbury (a tragedy, a community event, an anniversary), publish a thoughtful, faith-based response within 48 hours. This is how small ministries get cited in local news.

14. **A free downloadable resource** — a PDF Bible reading plan, or a printable Lent/Advent calendar — themed to your ministry. Other Christians link to it; libraries and church newsletters share it.

---

## 6. Measurement

### What to track

1. **In Google Search Console** (weekly for first 3 months, then monthly):
   - Impressions and clicks on /sudbury
   - Average position for target keywords (item 5 above)
   - Indexing status — confirm /sudbury stays indexed
   - Manual actions / security issues — should be zero

2. **In Google Analytics 4** (set up if not already):
   - Sessions to /sudbury, broken down by source (Organic Search, Direct, Referral, Social)
   - Geographic breakdown — are sessions coming from Sudbury/Ontario specifically?
   - Engagement time on /sudbury (target: 60+ seconds)
   - Conversion: "contact form started" and "contact form submitted" as separate events
   - Referrals from each directory you list in (note: many will pass `noreferrer` and be invisible — that's fine)

3. **In Google Business Profile** (monthly):
   - Discovery searches (people who didn't search your name)
   - Direct searches (people who did)
   - Profile views
   - Website clicks, calls, direction requests

4. **AI assistant visibility** (informal, monthly):
   - Ask ChatGPT, Claude, Perplexity, and Google AI Overviews questions like "Christian ministries serving Greater Sudbury" or "Bible-believing churches in French River Ontario." Note whether you're mentioned. Track in a simple spreadsheet — month over month, do you appear more?

### Realistic timelines

5. **Week 1–2**: GBP submitted, sitemap submitted to GSC and Bing, schema validated, basic citations started. **No ranking change yet — this is foundation.**

6. **Month 1–3**: GBP verified and starting to appear for branded searches. /sudbury indexed and ranking for branded terms (`Endtime Evangelism Sudbury`). Starting to rank in 50–100 position range for non-branded local terms.

7. **Month 3–6**: Local pack visibility for branded searches. Some long-tail informational keyword rankings emerging if you've added supporting content. Citations contributing to local ranking confidence.

8. **Month 6–12**: Top 10 (and ideally top 3) for branded terms; competitive rankings for `Christian ministry Sudbury` if competition is light (it likely is). AI assistants begin to mention you for very specific queries, especially if third-party mentions exist.

9. **Year 1+**: Compounding. Each new piece of content reinforces local relevance. Inbound contact through the form should be measurable monthly by month 9–12.

### Signals it's working vs. needs adjustment

10. **Working signals**:
    - Impressions on /sudbury growing month over month in GSC, even if clicks lag
    - Branded search volume increasing in GSC ("Endtime Evangelism" type queries)
    - GBP "discovery" searches > zero and growing
    - Inbound contact via the form referencing the website
    - AI assistants beginning to mention the ministry by name

11. **Adjustment signals**:
    - Page indexed but zero impressions after 3 months → page content is too thin or not matching any real query; rewrite with more substance and clearer local intent
    - High impressions, very low CTR → title and meta description aren't compelling; rewrite
    - Local rank stuck at 30+ for a target keyword after 6 months → competition is genuinely tougher than expected, or you have NAP inconsistencies — audit citations
    - GBP not appearing in local pack at all → likely a verification, category, or service-area issue; check GBP support docs
    - Contact form traffic but no submissions → form is broken, too long, or the page isn't pre-qualifying visitors well

---

## Honest Tradeoffs

1. **No public street address** costs you maybe 15–20% of local pack visibility. Service-area businesses can rank in local pack but compete on a slightly weaker signal. Middle path: list the *general meeting area* publicly ("we meet in the French River township") even if not a street address — Google's local algorithm reads region phrases.

2. **No in-person service times listed** means people who specifically search "church service Sunday morning Sudbury" will scroll past you. Middle path: an FAQ entry that says "We hold regular gatherings; please contact us for current times and location" — at least signals to Google that services exist.

3. **"Online only with contact-to-learn-more" model** is a real friction point. Most people won't fill a contact form to learn what time church is. Middle path: publish a low-commitment "intro" video or written welcome on /sudbury so visitors can get a sense of you before contacting.

4. **No paid ads** is fine; small ministries can absolutely grow organically. The honest tradeoff is timeline — what could be 3 months with paid is 12–18 months organically. Plan accordingly.

---

## What to do — by horizon

### This week (now mostly operational, since the code shipped)
1. **Submit GBP application** (item 1, section 3) — the biggest single lever, and the only thing on this list that is purely operational.
2. ~~Add ChurchOrganization schema to /sudbury~~ — **shipped** (Church + WebPage emitted by `LocalChurchJsonLd`).
3. **Submit sitemap to GSC and Bing Webmaster Tools** (items 11, 12 in section 2) — once the change is deployed, run URL Inspection on `/sudbury` in GSC and request indexing.
4. ~~Add the FAQ section~~ — **shipped** (six questions, see `FAQ` constant in `app/sudbury/page.tsx`; revise wording in place rather than rebuilding).
5. ~~Add the FAQPage schema~~ — **shipped** (rendered from the same `FAQ` array as the visible list).
6. **Validate the schemas** at Google's Rich Results Test (`search.google.com/test/rich-results`) once deployed. Paste the live URL; expect three valid blocks (Church, WebPage, FAQPage) plus the layout-level Organization and WebSite. The Breadcrumb is a fourth block but most validators treat it as informational.

### This month (10–20 hours, spread out)
1. Complete 10 priority citation listings: yp.ca, Canada411, Yelp Canada, Bing Places, Apple Business Connect, ChurchFinder, FaithStreet, ChurchAngel, OurChurch, Sudbury.com directory
2. Build the /about and /beliefs pages
3. Write the "Guide to Christian community in Greater Sudbury" post (item 10, section 5)
4. Audit Lighthouse scores and fix any below 90
5. Set up GA4 properly with the conversion events (item 2, section 6)
6. Start Reddit and Facebook group participation — purely helpful, no promotion

### This quarter (ongoing, ~5 hours/week)
1. One blog/sermon post per week, each with the "Local to Sudbury?" callout (item 13, section 1)
2. Reach out to 15–25 area pastors individually (items 5–8, section 5)
3. Pitch one local news story to Sudbury.com or CBC Sudbury (item 14, section 4)
4. Monthly GBP post (item 10, section 3)
5. Monthly check on AI assistant mentions (item 4, section 6) — track in a spreadsheet
6. Quarterly content refresh: update the "Last updated" date on /sudbury with real changes

---

## If You Only Do Five Things, Do These

1. **Get Google Business Profile verified and configured as a service-area business** (no public address, but full local visibility). This single step unlocks Google Maps presence and local pack ranking.

2. **Add the FAQ section to /sudbury with the seven specific questions listed in section 1, item 17, and add FAQPage schema.** This is the highest-leverage on-page change for both SEO and GEO.

3. **List in the top 10 citation directories with perfectly consistent NAP** (yp.ca, Canada411, Yelp Canada, Bing Places, Apple Business Connect, ChurchFinder, FaithStreet, ChurchAngel, OurChurch, Sudbury.com). Citation count and consistency is the foundation of local ranking.

4. **Write one long, generous "Guide to Christian community in Greater Sudbury" post that links to other local churches.** It will earn organic backlinks from those churches and become the page that AI assistants quote when asked about Sudbury Christian community.

5. **Set up Google Search Console + GA4, and check both monthly.** You can't improve what you don't measure, and the first three months of data will tell you whether the rest of the plan is working or needs adjustment.
