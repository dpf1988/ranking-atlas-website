# Internal Link Audit

Read-only audit of the Astro site at `C:\Users\inhal\ranking-atlas-company\website`. Scope covers pages under `src/pages/`. Global navigation (`Navbar.astro`) and global footer (`Footer.astro`) are excluded from page-body link counts and from inbound-link tallies, per the audit brief. Findings reflect only what was observed in source. No fixes are proposed.

## 1. Canonical Tag Audit

`src/layouts/Layout.astro` does not emit a default `<link rel="canonical">`. Canonicals therefore exist only on pages that explicitly inject one via the `head` slot.

| Slug | Canonical present | Href value | Matches clean URL | Notes |
|---|---|---|---|---|
| `/resources/` | No | : | : | Missing. |
| `/resources/citation-equity/` | No | : | : | Missing. |
| `/resources/chatgpt-search-visibility` | No | : | : | Missing. The route is served without a trailing slash. |
| `/resources/press-release-ai-citation-2026` | No | : | : | Missing. The route is served without a trailing slash. |
| `/resources/earned-links-vs-paid-links` | No | : | : | Missing. The route is served without a trailing slash. |
| `/resources/the-cost-of-authority` | No | : | : | Missing. The route is served without a trailing slash. |
| `/resources/saas-pricing-inflation` | No | : | : | Missing. The route is served without a trailing slash. |
| `/resources/ai-names-ict-experts/` | No | : | : | Missing. |
| `/resources/plastic-surgery-patient-age/` | Yes | `https://ranking-atlas.com/resources/plastic-surgery-patient-age/` | Yes (trailing slash) | Injected via `<fragment slot="head">`. |
| `/resources/plastic-surgery-patient-age/methodology` | Yes | `https://ranking-atlas.com/resources/plastic-surgery-patient-age/methodology` | Matches the page route, but no trailing slash | Inconsistent with the sibling `plastic-surgery-patient-age/` canonical, which carries a trailing slash. |

**Observed flags:**

- Eight of ten resource pages have no canonical tag at all.
- The two existing canonicals are not internally consistent with one another on trailing-slash policy: `plastic-surgery-patient-age/` ends with a slash, `plastic-surgery-patient-age/methodology` does not.
- No canonical href contained a UTM parameter or query string in any file inspected.

## 2. Internal Outbound Links By Resource Page

Page-body links only. Author-row links to `/about` and the `AuthorBio.astro` body link to `/resources/` are counted because they appear inside the article body, not in the global nav or footer. PrimaryCTA references to `/contact` are counted because they appear inline in page bodies.

### `/resources/` (resources index)

| Anchor text | Destination |
|---|---|
| How Brands Get Cited By AI: The 2026 Guide To Citation Equity | `/resources/citation-equity/` |
| What Is ChatGPT Search Visibility? (And How to Track It) | `/resources/chatgpt-search-visibility` |
| What Makes a Press Release Get Cited by ChatGPT in 2026? | `/resources/press-release-ai-citation-2026` |
| How Old Are Plastic Surgery Patients in the US? | `/resources/plastic-surgery-patient-age/` |
| Who AI Names When You Ask for ICT Experts | `/resources/ai-names-ict-experts/` |
| SaaS Price Comparison 2020–2026 | `/resources/saas-pricing-inflation` |
| How Paid Link Prices Rose While Their Value Collapsed | `/resources/the-cost-of-authority` |
| Why Earned Links Beat Paid Links | `/resources/earned-links-vs-paid-links` |

### `/resources/citation-equity/`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| ChatGPT search visibility | `/resources/chatgpt-search-visibility` |
| earned links | `/resources/earned-links-vs-paid-links` |
| press releases | `/resources/press-release-ai-citation-2026` |
| the cost of authority | `/resources/the-cost-of-authority` |
| AI names ICT experts | `/resources/ai-names-ict-experts/` |
| Talk to us | `/contact` |
| primary-source reports (via AuthorBio) | `/resources/` |

### `/resources/chatgpt-search-visibility`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| citation equity | `/resources/citation-equity/` |
| press release citation | `/resources/press-release-ai-citation-2026` |
| Talk to us | `/contact` |
| Citation Equity: The 2026 Guide | `/resources/citation-equity/` |
| Press Release Citation Playbook | `/resources/press-release-ai-citation-2026` |
| Earned vs Paid Links | `/resources/earned-links-vs-paid-links` |
| primary-source reports (via AuthorBio) | `/resources/` |

### `/resources/press-release-ai-citation-2026`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| earned links | `/resources/earned-links-vs-paid-links` |
| Talk to us | `/contact` |
| ChatGPT Search Visibility | `/resources/chatgpt-search-visibility` |
| Earned Links vs Paid Links | `/resources/earned-links-vs-paid-links` |
| Citation Equity: The 2026 Guide | `/resources/citation-equity` |
| The Cost of Authority | `/resources/the-cost-of-authority` |
| primary-source reports (via AuthorBio) | `/resources/` |

