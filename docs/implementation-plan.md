# Ranking Atlas: Citation Equity Pillar Publication Plan (Revised)

This plan supersedes the earlier implementation plan. It is rewritten to fit the actual state of the ranking-atlas-website repo as it exists today.

**Goal of this refactor is narrower than before:** publish the Citation Equity pillar at `/resources/citation-equity/`, make small scoped additions to the codebase (Definition component, linter, content-strategy doc), update the resources index to mark the pillar as foundational, and add supporting schema. Nothing else changes.

**What this plan does NOT do:**
- Move content to root-level URLs (`/citation-equity/`)
- Introduce Astro content collections, MDX, or Zod
- Replace the existing Article Header Pattern
- Create new layouts
- Touch the navbar, footer, or homepage commercial structure

**Stack state (confirmed from uploaded files):**
- Astro 4.16.18, no MDX, no integrations configured
- Tailwind v3.4.17 with brand tokens (`text-brand`, `text-ink`, `text-body`, `shadow-card`, etc.)
- Resources live as individual `.astro` files under `src/pages/resources/`
- Mandatory Article Header Pattern documented in `CLAUDE.md` and `docs/design-system.md`
- Reference implementation: `src/pages/resources/earned-links-vs-paid-links.astro`
- Components already built: `Layout`, `Navbar`, `Footer`, `AuthorBio`, `PrimaryCTA`, `SecondaryCTA`, `Eyebrow`, `FAQ`, `Contact`, `PullQuote`
- Existing netlify.toml redirects point inbound traffic to `/resources/` (current convention)
- Four resources already live:
  - `/resources/ai-names-ict-experts/` (Original Data)
  - `/resources/saas-pricing-inflation` (Original Data)
  - `/resources/the-cost-of-authority` (Data Report)
  - `/resources/earned-links-vs-paid-links` (Essay)

**Style and voice rules in effect (from CLAUDE.md, docs/writing-style.md, docs/positioning-core.md, docs/design-system.md):**
- Mandatory Article Header Pattern on every resource page
- Start-case capitalisation on all headings (every word capitalised)
- Flat eyebrow = content type only (never a subtitle)
- Left-aligned article headers, never centred
- Hero image slot always present, with onerror fallback
- No em dashes in prose
- No hedging verbs ("might," "could potentially," "may help")
- 1–2 sentence paragraphs, bucket-brigade pivots, single-sentence isolated lines
- Byline: Daniel Grainger on every piece
- Closing formula: decisive H2 → core principle restated → 2–4 linked next steps → final CTA band

**Known stale doc:** `docs/DNA.md` contains the old "Digital PR Without The Retainer" positioning, says "Sentence case headings", says "em dashes (—) not hyphens for parenthetical clauses". Every one of these conflicts with CLAUDE.md and the canonical docs. Flagged for deprecation in Part 1.5.

---

## Part 0: Prerequisites

### 0.1 Create working branch

```bash
git checkout main
git pull
git checkout -b feature/citation-equity-pillar
```

### 0.2 Confirm build works clean on main before changes

```bash
npm run build
```

If this fails, stop and fix the build before proceeding. Everything in this plan assumes a clean baseline.

---

## Part 1: Scoped additions

All additions go in alongside what exists. Nothing replaces, nothing restructures. Each file is additive.

### 1.1 Add pre-commit linter

Create `scripts/lint-content.mjs`:

```javascript
#!/usr/bin/env node
// Content linter for Ranking Atlas
// Enforces voice rules from docs/writing-style.md and docs/positioning-core.md
// Scope: src/pages/resources/*.astro, body content only (ignores frontmatter fences)

import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";

let changed;
try {
  changed = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf8" })
    .split("\n")
    .filter(f => f.startsWith("src/pages/resources/") && /\.astro$/.test(f) && existsSync(f));
} catch {
  process.exit(0);
}

let failed = false;
const warnings = [];

function stripFrontmatter(content) {
  // Astro frontmatter is between --- fences at the top of the file
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
}

function stripJsonLdBlocks(content) {
  // Ignore content inside <script type="application/ld+json"> blocks (JSON may contain em dashes in titles)
  return content.replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g, "");
}

for (const file of changed) {
  const raw = readFileSync(file, "utf8");
  const body = stripJsonLdBlocks(stripFrontmatter(raw));

  if (body.includes("—")) {
    console.error(`✗ ${file}: em dash detected in body`);
    failed = true;
  }

  const notXbutY = /(^|\n)\s*(It's |This is |It was |That's )?[Nn]ot [^,\n]{1,80}, but /;
  if (notXbutY.test(body)) {
    console.error(`✗ ${file}: "not X, but Y" construction detected`);
    failed = true;
  }

  const hedging = /\b(might help|could potentially|may help|perhaps)\b/;
  if (hedging.test(body)) {
    console.error(`✗ ${file}: hedging verb detected (see writing-style.md)`);
    failed = true;
  }

  // Warn on repeated anchor text to same URL within a file (anchor variation rule)
  const linkMap = new Map();
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = linkRegex.exec(body)) !== null) {
    const [, anchor, url] = m;
    if (url.startsWith("http") && !url.includes("ranking-atlas.com")) continue;
    const key = `${url}|||${anchor.toLowerCase()}`;
    linkMap.set(key, (linkMap.get(key) || 0) + 1);
  }
  for (const [key, count] of linkMap) {
    if (count > 2) {
      const [url, anchor] = key.split("|||");
      warnings.push(`⚠ ${file}: anchor "${anchor}" used ${count}× for ${url} (vary anchor text per content-strategy.md)`);
    }
  }
}

if (warnings.length) {
  console.warn("\nWarnings (not blocking):");
  warnings.forEach(w => console.warn(w));
}

if (failed) {
  console.error("\nCommit blocked. Fix the issues above and try again.");
  process.exit(1);
}
```

Make executable and wire to git hooks:

```bash
chmod +x scripts/lint-content.mjs
```

Create `.git/hooks/pre-commit`:

```bash
#!/bin/sh
node scripts/lint-content.mjs || exit 1
```

```bash
chmod +x .git/hooks/pre-commit
```

**Important:** `.git/hooks/` is not versioned. If Ranking Atlas goes multi-machine or multi-contributor, migrate to Husky. Solo on one machine for now, git-native hooks are fine.

**Note on the placeholder hero text.** The template string "Drop hero.jpg into /public/assets/images/..." in the Article Header Pattern is a deliberate dev-time fallback inside a `hidden` div triggered by `onerror`. It does not ship to real users. The linter ignores it.

### 1.2 Add Definition component

Create `src/components/Definition.astro`:

```astro
---
/*
  Extractable definition block. Use at the top of "What Is [Concept]?" H2 sections
  on pillar pages. Self-contained, declarative, copy-paste-able by LLMs.

  Usage:
    import Definition from '../../components/Definition.astro';
    <Definition term="Citation Equity">
      <Fragment slot="default">
        [100-150 words of clean definition prose. First sentence is the short-form definition.]
      </Fragment>
    </Definition>
*/
interface Props {
  term: string;
}
const { term } = Astro.props;
---
<aside
  class="bg-[#F8F7FA] border-l-4 border-brand rounded-r-xl p-6 md:p-8 my-8 max-w-3xl"
  aria-label={`Definition of ${term}`}
  data-definition-block={term}
>
  <div class="text-sm uppercase tracking-wider text-brand font-medium mb-3">
    {term} <span class="text-muted normal-case tracking-normal">(n.)</span>
  </div>
  <div class="text-body text-lg leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0">
    <slot />
  </div>
</aside>
```

Design rationale:
- Uses existing brand tokens (`bg-[#F8F7FA]`, `border-brand`, `text-brand`, `text-body`, `text-muted`)
- Left border + rounded right corners matches design-system callout aesthetic without introducing a new pattern
- `data-definition-block` attribute lets the JSON-LD generator find the term programmatically
- Accessible: `<aside>` with `aria-label`
- Visually distinct from running prose but stays tonally consistent

### 1.3 Add DefinedTerm schema helper

Create `src/lib/schema.ts` (first file in this directory; creates the directory):

