# find-solace Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-15

## Active Technologies
- HTML5, CSS3, Vanilla JavaScript (ES2020+, no transpilation) + None (CDN-only: Rough Notation, Splitting.js, Google Fonts, Fontshare) (003-solace-agent)
- `sessionStorage` (browser-side conversation state, visitor profile) (003-solace-agent)

- HTML5, CSS3, ES6+ JavaScript (vanilla, no transpilation) + Rough Notation 0.5.1 (CDN), Splitting.js 1.0.6 (CDN), Google Fonts (Instrument Serif), Fontshare (Satoshi) (001-solace-baseline)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

HTML5, CSS3, ES6+ JavaScript (vanilla, no transpilation): Follow standard conventions

## Recent Changes
- 003-solace-agent: Added HTML5, CSS3, Vanilla JavaScript (ES2020+, no transpilation) + None (CDN-only: Rough Notation, Splitting.js, Google Fonts, Fontshare)

- 001-solace-baseline: Added HTML5, CSS3, ES6+ JavaScript (vanilla, no transpilation) + Rough Notation 0.5.1 (CDN), Splitting.js 1.0.6 (CDN), Google Fonts (Instrument Serif), Fontshare (Satoshi)

<!-- MANUAL ADDITIONS START -->

## Squad Team Integration

This project uses a **Squad** team (Wakanda-themed) for structured development:

- **T'Challa** — Lead Architect: specs, plans, architecture, triage
- **Shuri** — Engineer: HTML/CSS/JS implementation, features, fixes
- **Okoye** — QA & Security: testing, accessibility, verification, security review
- **Nakia** — UX & Content: brand voice, copy editing, user experience, documentation
- **M'Baku** — Code Reviewer: adversarial review, pattern enforcement, performance

### Workflow Integration

- **Anvil tasks** route through Squad: Shuri implements → Okoye verifies → M'Baku reviews
- **Spec Kit workflows** route through Squad: T'Challa leads specs/plans, Nakia drives clarification, Shuri implements
- See `.squad/integrations.md` for the full dispatch mapping
- See `.squad/routing.md` for work routing rules

### Key Rules

- Primary AI tools featured in content: **Claude**, **Perplexity**, **Microsoft Copilot** (not ChatGPT)
- No build system — files served as-is (HTML/CSS/JS)
- All styles in single `style.css` using CSS custom properties
- Dark mode support required on all changes
- Mobile-first responsive design
- WCAG AA accessibility compliance

<!-- MANUAL ADDITIONS END -->
