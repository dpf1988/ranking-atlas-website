# Data Library

Structured, source-attributed rankings that render as static Astro pages under `/data/<slug>`. Every dataset ships with a full historical series, per-year ranks, computed headline metrics, a downloadable CSV, and rich schema.org markup.

## Layout

```
datalibrary/
  README.md
  design-audit.md               ← how /data/ pages align with the wider site
  scripts/
    fetch-worldbank.mjs         ← pulls a World Bank indicator into a dataset
    validate.mjs                ← sanity-checks a dataset before build
  datasets/
    <slug>/
      config.json               ← editorial layout + token placeholders
      data.json                 ← computed panel: countries, years, ranks, metrics
      data.csv                  ← long-format CSV mirror of the panel

src/
  pages/
    data/
      index.astro               ← auto-lists every dataset folder
      [slug].astro              ← the dynamic dataset template
  components/
    datalibrary/
      Sparkline.astro           ← per-country static SVG sparkline
      SlopeChart.astro          ← 1960 → latest slope chart, broken axis
      RankTable.astro           ← sortable / filterable ranking table
      YearScrubber.astro        ← animated ranking hero, RAF-driven

public/
  data/
    <slug>.csv                  ← stable public URL for the CSV
```

## Add a dataset from a World Bank indicator

1. **Fetch the indicator.**
   ```bash
   node datalibrary/scripts/fetch-worldbank.mjs <indicator-code> <slug>
   # e.g.
   node datalibrary/scripts/fetch-worldbank.mjs NY.GDP.PCAP.CD gdp-per-capita-by-country
   ```
   The script writes `datalibrary/datasets/<slug>/data.json`, `data.csv`, and copies the CSV to `public/data/<slug>.csv`. It strips aggregate rows (regions, income groups), computes per-year ranks across reporting economies, and computes the headline metrics block used by the template.

2. **Write `config.json`.** Copy an existing one as a starting point. `config.json` must include a required top-level `category` field. Use `{{tokens}}` for any figure that should come from the data:
   - `firstYear`, `latestYear`, `prevDecadeYear`, `yearSpan`
   - `reportingEconomiesLatest`, `reportingEconomies1960`
   - `leaderName`, `leaderValueFmt`, `rank2Name`, `rank2ValueFmt`, `rank3Name`, `rank3ValueFmt`
   - `overlapCount`, `overlapList` (1960 top 10 ∩ latest top 10)
   - `climberName`, `climberRank1960Ord`, `climberLatestRankOrd`
   - `gainerName`, `gainerRank2000Ord`, `gainerLatestRankOrd`, `gainerValueFmt`, `gainerGain`
   - `medianLatestFmt`, `medianFirstYearFmt`, `retrievedAtHuman`

   Never hard-code a figure that could come from the data. If a claim can't be derived from the metrics block, add it to the fetcher first, then reference it via a token.

3. **Validate.**
   ```bash
   node datalibrary/scripts/validate.mjs <slug>
   ```
   Checks the panel shape, aggregate leakage, latest-year top-50 completeness, metric consistency, token coverage, absence of em dashes, and CSV parity.

4. **Build.**
   ```bash
   npm run build
   ```
   The page is emitted at `dist/data/<slug>/index.html`. `src/pages/data/index.astro` auto-picks it up.

## Add a dataset from another source

Skip step 1. Produce `data.json` in the same shape by hand or with a bespoke fetcher:

```jsonc
{
  "indicator": { "code": "...", "name": "...", "unit": "..." },
  "source":    { "name": "...", "url": "..." },
  "license":   "...",
  "temporalCoverage": { "startYear": 1960, "endYear": 2025 },
  "retrievedAt": "2026-07-19",
  "years":     [1960, 1961, ..., 2025],
  "countries": [
    {
      "iso3": "LUX",
      "iso2": "lu",
      "name": "Luxembourg",
      "region": "Europe & Central Asia",
      "incomeLevel": "High income",
      "values": [ null, ..., 147252.18 ],
      "ranks":  [ null, ..., 1 ],
      "delta10y": 0,
      "delta1960": 0,
      "delta2000": 0
    }
  ],
  "metrics": {
    "firstYear": 1960, "latestYear": 2025, "prevDecadeYear": 2015,
    "reportingEconomiesLatest": 186, "reportingEconomies1960": 108,
    "leader": { "iso3": "LUX", "name": "Luxembourg", "value": 147252.18 },
    "top3":  [ ..., ..., ... ],
    "top14": [ ... ],
    "top10Overlap1960toLatestNames": ["Luxembourg", "Switzerland", ...],
    "largestClimberInTop10VsFirstYear": { "name": "Singapore", "firstRank": 35, "latestRank": 4 },
    "largestGainSince2000InTop20":     { "name": "Macao SAR, China", "rank2000": 40, "latestRank": 9, "value": ..., "gain": 31 },
    "medianLatest": 7882, "medianFirstYear": 255
  }
}
```

