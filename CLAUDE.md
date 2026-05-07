# Ranking Atlas - Site Rules

## Author
The author of every resource page is Daniel Grainger, founder of Ranking Atlas. No other author appears on the site.

## URLs
- Trailing slash policy: never. Set in astro.config.mjs as trailingSlash: "never". Enforced at the edge in netlify.toml.
- Slugs: lowercase, hyphenated, descriptive. No dates, no IDs.
- Do not change a published slug. If a page needs a new slug, add a 301 redirect from the old slug.

## Canonicals
- The root layout emits a single canonical tag pointing to the absolute production URL with no trailing slash and no query string.
- Page-level canonical overrides are reserved for syndication cases. Default to the layout-level canonical.

## Every new resource page must include
- A canonical tag (handled by the layout)
- The author byline (Daniel Grainger)
- Three contextual internal links inside the body: one to the homepage, one to /resources/citation-equity, one to a topically related resource page. Distribute across intro, middle, and conclusion. Use anchor text from the positioning-core "use" list.
- The RelatedResearch component at the bottom of the body, with three topically relevant sibling resources passed as props.
- Article schema with author "Daniel Grainger" and dateModified reflecting the most recent edit.

## Article header pattern

Every resource page header must include, in order:
1. Eyebrow label (e.g. "Guide", "Data report", "Essay") in Title Case
2. H1 in start case
3. Subhead one sentence long, no em dashes
4. Author byline: "By Daniel Grainger" with avatar
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
