# Internal Linking Audit: ranking-atlas.com

**Generated:** 2026-07-18
**Pages audited:** 33 (excluding `_template.astro`)

---

## 1. Sitewide shared links (Navbar + Footer)

Every page on the site inherits these links via Layout.astro:

### Navbar (4 unique destinations)

| Destination | Context |
|---|---|
| `/` | Logo + "Home" nav link |
| `/resources` | Nav link |
| `/about` | Nav link |
| `/contact` | Nav link + "Start a Campaign" CTA button |

**Notable absence:** `/blog` is not in the Navbar. It only appears in the Footer.

### Footer (9 unique destinations)

| Destination | Context |
|---|---|
| `/` | Logo link |
| `/blog` | Navigation column |
| `/about` | Navigation column |
| `/contact` | Navigation column |
| `/resources` | "All resources" link |
| `/resources/generational-fraud` | Resources column |
| `/resources/ai-names-ict-experts` | Resources column |
| `/resources/citation-equity` | Resources column |
| `/resources/earned-links-vs-paid-links` | Resources column |

### AuthorBio component (appears on 20 pages: 4 essays/guides + 16 blog posts)

| Destination | Context |
|---|---|
| `/about` | Author avatar + name link (x2) |
| `/resources` | "primary-source reports" inline text |

### InstitutionalBio component (appears on 7 Featured Research pages)

No internal page links (mailto only).

---

## 2. Page-by-page link inventory

### Key

- **Body**: Contextual prose links + RelatedResearch items (page-specific, editorially chosen)
- **Structural**: Byline `/about` links, PrimaryCTA `/contact`, SecondaryCTA (templated, not contextual)
- **Shared**: Navbar + Footer (sitewide, same on every page)
- Inbound counts exclude shared nav/footer/byline and count only contextual body links from other pages

---

### Homepage `/`

| Direction | Links |
|---|---|
| **Outbound body** | `/contact` (CTA x2), `/resources` (CTA x2 + "View all research"), `/resources/generational-fraud` (featured card), `/resources/ai-names-ict-experts` (card), `/resources/saas-pricing-inflation` (card) |
| **Inbound body** | `/resources/hs2-property-prices` ("Ranking Atlas"), `/resources/hs2-land-value-capture` ("Ranking Atlas" + "open government data") |
| **Inbound body count** | **3** |

### `/about`

| Direction | Links |
|---|---|
| **Outbound body** | `/contact` (PrimaryCTA x2), `/resources` (SecondaryCTA x2) |
| **Inbound body** | Byline links from 20 pages (structural, not contextual) |
| **Inbound contextual body count** | **0** |

### `/contact`

| Direction | Links |
|---|---|
| **Outbound body** | None (form only) |
| **Inbound body** | PrimaryCTA from ~20 pages (structural); 1 inline CTA from chatgpt-search-visibility |
| **Inbound contextual body count** | **1** |

### `/resources` (index)

| Direction | Links |
|---|---|
| **Outbound body** | All 11 resource pages via listing cards |
| **Inbound body** | Homepage (x3: CTA + "View all research"), About (SecondaryCTA x2), AuthorBio text from 20 pages |
| **Inbound contextual body count** | **5** (homepage + about, excluding AuthorBio structural) |

### `/blog` (index)

| Direction | Links |
|---|---|
| **Outbound body** | All 16 blog posts via listing cards |
| **Inbound body** | None |
| **Inbound contextual body count** | **0** (only reachable via Footer) |

### `/case-studies` (index)

| Direction | Links |
|---|---|
| **Outbound body** | None (stub page) |
| **Inbound body** | None |
| **Inbound shared** | None (not in Navbar or Footer) |
| **Inbound contextual body count** | **0 (true orphan)** |

---

### Resource pages

