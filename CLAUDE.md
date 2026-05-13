# Ranking Atlas - Site Rules

## Authorship

Two authorship modes, applied by content type. No other author appears on the site.

**Featured Research (data reports under /resources/)** are authored institutionally as "Ranking Atlas".
- Byline: "By Ranking Atlas" (no avatar, no personal link)
- JSON-LD `author`: `{ "@type": "Organization", "name": "Ranking Atlas", "url": "https://ranking-atlas.com" }`
- Closing bio: `<InstitutionalBio />`, not `<AuthorBio />`
- Resources index card: institutional label "Ranking Atlas", no headshot

**Essays & Guides (analysis, frameworks, explanatory pieces under /resources/)** are authored personally by Daniel Grainger, founder of Ranking Atlas.
- Byline: "By Daniel Grainger, founder of Ranking Atlas" with avatar `/assets/images/author/daniel-headshot.jpg`
- JSON-LD `author`: Person with `sameAs` LinkedIn
- Closing bio: `<AuthorBio />`
- Resources index card: shows headshot and "Daniel Grainger"

When in doubt about which mode applies: primary-source data, indexes, or methodology-driven studies are institutional. Argument pieces, frameworks, and explanatory guides are personal.

## Site structure

Two content sections:

- `/resources/` — Featured Research and Essays & Guides. Original data studies, strategic analysis, editorial thinking on citation equity and the AI search era.
- `/case-studies/` — Proof of execution. Currently scaffolded but not publicly launched. Will house client campaign breakdowns when populated.

`/library/` no longer exists. Do not reintroduce it.

When adding a new piece to `/resources/`, decide whether it belongs in Featured Research (primary-source data, original studies, methodology-driven) or Essays & Guides (analysis, frameworks, explanatory content). Add to the appropriate section of `/src/pages/resources/index.astro`.

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
- Three contextual internal links inside the body: one to the homepage, one to /resources/citation-equity, one to a topically related resource page. Distribute across intro, middle, and conclusion. Use anchor text from the positioning-core "use" list.
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

## Vocabulary
Use:
- Citation equity, editorial citations, editorial coverage
- Authoritative publishers, authority publishers
- AI search era, AI Overviews, ChatGPT, Perplexity, Gemini
- Omnipresence, pattern, cited, surfaced, verified
- Campaign, placement, pickup, guaranteed minimum

Avoid:
- Backlinks, link building, DR, domain rating, DA
- SEO as a primary value proposition
- Future-proof
- Rankings as a primary outcome
- Retainer, monthly, ongoing
- Hedging verbs: might, could, supports
- Click here, read more, learn more, this, here as anchor text

## Voice
- No em dashes anywhere
- No filler: genuinely, honestly, straightforward
- Active voice
- Short sentences mixed with longer
- British English
- Do not announce the link. Write the sentence with the linked phrase inline.
- Do not invent statistics, claims, or quotes.

## Audience and ICP language

Featured Research pages do not name a target audience or ICP (no "B2B SaaS", "fintech", "marketing teams", etc.) on the page itself. The studies stand as primary-source research and should read as such to any reader, including journalists. Audience and ICP framing belongs on the homepage, case studies, and contact surfaces, not inside research pieces.

Essays & Guides may speak to a defined reader where the topic requires it, but still avoid narrow vertical labels in body prose unless the data is specific to that vertical.

## CTAs on research pages

Featured Research pages (data reports under /resources/) do not carry hard sales CTAs. They end with a single soft sign-off line: "For a different cut of this data, additional regional or demographic breakouts, or methodology questions, contact contact@ranking-atlas.com."

Essays & Guides pages may carry the standard "Start a Campaign" CTA where appropriate to the topic. The distinction is editorial: research pages signal capability through restraint, guides signal capability through framing and direct invitation.

## Design
- All new components conform to design-system.md
- Use existing tokens for colour, typography, spacing, padding
- No new colours, fonts, or spacing values without a design decision logged
- Do not invent UI elements. If the spec does not include an icon, badge, button, or animation, do not add one.

## Design tokens

Defined in tailwind.config.js. Always use token names, not raw hex:
- text-brand / text-brand-dark, not text-[#5D4FE0]
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
