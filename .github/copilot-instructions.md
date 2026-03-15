# Solace — Project Constitution

> "Your guide to the quiet revolution"

## What Is Solace

Solace is a static educational website that helps everyday, non-technical people understand and use AI tools for practical tasks in their personal and professional lives. It is not a product, SaaS, or app — it is a warm, editorial guide.

**Target audience:** Busy adults (25–65) who are open to AI but skeptical of hype. They want time back, reduced anxiety, and concrete results — not theory.

**Created with:** Perplexity Computer

---

## Site Architecture

```
find-solace/
├── index.html           Landing page — "Your Guide to the Quiet Revolution"
├── home.html            Home Life — taxes, budgeting, vacation planning
├── work.html            Work Life — career, inbox/calendar, performance reviews
├── labs.html            Hands-on Labs — 6 copy-paste AI experiments
├── style.css            Single shared stylesheet (~1200 lines)
├── favicon.svg          Brand flame icon (SVG)
├── robots.txt           noindex, nofollow (intentional)
└── assets/
    ├── hero.webp         Landing hero (woman with laptop)
    ├── ai-explain.webp   "What is AI" section image
    ├── home-life.webp    Home page full-bleed banner
    ├── work-life.webp    Work page full-bleed banner
    ├── getting-started.webp  CTA / sidebar image
    └── vacation.webp     Vacation planning sidebar
```

**Navigation:** Sticky header with 4 links (Guide → Home Life → Work Life → Labs), dark mode toggle, mobile hamburger menu. Footer mirrors header navigation.

---

## Tech Stack

- **HTML5** — Semantic, accessible markup. No templating engine.
- **CSS3** — Custom properties, CSS Grid, Flexbox, clamp() fluid typography. Single file.
- **Vanilla JavaScript** — No frameworks. Inline `<script>` blocks at end of `<body>`.
- **CDN dependencies:**
  - Rough Notation 0.5.1 — Animated underline/highlight annotations
  - Splitting.js 1.0.6 — Character splitting for hero text animation (index.html only)
  - Google Fonts — Instrument Serif
  - Fontshare — Satoshi 400/500/700

**There is no build system, no bundler, no package.json, no npm.** Files are served as-is.