| Page | Outbound body links | Outbound RelatedResearch | Inbound contextual body count |
|---|---|---|---|
| `/resources/citation-equity` | `/resources/chatgpt-search-visibility`, `/resources/earned-links-vs-paid-links`, `/resources/press-release-ai-citation-2026` (RelatedResearch) | 3 items | **~30** (15 blog posts + 8 resource pages + resources/index + Footer) |
| `/resources/earned-links-vs-paid-links` | `/resources/the-cost-of-authority` (body) | `/resources/the-cost-of-authority`, `/resources/citation-equity`, `/resources/press-release-ai-citation-2026` | **11** |
| `/resources/chatgpt-search-visibility` | `/resources/press-release-ai-citation-2026`, `/resources/citation-equity` (x2) (body) | `/resources/citation-equity`, `/resources/press-release-ai-citation-2026`, `/resources/earned-links-vs-paid-links` | **2** |
| `/resources/generational-fraud` | None (zero body links to other pages) | `/resources/citation-equity`, `/resources/saas-pricing-inflation`, `/resources/ai-names-ict-experts` | **4** |
| `/resources/hs2-property-prices` | `/resources/hs2-land-value-capture` (body), `/` (body x1), `/resources/generational-fraud` (body), `/resources/citation-equity` (body) | `/resources/hs2-land-value-capture`, `/resources/generational-fraud`, `/resources/the-cost-of-authority` | **6** |
| `/resources/hs2-land-value-capture` | `/resources/hs2-property-prices` (body x4), `/` (body x2) | `/resources/hs2-property-prices`, `/resources/generational-fraud`, `/resources/the-cost-of-authority` | **3** |
| `/resources/pet-premium` | None (zero body links to other pages) | **No RelatedResearch component** | **2** |
| `/resources/saas-pricing-inflation` | `/resources/citation-equity` (body) | `/resources/the-cost-of-authority`, `/resources/ai-names-ict-experts`, `/resources/citation-equity` | **5** |
| `/resources/the-cost-of-authority` | `/resources/citation-equity` (body) | `/resources/earned-links-vs-paid-links`, `/resources/saas-pricing-inflation`, `/resources/citation-equity` | **12** |
| `/resources/press-release-ai-citation-2026` | `/resources/citation-equity` (body), `/resources/the-cost-of-authority` (body) | `/resources/citation-equity`, `/resources/earned-links-vs-paid-links`, `/resources/the-cost-of-authority` | **5** |
| `/resources/ai-names-ict-experts` | `/resources/citation-equity` (body) | `/resources/citation-equity`, `/resources/saas-pricing-inflation`, `/resources/the-cost-of-authority` | **3** |

### Blog posts

| Page | Outbound body links (to other blog posts) | Outbound body links (to /resources/) | Inbound from blog posts | Inbound from /resources/ | Inbound from homepage |
|---|---|---|---|---|---|
| `/blog/best-digital-pr-agencies-b2b-saas` | fintech-saas, cybersecurity, data-infrastructure, privacy-consent-saas, series-a-b-c (5) | earned-links, citation-equity (2) | **7** | 0 | 0 |
| `/blog/best-digital-pr-agencies-cybersecurity` | b2b-saas (1) | the-cost-of-authority, citation-equity (2) | **2** | 0 | 0 |
| `/blog/best-digital-pr-agencies-fintech-saas` | b2b-saas (1) | earned-links, the-cost-of-authority, citation-equity (3) | **2** | 0 | 0 |
| `/blog/best-digital-pr-agencies-uk` | how-many-links, measure-brand-visibility, digital-pr-kpis, b2b-saas (4) | citation-equity (1) | **0** | 0 | 0 |
| `/blog/best-pr-agencies-data-infrastructure` | b2b-saas (1) | citation-equity, the-cost-of-authority, ai-names-ict-experts (3) | **1** | 0 | 0 |
| `/blog/best-pr-agencies-privacy-consent-saas` | b2b-saas (1) | pet-premium, citation-equity (2) | **1** | 0 | 0 |
| `/blog/best-pr-agencies-series-a-b-c-saas` | b2b-saas (1) | earned-links, citation-equity (2) | **1** | 0 | 0 |
| `/blog/cybersecurity-ai-citations` | measure-brand-visibility, geo-vs-seo, best-cybersecurity (3) | citation-equity (1) | **0** | 0 | 0 |
| `/blog/digital-pr-kpis` | how-many-links, b2b-saas (2) | citation-equity (1) | **2** | 0 | 0 |
| `/blog/digital-pr-vs-link-building` | haro-alternatives (1) | the-cost-of-authority, citation-equity, earned-links (3) | **2** | 0 | 0 |
| `/blog/fintech-saas-ai-citations` | geo-vs-seo, measure-brand-visibility, best-fintech-saas (3) | citation-equity (1) | **0** | 0 | 0 |
| `/blog/geo-vs-seo` | measure-brand-visibility, digital-pr-vs-link-building (2) | citation-equity (1) | **4** | 0 | 0 |
| `/blog/haro-alternatives` | None (0) | earned-links, citation-equity (2) | **1** | 0 | 0 |
| `/blog/how-many-links-digital-pr-campaign` | digital-pr-vs-link-building (1) | earned-links, citation-equity (2) | **3** | 0 | 0 |
| `/blog/how-to-get-cited-by-chatgpt` | how-many-links, measure-brand-visibility, geo-vs-seo (3) | citation-equity (x2) (1 unique) | **0** | 0 | 0 |
| `/blog/measure-brand-visibility-ai-search` | geo-vs-seo, digital-pr-kpis (2) | citation-equity (1) | **5** | 0 | 0 |