Then write `config.json`, run `validate.mjs`, and build.

## Categories

Every dataset belongs to exactly one category, set via the required `category` field in `config.json`. The taxonomy is closed. `validate.mjs` rejects any value outside this list.

- **economy**: incomes, growth, prices, trade, labour, fiscal.
- **health**: life expectancy, mortality, disease burden, healthcare capacity.
- **society**: demographics, education, inequality, culture, migration.
- **environment**: emissions, energy, land use, climate, natural resources.
- **technology**: AI adoption, digital infrastructure, R&D, innovation output.
- **property**: house prices, transaction volumes, rents, land value.

Category slugs are reserved. A dataset slug that matches a category name (e.g. `economy/`) is rejected by `validate.mjs`.

Each category renders as a static listing page at `/data/<category>/` with a one-sentence standfirst held in `src/pages/data/[category]/index.astro`. Dataset pages remain flat at `/data/<slug>` so already-indexed URLs never churn.

## Internal linking

- Every Ranking Atlas study that uses one of these datasets should link its underlying dataset page in one in-context sentence. Anchor text is the metric name, never generic.
- Every dataset page's `related` array may include the study it powers.
- Dataset page prose links only to other datasets, other Ranking Atlas studies, and primary sources. Never to commercial pages: the nav and footer carry those.
- No dataset page should be an orphan: each must be reachable from the hub, its category page, and at least one Related card elsewhere once 2+ datasets exist.

## Style rules

- No em dashes anywhere. Use colons or "by". The pre-commit hook and `validate.mjs` both check.
- **No dataset jargon in visible copy.** Never `panel`, `the panel`, `reporting panel`, `cohort`, `entities`, `observations`. Rewrite in plain language:
  - "Singapore entered the panel in 1960" → "In 1960, Singapore ranked 35th"
  - "Positions computed within the full reporting panel for each year" → "Rankings computed among all countries with data for each year"
  - "reporting economies" → "countries with reported data" (or just "countries")
  This applies to config prose (standfirst, takeaways, sections, methodology, FAQ) and to any chart captions or legend text added to the components.
- Findings-led H2s. State the data claim, not the topic.
- Institutional voice. No editorialising, no hedging verbs.
- Every figure in visible copy must trace back to a metric in `data.json`.
- **Bold only the key names and figures inside a takeaway,** using inline `<b>...</b>` tags in the config string. The template renders takeaway text at body weight; do not bold the whole line and do not colour it.
- **State data currency plainly.** The template auto-appends "Data runs to `<latestYear>`, the most recent year published by `<source>`." to the methodology block. Do not restate this figure inside `methodology[]` in the config.
- Sparklines index each country to its own min/max; they compare shape not level.
- The slope chart highlights only climbers of 10+ places; every other line renders in the neutral tone. The section heading should carry the stability claim; do not add a "fallers" callout to the caption.
- The slope chart uses an honest broken axis (`breakBelow`, default 16). Do not clamp climbers into the top of the axis.
- **Each fact appears once per page in prose.** The data (chart, table) and schema may restate facts; prose may not. The standfirst defines the metric; the meta line carries source, coverage, unit, currency of data, update date, byline; takeaways carry findings; methodology carries provenance. Nothing else carries any of these.
- **Standfirst is the metric definition.** Add a required `definition` field to `config.json`: one to two plain-language sentences stating precisely what the indicator measures. No jargon, no findings, no leader claims, no coverage claim (that lives in the meta line). The template renders `definition` in the standfirst slot; the legacy `standfirst` field is kept only for the hub card blurb.
- **`card_summary` is a scope statement, not a definition.** Required on every dataset. One or two complete sentences stating precisely what is measured and counted, plus one scope note or caveat where the dataset has one. Rules:
  - Plain language, no dataset jargon. Never `rows`, `indicator`, `panel`, `entities`, `aggregates excluded`. Say "regional groupings removed" or fold exclusions into plain phrasing.
  - Do not name the source. The meta line below the card carries it.
  - No findings, no leader claims.
  - Hard cap 160 characters, no ellipses, complete sentences only. `validate.mjs` enforces the cap.
  - Example (GDP dataset): `"Annual economic output per person for every country, in the US-dollar values of each year. Rankings recalculated for each year since 1960."`

## Deviations from the reference prototype

- Numbers in copy are computed from live World Bank data, not the prototype's placeholders (Luxembourg $147,252 in 2025 vs $135K in the prototype; 186 reporting economies vs 46; latest year 2025 vs 2024).
- The "largest 10y faller" claim is omitted because the real panel produces only a marginal −1 rank movement inside the top 40 — a weak claim.
- Colour tokens are drawn from the site's tailwind config (`brand` navy `#1E3A8A`), not the prototype's standalone palette.
- Body text on the report page uses the site's 15px data-report scale, not the prototype's larger body scale, to match the wider Data Report register.
- Anchor navigation is a sticky rail matching the site's existing resource pages, not the prototype's inline tab bar.
