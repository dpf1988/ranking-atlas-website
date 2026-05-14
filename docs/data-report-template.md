# Data Report Template

The canonical structure, classes, and editorial rules for Featured Research pages on `/resources/`.

Reference page: `src/pages/resources/ai-names-ict-experts/index.astro`
Starter file: `src/pages/resources/_template.astro` (copy this when starting a new report)

This document layers on top of `CLAUDE.md`, `docs/design-system.md`, and `docs/writing-style.md`. Where this file specifies something, it overrides the more general guidance.

---

## 1. Section order

Every data report follows this sequence:

1. **Hero**: eyebrow, H1, standfirst, hero image with caption, byline block, navigation panel
2. **Key Takeaways**: six to eight bullet points, each leading with a bolded claim
3. **Finding section 1** (claim-led H2): chart, optional table, body prose
4. **Finding section 2** (claim-led H2): same pattern
5. **Finding section 3** ... continue as needed, typically four to six findings
6. **Closing editorial**: claim-led H2 reframing the finding in interpretive terms; one PullQuote with attribution allowed here only
7. **Methodology**: full disclosure of what was asked, who was asked, sample sizes, classification methods, exclusions, baselines
8. **Limitations**: five to seven candid concessions about what the data does not prove
9. **Download**: CSV link, citation line
10. **Press contact sign-off**: single soft line, no styled CTA
11. **RelatedResearch**: three sibling resources
12. **InstitutionalBio**: closing institutional bio (Featured Research is institutional; never use AuthorBio here)

---

## 2. Header pattern

In order, inside the hero section:

```astro
<section class="pt-20 md:pt-28 pb-16 border-b border-[#0A0F1E]/8">
  <div class="max-w-3xl mx-auto px-6">

    <!-- 1. Eyebrow (Title Case, one of: Data Report / Guide / Essay) -->
    <div class="text-xs uppercase tracking-wider text-brand font-medium mb-3 text-center">Data Report</div>

    <!-- 2. H1 (start case, centered) -->
    <h1 class="font-serif font-medium text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] tracking-tight text-ink leading-[1.15] mb-3 text-center">
      [REPORT TITLE]
    </h1>

    <!-- 3. Standfirst (italic serif, lead with the most surprising finding) -->
    <p class="font-serif italic text-[15px] md:text-[16px] leading-[1.55] text-body mt-2 mb-8">
      [STANDFIRST: one sentence, no em dashes, leads with the sharpest finding rather than the headline gap]
    </p>

    <!-- 4. Hero image with caption -->
    <figure class="mb-8">
      <img
        src="/assets/images/resources/[slug]/hero.jpg"
        alt="[Describe the illustration in one sentence. Not visible on the page.]"
        class="w-full h-auto rounded-2xl border border-[#0A0F1E]/8"
        loading="eager"
      />
      <figcaption class="mt-3 text-sm text-[#64748B] italic">[Optional visible caption. Omit the figcaption entirely if no caption.]</figcaption>
    </figure>

    <!-- 5. Byline block (tinted card, all lines muted) -->
    <div class="bg-[#FBFAF7] border border-[#0A0F1E]/8 rounded-2xl p-5 mb-6">
      <p class="text-[13px] text-[#64748B]">Content Written By:</p>
      <p class="text-[13px] text-[#64748B]">Daniel Grainger</p>
      <p class="text-[13px] text-[#64748B]">Founder, Ranking Atlas</p>
      <p class="text-[13px] text-[#64748B]">Published [Month Year]</p>
    </div>

    <!-- 6. Navigation panel (tinted card, one anchor per finding section, hollow-bullet list) -->
    <nav class="bg-[#FBFAF7] border border-[#0A0F1E]/8 rounded-2xl p-5" aria-label="Article sections">
      <p class="text-[14px] font-semibold text-ink mb-3">Navigation</p>
      <ul class="flex flex-col space-y-2 text-[14px]">
        <li class="flex items-center gap-2.5"><span aria-hidden="true" class="inline-block w-1.5 h-1.5 rounded-full border border-[#0A0F1E]/30 shrink-0"></span><a href="#key-takeaways" class="text-brand hover:text-brand-dark hover:underline underline-offset-2">Key Takeaways</a></li>
        <!-- one <li> per finding section, anchor text matches the H2, following the same flex + hollow-bullet pattern -->
      </ul>
    </nav>

  </div>
</section>
```

---

## 3. Page container and typography

