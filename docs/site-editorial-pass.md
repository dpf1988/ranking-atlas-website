# Site Editorial Pass — Audit

**Reference point:** homepage `src/pages/index.astro` at commit `6e5d7f0` on `main` (deployed after Homepage Editorial Pass, PR #2). All inner pages measured against this and against the ui-ux-pro-max skill's 10 priority categories.

**Audit only.** No file edits performed. Do not treat this as a spec — treat it as evidence + ranked recommendations. Every proposal must be re-confirmed before implementation.

---

## Part A — Homepage Pattern Language (the yardstick)

Extracted from the current homepage. This is the reference language the rest of the site should either match, defer to, or deliberately deviate from.

### A1. Section rhythm

Alternates paper (`bg-white` / default) → warm (`bg-bg-warm`) → paper → dark card. Never two dark sections in a row. Never two warm sections in a row.

- Hero: white + subtle 48px grid overlay
- Featured In (marquee strip): white, bordered top/bottom `border-y border-ink/10`
- Problem: `bg-bg-warm`
- What We Do: white
- Featured Research: `bg-bg-warm`
- How We Work: white
- Final CTA: white section, dark card inside (`bg-brand-slate rounded-md`)

Section padding: `py-16 lg:py-20` (standard), `py-20 lg:py-28` (feature sections), `pt-28 md:pt-32 lg:pt-36` (hero top).

### A2. Type scale

- Serif family: `Source Serif 4` (weights 300/500/600)
- Sans family: `Inter` (body, UI)
- Italic display: `Instrument Serif` (hero emphasis only)
- **H1 hero:** `font-serif font-light text-[2.5rem] sm:text-[3.5rem] lg:text-[4.75rem] tracking-[-0.02em] leading-[1.02]`
- **H2 section:** `font-serif font-semibold text-2xl md:text-3xl tracking-tight leading-tight` + `<span class="brush-underline">`
- **H3 sub:** `font-serif text-lg md:text-xl font-medium tracking-tight`
- **Standfirst (hero):** `font-serif italic text-[19px] md:text-[22px] leading-snug`
- **Standfirst (section):** `font-serif italic text-[19px] leading-snug text-body`
- **Body:** `text-[15px] text-body leading-relaxed`
- **Eyebrow:** `text-[11px] uppercase tracking-[0.14em] font-semibold text-ink`
- **Caption/meta:** `text-[10px]–text-[11px] uppercase tracking-[0.10em–0.14em]`

### A3. Eyebrow patterns

**Light (const):**
```
inline-flex items-center gap-2 px-3 py-1.5 rounded-full
bg-accent-bright/15 border border-accent-bright/40
+ h-1.5 w-1.5 rounded-full bg-brand (dot)
+ text-[11px] uppercase tracking-[0.14em] font-semibold text-ink
```

**Dark (used on Final CTA card):**
```
bg-white/8 border border-white/15
+ dot: bg-accent-bright
+ text: text-white
```

Also `<Eyebrow variant="dark">` component with `bg-white/10 border-white/20` dot bg-white.

### A4. Brush marks

- `.brush-underline` — amber gradient, skewed, animates in from left on load (900ms, respects reduced-motion). Applied to every H2 on the homepage.
- `.brush-highlight` — amber highlighter swipe behind display text. Not currently used on the homepage but defined in `global.css`.

### A5. Hairlines & rules

- **Amber tick bullets:** `<span class="inline-block w-3 h-px bg-accent mt-[0.7em] shrink-0">` — replaces standard disc bullets in the three-pillar and step lists.
- **Amber gradient step-connector:** horizontal 1px rule under How We Work step circles with 50%→75%→100% intensity buildup (`linear-gradient(90deg, rgba(192,138,31,0.5) 0%, ..., 1) 100%)`).
- **Section divider:** `border-y border-ink/10` on marquee band; `border-t border-white/10` inside footer.

### A6. Amber usage rules

Amber appears ONLY on:
1. Eyebrow pill bg + border
2. Brush marks (underline/highlight)
3. Bullet ticks
4. Step-connector gradient
5. Step-circle progression (outline of Step 3, fill of Step 4)
6. Featured Research inline chart winning row
7. "Featured Study" label uses navy (`text-brand`), NOT amber
8. Left-edge accent on third secondary card (`border-l-accent`)

**NEVER on CTAs.** Primary CTA is `bg-brand` (navy). On dark surfaces, CTA becomes `bg-white text-brand`.

### A7. CTA patterns

- **Primary (navy):** `bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded shadow-[…] hover:-translate-y-px transition-all duration-200`
- **Secondary text link:** `text-sm font-semibold text-brand hover:text-brand-dark inline-flex items-center gap-1.5`
- **Dark-surface (white pill):** `bg-white hover:bg-white/95 text-brand font-semibold px-6 py-3 rounded shadow-[0_6px_20px_-4px_rgba(0,0,0,0.35)] hover:-translate-y-px`
- **Card trail:** `text-xs text-brand-navy font-semibold group-hover:underline` for research card "Read the study →"

Label rule (CLAUDE.md): every CTA is "Book a Call". Do not rename.

### A8. Card patterns

- **Featured flagship (Research):** `lg:col-span-7 bg-white border border-ink/12 rounded-md p-10 md:p-12 hover:border-ink/25`. Contains inline chart preview, evidence chips, byline row, "Read the study →" trail.
- **Secondary card:** `bg-white border border-ink/10 border-l-2 border-l-brand rounded-md p-7`. Third secondary uses `border-l-accent` for variety.
- **Dark card (Final CTA):** `bg-brand-slate rounded-md p-10 md:p-14 shadow-[0_20px_60px_-20px_rgba(15,27,61,0.35)]`.

### A9. Inline data-viz snippet

Composite index preview inside flagship card:
- Row: rank number + label + bar track + value
- Bar track: `flex-1 h-2 rounded-full bg-ink/[0.06]`
- Winning bar fill: `bg-accent` (amber) at full percentage
- Losing bar fills: `bg-brand/55` → `bg-brand/30` (navy fade)
- Winner value: `text-[13px] font-bold text-accent`
- No axes, no legend, no gridlines — pure editorial data preview.

### A10. Metadata treatments

- **Byline row:** `By Daniel Grainger · March 2026 · 9-min read` with `w-1 h-1 rounded-full bg-muted/60` dot separators. `text-[11px] text-muted`.
- **Evidence chips (primary):** `text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm bg-white border border-ink/10 text-body font-medium`
- **Evidence chips (secondary, smaller):** `bg-bg-warm border-ink/08 text-muted px-1.5 py-0.5`

### A11. Numbering

- **Large tinted numerals (Problem):** `font-serif text-[2rem] md:text-[2.25rem] font-semibold text-brand/35 leading-none w-14`. 35% opacity = de-emphasised eyebrow of the beat.
- **Step circles progression:** navy solid → navy-light outline → amber outline → amber fill. White numbers except Step 4 (white on amber). Serif numerals.

### A12. Motion

- `.brush-underline` sweep on load (900ms cubic-bezier)
- `.animate-marquee-slow` 50s linear infinite for Featured In strip, pauses on hover
- Press carousel: 4s auto-advance, 700ms opacity crossfade
- Button hover: `-translate-y-px` + shadow lift, 200ms
- Navbar dropdown: 150ms opacity fade
- Every animation respects `prefers-reduced-motion`
- **No scroll-triggered reveals, no parallax, no page transitions**

### A13. Container widths

- `max-w-7xl` — navbar + footer
- `max-w-6xl` — hero, Problem, Featured Research, How We Work
- `max-w-5xl` — What We Do, Final CTA
- `max-w-4xl` — reserved for closing/reading widths

---

## Part B — Rest-of-Site Audit

Every page below is a real file. Ratings are relative to the homepage language (A1–A13 above) and to the ui-ux-pro-max skill's 10 priority categories (Accessibility, Touch, Performance, Style, Layout, Typography, Animation, Forms, Navigation, Data-viz).

### B1. `/about` — about.astro

- **Match:** eyebrow, H1 treatment, single Book a Call, footer transition. Positioning language is clean.
- **Gap:** no visual proof (timeline, headshot beyond avatar, founding photo). Prose-only.
- **Verdict:** solid. Small polish opportunity, not urgent.

### B2. `/contact` — contact.astro

- **Match:** hero H1 with brush-underline + italic emphasis. Price anchor per CLAUDE.md.
- **Gap:** thin. No social proof, no process diagram, no visual reference to research library. Form floats alone.
- **Verdict:** biggest conversion surface, weakest visual case. Priority upgrade.

### B3. `/case-studies` — case-studies/index.astro

- **State:** placeholder + noindex. Correct behaviour.
- **Verdict:** ignore until case studies actually launch.

### B4. `/resources` — resources/index.astro (Featured Research hub)

- **Match:** eyebrow, HandUnderline, "By Ranking Atlas" byline, card grid.
- **Gap vs homepage:** flat 2-column grid. No featured flagship card mirroring homepage. No inline chart previews. Cards all look identical — no visual hierarchy. No category filtering, no search, no reading-time chips.
- **Verdict:** high-leverage. Should mirror homepage's flagship+secondaries pattern.

### B5. `/resources/ai-names-ict-experts` — sample Data Report

- **Match:** article header pattern, byline card, ToC, Key Takeaways card, tables + charts, methodology, RelatedResearch. Publication-standard.
- **Gap vs homepage:** no brush-underline on section H2s (homepage has it on every H2). No inline evidence chips like the homepage flagship. No pull quotes. No editorial marginalia (source badges next to claims).
- **Verdict:** already premium. Small enhancements would push it further.

### B6. `/resources/generational-fraud` — simpler Data Report

- **Match:** same template, executed correctly.
- **Gap:** thinner data-viz (tables only, no charts). Reads like an analysis, less like a premium artefact.
- **Verdict:** could add one slope chart + inline callout to lift.

### B7. `/blog` — blog/index.astro (hub)

- **Match:** eyebrow, HandUnderline, card grid, per-post author avatar + byline (Person schema — correct for Essays).
- **Gap:** 19+ posts in a flat 2-column grid. No filter, no search, no featured hero card. No reading-time signal. No category grouping. Discovery is weak.
- **Verdict:** high-leverage. Add featured card + category filter + reading time.

### B8. `/blog/earned-links-vs-paid-links` — canonical Essay

- **Match:** eyebrow "Essay", 21px prose, per-CLAUDE.md byline (Person + avatar). Definition callouts. SVG diagrams inline.
- **Gap vs homepage:** no brush-underline on H2s. No pull quotes. No inline stat highlights (numbers should pop — homepage does this with amber). No editorial marginalia.
- **Verdict:** strong prose. Would benefit from 2-3 visual anchors per essay (PullQuote, stat highlight, inline chart).

### B9. `/blog/citation-equity` — foundational Guide

- **Match:** eyebrow "Guide", 21px body, Definition component, comprehensive schema (Article + DefinedTerm + Breadcrumb).
- **Gap:** highly text-heavy. No flow diagram showing retrieval→selection→citation stages. No comparison table across engines. No downloadable playbook.
- **Verdict:** since this is the hub concept the whole brand orbits, it deserves the strongest visual treatment on the site.

### B10. `/blog/best-digital-pr-agencies-uk` — listicle/comparison

- **Match:** eyebrow "Comparison", clean disclosure box, per-agency H3 structure, FAQ schema.
- **Gap:** no logos, no capability matrix table, no visual badges per agency. Text-only comparison is hard to scan.
- **Verdict:** medium-leverage. A comparison matrix would materially improve utility.

### B11. `/data` — data/index.astro (Data Library hub)

- **Match:** eyebrow, HandUnderline, category grid + latest grid, "How this library works" editorial section (nice touch).
- **Gap:** no featured dataset card, no search, no freshness indicators.
- **Verdict:** structurally solid, could add featured hero + search.

### B12. `/data/[slug]` — dataset template

- **Match:** breadcrumb, YearScrubber chart, Key Takeaways card, methodology + FAQ + citation copy block, Dataset schema.
- **Gap vs homepage:** no brush-underline, no editorial marginalia, minimal visual flourish. Purely functional.
- **Verdict:** premium data provenance, minimal visual identity. Add small design signals (badges, source chips, sparkline previews).

### B13. `/data/[category]` — category template

- **State:** minimal, functional.
- **Verdict:** add category description + featured dataset at top.

### B14. `resources/_template.astro`

- **State:** the starter file for new data reports. Prescriptive, well-commented, enforces house style.
- **Verdict:** update this template every time we settle a new pattern (e.g. add PullQuote if we adopt it site-wide).

---

## Part C — Ranked Hit-List (highest leverage first)

Every item scored on **impact × ease × strategic fit**. Numbers are effort estimates only (S/M/L). No implementation without user re-confirmation per item.

### C1. Resources hub: flagship + secondaries card pattern (High impact, M effort)
Convert `/resources` from a flat 2-column grid into the homepage's flagship-plus-secondaries layout. Newest data report gets the flagship treatment (large card, inline chart preview, evidence chips, byline row). Older reports stack as secondaries with left-border accents. Makes the hub feel curated instead of catalogued.

### C2. Blog hub: featured post + category filter + reading time (High impact, M effort)
Add a featured hero card (most recent or manually pinned essay), category filter buttons (Essay / Guide / Comparison / Analysis / How-to), and reading-time chip on every card. Currently 19+ posts sit in a flat grid — discovery is broken.

### C3. Contact page: proof + process (High impact, M effort)
Add three elements above/around the form: (a) one client outcome or press hit as social proof, (b) a compact process diagram showing "Baseline → Build → Measure" as visual, (c) miniature evidence chips echoing homepage ("6 federal sources / 4 engines / 2,286 individuals" style). The contact page is the conversion surface but currently reads thinnest.

### C4. Long-form essays: pull quotes + stat highlights (Medium impact, S each)
Add two or three visual anchors per long essay: PullQuote component, inline stat callout (large amber number with brush-highlight), and one Definition-style callout per key concept. Applies immediately to citation-equity, earned-links, geo-vs-seo, digital-pr-kpis. Extends the homepage's "amber-on-data" language into body prose.

### C5. Brush-underline on inner-page H2s (Low-medium impact, S effort)
Currently only the homepage carries the brush-underline treatment on H2s. Extending it to research pages, essays, and hub headers would unify the editorial language across the site. Should be additive, not disruptive — the sweep animation is already reduced-motion safe.

### C6. Comparison listicles: capability matrix (Medium impact, M effort)
The "best-of" agency comparisons are pure prose. Adding a scannable capability matrix table (retainer vs project, consumer vs B2B, measurement approach, geography) plus small badges per agency would 10× utility.

### C7. Author archive page (Medium impact, M effort)
Create `/authors/daniel-grainger/` collecting all posts and research. Every byline links to it. Builds author authority signal for both search and AI-citation. Currently bylines link to `/about` which is a company page, blurring the Person entity.

### C8. Site-wide search or filter (Medium impact, L effort)
No search anywhere. As the library grows, this becomes structural debt. Options: client-side filter (cheap), Astro collections filter (medium), Algolia (heavy). Recommend starting with client-side.

### C9. Breadcrumb consistency (Low impact, S effort)
Blog and data pages have breadcrumbs. Resource pages don't. Add for consistency and IA clarity.

### C10. Dark card for one non-homepage surface (Low-medium impact, S effort)
The dark-card treatment developed for the Final CTA is documented in `memory/dark-band-pattern.md`. Best next application: a closing CTA / "Talk to us" band on individual essay pages or research reports, or the closing block on `/about`.

---

## Part D — Skill Category Checklist (site-wide)

Where the site sits against the ui-ux-pro-max skill's 10 priority categories.

| # | Category | Priority | Status | Notes |
|---|----------|----------|--------|-------|
| 1 | Accessibility | CRITICAL | ✓ Good | Reduced-motion respected in brush-sweep/marquee/carousel. Aria labels present on decorative elements. Focus states unverified — spot check needed. |
| 2 | Touch & Interaction | CRITICAL | ✓ Good | CTAs meet minimum tap sizes. Navbar mobile menu present. Verify 44×44 on nav dropdown items. |
| 3 | Performance | HIGH | ? Unknown | Image lazy-loading unclear. Self-hosted Chart.js (good). Fonts loaded via `<link>` (good). Need Lighthouse pass. |
| 4 | Style Selection | HIGH | ✓ Strong | Editorial magazine register. Consistent typography + colour palette. No emoji-as-icon violations. |
| 5 | Layout & Responsive | HIGH | ✓ Good | Mobile-first breakpoints, consistent max-widths, spacing on 4/8 rhythm. |
| 6 | Typography & Colour | MEDIUM | ✓ Strong | Semantic tokens throughout. Contrast passes on all body text. Editorial serif + geometric sans pairing is genre-appropriate. |
| 7 | Animation | MEDIUM | ✓ Good | Restrained, purposeful, reduced-motion respected. No decorative-only motion. |
| 8 | Forms & Feedback | MEDIUM | ⚠ Thin | Only the contact form exists. Not audited in detail — needs its own inline-validation / error-state review. |
| 9 | Navigation | HIGH | ⚠ Gaps | No breadcrumbs on resource pages. No site search. No author archive. Navbar itself is clean. |
| 10 | Charts & Data | LOW | ✓ Good | Data pages carry proper charts, tables, methodology, CSV export. Alt text and axis labels present. Could add drill-down + more direct labelling. |

---

## What to do next

1. Confirm this audit is directionally correct.
2. Pick the top 1-3 items from Part C to work through in order.
3. Each item gets its own commit + push to a working branch, then merge when signed off.

This document is the master plan. Update it as work progresses. If context is lost, re-read this file to rehydrate.
