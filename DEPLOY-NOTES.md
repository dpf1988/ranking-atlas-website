# Ranking Atlas - full update package (rebrand + fixes)
2026-07-20. Extract over the repo root. `npm run build` verified clean, 36 pages.
Also DELETE from the repo: "loveable code.tsx" (dead Lovable prototype; a zip cannot carry deletions).

## 1. Rebrand (navy + refined amber A')
- Palette: brand navy #1E3A8A unchanged; accent #C08A1F (working amber, light bg only: chart
  highlights, brush marks, callouts); accent-bright #D9A83E (logo mark + dark surfaces only).
  Amber is never a CTA colour. All purple and raw gold removed from src.
- Assets: favicon.svg recoloured; Logo.png regenerated 1042x1008 (Organization schema logo).
- Navbar/Footer mark: purple ring gradient -> amber, gold bars -> display amber, wordmark -> solid white.
- Eyebrow/homepage pills -> bg-accent/10; brush highlight/underline -> working amber at highlighter opacity.
- New tokens: accent, accent-bright, viz-red/-green/-green-deep/-amber, brand-slate.
- Token sweep: ~56 files, arbitrary hex classes -> named tokens (pixel-identical output).
- docs/design-system.md migrated to navy+amber with dated note.

## 2. Contact form (ContactForm.astro)
- _replyto now the submitter's email (was hardcoded to your own address - replies went to yourself).
- email -> type="email", website -> type="url", autocomplete added.
- _gotcha honeypot field added (Formspree drops submissions where bots fill it).
- STILL DO IN FORMSPREE DASHBOARD: enable spam filtering / reCAPTCHA on form xojkolng.

## 3. Security (netlify.toml, misc)
- Headers block added: HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy,
  and CSP in **Report-Only** mode. After deploy, browse the site with devtools open for a few days;
  if no violations, rename Content-Security-Policy-Report-Only to Content-Security-Policy to enforce.
- Chart.js self-hosted at /public/vendor/chart.umd.js (4.4.1); all four cdnjs references replaced.
  Removes the third-party script dependency entirely (better than SRI).
- AuthorBio external link: rel="noopener noreferrer" added.

## 4. Social sharing (Layout.astro + public/og-default.png)
- OG + Twitter card meta on every page, per-page override via new `ogImage` prop on Layout.
- Default 1200x630 branded image at /og-default.png (navy, amber mark, Source Serif wordmark).
- Per-study bespoke OG images can be added later: pass ogImage="/assets/images/og/[slug].png".

## 5. Placeholder image slots stripped
- citation-equity (5), earned-links-vs-paid-links (2), press-release-ai-citation-2026 (1),
  chatgpt-search-visibility (1): the "Drop hero.jpg ... when ready" blocks are gone; pages now
  flow text-only. Dead schema "image" fields pointing at the missing files also removed.
- If you later produce the images, re-add plain <img> figures (no onerror placeholder pattern).

## 6. Redirect chains (public/_redirects)
- /library and /resources/plastic-surgery-patient-age targets fixed to /resources (no trailing
  slash), removing the self-inflicted double-301.

## 7. CLAUDE.md rewrite
- Authorship: single rule - everything authored by Daniel Grainger (Person schema, publisher Org).
  InstitutionalBio retired. Notes that /about must be indexable once launched.
- Site structure: /resources = data studies, /blog = essays/guides (moved 2026-07-19), /data, /case-studies.
- Internal-link rule now targets /blog/citation-equity.
- "Start a Campaign" contradiction fixed to "Book a Call".
- Design tokens section updated with amber usage rule.

## Deploy checklist
1. Extract zip over repo root, delete "loveable code.tsx", git diff to review, commit, push.
2. Formspree: enable spam protection.
3. Test the contact form once live (submit, check reply-to on the notification email).
4. Share the homepage URL in a LinkedIn draft to confirm the OG card renders.
5. securityheaders.com scan; after a clean week, flip CSP to enforcing.
6. Still open (content decisions): /about noindex + thin content; case-studies launch;
   per-study OG images; the ~50 remaining one-off hex tints.