---

## 3. Orphan and near-orphan pages

Pages whose only inbound links come from sitewide nav/footer, with zero contextual body links pointing at them from any other page.

| Page | Inbound body links | Only reachable via |
|---|---|---|
| **`/case-studies`** | 0 | **Nothing** (not in Nav, not in Footer, not linked from any page). True orphan. |
| **`/blog` (index)** | 0 | Footer only |
| **`/blog/best-digital-pr-agencies-uk`** | 0 | blog/index listing only |
| **`/blog/cybersecurity-ai-citations`** | 0 | blog/index listing only |
| **`/blog/fintech-saas-ai-citations`** | 0 | blog/index listing only |
| **`/blog/how-to-get-cited-by-chatgpt`** | 0 | blog/index listing only |
| **`/about`** | 0 contextual (only byline structural links) | Nav + Footer + AuthorBio byline |

---

## 4. Contextual inbound equity winners

Pages ranked by number of contextual body links pointing at them (excluding sitewide nav/footer).

| Rank | Page | Contextual inbound links | Sources |
|---|---|---|---|
| 1 | `/resources/citation-equity` | ~30 | 15 blog posts, 8 resource pages, resources/index, Footer |
| 2 | `/resources/the-cost-of-authority` | 12 | 6 resource pages, 4 blog posts, resources/index |
| 3 | `/resources/earned-links-vs-paid-links` | 11 | 3 resource pages, 6 blog posts, resources/index |
| 4 | `/blog/best-digital-pr-agencies-b2b-saas` | 7 | 7 blog posts (hub post for the listicle cluster) |
| 5 | `/resources/hs2-property-prices` | 6 | hs2-land-value-capture (5 links), resources/index |
| 6 | `/resources/saas-pricing-inflation` | 5 | 3 resource pages, homepage, resources/index |
| 7 | `/blog/measure-brand-visibility-ai-search` | 5 | 5 blog posts |
| 8 | `/resources/press-release-ai-citation-2026` | 5 | 3 resource pages, resources/index |
| 9 | `/resources/generational-fraud` | 4 | 2 resource pages, homepage, resources/index |
| 10 | `/blog/geo-vs-seo` | 4 | 4 blog posts |

---

## 5. Trailing slashes and `.html` suffixes

**None found.** All internal hrefs use clean paths without trailing slashes or file extensions. The site is compliant with the `trailingSlash: "never"` policy.

---

## 6. Broken internal links

| Source page | Broken href | Issue |
|---|---|---|
| `/resources/saas-pricing-inflation` | `/downloads/saas-pricing-inflation-2020-2026.csv` | **File does not exist** in `public/downloads/`. The directory contains: `ai-ict-experts-dataset.csv`, `hs2-land-value-capture.csv`, `hs2-property-prices.csv`, `pet-premium-data.csv`. |

No broken page-to-page links found. All internal hrefs pointing to `/resources/*`, `/blog/*`, `/about`, `/contact`, etc. resolve to existing `.astro` files.

---

## 7. Blog cluster interconnection analysis

### Blog-to-blog link matrix

The 16 blog posts form two loosely connected sub-clusters:

**Cluster A: Agency listicles** (7 posts)
- Hub: `best-digital-pr-agencies-b2b-saas` (links OUT to 5 vertical variants; receives links FROM 7 posts)
- Spokes: cybersecurity, fintech-saas, uk, data-infrastructure, privacy-consent-saas, series-a-b-c
- Pattern: Every spoke links back to the b2b-saas hub. The hub links to all spokes except UK.
- **Weak point:** `best-digital-pr-agencies-uk` links TO the hub and 3 other posts, but receives zero inbound blog links.

**Cluster B: Thought-leadership / how-to posts** (9 posts)
- Most connected: `geo-vs-seo` (4 inbound), `measure-brand-visibility-ai-search` (5 inbound), `how-many-links-digital-pr-campaign` (3 inbound)
- Isolated: `cybersecurity-ai-citations` (0 inbound), `fintech-saas-ai-citations` (0 inbound), `how-to-get-cited-by-chatgpt` (0 inbound)
- `haro-alternatives` is an island: links to no other blog post, receives 1 inbound.

