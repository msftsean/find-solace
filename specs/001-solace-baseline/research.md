# Research: Solace Baseline

**Branch**: `001-solace-baseline` | **Date**: 2026-03-15

## Hosting & Deployment

**Decision**: GitHub Pages
**Rationale**: Zero-config static hosting directly from the git repo. No server management, free for public repos, supports custom domains. Aligns with the "no build system" philosophy.
**Alternatives considered**: Netlify/Vercel (more features but unnecessary complexity for a static site with no build step), self-hosted (maintenance overhead with no benefit).

## Content Delivery & CDN Dependencies

**Decision**: Continue using external CDNs for fonts and JS libraries
**Rationale**: Google Fonts, Fontshare, Rough Notation, and Splitting.js are all stable, well-maintained CDN resources. The site degrades gracefully if they're unavailable (fallback fonts, no animations).
**Alternatives considered**: Self-hosting all assets (would increase repo size and maintenance burden for fonts; libraries would need manual version tracking).

| Dependency | Version | CDN | Fallback |
|-----------|---------|-----|----------|
| Instrument Serif | Latest | Google Fonts | Georgia, serif |
| Satoshi | 400/500/700 | Fontshare | system sans-serif |
| Rough Notation | 0.5.1 | unpkg | No annotations (decorative only) |
| Splitting.js | 1.0.6 | unpkg | No char animation (text still visible) |

## Browser Support

**Decision**: Last 2 major versions of Chrome, Firefox, Safari, Edge
**Rationale**: Covers 95%+ of the target audience. All CSS features used (`clamp()`, `backdrop-filter`, CSS Grid, custom properties) are fully supported.
**Alternatives considered**: Broader support including Samsung Internet (marginal user base for this audience), IE11 (dead browser, would require removing modern CSS).

## Future Growth Direction

**Decision**: Static now, dynamic features later
**Rationale**: The current architecture supports content growth (new pages, new labs) without changes. When dynamic features are needed (newsletter, search), they can be added incrementally — a newsletter could use a third-party form embed, search could use a client-side index (Lunr.js/Pagefind).
**Implications**: Avoid architectural decisions that would make adding JavaScript modules difficult later. The current inline `<script>` pattern works but may need to evolve to ES modules when dynamic features arrive.

## Performance

**Decision**: Sub-2-second page loads on broadband
**Rationale**: Static HTML + CSS with lazy-loaded WebP images is inherently fast. GitHub Pages provides global CDN. The main bottleneck is external font loading, which is mitigated by fallback fonts.
**Key metrics**: Total page weight should stay under 500KB per page (excluding cached fonts/libraries).
