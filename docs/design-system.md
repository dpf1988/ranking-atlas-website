# Ranking Atlas — Design System Reference

This document is the authoritative reference for layout, typography, colour, spacing, and component patterns used across the Ranking Atlas website. Use it when building new pages or components.

---

## Tech Stack

- **Framework:** Astro (static site)
- **Styling:** Tailwind CSS v3 (utility-first)
- **Font:** Inter (Google Fonts) — weights 300–900
- **Icons:** `lucide-astro`
- **Deployment:** Netlify via `git push origin main`

---

## Colour Tokens

Defined in `tailwind.config.js`. Always use token names, not raw hex values.

| Token | Hex | Usage |
|---|---|---|
| `brand` | `#5D4FE0` | Primary purple — CTAs, icons, accents, links |
| `brand-dark` | `#4338CA` | Hover state for brand elements |
| `brand-light` | `#7C3AED` | Gradient mid-stop |
| `ink` | `#0A0F1E` | Headings, primary text on light backgrounds |
| `body` | `#475569` | Body copy on light backgrounds |
| `muted` | `#64748B` | Secondary/supporting text, captions |
| `subtle` | `#94A3B8` | Placeholder text, disabled states |
| `bg-paper` | `#F8F7FA` | Alternate section background (off-white warm) |
| `bg-lavender` | `#F5F3FA` | Light purple tint background |
| `surface` | `#F1F5F9` | Card backgrounds, skeleton loaders |
| `midnight` | `#0A0F1E` | Dark section backgrounds, footer |

**Additional raw values used directly (not tokenised):**
- Body background: `#F5F4EF` (warm off-white, applied to `<body>`)
- `bg-bg-cream` — Tailwind custom class used in resource card grids (maps to `#F5F4EF` area)
- Dark section backgrounds: `bg-[#0A0F1E]` or `style="background: #5D4FE0;"`

---

## Typography

### Font

```
font-family: Inter, ui-sans-serif, system-ui
```

Applied globally via `font-sans` on `<body>`. All text is antialiased (`antialiased`).

### Heading Scale

