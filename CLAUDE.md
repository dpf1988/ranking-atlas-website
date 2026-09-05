# Ranking Atlas - Site Rules

## Authorship

All site content, including Featured Research, is authored personally by Daniel Grainger, founder of Ranking Atlas. There is no institutional authorship mode. (Rule changed 2026-07: research pages moved from Organization to Person authorship to build a single consistent author entity across blog and research.)

- Byline: "By Daniel Grainger, founder of Ranking Atlas" with avatar `/assets/images/author/daniel-headshot.jpg` where the layout carries an avatar; research hero metas may use the short form "By Daniel Grainger"
- JSON-LD `author`: Person { "name": "Daniel Grainger", "url": "https://ranking-atlas.com/about" } with `sameAs` LinkedIn; `publisher`: Organization Ranking Atlas
- Closing bio: `<AuthorBio />`
- Index cards: show "Daniel Grainger"
- `<InstitutionalBio />` is retired. Do not use it on new pages.

The author URL is /about. That page must remain indexable once launched; every article schema points at it.

## Site structure

Three content sections:

- `/resources/` - Featured Research only: original data studies, indexes, methodology-driven reports.
- `/blog/` - Essays, guides, comparisons, and analysis. Essays & Guides moved here from /resources/ on 2026-07-19; 301s live in netlify.toml.
- `/data/` - Data Library: reusable datasets with interactive pages.
- `/case-studies/` - scaffolded, noindexed, not publicly launched.

`/library/` no longer exists. Do not reintroduce it. Do not reintroduce essay slugs under /resources/ (citation-equity, chatgpt-search-visibility, press-release-ai-citation-2026, earned-links-vs-paid-links all 301 to /blog/).

New data studies go in /resources/ and onto `/src/pages/resources/index.astro`. New essays/guides go in /blog/ and onto `/src/pages/blog/index.astro`.

## URLs
- Trailing slash policy: never. Set in astro.config.mjs as trailingSlash: "never". Enforced at the edge in netlify.toml.
- Slugs: lowercase, hyphenated, descriptive. No dates, no IDs.
- Do not change a published slug. If a page needs a new slug, add a 301 redirect from the old slug.

## Canonicals
- The root layout emits a single canonical tag pointing to the absolute production URL with no trailing slash and no query string.
- Page-level canonical overrides are reserved for syndication cases. Default to the layout-level canonical.

## Every new resource page must include
- A canonical tag (handled by the layout)
- The correct author byline per the Authorship rules (institutional "Ranking Atlas" for Featured Research, personal "Daniel Grainger" for Essays & Guides)
- Three contextual internal links inside the body: one to the homepage, one to /blog/citation-equity, one to a topically related resource page. Distribute across intro, middle, and conclusion. Use anchor text from the positioning-core "use" list.
- The RelatedResearch component at the bottom of the body, with three topically relevant sibling resources passed as props.
- Article schema with the author matching the Authorship rules and dateModified reflecting the most recent edit.

## Article header pattern

Every resource page header must include, in order:
1. Eyebrow label (e.g. "Guide", "Data report", "Essay") in Title Case
2. H1 in start case
3. Subhead one sentence long, no em dashes
4. Author byline: "By Ranking Atlas" for Featured Research (no avatar) or "By Daniel Grainger, founder of Ranking Atlas" with avatar for Essays & Guides
5. Published date, ISO format in source, formatted human-readable in render
6. Last updated date, only when it differs from published date
7. Estimated reading time
8. Table of contents anchor links for any page over 1000 words

Reference implementation: src/pages/resources/earned-links-vs-paid-links.astro

## Positioning

Ranking Atlas is a digital PR agency built for the AI search era. The homepage is the canonical source of truth for positioning language.

- **Category:** "Digital PR" (primary — the term buyers actually search for). This is the eyebrow on the homepage hero and the top-of-funnel label across the site. Always paired with the measurement and AI visibility layer in body prose, which is what separates Ranking Atlas from commodity digital PR firms. Never stated alone as an identity claim (e.g. "we are a digital PR agency, full stop") without that pairing appearing in the same block.
- **Core promise:** earn citations in publications Google ranks and AI engines cite, then track the movement across both
- **Three pillars:** Original Research / Editorial Production / Visibility Measurement
- **Engagement model:** "Baseline. Build. Measure." Documented baseline, research-led campaign, ongoing prompt-level measurement
- **Measurement language:** prompt-level tracking, competitor benchmarking, documented baseline, branded vs non-branded visibility
- **CTA label:** Default primary CTA: "See Your AI Visibility" → /breakdown. Default secondary CTA: "Get in touch" → /contact. No calendar booking on the site. Contextual overrides only when explicitly instructed. Previous label "Book a Call" retired 2026-09.

**Deprecated positioning (do not reintroduce):**
- "Guaranteed minimum placements" or any contractual placement floor language
- "Fixed-price per campaign" or "per-campaign model" as identity claims
- "No retainer" / "no retainers" as a headline differentiator
- Specific guaranteed link/placement numbers (e.g. "8 links")
- "Search & AI Visibility" as the primary category label (retired 2026-07; still used inside body prose to describe the outcome, but no longer the eyebrow or headline framing)
- "Digital PR" stated as identity without the measurement / AI visibility pairing in the same block

