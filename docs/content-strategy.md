# Ranking Atlas Content Strategy

Complementary to `positioning-core.md` (category, language) and `writing-style.md` (voice, rhythm, structure). This document owns content architecture, linking rules, and the pillar policy.

## Content types

**Pillar.** The canonical definitional or strategic answer for a major entity in the citation equity category. Pillars ship with a 100-150 word extractable Definition block (see below) and follow the Article Header Pattern from design-system.md. Ranking Atlas targets 3–6 pillars over its lifetime.

**Essay.** Point-of-view argument or framework explanation. Shorter than a pillar, sharper thesis, fewer evidence sections. Example: Why Earned Links Beat Paid Links.

**Data Report / Original Data.** Primary-source research based on proprietary or independently-collected data. Lives under `/resources/` with the Data Report eyebrow. Examples: The Cost of Authority, SaaS Price Comparison 2020–2026, Who AI Names When You Ask for ICT Experts.

**Guide.** Process-oriented teaching piece. Uses numbered strategy blocks per writing-style.md.

**Spoke (future).** 1,200–2,000 word deep dive on a specific question inside a pillar's topic. Spokes nest under the pillar's URL path, e.g. `/resources/citation-equity/chatgpt-citations/`. Each spoke links up to its pillar in the first 200 words.

**Tool (future).** Interactive asset, calculator, or data explorer. Lives at `/resources/tools/<slug>/`.

**Post (future).** Tactical commentary, campaign teardown, or industry analysis. 500–1,500 words. Lives at `/blog/<slug>/`.

## URL policy

All long-form content lives under `/resources/`. This is Ranking Atlas's established convention and the Netlify redirect layer is built around it. Do not move content to root-level URLs.

- Pillars: `/resources/<pillar-slug>/`
- Spokes: `/resources/<pillar-slug>/<spoke-slug>/`
- Tools: `/resources/tools/<tool-slug>/`
- Posts (future): `/blog/<post-slug>/`

## Strict pillar policy

A pillar is the canonical definitional or strategic answer for a major entity in the citation equity category. Promotion of a piece to pillar status requires:

1. Explicit definitional or strategic role in the category
2. A 100-150 word extractable Definition block via `<Definition>` component
3. `DefinedTerm` JSON-LD schema emitted on the page
4. Linked from the Resources index with a "Foundational" treatment (if definitional) or standard pillar card
5. Other pillars link back to it with varied anchor text

Everything else is an Essay, Data Report, Guide, spoke, tool, or post. Ranking Atlas targets 3–6 pillars lifetime.

## Linking rules

- Every spoke links up to its pillar in the first 200 words with a branded anchor
- Every pillar links laterally to 1–2 other pillars where topically relevant
- Every pillar except Citation Equity links to `/resources/citation-equity/` once
- Homepage links to `/resources/citation-equity/` as the primary pillar plus 1–2 secondaries where it fits the copy
- Resources index lists all pillars, essays, reports, tools, and posts
- No more than 60% of inbound anchors to a single URL should use the same exact string (vary anchor text; the linter warns when a single file uses the same anchor 3+ times for the same URL)

## The Definition block rule

Every pillar ships with a 100-150 word extractable definition block via the `<Definition>` component. The block must be self-contained, declarative, and copy-paste-able without surrounding context.

This is the primary surface LLMs lift when answering "what is X" queries. It is the single most important piece of copy on a pillar page. Treat it like the money sentence from positioning-core.md: written with intention, revised until dense.

The first sentence must be the short-form definition that works as a standalone quote.

Exception: data reports do not need a Definition block because they do not introduce a new term.

## Voice rules

Per CLAUDE.md, positioning-core.md, and writing-style.md:

- No em dashes in prose (enforced by scripts/lint-content.mjs)
- No "not X, but Y" sentence-initial constructions (enforced)
- No hedging verbs ("might help", "could potentially", "may help") (enforced)
- Start-case capitalisation on all headings
- Byline: Daniel Grainger on every piece

## Deprecated

`docs/DNA.md` is deprecated. It reflects the pre-repositioning "Digital PR Without The Retainer" frame and contains instructions that directly contradict the current canon (sentence case headings, em dashes as standard, "backlinks" as primary term). Retained for historical reference only. Do not use as a style or positioning source.