### `/resources/earned-links-vs-paid-links`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| our analysis | `/resources/the-cost-of-authority` |
| The Cost of Authority dataset | `/resources/the-cost-of-authority` |
| Talk to us | `/contact` |
| ChatGPT Search Visibility | `/resources/chatgpt-search-visibility` |
| Press Release Citation Playbook | `/resources/press-release-ai-citation-2026` |
| The Cost of Authority | `/resources/the-cost-of-authority` |
| primary-source reports (via AuthorBio) | `/resources/` |

### `/resources/the-cost-of-authority`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| Earned links beat paid links | `/resources/earned-links-vs-paid-links` |
| Why Earned Links Beat Paid Links | `/resources/earned-links-vs-paid-links` |
| Talk to us | `/contact` |
| Talk to us | `/contact` |
| primary-source reports (via AuthorBio) | `/resources/` |

### `/resources/saas-pricing-inflation`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| primary-source reports (via AuthorBio) | `/resources/` |

No outbound links to sibling resource pages from the body.

### `/resources/ai-names-ict-experts/`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| primary-source reports (via AuthorBio) | `/resources/` |

No outbound links to sibling resource pages from the body.

### `/resources/plastic-surgery-patient-age/`

| Anchor text | Destination |
|---|---|
| Daniel Grainger (avatar link) | `/about` |
| Daniel Grainger (name link) | `/about` |
| Jump to dataset (in-page) | `#dataset` |
| Download CSV | `/resources/plastic-surgery-patient-age/data.csv` |
| Download Excel | `/resources/plastic-surgery-patient-age/data.xlsx` |
| View methodology | `/resources/plastic-surgery-patient-age/methodology` |
| CSV | `/resources/plastic-surgery-patient-age/data.csv` |
| Excel | `/resources/plastic-surgery-patient-age/data.xlsx` |
| Methodology | `/resources/plastic-surgery-patient-age/methodology` |
| Open interactive atlas | `/resources/plastic-surgery-patient-age/charts/atlas.html` |
| Atlas | `/resources/plastic-surgery-patient-age/charts/atlas.html` |
| Atlas (further reading) | `/resources/plastic-surgery-patient-age/charts/atlas.html` |
| CSV (further reading) | `/resources/plastic-surgery-patient-age/data.csv` |
| AI Names ICT Experts | `/resources/ai-names-ict-experts/` |
| SaaS Price Comparison 2020–2026 | `/resources/saas-pricing-inflation` |
| The Cost of Authority | `/resources/the-cost-of-authority` |
| primary-source reports (via AuthorBio) | `/resources/` |

### `/resources/plastic-surgery-patient-age/methodology`

| Anchor text | Destination |
|---|---|
| Back to dataset | `/resources/plastic-surgery-patient-age/` |
| Back to dataset | `/resources/plastic-surgery-patient-age/` |

**Trailing-slash inconsistency observed across pages:**

- `/resources/citation-equity/` is referenced with the trailing slash from `/resources/`, `/resources/chatgpt-search-visibility`, and `/resources/chatgpt-search-visibility` (further reading).
- The same destination is referenced **without** the trailing slash from `/resources/press-release-ai-citation-2026` (further reading link to `/resources/citation-equity`).

## 3. Anchor Text Patterns

Aggregate frequency of anchor text across all resource page bodies (sibling and shared-component links included; ordered by count, then alphabetically):

| Anchor text | Count |
|---|---|
| Daniel Grainger | 18 |
| primary-source reports | 8 |
| Talk to us | 7 |
| The Cost of Authority | 3 |
| Why Earned Links Beat Paid Links / Earned Links vs Paid Links / Earned links beat paid links | 3 |
| Citation Equity: The 2026 Guide | 2 |
| Press Release Citation Playbook | 2 |
| ChatGPT Search Visibility | 2 |
| Back to dataset | 2 |
| CSV | 2 |
| Excel | 2 |
| Methodology / View methodology | 2 |
| Atlas / Open interactive atlas | 3 |
| AI Names ICT Experts / AI names ICT experts | 2 |
| Download CSV | 1 |
| Download Excel | 1 |
| Jump to dataset | 1 |
| ChatGPT search visibility | 1 |
| earned links | 2 |
| press releases | 1 |
| press release citation | 1 |
| the cost of authority | 1 |
| The Cost of Authority dataset | 1 |
| our analysis | 1 |
| citation equity | 1 |
| SaaS Price Comparison 2020–2026 | 1 |
| How Brands Get Cited By AI: The 2026 Guide To Citation Equity | 1 |
| What Is ChatGPT Search Visibility? (And How to Track It) | 1 |
| What Makes a Press Release Get Cited by ChatGPT in 2026? | 1 |
| How Old Are Plastic Surgery Patients in the US? | 1 |
| Who AI Names When You Ask for ICT Experts | 1 |
| How Paid Link Prices Rose While Their Value Collapsed | 1 |

**Generic-anchor flags (matching the audit brief: "click here", "read more", "learn more", "this", "here"):**