**Cross-cluster links:** The AI-citations posts (`cybersecurity-ai-citations`, `fintech-saas-ai-citations`) bridge the clusters by linking to their respective agency listicle. The UK agency guide links to several Cluster B posts.

### Blog posts receiving zero contextual links from /resources/ or homepage

**All 16 blog posts receive zero contextual body links from any /resources/ page or the homepage.**

The blog section is completely walled off from the resource section. Traffic and equity can flow blog-to-resources (15 of 16 blog posts link to `/resources/citation-equity`), but nothing flows back. The homepage features three resource cards and zero blog content.

### Blog posts with zero inbound contextual links from any source (excluding blog/index listing)

| Blog post | Outbound to blog | Outbound to resources | Total inbound body links |
|---|---|---|---|
| `/blog/best-digital-pr-agencies-uk` | 4 | 1 | **0** |
| `/blog/cybersecurity-ai-citations` | 3 | 1 | **0** |
| `/blog/fintech-saas-ai-citations` | 3 | 1 | **0** |
| `/blog/how-to-get-cited-by-chatgpt` | 3 | 1 | **0** |

These four posts are discoverable only via the `/blog` index page, which itself is only reachable via the Footer.

---

## 8. Structural issues summary

1. **`/blog` missing from Navbar.** The main navigation links to Home, Resources, About, Contact. Blog is only in the Footer. This means the entire 16-post blog section has weaker crawl priority than `/resources`.

2. **Zero resource-to-blog links.** Equity flows one way: blog posts link heavily to resource pages (especially citation-equity), but no resource page links back to any blog post. The blog cluster is an equity dead-end.

3. **Zero homepage-to-blog links.** The homepage features three resource cards but no blog content. The blog section gets no homepage equity.

4. **`/resources/pet-premium` is under-linked.** It has national press backlinks but: zero body links to other pages, no RelatedResearch component, and only 2 contextual inbound links (resources/index card + 1 blog post). It also violates the CLAUDE.md requirement for three contextual internal links per resource page.

5. **`/resources/generational-fraud` has zero body links.** Another Featured Research page with no inline links to other site pages, violating the CLAUDE.md internal linking requirement.

6. **`/case-studies` is a true orphan.** Not in nav, not in footer, not linked from any page. Search engines may never discover it.

7. **`/blog` index has zero contextual inbound.** Only reachable via Footer.

8. **Broken download link** on saas-pricing-inflation page.

---

## 9. Top 10 highest-impact internal links to add

Ranked by the combination of: equity available at the source page, indexing need at the target page, and genuine contextual fit.

### 1. `/resources/citation-equity` → `/blog/how-to-get-cited-by-chatgpt`

**Why it matters:** citation-equity is the site's highest external-equity page. how-to-get-cited-by-chatgpt has zero inbound contextual links and is stuck in "crawled, currently not indexed". The citation equity guide explains the theory of how AI engines select sources to cite; the blog post is the tactical walkthrough for getting ChatGPT specifically to cite a brand. A natural "for the step-by-step on earning ChatGPT citations" link fits anywhere in the guide's practical sections.

### 2. `/resources/citation-equity` → `/blog/measure-brand-visibility-ai-search`

**Why it matters:** Same source equity logic. The citation equity guide discusses what visibility means in AI search; the blog post provides the measurement method and template. A "here is how to measure it" link contextually fits in the guide's sections on tracking citation patterns. The blog post also has zero inbound from resources.

### 3. `/resources/earned-links-vs-paid-links` → `/blog/how-many-links-digital-pr-campaign`

**Why it matters:** The essay argues that earned editorial links beat paid links. The blog post answers the natural follow-up: "how many earned links should a campaign produce?" A "for realistic campaign benchmarks" link fits in the essay's closing argument or "What This Means" section. earned-links-vs-paid-links carries Footer equity + links from 3 resource pages.

### 4. `/resources/the-cost-of-authority` → `/blog/digital-pr-vs-link-building`

**Why it matters:** the-cost-of-authority (12 inbound links, strong equity) analyses the paid-link economy's pricing. digital-pr-vs-link-building already links back to the-cost-of-authority. Completing the two-way link strengthens the topical cluster. A "the practical comparison" or "what this means for buying decisions" link fits naturally in the cost analysis.

### 5. `/resources/press-release-ai-citation-2026` → `/blog/how-to-get-cited-by-chatgpt`