The engagement model is deliberately not stated on the site. "Campaign" refers to the deliverable. "Engagement"/"programme" refers to the relationship. Both terms are used; they are not interchangeable.

**Price anchoring (contact page only):** A single italic line under the contact-page intro paragraph carries a per-campaign floor. Current canonical anchor, lifted from the deprecated no-pricing rule on 2026-07-20: "A single campaign starts at £4.5k. Programmes run in successive campaigns over months." Do not add pricing figures to the homepage, resources, case studies, or blog. Do not restate the figure inline in body prose. If the floor changes, update `src/pages/contact.astro` and reflect the new number here.

## Duration and compounding (canonical language)

Two claims that must never be merged:

- **Campaign duration:** "A single campaign runs four to six weeks from kickoff" (study design, data production, landing page, journalist outreach; placements land during and shortly after the outreach window). A campaign may carry this duration claim.
- **Compounding:** "Visibility in search and AI answers compounds across successive campaigns over months, as each round of coverage adds to the citation base the engines retrieve from." Only the programme/engagement carries outcome and compounding claims. Compounding is NEVER phrased as the automatic tail of a single campaign (e.g. "compounds over months as coverage is indexed" with no multi-campaign framing is wrong).

Compounding language inside /resources/ study arguments (e.g. the earned-vs-paid-links essay arguing that earned media compounds as a market thesis) is study content, not a service claim. Leave it untouched.

## Vocabulary
Use:
- Citation equity, editorial citations, editorial coverage
- Authoritative publishers, authority publishers
- AI search era, AI Overviews, ChatGPT, Perplexity, Gemini, Claude, Google
- Omnipresence, pattern, cited, surfaced, verified
- Campaign, placement, pickup
- Baseline, measurement, visibility, prompt-level tracking
- Engagement (for the relationship/scope, not the deliverable)

Avoid:
- Backlinks, link building, DR, domain rating, DA
- SEO as a primary value proposition
- Future-proof
- Rankings as a primary outcome
- Guaranteed minimum, guaranteed placements, fixed-price (as identity claims)
- Retainer, monthly (as differentiators or headline claims)
- Hedging verbs: might, could, supports
- Click here, read more, learn more, this, here as anchor text
- B2B SaaS, fintech, marketing teams on Featured Research pages (see Audience rules)

## Voice
- No em dashes anywhere
- No filler: genuinely, honestly, straightforward
- Active voice
- Short sentences mixed with longer
- British English
- Do not announce the link. Write the sentence with the linked phrase inline.
- Do not invent statistics, claims, or quotes.

## Audience and ICP language

Featured Research pages do not name a target audience or ICP (no "B2B SaaS", "fintech", "marketing teams", etc.) on the page itself. The studies stand as primary-source research and should read as such to any reader, including journalists. Audience and ICP framing belongs on case studies and contact surfaces, not inside research pieces.

The homepage describes the service without naming a vertical. It speaks to any brand that wants search and AI visibility. Do not add vertical-specific language to the homepage.

Essays & Guides may speak to a defined reader where the topic requires it, but still avoid narrow vertical labels in body prose unless the data is specific to that vertical.

## CTAs on research pages

Featured Research pages (data reports under /resources/) do not carry hard sales CTAs. They end with a single soft sign-off line: "For a different cut of this data, additional regional or demographic breakouts, or methodology questions, contact contact@ranking-atlas.com."

Essays & Guides pages may carry the standard "Book a Call" CTA where appropriate to the topic. The distinction is editorial: research pages signal capability through restraint, guides signal capability through framing and direct invitation.

## Design
- All new components conform to design-system.md
- Use existing tokens for colour, typography, spacing, padding
- No new colours, fonts, or spacing values without a design decision logged
- Do not invent UI elements. If the spec does not include an icon, badge, button, or animation, do not add one.

## Design tokens

Defined in tailwind.config.js. Always use token names, not raw hex:
- text-brand / text-brand-dark, not text-[#1E3A8A]
- text-accent / text-accent-bright for the editorial amber, not text-[#C08A1F]. Working amber (accent) on light backgrounds; display amber (accent-bright) on the logo mark and dark surfaces only. The amber appears only on data highlights, brush marks, callouts, and the logo. It is never a CTA colour.
- text-ink, not text-[#0A0F1E]
- text-body, not text-[#475569]
- text-muted, not text-[#64748B]
- shadow-card, not inline shadow values

Full reference: docs/design-system.md

## Headings

- Body headings (H1, H2, H3 in page bodies): start case
- Eyebrow labels above hero headings: Title Case
- Section headings inside content: start case

Full reference: docs/writing-style.md

## Build and deploy
- Build locally with npm run build before any commit
- Batch changes into single Netlify deploys to conserve build credits
- Do not push incremental commits
- Do not include "Co-Authored-By: Claude" in commit messages
- PowerShell command chaining: ; not &&

## Updating canonical references
If positioning-core.md, design-system.md, or writing-style.md is updated in the project knowledge base, treat that update as authoritative and bring this CLAUDE.md into alignment.