```typescript
// JSON-LD helpers for structured data emission on pillar pages
// Organization + Person schema already emitted sitewide in Layout.astro

export function articleSchema(args: {
  title: string;
  description: string;
  url: string;
  datePublished: string;  // ISO date
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: args.url,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: {
      "@type": "Person",
      name: "Daniel Grainger",
      url: "https://ranking-atlas.com/about",
      jobTitle: "Founder",
      worksFor: {
        "@type": "Organization",
        name: "Ranking Atlas",
        url: "https://ranking-atlas.com",
      },
      sameAs: [
        "https://www.linkedin.com/in/daniel-grainger/",
        "https://ranking-atlas.com/about",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Ranking Atlas",
      url: "https://ranking-atlas.com",
    },
    image: args.image ? `https://ranking-atlas.com${args.image}` : undefined,
  };
}

export function definedTermSchema(args: {
  term: string;
  definition: string;  // 100-150 word extractable paragraph
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: args.term,
    description: args.definition,
    url: args.url,
    inDefinedTermSet: "https://ranking-atlas.com/resources/citation-equity/",
  };
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

These are opt-in helpers. Existing resource pages emit their JSON-LD inline (see `earned-links-vs-paid-links.astro`). The helpers are available for the new pillar and any future pages that want to use them.

### 1.4 Add content-strategy.md

Create `docs/content-strategy.md`:

```markdown
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
```

### 1.5 Deprecate DNA.md

Rename `docs/DNA.md` to `docs/DNA.deprecated.md` and add a banner at the top:

```markdown
# [DEPRECATED] Ranking Atlas — Brand DNA

> **This document is deprecated and retained for historical reference only.**
>
> It reflects the pre-2026 "Digital PR Without The Retainer" positioning. Every substantive rule in this document has been superseded by one or more of:
>
> - `positioning-core.md` (category frame, vocabulary, voice rules)
> - `writing-style.md` (voice, rhythm, structure)
> - `design-system.md` (headings, typography, start-case capitalisation)
> - `CLAUDE.md` (mandatory patterns and enforced rules)
>
> Conflicts to note if anyone references this file:
> - Says "Sentence case headings" → current standard is start-case (every word capitalised)
> - Says "Em dashes (—) not hyphens for parenthetical clauses" → current standard is no em dashes in prose
> - Uses "backlinks" and "digital PR" as primary vocabulary → current primary term is citation equity
>
> Do not treat this document as a style or positioning source.

---

[Original content preserved below]

[... rest of DNA.md unchanged ...]
```

```bash
git mv docs/DNA.md docs/DNA.deprecated.md
# Then edit to add the banner
```

### 1.6 Commit Part 1

```bash
git add scripts/lint-content.mjs src/components/Definition.astro src/lib/schema.ts docs/content-strategy.md docs/DNA.deprecated.md
git rm docs/DNA.md  # git mv above handles this automatically
git commit -m "foundation: linter, Definition component, schema helpers, content strategy doc, deprecate DNA"
```

Site behaves identically to before Part 1 at this point. Only scaffolding has been added.

---

## Part 2: Publish the Citation Equity pillar

### 2.1 Create the pillar page

Create `src/pages/resources/citation-equity.astro`.

**Structure the file in this exact order** (match the reference implementation at `earned-links-vs-paid-links.astro`):

```astro
---
import Layout from '../../layouts/Layout.astro';
import PrimaryCTA from '../../components/PrimaryCTA.astro';
import AuthorBio from '../../components/AuthorBio.astro';
import Definition from '../../components/Definition.astro';
import { articleSchema, definedTermSchema, breadcrumbSchema } from '../../lib/schema';

const url = "https://ranking-atlas.com/resources/citation-equity/";
const pubDate = "2026-04-21";

const article = articleSchema({
  title: "How Brands Get Cited By AI: The 2026 Guide To Citation Equity",
  description: "The definitional framework for citation equity. How ChatGPT, Perplexity, Gemini, and Google AI Overviews choose which brands to cite, and what builds the pattern that puts you in the answer.",
  url,
  datePublished: pubDate,
  image: "/assets/images/resources/citation-equity/hero.jpg",
});

// DEFINITION: 100-150 words. This is the most important paragraph on the page.
// First sentence must work as a standalone short-form definition.
const definitionProse = `Citation equity is the accumulated pattern of a brand's name appearing across authority publishers that AI systems treat as trusted sources. It works on the same underlying principle as PageRank (trust flows through a network of references), applied via a different mechanism. Where PageRank counted hyperlinks, citation equity reads semantic co-occurrence across the editorial corpora that ChatGPT, Perplexity, Gemini, and Google AI Overviews draw from. Brands surfaced in AI answers are those whose mention pattern aligns with the authority graph of their category. Citation equity is built through earned editorial coverage, not bought through paid placements.`;

const defined = definedTermSchema({
  term: "Citation Equity",
  definition: definitionProse,
  url,
});

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://ranking-atlas.com/" },
  { name: "Resources", url: "https://ranking-atlas.com/resources/" },
  { name: "Citation Equity", url },
]);
---