- None observed across resource page bodies.

**Other observations:**

- Anchor text is generally descriptive and topical. The most repeated body anchor is the author name "Daniel Grainger" (avatar plus name link in every author row, plus a duplicate inside `AuthorBio.astro`).
- "Back to dataset" appears twice on the methodology page with identical text and destination.
- Variant casings exist for related destinations: "earned links" / "Earned links beat paid links" / "Why Earned Links Beat Paid Links" / "Earned Links vs Paid Links" all resolve to `/resources/earned-links-vs-paid-links`. The brief did not request casing flags, so this is reported as observation only.

## 4. Orphan Check

A page is marked an orphan here if no other page links to it from a page body. Inbound references that exist only inside the global `Navbar.astro` or global `Footer.astro` are excluded per the brief.

| Page | Inbound from page bodies (non-nav, non-footer) | Status |
|---|---|---|
| `/` (homepage `src/pages/index.astro`) | None observed | Orphan (only reachable via Navbar / Footer) |
| `/about` | Linked from author rows on every resource page (avatar plus name); also from `AuthorBio.astro` | Not an orphan |
| `/contact` | Linked from PrimaryCTA usages inside page bodies of `citation-equity`, `chatgpt-search-visibility`, `press-release-ai-citation-2026`, `earned-links-vs-paid-links`, and `the-cost-of-authority` (twice) | Not an orphan |
| `/resources/` (resources index) | Linked from `AuthorBio.astro` body ("primary-source reports") rendered inside every resource page | Not an orphan |
| `/resources/citation-equity/` | `/resources/`, `/resources/chatgpt-search-visibility` (×2), `/resources/press-release-ai-citation-2026` (with no trailing slash) | Not an orphan |
| `/resources/chatgpt-search-visibility` | `/resources/`, `/resources/citation-equity/`, `/resources/press-release-ai-citation-2026`, `/resources/earned-links-vs-paid-links`, `/resources/index.astro` (homepage links to it from body) | Not an orphan |
| `/resources/press-release-ai-citation-2026` | `/resources/`, `/resources/citation-equity/`, `/resources/chatgpt-search-visibility`, `/resources/earned-links-vs-paid-links` | Not an orphan |
| `/resources/earned-links-vs-paid-links` | `/resources/`, `/resources/citation-equity/`, `/resources/press-release-ai-citation-2026`, `/resources/the-cost-of-authority` (×2) | Not an orphan |
| `/resources/the-cost-of-authority` | `/resources/`, `/resources/citation-equity/`, `/resources/earned-links-vs-paid-links` (×2), `/resources/press-release-ai-citation-2026`, `/resources/plastic-surgery-patient-age/` | Not an orphan |
| `/resources/saas-pricing-inflation` | `/resources/`, `/resources/plastic-surgery-patient-age/` | Not an orphan |
| `/resources/ai-names-ict-experts/` | `/resources/`, `/resources/citation-equity/`, `/resources/plastic-surgery-patient-age/` | Not an orphan |
| `/resources/plastic-surgery-patient-age/` | `/resources/`, `/resources/plastic-surgery-patient-age/methodology` (×2 back-links) | Not an orphan |
| `/resources/plastic-surgery-patient-age/methodology` | `/resources/plastic-surgery-patient-age/` (×2) | Not an orphan |
| `/library/` | None observed outside the global Footer | Orphan |
| `/library/[slug]` (dynamic) | Inbound only from `/library/` index, which is itself an orphan per this audit's exclusion rule | Functionally reachable only via an orphaned parent |

**Summary of orphans:**

- `/` (homepage) is an orphan if global nav and footer are excluded. Every other route reaches it only through the Navbar logo or Footer link.
- `/library/` is an orphan: its only inbound link sits inside the global Footer.
- `/library/[slug]` entries depend on `/library/` for discovery, so they are reachable from a page body only through that orphaned index.

## 5. Resource Page Inventory

| Slug | H1 |
|---|---|
| `/resources/` | Library |
| `/resources/citation-equity/` | How Brands Get Cited By AI: The 2026 Guide To Citation Equity |
| `/resources/chatgpt-search-visibility` | What Is ChatGPT Search Visibility? (And How to Track It) |
| `/resources/press-release-ai-citation-2026` | What Makes a Press Release Get Cited by ChatGPT in 2026? |
| `/resources/earned-links-vs-paid-links` | Why Earned Links Beat Paid Links |
| `/resources/the-cost-of-authority` | How Paid Link Prices Rose While Their Value Collapsed |
| `/resources/saas-pricing-inflation` | SaaS Price Comparison 2020–2026 |
| `/resources/ai-names-ict-experts/` | Who AI Names When You Ask for ICT Experts |
| `/resources/plastic-surgery-patient-age/` | How Old Are Plastic Surgery Patients in the US? |
| `/resources/plastic-surgery-patient-age/methodology` | The Plastic Surgery Patient Age Dataset: Methodology |