**Why it matters:** The press release guide covers how press releases feed into AI citation chains. The blog post covers the broader question of getting cited by ChatGPT. A "beyond press releases, the full mechanism for earning ChatGPT citations" link fits contextually. Both are Essays & Guides by the same author. Sends equity from a page with 5 inbound links to one with zero.

### 6. `/resources/pet-premium` → add RelatedResearch + body links

**Why it matters:** pet-premium holds national press backlinks but is an internal linking dead-end: zero outbound body links, no RelatedResearch, only 2 inbound. It violates the CLAUDE.md rule requiring three contextual internal links per resource page. Add:
- Body link to `/` ("Ranking Atlas" attribution in intro)
- Body link to `/resources/citation-equity` (methodology credibility context)
- Body link to a topically related resource (e.g. `/resources/generational-fraud` if both use government open data)
- RelatedResearch with `/resources/generational-fraud`, `/resources/hs2-land-value-capture`, `/resources/saas-pricing-inflation` (fellow data reports)

### 7. `/resources/generational-fraud` → add body links

**Why it matters:** generational-fraud receives homepage placement and Footer links, giving it decent crawl priority, but its body contains zero links to any other page. It currently hoards equity without distributing it. Add:
- Body link to `/` ("Ranking Atlas" attribution)
- Body link to `/resources/citation-equity` (methodology context)
- Body link to a sibling data study (e.g. `/resources/ai-names-ict-experts`, since both interrogate a public dataset with counterintuitive findings)

### 8. `/resources/hs2-land-value-capture` → `/resources/pet-premium`

**Why it matters:** Both are UK-focused Featured Research pages built on public/government data. hs2-land-value-capture has national press links. pet-premium has national press links. Neither currently links to the other. A "see also our analysis of the UK rental market" link in the methodology or closing section creates a two-way equity bridge between the two highest-press-equity data studies.

### 9. `/resources/chatgpt-search-visibility` → `/blog/geo-vs-seo`

**Why it matters:** chatgpt-search-visibility explains what ChatGPT search visibility means; geo-vs-seo analyses how GEO compares to traditional SEO. These are companion topics. chatgpt-search-visibility currently has only 2 contextual inbound links, while geo-vs-seo gets zero inbound from resources. A "for the broader GEO versus SEO context" link fits in the "What To Do About It" section.

### 10. Homepage → `/blog` section

