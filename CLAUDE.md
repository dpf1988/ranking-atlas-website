# Ranking Atlas — Claude Code Instructions

This file is loaded automatically into every Claude Code session for this project. Follow all rules below without being prompted.

---

## Mandatory: Article Header Pattern

Every resource page (essay, guide, data report) **must** use the Article Header Pattern defined in `docs/design-system.md` under "Article / Resource Page Template".

The reference implementation is `src/pages/resources/earned-links-vs-paid-links.astro`.

**The pattern in brief:**
1. `<article class="py-20 md:py-28">` wrapping the header block
2. `<div class="max-w-3xl mx-auto px-6">` — left-aligned, never centred
3. Flat eyebrow — content type label only: `Essay` | `Guide` | `Data Report`
4. H1 — full title
5. Author row — avatar + name + date, left-aligned
6. Hero image slot — `aspect-[16/9]` with onerror fallback, always present
7. Intro paragraphs — `text-body text-lg md:text-xl`
8. ToC / summary box — `bg-white border border-[#0A0F1E]/8 rounded-xl p-6 mb-10 shadow-card`

**Never:**
- Centre the article header (`text-center`, `justify-center` on the header container)
- Add decorative radial glow or noise texture overlays to the article header
- Use the eyebrow to repeat the subtitle — eyebrow is the content type only
- Split the title across eyebrow + H1
- Omit the hero image slot
- Put CTA buttons inside the article header block

This applies to all future resource pages without exception. Do not ask — apply the pattern.

---

## Build Rules

- **Never commit or push** unless the user explicitly asks.
- Always run `npm run build` after writing a resource page to confirm clean compilation.
- Run `npm run dev` to start the local preview server at `http://localhost:4321`.

---

## Vocabulary (from `docs/positioning-core.md`)

- Use: citation equity, earned editorial coverage, authoritative publishers, AI answer engines
- Avoid: digital PR, backlinks, bought links, SEO links, link building

---

## Style (from `docs/writing-style.md`)

- No em dashes in prose. Use commas or full stops.
- No hedging verbs (consider, might, could, perhaps).
- 1–2 sentence paragraphs. Isolated emphasis lines for key points.
- Bucket brigade pivot lines to pull readers forward.
- Start-case capitalisation on all headings (every word capitalised).
- Eyebrow labels: start-case is NOT used — eyebrow labels are Title Case only for the content type word itself.

---

## Design Tokens

Defined in `tailwind.config.js`. Always use token names, not raw hex:
- `text-brand` / `text-brand-dark` — not `text-[#5D4FE0]`
- `text-ink` — not `text-[#0A0F1E]`
- `text-body` — not `text-[#475569]`
- `text-muted` — not `text-[#64748B]`
- `shadow-card` — not inline shadow values

Full reference: `docs/design-system.md`
