---
last_updated: 2026-03-15T04:27:00.000Z
---

# Team Wisdom

Reusable patterns and heuristics learned through work. NOT transcripts — each entry is a distilled, actionable insight.

## Patterns

**Pattern:** Never hardcode colors — always use CSS custom properties (`--color-*` tokens). **Context:** Every CSS change, both light and dark mode.

**Pattern:** All images must be WebP with `loading="lazy"` (except above-fold hero). **Context:** Adding any new visual content.

**Pattern:** Inline SVG logo uses per-page unique gradient/clipPath IDs (suffixed `gc-h`, `gc-w`, `gc-l`). **Context:** Adding new pages or copying header markup.

**Pattern:** Every tool mentioned in content must be real, currently available, and free/freemium. **Context:** Writing or editing any content section. Nakia enforces this.

**Pattern:** Primary AI tools featured are Claude, Perplexity, and Microsoft Copilot — not ChatGPT. **Context:** Any content mentioning AI tools.

**Pattern:** PowerShell spec-kit scripts require explicit `-FeatureDescription` parameter (positional binding conflicts with `-Number`). **Context:** Running `create-new-feature.ps1`.

**Pattern:** `prefers-reduced-motion: reduce` must be respected — all animations should instantly complete. **Context:** Adding any CSS animation or JS transition.

**Pattern:** API keys must never appear in client-side code. Use Azure APIM or a serverless proxy. **Context:** Any feature requiring external API calls.