---

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-bg` | #FAF8F5 | #1A1714 | Page background |
| `--color-surface` | #F5F0EB | #211E19 | Card/section backgrounds |
| `--color-surface-2` | #FFFDF9 | #2A2520 | Secondary surfaces |
| `--color-text` | #2C2418 | #D9D0C5 | Body text |
| `--color-text-muted` | #8B7E6E | #9E9487 | Secondary text |
| `--color-primary` | #B87333 | #D4956A | Links, buttons, accents |
| `--color-secondary` | #5B7F6E | #7DA28E | Lab badges, green accents |

**Palette character:** Warm browns, burnt oranges, sage greens. No harsh reds, cool blues, or aggressive brights. Warm and calming.

### Typography

| Role | Font | Fallback |
|------|------|----------|
| Headlines (h1–h4) | Instrument Serif | Georgia, serif |
| Body, UI, buttons | Satoshi | BlinkMacSystemFont, Segoe UI, sans-serif |

Fluid type scale using `clamp()`:
- Hero: `clamp(2.75rem, 2rem + 3.75vw, 5.5rem)`
- Body: `clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)`
- Line height: 1.15 headings, 1.65 body
- Prose max-width: `65ch`

### Spacing

Rem-based scale: `--space-1` (0.25rem) through `--space-32` (8rem). Container max: 1200px. Padding: 1.5rem mobile, 2rem desktop.

### Components

- **Cards:** Surface bg, 1px border, `--radius-lg` (12px), hover lifts 2px with shadow
- **Buttons:** Primary (solid) and outline variants, `--radius-md` (8px)
- **Header:** Sticky, glassmorphism (`backdrop-filter: blur(16px)`), adds shadow on scroll
- **Two-column layouts:** CSS Grid, 1-col mobile → 2-col at 768px, reverse variant via `order`
- **Full-bleed images:** `calc(-50vw + 50%)` technique
- **Lab cards:** Accordion with single-open behavior, copy-to-clipboard buttons

### Responsive Breakpoints

- Base: mobile-first
- `640px`: Tablet start
- `768px`: Main breakpoint (nav, grids, two-column layouts)
- `1024px`: 3-column card grids

---

## JavaScript Behaviors

All scripts are inline at end of `<body>`. No external JS files.

| Feature | Pages | Mechanism |
|---------|-------|-----------|
| Theme toggle | All | `data-theme` attribute on `<html>`, system preference detection |
| Mobile menu | All | Toggle `.active` class on `.nav-links`, `aria-expanded` |
| Header scroll shadow | All | IntersectionObserver adds `site-header--scrolled` at 50px |
| Hero text animation | index.html | Splitting.js chars + staggered `animationDelay` (30ms/char) |
| Scroll reveal | All | IntersectionObserver adds `.is-visible` at 10% threshold |
| Rough notation | index, home, work | IntersectionObserver triggers annotate() at 50% threshold |
| Lab accordion | labs.html | Single-open toggle, `aria-expanded` + `hidden` attribute |
| Copy to clipboard | labs.html | `navigator.clipboard.writeText()`, 2s "Copied!" feedback |

All animations respect `prefers-reduced-motion: reduce`.

---

## Accessibility Standards

- **Skip link:** `<a href="#main-content" class="skip-link">Skip to content</a>` on every page
- **Semantic HTML:** `<header role="banner">`, `<nav aria-label>`, `<main>`, `<article>`, `<section aria-labelledby>`, `<footer role="contentinfo">`
- **ARIA attributes:** `aria-expanded`, `aria-controls`, `aria-current="page"`, `aria-label`, `aria-hidden="true"` on decorative elements
- **Keyboard support:** All interactive elements (lab cards, toggles) respond to Enter/Space
- **Color contrast:** WCAG AA compliant in both light and dark modes
- **Focus indicators:** `outline: 2px solid var(--color-primary)` on `:focus-visible`
- **Image alt text:** Descriptive, context-specific (never generic "image")
- **Reduced motion:** All animations instantly complete when `prefers-reduced-motion` is set

---

## Content & Brand Voice

### Tone

| Dimension | Execution |
|-----------|-----------|
| Warm | Conversational, approachable, never condescending |
| Clear | Jargon-free. Plain language. Analogies over definitions |
| Practical | Real tools, real results, real time savings with concrete stats |
| Honest | Acknowledges limitations ("AI can't do everything") |
| Optimistic | Focuses on relief and ease, not anxiety about AI |

### Key Messaging

1. "AI isn't about robots" — Set realistic expectations
2. "It's about making your life a little easier" — Emotional benefit
3. "It's software, like spell-check" — Familiar analogy
4. "Real tools you can use today" — Actionable, not theoretical
5. "You don't need to understand how it works" — Permission to be non-technical

### Content Rules

- Every tool mentioned must be currently available and free/freemium
- Use concrete stats where available (e.g., "7.6 hours saved/week")
- Always mention what AI **can't** do alongside what it can
- Primary AI tools featured: **Claude** and **Perplexity** (not ChatGPT)
- Labs must be completable in 5–20 minutes with zero setup
- Prompts use `[BRACKETED]` placeholders for user personalization

### Pull Quotes

Each article includes a testimonial-style pull quote. These are illustrative, conversational, and emphasize transformation ("I used to… now I…").

---

## Development Rules

1. **No build tools.** Files are served as-is. No npm, no bundler, no preprocessor.
2. **Single CSS file.** All styles in `style.css`. Do not create additional stylesheets.
3. **Vanilla JS only.** No React, Vue, jQuery, or other frameworks. Minimal CDN libs.
4. **Semantic HTML.** Proper heading hierarchy (h1 → h2 → h3), sections, articles, nav.
5. **Mobile-first CSS.** Base styles for mobile; enhance with `min-width` media queries.
6. **Dark mode support.** All new styles must work in both `[data-theme="light"]` and `[data-theme="dark"]`.
7. **Accessibility first.** ARIA attributes, keyboard support, skip links, alt text, contrast compliance.
8. **Progressive enhancement.** Core content must work without JavaScript.
9. **WebP images.** All new images in WebP format with `loading="lazy"` (except above-fold).
10. **CSS custom properties.** Use existing design tokens. Do not hardcode colors, fonts, or spacing.
11. **SVG IDs must be unique per page.** Each page uses suffixed IDs (e.g., `gc-h`, `gc-w`, `gc-l`) to avoid conflicts.
12. **Perplexity Computer attribution** must remain in HTML comments and meta tags.
13. **`robots.txt` stays `Disallow: /`.** The site is intentionally not indexed.

---

## File Conventions

- **HTML files** are standalone pages at the root. No subdirectories for pages.
- **Assets** go in `assets/`. Named descriptively (e.g., `home-life.webp`, not `img1.webp`).
- **No generated files** — everything is hand-authored.
- **Inline SVG** for the logo (with per-page unique gradient/clipPath IDs).
- **Inline `<script>`** blocks at end of `<body>`, not external JS files.

---

## Navigation Pattern

Every page must include:
1. Sticky header with logo, 4 nav links, theme toggle, mobile menu button
2. `aria-current="page"` on the active nav link
3. Skip link as first child of `<body>`
4. Footer with same 4 nav links + "Made with care" tagline
5. Smooth scroll behavior (`scroll-behavior: smooth` on `html`)