All headings use `tracking-tight` and start-case capitalisation (every word's first letter capitalised).

| Level | Classes | Context |
|---|---|---|
| H1 — Marketing (homepage) | `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]` | Homepage hero only |
| H1 — Editorial (resource/about pages) | `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1]` | Resource pages, About |
| H2 — Marketing (homepage sections) | `text-4xl md:text-5xl font-extrabold tracking-tight leading-tight` | Homepage section headers |
| H2 — Editorial (resource pages) | `text-3xl md:text-4xl font-bold tracking-tight text-ink leading-tight` | Resource page sections |
| H2 — Prose article | `text-2xl md:text-3xl font-bold tracking-tight text-ink leading-tight mt-10 mb-4` | Long-form essay page |
| H2 — On dark backgrounds | Same size/weight as context, but `text-white` | Purple/dark sections |
| H2 — Final CTA (all pages) | `text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]` | Bottom CTA band |
| H3 — Cards on light bg | `text-lg md:text-xl font-semibold tracking-tight text-ink leading-snug mb-3` | Content/feature cards |
| H3 — Cards on purple bg | `text-base md:text-lg font-semibold tracking-tight text-white leading-snug mb-3` | Purple section cards |
| H3 — Brand accent | `text-lg md:text-xl font-semibold tracking-tight text-[#5D4FE0] leading-snug mb-3` | "What you get" cards |

### Gradient Headings (Homepage)

Several homepage H2s use a purple gradient instead of `text-ink`:

```html
<h2 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 pb-1"
    style="background: linear-gradient(135deg, #5D4FE0 0%, #7C3AED 50%, #4338CA 100%);
           -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
  Heading Text
</h2>
```

Note: `pb-1` is required to prevent descender clipping on the gradient clip.

### Underline Accent (Hero H1 / Final CTA H2)

Animated SVG underline on a key phrase:

```html
<span class="relative inline-block pb-2 pr-1">
  <span style="background: linear-gradient(135deg, #5D4FE0 0%, #7C3AED 50%, #4338CA 100%);
               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
    AI Cites
  </span>
  <svg viewBox="0 0 200 12" preserveAspectRatio="none"
       class="absolute -bottom-1 left-0 w-full h-3 text-[#5D4FE0]" aria-hidden="true">
    <path d="M2 8 Q 50 2, 100 6 T 198 5" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>
</span>
```

On dark backgrounds, use `stroke="white"` instead of `currentColor`.

### Body / Prose Text

| Usage | Classes |
|---|---|
| Hero intro paragraph | `text-body text-lg md:text-xl leading-relaxed max-w-3xl` |
| Section lead paragraph | `text-lg text-[#64748B] max-w-3xl mx-auto` |
| Card body copy | `text-base text-[#475569] leading-relaxed` |
| Small card body (dark bg) | `text-sm text-white/70 leading-relaxed` |
| Article prose | `prose prose-lg text-body max-w-none space-y-6 leading-relaxed` |
| Lead paragraph in report | `text-lg md:text-xl text-[#475569] leading-relaxed mb-8 font-medium max-w-3xl` |
| Caption / metadata | `text-sm text-[#64748B]` |
| Eyebrow label | `text-sm uppercase tracking-wider text-brand font-medium mb-3` |

### Inline Links

```html
<a class="text-[#5D4FE0] hover:text-[#4338CA] underline underline-offset-2 decoration-[#5D4FE0]/30 hover:decoration-[#5D4FE0] transition-colors">
```

Or use the global utility class `.inline-link` (same styles).

---

## Spacing & Layout

### Page Container Widths

| Container | Max-width class | Used for |
|---|---|---|
| Full site wrapper | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Navbar, Footer, homepage sections |
| Wide content | `max-w-6xl mx-auto px-6` | Homepage section content |
| Mixed prose + data | `max-w-5xl mx-auto px-6` | Resource pages with card grids |
| Prose + narrow | `max-w-4xl mx-auto px-6` | Resource page hero, intro sections |
| Prose only | `max-w-3xl mx-auto px-6` | Long-form text, FAQ, article body |

### Section Padding

| Section type | Padding classes |
|---|---|
| **Hero** (first section, clears fixed nav) | `py-20 md:py-28` |
| **Content sections** | `py-16 md:py-24` |
| **Homepage sections** | `py-16 lg:py-24` |
| Footer | `py-16` |

**Critical:** The navbar is `position: fixed`, `h-16 lg:h-20` (64px/80px). The first section on every page must use at minimum `pt-20 md:pt-28` to prevent content hiding behind the nav. `py-20 md:py-28` satisfies this.

### Heading Margins

| Element | Bottom margin |
|---|---|
| H1 on hero sections | `mb-6` |
| H2 on content sections | `mb-5` |
| H2 in article prose | `mt-10 mb-4` |
| H3 in cards | `mb-3` |
| Section intro paragraph | `mb-8` or `mb-10` |
| Section header group to grid | `mb-12` |
| Eyebrow label | `mb-3` |

---

## Backgrounds

### Light Sections
- Primary page background: `bg-[#F5F4EF]` (body default — warm off-white)
- White sections: `bg-white`
- Warm off-white sections: `style="background: #F8F7FA;"` or `bg-bg-cream`
- Surface/card fill: `bg-[#F1F5F9]`

### Dark Sections
- Deep navy: `bg-[#0A0F1E]` — used for footer and About CTA
- Brand purple: `style="background: #5D4FE0;"` — used for homepage "How It Works" and final CTA band

### Background Texture (Dark/Hero Sections)
Subtle noise grain overlay — add to dark sections for depth:
```html
<div class="absolute inset-0 opacity-[0.03] pointer-events-none"
     style="background-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22/></filter><rect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22/></svg>');"></div>
```

### Background Glow (Hero Sections)
Purple radial glow — add to hero sections for atmosphere:
```html
<div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.10] blur-[140px]"
     style="background: radial-gradient(circle, #5D4FE0 0%, transparent 70%);"></div>
```

### Global Grid Overlay
Applied to the entire page via a fixed `z-index: -1` div in `Layout.astro`. Do not add again per-page — it's already there:
```css
background-image: linear-gradient(rgba(93,79,224,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(93,79,224,0.04) 1px, transparent 1px);
background-size: 40px 40px;
```

---

## Shadows

Defined in `tailwind.config.js`:

| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 4px 20px -8px rgba(10,15,30,0.08)` | Default card shadow |
| `shadow-card-hover` | `0 8px 30px -8px rgba(93,79,224,0.2)` | Card hover state |
| `shadow-float` | `0 20px 60px -15px rgba(10,15,30,0.2)` | Floating elements |
| `shadow-cta` | Complex 3-layer | PrimaryCTA button |

Card hover pattern (inline in most places):
```
hover:shadow-[0_8px_30px_-8px_rgba(93,79,224,0.2)]
```

---

## Components

### `Layout.astro`
Wraps every page. Provides: `<head>` with Inter font, meta, org JSON-LD schema; fixed `<Navbar>`; global grid overlay; `<Footer>`. The `<slot>` has no padding — first page section must supply its own top padding.

Props: `title`, `description`

### `Navbar.astro`
- `position: fixed`, `z-50`, `h-16 lg:h-20`
- White background, `border-b border-[#0A0F1E]/10`, `shadow-sm`
- Logo: SVG globe icon + "Ranking Atlas" gradient text
- Desktop nav links: `text-[#0A0F1E]/65 hover:text-[#0A0F1E] text-[0.9375rem] font-medium`
- Desktop CTA button: `bg-[#5D4FE0] hover:bg-[#4338CA] text-white text-sm font-semibold px-5 py-2.5 rounded-lg`
- Mobile: hamburger toggle, slide-down menu

### `Footer.astro`
- `bg-[#0A0F1E]`, `border-t border-white/10`
- 4-column grid: Brand, Navigation, Resources, Contact
- Column headers: `text-white font-semibold text-sm uppercase tracking-widest mb-5`
- Links: `text-sm text-[#64748B] hover:text-[#5D4FE0]`

### `PrimaryCTA.astro`
Default label: "Start a Campaign — $3.5K →"

```html
<a class="inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-4 rounded-lg text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(93,79,224,0.6)]"
   style="background: linear-gradient(180deg, #6B5CE8 0%, #5D4FE0 50%, #4F41D0 100%);
          box-shadow: 0 4px 20px -4px rgba(93,79,224,0.5), 0 1px 2px rgba(93,79,224,0.2), inset 0 1px 0 rgba(255,255,255,0.15);">
```

### `SecondaryCTA.astro`
```html
<a class="inline-flex items-center justify-center gap-2 font-bold px-6 py-3 border-2 border-[#5D4FE0] text-[#5D4FE0] rounded-lg text-base transition-all duration-200 hover:bg-[#5D4FE0]/5">
```

### `Eyebrow.astro`
A pill-style label component. **Only used on homepage** (light and dark variants). Do not use on resource pages — use flat inline `<div>` instead (see below).

- Light variant: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5D4FE0]/10 border border-[#5D4FE0]/15 mb-6`
- Dark variant (`variant="dark"`): `bg-white/10 border-white/20` with white text

### Flat Eyebrow (Resource Pages)
Used on all resource pages instead of `Eyebrow.astro`:
```html
<div class="text-sm uppercase tracking-wider text-brand font-medium mb-3">Label Text</div>
```

---

## Card Patterns

### Standard Feature Card (Light Background)
```html
<div class="bg-white rounded-2xl border border-[#0A0F1E]/8 p-8 shadow-[0_4px_20px_-8px_rgba(10,15,30,0.08)]
            flex flex-col transition-all duration-300
            hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(93,79,224,0.2)] hover:border-[#5D4FE0]/20">
  <div class="w-12 h-12 rounded-xl bg-[#5D4FE0]/10 flex items-center justify-center mb-6">
    <Icon size={22} class="text-[#5D4FE0]" />
  </div>
  <h3 class="text-lg md:text-xl font-semibold tracking-tight text-[#5D4FE0] leading-snug mb-3">Card Title</h3>
  <p class="text-base text-[#475569] leading-relaxed">Card body copy.</p>
</div>
```

### Feature Card (Dark/Purple Background)
```html
<div class="relative bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-left
            transition-all duration-300 hover:bg-white/[0.09] hover:border-white/20 hover:-translate-y-1">
  <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
    <Icon size={22} class="text-white" />
  </div>
  <h3 class="text-base md:text-lg font-semibold tracking-tight text-white leading-snug mb-3">Card Title</h3>
  <p class="text-sm text-white/70 leading-relaxed">Card body copy.</p>
</div>
```

### Resource Index Card (Link Card)
```html
<a href="/resources/slug" class="group bg-white rounded-2xl shadow-card p-8 hover:shadow-lg transition-shadow block">
  <div class="text-xs uppercase tracking-wider text-brand font-medium mb-3">Guide</div>
  <h2 class="text-xl md:text-2xl font-bold tracking-tight text-ink mb-4 leading-snug group-hover:text-[#5D4FE0] transition-colors">
    Resource Title
  </h2>
  <p class="text-body leading-relaxed mb-4">Description copy.</p>
  <div class="text-sm text-brand font-medium group-hover:underline">Read the guide →</div>
</a>
```

---

## Page Templates

### Homepage (`index.astro`)
Sections in order:
1. **Hero** — 2-col grid, left: text + pills + CTAs, right: browser mockup card. `py-20 md:py-28` (first section).
2. **Publisher Strip** — White bar, `py-8`, animated marquee of publisher name pills.
3. **What AI Systems Trust** — White bg, `py-16 lg:py-24`, 3-col card grid.
4. **How It Works** — Purple bg (`#5D4FE0`), `py-16 lg:py-24`, 4-col card grid.
5. **Placements** — `#F8F7FA` bg, `py-16 lg:py-24`, 3-col placement preview cards.
6. **Compound** — White bg, `py-16 lg:py-24`, 3-col stat+copy cards.
7. **FAQ** — `<FAQ />` component.
8. **Final CTA** — Purple bg, `py-16 lg:py-24`, centred H2 + CTA button.

### Article / Resource Page Template

**All resource pages** (essays, guides, data reports) use this header pattern. This is mandatory branding — do not deviate.

The reference implementation is `earned-links-vs-paid-links.astro`.

#### Article Header Block (mandatory)

```html
<article class="py-20 md:py-28">
  <div class="max-w-3xl mx-auto px-6">

    <!-- 1. Flat eyebrow — content type label only, never a subtitle -->
    <div class="text-sm uppercase tracking-wider text-brand font-medium mb-3">Essay</div>
    <!-- Valid labels: Essay | Guide | Data Report -->

    <!-- 2. H1 — full title, left-aligned, never centred -->
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1] mb-6">
      Full Article Title Here
    </h1>

    <!-- 3. Author row — left-aligned, never centred -->
    <div class="flex items-center gap-3 mb-6">
      <a href="/about" class="shrink-0">
        <img src="/assets/images/author/daniel-headshot.jpg" alt="Daniel Grainger"
             class="w-12 h-12 rounded-full object-cover" width="48" height="48" />
      </a>
      <div>
        <p class="text-sm font-medium text-ink">By <a href="/about" class="text-brand hover:text-brand-dark transition-colors">Daniel Grainger</a>, founder of Ranking Atlas</p>
        <p class="text-sm text-[#64748B]">Published [Month Year] &nbsp;·&nbsp; [optional stat/context]</p>
      </div>
    </div>

    <!-- 4. Hero image slot — always present, even if image not yet available -->
    <div class="relative w-full rounded-2xl overflow-hidden bg-surface border border-[#0A0F1E]/8 shadow-card mb-10 aspect-[16/9] flex items-center justify-center">
      <img
        src="/assets/images/resources/[slug]/hero.jpg"
        alt="[Article title]"
        class="w-full h-full object-cover"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      />
      <div class="hidden flex-col items-center justify-center text-muted p-8 text-center">
        <div class="text-sm uppercase tracking-wider text-brand font-medium mb-3">Hero Image Slot</div>
        <div class="text-sm">Drop hero.jpg into /public/assets/images/resources/[slug]/ when ready.</div>
      </div>
    </div>

    <!-- 5. Intro paragraphs -->
    <p class="text-body text-lg md:text-xl leading-relaxed max-w-3xl mb-4">...</p>

    <!-- 6. ToC / summary box -->
    <div class="bg-white border border-[#0A0F1E]/8 rounded-xl p-6 mb-10 shadow-card">
      <p class="text-sm font-semibold text-ink mb-3">In this [essay/guide/report], you'll [learn/see]:</p>
      <ul class="space-y-2 text-sm text-[#475569] mb-4 list-disc pl-5">
        <li>...</li>
      </ul>
      <p class="text-sm text-[#64748B] italic">Transition sentence into body.</p>
    </div>

  </div>
  <!-- Body content follows — max-w-3xl for prose, max-w-5xl for data sections -->
</article>
```

**Rules:**
- Left-aligned throughout. Never `text-center` in the article header.
- No decorative radial glow or noise texture overlays on the article header.
- Eyebrow label = content type ("Essay", "Guide", "Data Report") — never a subtitle.
- H1 = full title. Never split the title across H1 and eyebrow.
- Hero image slot is always present. Use the onerror fallback until an image exists.
- No CTA buttons inside the article header. CTAs belong in the final CTA band only.

#### Content Sections (after article header)
- `py-16 md:py-24`, alternating `bg-white` / `style="background: #F8F7FA;"` backgrounds
- Prose sections: `max-w-3xl mx-auto px-6`
- Data sections (tables, charts, card grids): `max-w-5xl mx-auto px-6`

#### Final CTA Band
- `bg-[#0A0F1E]`, centred, H2 + `<PrimaryCTA />`
- Followed by `<AuthorBio />`

### About Page
- Single content section: `pt-28 lg:pt-36 pb-24 lg:pb-32`, `max-w-3xl mx-auto`
- "Our Story" eyebrow (flat inline div)
- Body paragraphs: `text-lg leading-relaxed text-[#64748B] space-y-6`
- Bottom CTA section: `bg-[#0A0F1E] py-24 lg:py-32`, centred

---

## Grids

| Layout | Classes |
|---|---|
| 2-col (hero) | `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center` |
| 3-col cards | `grid grid-cols-1 md:grid-cols-3 gap-6` |
| 4-col cards | `grid grid-cols-1 md:grid-cols-4 gap-6` |
| 2-col resource cards | `grid md:grid-cols-2 gap-8` |
| 2-col + 1 full-width | First two cards `md:col-span-1`, third `md:col-span-2` |
| Footer | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12` |

---

## Animations

### Marquee (Publisher Strip)
```css
.animate-marquee-slow { animation: marquee-slow 50s linear infinite; }
.animate-marquee-slow:hover { animation-play-state: paused; }
@keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
```
Requires duplicating the list items for a seamless loop. Fade edges with:
```html
<div class="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
<div class="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
```

### Card Hover
```
transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(93,79,224,0.2)] hover:border-[#5D4FE0]/20
```

### CTA Button Hover
```
transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(93,79,224,0.6)]
```

---

## Capitalisation

All heading text uses **start-case**: every word's first letter capitalised, including articles and prepositions.

Examples:
- "Be The Brand AI Cites"
- "Why One Compounds And The Other Decays"
- "What This Means For B2B SaaS Marketing Teams"
- "The Cost Of Authority"

---

## Stat / Display Numbers

Large stat numbers (data report sections) use:
```
text-4xl md:text-5xl font-black tracking-tight text-ink
```
`font-black` (900) is reserved for display stat numbers only — not headings.

---

## Borders

| Usage | Class |
|---|---|
| Card borders (light bg) | `border border-[#0A0F1E]/8` |
| Card borders (dark/purple bg) | `border border-white/10` |
| Navbar bottom | `border-b border-[#0A0F1E]/10` |
| Footer top | `border-t border-white/10` |
| Publisher pills | `border border-[#0A0F1E]/10` |
| Secondary CTA button | `border-2 border-[#5D4FE0]` |

---

## Icon Usage

From `lucide-astro`. Standard sizes in cards: `size={22}`. In inline text/pills: `size={16}`.

Icon container in light cards:
```html
<div class="w-12 h-12 rounded-xl bg-[#5D4FE0]/10 flex items-center justify-center mb-6">
  <Icon size={22} class="text-[#5D4FE0]" />
</div>
```

Icon container in dark/purple cards:
```html
<div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
  <Icon size={22} class="text-white" />
</div>
```