<Layout
  title="How Brands Get Cited By AI: The 2026 Guide To Citation Equity — Ranking Atlas"
  description="The definitional framework for citation equity. How ChatGPT, Perplexity, Gemini, and Google AI Overviews choose which brands to cite."
>
  <script type="application/ld+json" set:html={JSON.stringify(article)} />
  <script type="application/ld+json" set:html={JSON.stringify(defined)} />
  <script type="application/ld+json" set:html={JSON.stringify(breadcrumbs)} />

<div class="bg-white">
<article class="py-20 md:py-28">
  <div class="max-w-3xl mx-auto px-6">

    <!-- Mandatory Article Header Pattern -->
    <div class="text-sm uppercase tracking-wider text-brand font-medium mb-3">Guide</div>
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1] mb-6">
      How Brands Get Cited By AI: The 2026 Guide To Citation Equity
    </h1>
    <div class="flex items-center gap-3 mb-6">
      <a href="/about" class="shrink-0">
        <img src="/assets/images/author/daniel-headshot.jpg" alt="Daniel Grainger" class="w-12 h-12 rounded-full object-cover" width="48" height="48" />
      </a>
      <div>
        <p class="text-sm font-medium text-ink">By <a href="/about" class="text-brand hover:text-brand-dark transition-colors">Daniel Grainger</a>, founder of Ranking Atlas</p>
        <p class="text-sm text-[#64748B]">Published April 2026</p>
      </div>
    </div>

    <!-- Hero image slot (required per Article Header Pattern) -->
    <div class="relative w-full rounded-2xl overflow-hidden bg-surface border border-[#0A0F1E]/8 shadow-card mb-10 aspect-[16/9] flex items-center justify-center">
      <img
        src="/assets/images/resources/citation-equity/hero.jpg"
        alt="Citation Equity: the pattern AI systems read to decide which brands to cite"
        class="w-full h-full object-cover"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      />
      <div class="hidden flex-col items-center justify-center text-muted p-8 text-center">
        <div class="text-sm uppercase tracking-wider text-brand font-medium mb-3">Hero Image Slot</div>
        <div class="text-sm">Drop hero.jpg into /public/assets/images/resources/citation-equity/ when ready.</div>
      </div>
    </div>

    <!-- Opening hook (follow writing-style.md formula) -->
    <p class="text-body text-[21px] leading-[1.7] max-w-3xl mb-4">
      [OPENING HOOK HERE — per writing-style.md formula:]
      <br /><br />
      [Line 1-2: Punchy assertion or provocative question naming the reader's situation]
      <br /><br />
      [Line 3-4: Sharpening stat, contrast, or implication. Often a single sentence on its own line]
    </p>

    <!-- "In this guide, you'll learn..." box -->
    <div class="bg-white border border-[#0A0F1E]/8 rounded-xl p-6 mb-10 shadow-card">
      <p class="text-sm font-semibold text-ink mb-3">In this guide, you'll learn:</p>
      <ul class="space-y-2 text-sm text-[#475569] mb-4 list-disc pl-5">
        <li>[Bullet 1 — specific outcome]</li>
        <li>[Bullet 2]</li>
        <li>[Bullet 3]</li>
        <li>[Bullet 4]</li>
      </ul>
      <p class="text-sm text-[#64748B] italic">[Transition line into body]</p>
    </div>

    <!-- BODY PROSE BLOCK -->
    <div class="prose prose-lg text-body max-w-none space-y-6 text-[21px] leading-[1.7]">

      <!-- What Is Citation Equity? (first H2, contains the Definition block) -->
      <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-ink leading-tight mt-10 mb-4">What Is Citation Equity?</h2>

      <Definition term="Citation Equity">
        <p>{definitionProse}</p>
      </Definition>

      <p>
        [Paragraph after the definition block explaining why it matters, following writing-style.md voice rules.]
      </p>

      <!-- Numbered strategy / mechanism sections per writing-style.md page architecture -->
      <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-ink leading-tight mt-10 mb-4">[H2: Second Section Title In Start Case]</h2>
      <p>[Body content per writing-style.md rhythm rules]</p>

      <!-- ... continue with the rest of the 3,200 word body ... -->

      <!-- Closing formula per writing-style.md -->
      <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-ink leading-tight mt-10 mb-4">[Decisive H2 Closing Title]</h2>
      <p>[2-3 short paragraphs restating the core principle]</p>

      <p>Check out these resources for next steps:</p>
      <ul>
        <li><a href="/resources/earned-links-vs-paid-links" class="inline-link">Why Earned Links Beat Paid Links</a></li>
        <li><a href="/resources/the-cost-of-authority" class="inline-link">How Paid Link Prices Rose While Their Value Collapsed</a></li>
        <li><a href="/resources/ai-names-ict-experts/" class="inline-link">Who AI Names When You Ask For ICT Experts</a></li>
      </ul>
    </div>
  </div>
</article>
</div>

<!-- Final CTA band per design-system.md -->
<section class="bg-[#0A0F1E] py-16 lg:py-24">
  <div class="max-w-3xl mx-auto px-6 text-center">
    <h2 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
      Be The Brand AI Cites.
    </h2>
    <p class="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
      Per-campaign. Fixed price. Guaranteed placements on authority publishers.
    </p>
    <PrimaryCTA href="/contact" />
  </div>
</section>

<AuthorBio />

</Layout>
```

### 2.2 Paste the 3,200-word body

Paste the finished pillar content into the body prose block, using the existing `earned-links-vs-paid-links.astro` as the structural reference. Key constraints when pasting:

- Every H2 uses `class="text-2xl md:text-3xl font-bold tracking-tight text-ink leading-tight mt-10 mb-4"` and start-case capitalisation
- Every H3 uses start-case and fits the numbered-strategy-block pattern from writing-style.md where applicable
- Inline links use `class="inline-link"` (global utility from `src/styles/global.css`)
- Bold for key terms and named tools, italics sparingly
- Pro Tip, Note, and Further Reading callouts per design-system.md
- Every numbered section should have at least one image per the Image System rules in writing-style.md (can be added later with placeholder fallback until real imagery is ready)
- No em dashes (the linter will catch any)

### 2.3 Refine the Definition block

The `definitionProse` constant at the top of the file is the most important 100-150 words on the page. Refinement pass before committing:

1. First sentence must work as a standalone quote. LLMs lift it when asked "what is citation equity"
2. The entire block must read as coherent prose without surrounding context
3. Dense with the category vocabulary from positioning-core.md (citation equity, authority publishers, AI answer engines, editorial coverage)
4. Under 150 words, aim for ~130
5. No em dashes, no hedging verbs, no "not X, but Y" constructions

The draft in the code above is a starting point. Iterate on it directly until it lands.

### 2.4 Hero image

Create directory and add hero image:

```bash
mkdir -p public/assets/images/resources/citation-equity
# Add hero.jpg here when ready
```

If no hero is ready at commit time, the onerror fallback displays the "Hero Image Slot" placeholder. That is the intended behaviour and the linter does not flag it. Ship with the fallback visible, replace with a real hero asset once generated (see `scripts/generate_hero.py` in the repo).

### 2.5 Add the pillar to Netlify redirects

Update `netlify.toml` to catch any legacy URLs pointing at the old "AI Search Visibility" concept:

```toml
[[redirects]]
  from = "/resources/ai-search-visibility/"
  to = "/resources/citation-equity/"
  status = 301
```

Note: redirects already exist for `/ai-search-visibility` and `/ai-search-visibility/` but they currently target `/resources/ai-search-visibility/` which does not exist. Update those two rules to point at `/resources/citation-equity/` instead.

Final redirect block for AI Search Visibility becomes:

```toml
[[redirects]]
  from = "/ai-search-visibility"
  to = "/resources/citation-equity/"
  status = 301

[[redirects]]
  from = "/ai-search-visibility/"
  to = "/resources/citation-equity/"
  status = 301

[[redirects]]
  from = "/resources/ai-search-visibility"
  to = "/resources/citation-equity/"
  status = 301

[[redirects]]
  from = "/resources/ai-search-visibility/"
  to = "/resources/citation-equity/"
  status = 301
```

### 2.6 Commit Part 2

```bash
git add src/pages/resources/citation-equity.astro netlify.toml public/assets/images/resources/citation-equity/
git commit -m "pillar: publish citation equity guide"
```

Verify locally:

```bash
npm run build
npm run dev
```

Open `http://localhost:4321/resources/citation-equity/`. Verify:
- Article Header Pattern renders correctly
- Definition block visually distinct with brand-purple left border
- Body prose flows
- Further reading links work
- Final CTA band + AuthorBio render below

Open DevTools and check `<head>` contains:
- Organization schema (from Layout.astro)
- Article schema (from articleSchema helper)
- DefinedTerm schema (from definedTermSchema helper)
- BreadcrumbList schema (from breadcrumbSchema helper)

---

## Part 3: Update the Resources index

### 3.1 Add the Citation Equity pillar card with Foundational treatment

Open `src/pages/resources/index.astro`.

**3.1a.** Update the `itemListElement` array in the JSON-LD to include citation equity as the first entry:

```javascript
{
  "@type": "ListItem",
  "position": 1,
  "item": {
    "@type": "Article",
    "headline": "How Brands Get Cited By AI: The 2026 Guide To Citation Equity",
    "description": "The definitional framework for citation equity. How ChatGPT, Perplexity, Gemini, and Google AI Overviews choose which brands to cite, and what builds the pattern that puts you in the answer.",
    "url": "https://ranking-atlas.com/resources/citation-equity/",
    "author": { "@type": "Person", "name": "Daniel Grainger", "url": "https://ranking-atlas.com/about", "jobTitle": "Founder", "worksFor": { "@type": "Organization", "name": "Ranking Atlas", "url": "https://ranking-atlas.com" }, "sameAs": ["https://www.linkedin.com/in/daniel-grainger/", "https://ranking-atlas.com/about"] },
    "publisher": { "@type": "Organization", "name": "Ranking Atlas" },
    "datePublished": "2026-04-21",
    "dateModified": "2026-04-21"
  }
},
```

Renumber the existing entries from position 2 onwards.

**3.1b.** Add a new card as the FIRST card in the grid, with a Foundational visual treatment. Insert this before the existing AI Names ICT Experts card:

```astro
<!-- Foundational pillar card -->
<a href="/resources/citation-equity/" class="group md:col-span-2 bg-white rounded-2xl shadow-card border-2 border-brand/30 p-8 hover:shadow-lg hover:border-brand transition-all duration-300 block flex flex-col relative overflow-hidden">
  <!-- Subtle brand accent corner -->
  <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none"></div>

  <div class="flex items-center gap-3 mb-3">
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20">
      <span class="w-1.5 h-1.5 rounded-full bg-brand"></span>
      <span class="text-xs uppercase tracking-wider text-brand font-semibold">Foundational</span>
    </span>
    <div class="text-xs uppercase tracking-wider text-muted font-medium">Guide</div>
  </div>

  <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-ink mb-4 leading-snug group-hover:text-brand transition-colors">
    How Brands Get Cited By AI: The 2026 Guide To Citation Equity
  </h2>
  <p class="text-body leading-relaxed mb-4 text-lg">
    The definitional framework for citation equity. How ChatGPT, Perplexity, Gemini, and Google AI Overviews choose which brands to cite, and what builds the pattern that puts you in the answer.
  </p>
  <p class="text-sm text-muted mb-6">Published April 2026</p>
  <div class="mt-auto flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <img src="/assets/images/author/daniel-headshot.jpg" alt="Daniel Grainger" class="w-8 h-8 rounded-full object-cover" width="32" height="32" />
      <span class="text-sm text-muted">Daniel Grainger</span>
    </div>
    <div class="text-sm text-brand font-medium group-hover:underline">Read the guide →</div>
  </div>
</a>
```

Visual rationale (fits design-system.md):
- Uses existing Tailwind brand tokens (`border-brand`, `bg-brand/10`, `text-brand`)
- `md:col-span-2` makes it full-width on desktop, taking visual primacy over the 2-column grid below
- 2px `border-brand/30` accent differentiates it from the standard 1px `[#0A0F1E]/8` cards
- "Foundational" pill with small dot indicator marks it as the definitional piece without needing a separate section header
- Larger title (text-2xl md:text-3xl vs text-xl md:text-2xl on standard cards) reinforces hierarchy
- Subtle gradient corner adds dimension without violating the no-decorative-effects pattern

**3.1c.** Update the page header copy to reflect five resources:

Leave the H1 and intro paragraph as-is. The existing "Industry Insights" frame still works.

### 3.2 Commit Part 3

```bash
git add src/pages/resources/index.astro
git commit -m "resources: add citation equity pillar with foundational treatment"
```

Verify `/resources/` locally. Five cards should render: one foundational full-width pillar card, four standard cards below in 2-column grid.

---

## Part 4: Verify and Ship

### 4.1 Local verification checklist

```bash
npm run build
```

Build must succeed clean. If it fails, read the error and fix before proceeding.

```bash
npm run dev
```

Walk these URLs:

- `/` — homepage, unchanged but verify no regressions
- `/resources/` — five cards, citation equity featured at top
- `/resources/citation-equity/` — full pillar renders with Article Header, Definition block, body, closing, CTA, AuthorBio
- `/resources/earned-links-vs-paid-links` — unchanged, verify still works
- `/resources/the-cost-of-authority` — unchanged, verify still works
- `/resources/ai-names-ict-experts/` — unchanged, verify still works
- `/resources/saas-pricing-inflation` — unchanged, verify still works
- `/about` — unchanged
- `/contact` — unchanged

DevTools on `/resources/citation-equity/`:
- Organization JSON-LD (from Layout)
- Article JSON-LD (from articleSchema)
- DefinedTerm JSON-LD (from definedTermSchema)
- BreadcrumbList JSON-LD (from breadcrumbSchema)
- Canonical and OG meta present
- No console errors
- Inter font loads
- Brand purple (#5D4FE0) renders correctly on CTAs, links, and Definition block border

### 4.2 Push to deploy preview

```bash
git push origin feature/citation-equity-pillar
```

Open a PR on GitHub. Wait for the Netlify deploy preview build.

On the preview URL, test:

```bash
PREVIEW=https://deploy-preview-NN--ranking-atlas.netlify.app

# Verify new redirects work
curl -I $PREVIEW/ai-search-visibility
# Expect: HTTP/2 301, location: /resources/citation-equity/

curl -I $PREVIEW/resources/ai-search-visibility/
# Expect: HTTP/2 301, location: /resources/citation-equity/

# Verify existing redirects still work
curl -I $PREVIEW/the-cost-of-authority
# Expect: HTTP/2 301, location: /resources/the-cost-of-authority/

curl -I $PREVIEW/resources/citation-equity-vs-link-building
# Expect: HTTP/2 301, location: /resources/earned-links-vs-paid-links/
```

### 4.3 Schema validation

Run Google's Rich Results Test against `$PREVIEW/resources/citation-equity/`. Should recognise Article, DefinedTerm, and BreadcrumbList. Fix any validation errors.

Also test `$PREVIEW/resources/` for the ItemList schema.

### 4.4 Merge to production

```bash
git checkout main
git merge feature/citation-equity-pillar
git push origin main
```

Netlify deploys production. Watch the deploy complete in the Netlify dashboard.

### 4.5 Post-deploy

- Submit updated sitemap to Google Search Console (if sitemap is auto-generated; otherwise skip for now and plan sitemap integration as a later task)
- Use Search Console's URL Inspection to request indexing for `/resources/citation-equity/`
- Monitor Search Console for crawl errors over the following week
- LinkedIn post announcing the pillar (ties into Paul's existing LinkedIn post engine; this is a separate task)

---

## Appendix A: Troubleshooting

**Linter blocks commit for em dash in pillar body**
Search the content for `—` in the body section. Replace with period, comma, parentheses, or colon based on sentence logic. The linter already ignores em dashes inside JSON-LD blocks and frontmatter fences.

**Linter blocks for "not X, but Y"**
Rewrite to positive structure. Example: "Not a bug, but a feature" becomes "This is intended behaviour."

**Linter blocks for hedging verb**
Rewrite to assertive. Example: "Editorial coverage might help with AI visibility" becomes "Editorial coverage puts brands in the cited set."

**Definition block doesn't render with purple border**
Check that `text-brand` and `border-brand` are classes in the rendered HTML. If Tailwind didn't pick them up, verify the component file is inside the Tailwind `content` glob in `tailwind.config.js` (`./src/**/*.{astro,html,js,ts}` — Definition.astro matches).

**Hero image placeholder showing in production**
This is the intended fallback when `/public/assets/images/resources/citation-equity/hero.jpg` doesn't exist. Add the real hero image and the placeholder disappears automatically.

**JSON-LD not appearing in HTML `<head>`**
The `<script type="application/ld+json">` tags in the pillar file sit inside `<Layout>` but above the article content. If they render in `<body>` instead of `<head>`, that is Astro's default behaviour for scripts inside a layout's default slot. Acceptable; crawlers read the whole document.

**Redirect returns 404 on preview**
Netlify evaluates `_redirects` and `netlify.toml` at deploy time. Verify the file syntax and redeploy. The `netlify.toml` syntax uses double brackets `[[redirects]]`.

**Build fails importing Definition.astro**
Confirm the import path is `../../components/Definition.astro` from `src/pages/resources/citation-equity.astro`.

**Build fails importing schema helpers**
Confirm `src/lib/schema.ts` exists and exports `articleSchema`, `definedTermSchema`, `breadcrumbSchema`. Import path from the pillar page is `../../lib/schema`.

---

## Appendix B: Future work (separate plans)

Once the pillar is live and measured:

**Spoke planning.** Read the published Citation Equity pillar's H2 structure. Identify 3–5 H2 sections substantial enough to stand as their own 1,200–2,000 word piece. Draft spoke candidates. Target URLs under `/resources/citation-equity/<spoke-slug>/`.

Candidate spokes based on the current frame:
- How ChatGPT Chooses Which Brands To Cite
- How Perplexity Surfaces Sources
- How Google AI Overviews Decide What To Include
- How To Measure Your Brand's Citation Equity
- Citation Equity For Fintech SaaS
- Citation Equity For Cybersecurity SaaS

**Blog launch.** Introduce `/blog/` as a new surface. First 3–5 tactical posts. Keep under `/blog/<slug>/` per content-strategy.md.

**Backlink Price Index tool.** Build the interactive version of the data already in The Cost of Authority. Lives at `/resources/tools/backlink-price-index/`.

**Journalist Finder tool.** Package the existing internal tool for public use. Lives at `/resources/tools/journalist-finder/`.

**Sitemap integration.** Add `@astrojs/sitemap` and auto-generation. Submit to Search Console.

**Content collections migration (optional, low priority).** If the number of resources grows past ~15, migrating to Astro content collections with MDX becomes worth the cost. Until then, the `.astro`-per-resource pattern is simpler and matches the existing codebase.

---

Plan ends.