| Element | Class |
|---|---|
| Section container | `max-w-3xl mx-auto px-6` |
| Section vertical padding | `py-16` |
| Section divider | `border-b border-[#0A0F1E]/8` |
| Section background alternation | white (default) / `bg-[#FBFAF7]` (alternating) |
| H1 | `font-serif font-medium text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] tracking-tight text-ink leading-[1.15] text-center` |
| H2 | `font-serif font-semibold text-xl md:text-[1.5rem] tracking-tight text-ink leading-tight mb-6` |
| H3 | `font-serif font-semibold text-base text-ink mb-3` |
| Body prose | `text-body text-[15px] leading-[1.7]` |
| Body group wrapper | `space-y-6 text-body text-[15px] leading-[1.7]` |
| Lists | `space-y-2 list-disc pl-6 text-body text-[15px] leading-[1.7]` |
| Captions / figcaptions / methodology notes | `text-sm text-[#64748B]` (italic optional) |

Body is **15px / 1.7 line-height**. Never `text-lg`, `text-xl`, or `text-[16-21px]` for body prose on data reports. (Note: this is narrower than the 21px standard used on Essays & Guides. Data reports run denser because charts and tables already break up the page.)

---

## 4. Section headlines (H2s)

H2s are **claim-led**, not topical labels.

Good: "Ask AI for Top Tech Founders and It Names One Woman for Every Ten Men"
Bad: "Role Gap"

Good: "One Wording Change Nearly Doubled How Many Women AI Named"
Bad: "Language Effect"

Title Case, no full stops, no em dashes. The H2 is the finding stated as a sentence.

---

## 5. Charts

- Chart.js 4.4.1 loaded from CDN at the top of the page, once:
  ```astro
  <script is:inline src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
  ```
- Each chart is a separate `.astro` component under `src/components/charts/`
- Component accepts `id` and `eyebrow` props (and `showHeadline` when the chart appears twice on a page)
- Init pattern: poll `window.Chart` with `setTimeout(init, 50)` until available
- Wrapper: `<div class="relative w-full" style="height:[NNN]px">` (fixed height; do not use aspect ratio)
- Bar charts: horizontal (`indexAxis: 'y'`), `responsive: true, maintainAspectRatio: false`
- Bar thickness: 18–28px depending on number of categories
- Colours (use these exact hex; do not add new colours):
  - `#B91C1C` = below baseline (red)
  - `#047857` = at or above baseline (green)
  - `#1E3A8A` = navy (brand, used in stacked bars for female share)
  - `#D8DCE6` = grey (male share in stacked bars)
  - `#0A0F1E` = ink (dashed baseline line)
  - `#64748B` = muted (axis ticks, secondary labels)
- Baseline plugin: dashed vertical line at the reference value, 2px lineWidth, `setLineDash([5,4])`
- Value labels plugin: 11px Inter 600 weight, fillStyle matches bar colour, placed `bar.x + 6` to the right of bar
- Legend: custom HTML below the canvas, never Chart.js's built-in legend
- Canvas always has a `role="img"` and `aria-label` describing the chart in one sentence, with text content inside the canvas as a fallback for screen readers without canvas support

Template chart component lives at `src/components/charts/ChartQueryVariants.astro` and is the canonical reference for new charts.

---

## 6. Tables

Tables sit **below** the chart, not beside it. The chart shows the pattern; the table is the receipt.

```astro
<div class="overflow-x-auto bg-white rounded-2xl border border-[#0A0F1E]/8 mb-8">
  <table class="w-full text-sm text-left">
    <thead>
      <tr class="border-b border-[#0A0F1E]/8 bg-[#FBFAF7]">
        <th class="px-4 py-3 font-semibold text-ink">[Column]</th>
        <th class="px-4 py-3 font-semibold text-ink text-right">[Numeric column]</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-[#0A0F1E]/6">
      <tr class="hover:bg-[#FBFAF7] transition-colors">
        <td class="px-4 py-3 font-medium text-ink">[Row label]</td>
        <td class="px-4 py-3 text-right font-semibold text-[#B91C1C]">[Below-baseline value]</td>
      </tr>
    </tbody>
  </table>
</div>
```

Numeric cells right-aligned. Below-baseline values use `text-[#B91C1C]`, at/above use `text-[#047857]`, neutral values use `text-[#64748B]`. Bold the leading row label, not the values, unless the value is the column's headline figure.

