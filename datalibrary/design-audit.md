# Design audit — for /data/ pages

Extracted from the shipped implementation, not assumptions. Sources: `src/layouts/Layout.astro`, `tailwind.config.js`, `docs/design-system.md`, `docs/data-report-template.md`, `src/pages/resources/ai-names-ict-experts/index.astro` (Featured Research reference), `src/pages/resources/hs2-land-value-capture.astro`, `src/components/RelatedResearch.astro`, `src/components/InstitutionalBio.astro`, `src/components/charts/*`.

## 1. Layout shell

- Root wrapper: `src/layouts/Layout.astro`. Emits Inter + Source Serif 4 from Google Fonts, canonical (`https://ranking-atlas.com` + pathname, trailing slash stripped, query dropped), Organization JSON-LD, `<Navbar>` (fixed, `h-16 lg:h-20`), `<Footer>` (dark navy). Body class: `bg-[#FBFAF7] font-sans antialiased min-h-screen`.
- **First section on any page must include top padding** to clear the fixed nav (`pt-20 md:pt-28` at minimum).
- The layout accepts a `head` slot for per-page schema, OG meta, extra scripts. Use it for the `Dataset`, `ItemList`, `BreadcrumbList`, `FAQPage` schema on /data/ pages.
- No global grid overlay div is actually mounted (the design-system.md mentions one but Layout.astro does not emit it). Body colour `#FBFAF7` is the only page-level canvas.

## 2. Typography

**Families**: `Inter` (weights 300–900) for sans; `"Source Serif 4"` (weights 500, 600) for serif. Applied via `font-sans` (default on body) and `font-serif` (explicit).