**Why it matters:** The homepage currently links to 3 resource cards but zero blog content. The entire 16-post blog section (most of which is "crawled, not indexed") receives zero homepage equity. Adding even a small "Latest from the blog" section with 3 cards (prioritise `how-to-get-cited-by-chatgpt`, `measure-brand-visibility-ai-search`, `geo-vs-seo` as the most topically aligned with the homepage's AI visibility positioning) would create the single largest crawl-priority boost for the blog cluster.

---

## Appendix: complete outbound link list per page

<details>
<summary>Click to expand full link inventory</summary>

### Homepage `/`
- `/contact` (hero CTA)
- `/resources` (hero CTA, "View all research", final CTA)
- `/resources/generational-fraud` (featured card)
- `/resources/ai-names-ict-experts` (card)
- `/resources/saas-pricing-inflation` (card)

### `/about`
- `/contact` (PrimaryCTA x2)
- `/resources` (SecondaryCTA x2)

### `/contact`
- (none)

### `/resources` (index)
- `/resources/pet-premium`, `/resources/hs2-land-value-capture`, `/resources/hs2-property-prices`, `/resources/generational-fraud`, `/resources/the-cost-of-authority`, `/resources/saas-pricing-inflation`, `/resources/ai-names-ict-experts` (Featured Research cards)
- `/resources/citation-equity`, `/resources/chatgpt-search-visibility`, `/resources/press-release-ai-citation-2026`, `/resources/earned-links-vs-paid-links` (Essays & Guides cards)

### `/blog` (index)
- All 16 blog post URLs (listing cards)

### `/case-studies` (index)
- (none, stub)

### `/resources/citation-equity`
- `/contact` (PrimaryCTA)
- RelatedResearch: `/resources/chatgpt-search-visibility`, `/resources/earned-links-vs-paid-links`, `/resources/press-release-ai-citation-2026`

### `/resources/earned-links-vs-paid-links`
- `/resources/the-cost-of-authority` ("our analysis")
- `/contact` (PrimaryCTA)
- RelatedResearch: `/resources/the-cost-of-authority`, `/resources/citation-equity`, `/resources/press-release-ai-citation-2026`

### `/resources/chatgpt-search-visibility`
- `/resources/press-release-ai-citation-2026` ("press release AI citation")
- `/resources/citation-equity` (x2, body prose)
- `/contact` (inline CTA)
- RelatedResearch: `/resources/citation-equity`, `/resources/press-release-ai-citation-2026`, `/resources/earned-links-vs-paid-links`

### `/resources/generational-fraud`
- (zero body links)
- RelatedResearch: `/resources/citation-equity`, `/resources/saas-pricing-inflation`, `/resources/ai-names-ict-experts`

### `/resources/hs2-property-prices`
- `/resources/hs2-land-value-capture` ("companion study")
- `/` ("Ranking Atlas")
- `/resources/generational-fraud` ("counterintuitive findings")
- `/resources/citation-equity` ("primary-source, reproducible data")
- RelatedResearch: `/resources/hs2-land-value-capture`, `/resources/generational-fraud`, `/resources/the-cost-of-authority`

### `/resources/hs2-land-value-capture`
- `/` (x2, "open government data" + "Ranking Atlas")
- `/resources/hs2-property-prices` (x4, multiple body references)
- RelatedResearch: `/resources/hs2-property-prices`, `/resources/generational-fraud`, `/resources/the-cost-of-authority`

### `/resources/pet-premium`
- (zero body links to other pages, no RelatedResearch)

### `/resources/saas-pricing-inflation`
- `/resources/citation-equity` ("citation equity")
- RelatedResearch: `/resources/the-cost-of-authority`, `/resources/ai-names-ict-experts`, `/resources/citation-equity`

### `/resources/the-cost-of-authority`
- `/resources/citation-equity` ("citation equity")
- RelatedResearch: `/resources/earned-links-vs-paid-links`, `/resources/saas-pricing-inflation`, `/resources/citation-equity`

### `/resources/press-release-ai-citation-2026`
- `/resources/citation-equity` ("our citation equity guide")
- `/resources/the-cost-of-authority` ("paid link prices")
- `/contact` (PrimaryCTA)
- RelatedResearch: `/resources/citation-equity`, `/resources/earned-links-vs-paid-links`, `/resources/the-cost-of-authority`

### `/resources/ai-names-ict-experts`
- `/resources/citation-equity` ("citation equity")
- RelatedResearch: `/resources/citation-equity`, `/resources/saas-pricing-inflation`, `/resources/the-cost-of-authority`

### Blog posts (all link to `/contact` via PrimaryCTA, `/about` via byline)

| Post | Blog-to-blog links | Blog-to-resource links |
|---|---|---|
| best-digital-pr-agencies-b2b-saas | fintech-saas, cybersecurity, data-infrastructure, privacy-consent-saas, series-a-b-c | earned-links, citation-equity |
| best-digital-pr-agencies-cybersecurity | b2b-saas | the-cost-of-authority, citation-equity |
| best-digital-pr-agencies-fintech-saas | b2b-saas | earned-links, the-cost-of-authority, citation-equity |
| best-digital-pr-agencies-uk | how-many-links, measure-brand-visibility, digital-pr-kpis, b2b-saas | citation-equity |
| best-pr-agencies-data-infrastructure | b2b-saas | citation-equity, the-cost-of-authority, ai-names-ict-experts |
| best-pr-agencies-privacy-consent-saas | b2b-saas | pet-premium, citation-equity |
| best-pr-agencies-series-a-b-c-saas | b2b-saas | earned-links, citation-equity |
| cybersecurity-ai-citations | measure-brand-visibility, geo-vs-seo, best-cybersecurity | citation-equity |
| digital-pr-kpis | how-many-links, b2b-saas | citation-equity |
| digital-pr-vs-link-building | haro-alternatives | the-cost-of-authority, citation-equity, earned-links |
| fintech-saas-ai-citations | geo-vs-seo, measure-brand-visibility, best-fintech-saas | citation-equity |
| geo-vs-seo | measure-brand-visibility, digital-pr-vs-link-building | citation-equity |
| haro-alternatives | (none) | earned-links, citation-equity |
| how-many-links-digital-pr-campaign | digital-pr-vs-link-building | earned-links, citation-equity |
| how-to-get-cited-by-chatgpt | how-many-links, measure-brand-visibility, geo-vs-seo | citation-equity (x2) |
| measure-brand-visibility-ai-search | geo-vs-seo, digital-pr-kpis | citation-equity |

</details>