A table is only included if the chart cannot carry the sample size or auxiliary columns the prose cites. If the chart already shows everything, drop the table.

---

## 7. PullQuote rules

`<PullQuote quote="..." attribution="..." />`

- **One per page maximum.** Place it in the closing editorial section, not as a mid-section divider.
- The quote is a single editorial claim, two to three sentences, in the founder's voice.
- Attribution always reads: `"Daniel Grainger, Ranking Atlas"` (no em dash, no full stop, no role title).
- The component renders italic, with typographic curly quotation marks, on a navy left border.
- Do not use PullQuotes to break up long sections. If a section feels long, tighten the prose.

---

## 8. JSON-LD

```js
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[REPORT TITLE]",
  "description": "[META DESCRIPTION, 1-2 SENTENCES, NO EM DASHES]",
  "url": "https://ranking-atlas.com/resources/[slug]/",
  "image": "https://ranking-atlas.com/assets/images/resources/[slug]/hero.jpg",
  "author": { "@type": "Person", "name": "Daniel Grainger", "url": "https://ranking-atlas.com/about" },
  "datePublished": "[ISO date]T00:00:00+00:00",
  "dateModified": "[ISO date]T00:00:00+00:00",
  "publisher": { "@type": "Organization", "name": "Ranking Atlas" }
};
```

Author is Person (Daniel Grainger) on Featured Research. This overrides the CLAUDE.md instruction that says Featured Research is institutionally authored; the ICT page is the new canonical and uses a Person author with `dateModified` reflecting the most recent edit.

(Open question: reconcile this with CLAUDE.md's authorship section before publishing the next data report.)

---

## 9. Voice rules (data reports specifically)

In addition to the CLAUDE.md global rules, data reports must avoid:

- **Rhythmic A/B contrast pairs**: "Asked directly, X. Asked normally, Y." → rewrite as one sentence with a clause.
- **Rhetorical anchor lines** sitting alone as a paragraph: "The wording is doing the work.", "The names are there.", "Visibility compounds." → delete or fold into the surrounding paragraph.
- **Triplet sentence cadence**: "Same models. Same topic. Same categories." → collapse into one clause.
- **Mirrored couplet structure**: "The further X, the closer Y. The closer to Z, the fewer Q." → keep only one half or merge into prose.
- **Think-piece slogans**: "This is what X looks like from the inside." / "The default question rewards whoever already holds it." → cut.
- **Interpretive overreach**: do not say AI "suppresses" or "leaves out" women. Say it "does not surface", "returns fewer", or "reflects existing authority hierarchies in the underlying sources". The data supports the second framing, not the first.

The page's job is to present the finding cleanly. Editorial weight belongs in the closing PullQuote, not in every paragraph.

---

## 10. CTAs

Featured Research pages do not carry hard sales CTAs. Close with the press-contact sign-off only:

```astro
<section class="py-12 bg-white">
  <div class="max-w-3xl mx-auto px-6">
    <p class="text-body text-[15px] leading-[1.7]">
      For a different cut of this dataset, additional [category] or [breakout] questions, or methodology questions, contact <a href="mailto:contact@ranking-atlas.com" class="text-brand hover:text-brand-dark underline underline-offset-2">contact@ranking-atlas.com</a>.
    </p>
  </div>
</section>
```

---

## 11. Pre-publish checklist

- [ ] No em dashes anywhere (`grep -n "—" [file]` returns nothing)
- [ ] `npm run build` clean
- [ ] H1 is start case and centered
- [ ] Eyebrow is one of: Data Report, Guide, Essay
- [ ] Standfirst leads with the sharpest finding, not the headline gap
- [ ] Hero image alt text describes the illustration in one sentence
- [ ] Byline block: four lines, all muted, no em dashes
- [ ] Navigation panel anchors match the H2 section ids
- [ ] Every finding H2 is claim-led, not a topic label
- [ ] No more than one PullQuote, in the closing editorial section
- [ ] Charts: legend below canvas, baseline plugin present where a reference value applies, value labels colour-matched
- [ ] Tables earn their place (carry sample size or columns the prose cites)
- [ ] Methodology section discloses sample sizes, classification methods, exclusions, baselines
- [ ] Limitations section is candid (five to seven concessions)
- [ ] Download CSV link present
- [ ] Press contact sign-off, no styled CTA
- [ ] RelatedResearch with three topically related siblings
- [ ] InstitutionalBio at the foot
- [ ] JSON-LD updated with correct headline, url, image, dateModified