**Data-report register (matches /data/)**:
- H1: `font-serif font-medium text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] tracking-tight text-ink leading-[1.15]`. Centred on Featured Research; **left-aligned on /data/** because the animated ranking dominates the fold and the H1 must sit compactly above it.
- H2 (finding-led claim): `font-serif font-semibold text-xl md:text-[1.5rem] tracking-tight text-ink leading-tight mb-6`.
- H3: `font-serif font-semibold text-base text-ink mb-3`.
- Standfirst: `font-serif italic text-[15px] md:text-[16px] leading-[1.55] text-body`.
- Body prose: `text-body text-[15px] leading-[1.7]`. Wrapper: `space-y-6 text-body text-[15px] leading-[1.7]`. Never `text-lg`/`text-xl`/`text-[16-21px]` on data pages.
- Lists: `space-y-2 list-disc pl-6 text-body text-[15px] leading-[1.7]`.
- Captions / figcaptions / methodology notes: `text-sm text-[#64748B]` (italic optional).
- Eyebrow (content-type label): `text-xs uppercase tracking-wider text-brand font-medium mb-3`. Data reports use the flat text form, not the `Eyebrow.astro` pill.
- Byline block: 4 lines, all `text-[13px] text-[#64748B]`, on a `bg-[#FBFAF7] border border-[#0A0F1E]/8 rounded-2xl p-5` card. Never uses `<AuthorBio>` on institutional Featured Research; uses `<InstitutionalBio>` at foot.

## 3. Colour tokens

From `tailwind.config.js` (authoritative — the design-system.md doc lists an older purple palette that no longer matches the config; the config wins):

| Token | Hex | Role |
|---|---|---|
| `brand` | `#1E3A8A` | Primary navy — links, CTAs, chart primary |
| `brand-light` | `#3B5BB8` | Chart accent |
| `brand-dark` | `#1E40AF` | Link hover |
| `brand-navy` | `#0F1B3D` | Deep navy — headings on dark surfaces, dark chart plates |
| `brand-navy-dark` | `#080F24` | Darkest navy — chart plate gradient end |
| `ink` | `#0A0F1E` | Headings, primary text on light |
| `body` | `#475569` | Body prose |
| `muted` | `#64748B` | Captions, axis ticks, secondary labels |
| `subtle` | `#94A3B8` | Placeholder, flat delta, held-position slope lines |
| `bg-paper` / `bg-cream` / `paper-cream` | `#FBFAF7` | Page and byline-card background |
| `bg-warm` / `bg-lavender` | `#F4F0E9` | Warm alternate section fill (rare on data pages) |
| `surface` | `#F1F5F9` | Card fills, skeletons |

**Chart-specific hex used in existing study components** (do not add new colours):
- `#B91C1C` red — below baseline / decline
- `#047857` green — above baseline / rise
- `#1E3A8A` navy — primary bar / brand
- `#D8DCE6` grey — secondary stack member
- `#0A0F1E` ink — dashed baseline line
- `#64748B` muted — axis ticks
- Slope chart "held position" grey-blue: `#7B92C4`
- Slope chart climber emerald: `#34D399`
- Slope chart faller coral: `#F87171`

**Category palette for scrubber bars** (extension of the brand palette, one hue per country slot, ordered from strongest brand navy through complementary neighbours so top-3 stay closest to the brand):
`#1E3A8A #2563EB #0891B2 #0D9488 #047857 #65A30D #CA8A04 #D97706 #C2410C #B91C1C #9333EA #DB2777 #475569 #7C3AED`

## 4. Component patterns

- **Card shell**: `bg-white rounded-2xl border border-[#0A0F1E]/8 shadow-card p-8` (or `p-6` when denser). Hover: `hover:border-[#0A0F1E]/25 hover:shadow-[0_8px_30px_-8px_rgba(30,58,138,0.2)]`.
- **Byline card / navigation card**: `bg-[#FBFAF7] border border-[#0A0F1E]/8 rounded-2xl p-5`.
- **Table shell** (from data-report-template §6): outer `overflow-x-auto bg-white rounded-2xl border border-[#0A0F1E]/8`. Header row `border-b border-[#0A0F1E]/8 bg-[#FBFAF7]`, header cells `px-4 py-3 font-semibold text-ink`, numeric header `text-right`. Body rows `hover:bg-[#FBFAF7] transition-colors`, cell `px-4 py-3`, numeric cell right-aligned. Below-baseline value cell `font-semibold text-[#B91C1C]`, above-baseline `text-[#047857]`, neutral `text-[#64748B]`.
- **Eyebrow (flat)**: `text-xs uppercase tracking-wider text-brand font-medium mb-3`.
- **Section divider**: `border-b border-[#0A0F1E]/8` on the section, plus alternating white / `bg-[#FBFAF7]` fills.
- **Container widths**: `max-w-3xl mx-auto px-6` for prose sections; `max-w-5xl mx-auto px-6` for data sections (charts, tables, card grids). On /data/ pages the hero scrubber and the ranking table both use `max-w-5xl`; body prose and FAQ/methodology stay `max-w-3xl`.
- **Section vertical padding**: `py-16` on data-report content sections; hero uses `pt-20 md:pt-28 pb-10` (compressed — the animated ranking sits immediately below the title block).
- **Related datasets grid**: reuse `RelatedResearch.astro` (three cards, `md:grid-cols-3`, `bg-white rounded-2xl border border-[#0A0F1E]/8 p-8 shadow-card`).
- **Institutional close**: `<InstitutionalBio>` — thin ruled colophon, no avatar. Never `<AuthorBio>` on Featured Research / /data/.

## 5. Existing chart / table components

- `src/components/charts/ChartQueryVariants.astro` — canonical Chart.js pattern (loaded via CDN once per page, `setTimeout` poll for `window.Chart`, horizontal bar, fixed-height wrapper, custom HTML legend). Not reused directly on /data/ (Chart.js is bar-only), but its patterns (fixed-height wrapper, canvas `role="img"` + `aria-label`, `<noscript>` fallback text) inform the new `SlopeChart`, `Sparkline`, `YearScrubber` components.
- `src/components/RelatedResearch.astro` — reused as-is on /data/ pages.
- `src/components/InstitutionalBio.astro` — reused as-is on /data/ pages.
- No existing slope-chart, sparkline, animated-scrubber, or rank-table component. Build these fresh under `src/components/datalibrary/`.

## 6. Adaptations required by the /data/ prototype

The reference prototype (`datalibrary/reference/gdp-dataset-page-v5.html`) invents three patterns the site does not have. Restyle each as the closest native extension:

1. **Chart "plate"** — deep navy gradient panel wrapping the slope chart. Native equivalent: `bg-gradient-to-br from-[#0F1B3D] via-[#0F1B3D] to-[#080F24] rounded-2xl shadow-card p-8 md:p-10`, inner ring `after:absolute after:inset-0 after:rounded-2xl after:border after:border-white/8 after:pointer-events-none`. Uses existing `brand-navy` and `brand-navy-dark` tokens; adds nothing new.
2. **Rank chip** — pill around each rank number in the table. Native equivalent: `inline-flex items-center justify-center min-w-[32px] h-8 rounded-lg font-bold text-[13px] tabular-nums text-brand bg-brand/8`. Top-3 rows: solid `bg-brand text-white`.
3. **Year scrubber card** — white card wrapping the animated ranking. Native equivalent: `bg-white rounded-2xl border border-[#0A0F1E]/8 shadow-card p-6 md:p-8`. Stage inside: `rounded-xl bg-[#F1F5F9]` (site `surface` token) with a subtle 48px grid overlay via inline style, matching the reference feel but using the surface token instead of a new colour.

## 7. Visual hierarchy on /data/ pages

Non-negotiable order above the fold:

1. Breadcrumbs (compact, `text-[13px] text-muted`)
2. Eyebrow + one or two taxonomy chips
3. H1 (single line, left-aligned, `font-serif font-medium` at the data-report size)
4. Standfirst (one sentence, `font-serif italic`)
5. Byline row + meta strip + CSV download button
6. **Animated ranking (YearScrubber) — hero, immediately below the meta strip**
7. Key takeaways
8. Finding H2 sections in the order the argument builds
9. Slope chart section
10. Full sortable/filterable table
11. FAQ
12. Methodology & Fair Use
13. Cite this page
14. Related datasets (reuse `RelatedResearch`)
15. `InstitutionalBio`

## 8. Static-first rules (from the prototype, enforced site-wide)

- Every table row, every sparkline SVG, every slope chart line, and the scrubber's latest-year frame renders in the HTML at build. JS is progressive enhancement only: table sort/filter, scrubber play, and scrubber drag interpolation.
- Scrubber animation is `requestAnimationFrame`-driven with continuous interpolation between year keyframes. Reduced-motion falls back to discrete yearly stepping.
- `aria-live="polite"` on the year output; the value only writes on year change, not every frame.
- Controls hidden under `<noscript>`; the latest-year frame stays fully readable without JS.
- Country flags via `flagcdn.com` `w20`/`w40` PNG (never emoji flags).

## 9. Voice and copy register (data pages specifically)

- Institutional register. No editorialising, no causal claims, no marketing language.
- No em dashes anywhere in visible copy. Colon or comma or a two-sentence rewrite instead.
- Section headings are descriptive, not evocative: "Ranking by year, 1960–2024" is right; "Sixty-four years in motion" is wrong.
- Finding H2s state the finding: "Singapore rose from 32nd in 1960 to 6th in 2024".
- Prose leads the section; visuals follow, then a caption. Not the other way round.
- Every figure quoted in prose, meta tags, takeaways, FAQ, and schema must be computed from the loaded data at build time.
