# Implementation Plan: Solace Agent

**Branch**: `003-solace-agent` | **Date**: 2026-03-15 | **Spec**: `specs/003-solace-agent/spec.md`
**Input**: Feature specification from `/specs/003-solace-agent/spec.md`

## Summary

Add an embedded AI chat widget ("Solace Agent") to all four Solace pages, backed by Azure OpenAI via APIM Consumption tier, proxied through Azure Static Web Apps. The agent provides page-aware Q&A, personalized DIY recommendations, prompt-building help, and progressive skill guidance — all in Solace's warm, jargon-free voice.

**Technical approach**: Browser → SWA API proxy (`/api/chat`) → APIM (Consumption) → Azure OpenAI (GPT-4.1-mini default, GPT-5-mini for complex queries). Streaming via SSE. All frontend code is inline `<script>` blocks + shared `style.css`. No build system.

## Technical Context

**Language/Version**: HTML5, CSS3, Vanilla JavaScript (ES2020+, no transpilation)
**Primary Dependencies**: None (CDN-only: Rough Notation, Splitting.js, Google Fonts, Fontshare)
**Storage**: `sessionStorage` (browser-side conversation state, visitor profile)
**Testing**: Manual smoke tests, Python HTMLParser for parse validation, IDE diagnostics (no test framework)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions), mobile-first
**Project Type**: Static website with serverless API proxy
**Performance Goals**: <2s first response (SC-002), 95%+ page context accuracy (SC-003)
**Constraints**: No npm/bundler/build system, single CSS file, inline JS only, WCAG AA accessibility
**Scale/Scope**: 4 HTML pages, ~6 concurrent visitors expected initially, 20 req/min rate limit per IP

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

> ⚠️ Constitution is still placeholder template. No gates defined yet. Proceeding with project custom instructions as governance source.

**Custom instruction compliance check:**

| Rule | Status | Notes |
|------|--------|-------|
| No build tools | ✅ Pass | Widget uses inline `<script>`, no npm/bundler |
| Single CSS file | ✅ Pass | Widget styles appended to `style.css` |
| Vanilla JS only | ✅ Pass | No frameworks, no external JS files |
| Semantic HTML | ✅ Pass | Widget uses `<dialog>`, `<form>`, ARIA attributes |
| Mobile-first CSS | ✅ Pass | Widget defaults to full-width bottom sheet, enhanced at 768px |
| Dark mode support | ✅ Pass | Widget uses `var(--color-*)` tokens exclusively |
| Accessibility first | ✅ Pass | Keyboard navigation, focus management, live regions, screen reader announcements |
| Progressive enhancement | ✅ Pass | FR-060: site works without JS, no broken widget artifacts |
| CSS custom properties | ✅ Pass | All colors, spacing, typography from existing tokens |
| SVG IDs unique per page | ✅ Pass | Widget uses no SVG IDs (icon is CSS/emoji-based) |

## Project Structure

### Documentation (this feature)

```text
specs/003-solace-agent/
├── plan.md              # This file
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: entity model
├── contracts/
│   └── chat-api.md      # Phase 1: SWA→APIM→OpenAI contract
├── quickstart.md        # Phase 1: developer setup guide
└── tasks.md             # Phase 2: task breakdown (/speckit.tasks)
```

### Source Code (repository root)

```text
find-solace/
├── index.html                    (+ widget HTML + inline agent <script>)
├── home.html                     (+ widget HTML + inline agent <script>)
├── work.html                     (+ widget HTML + inline agent <script>)
├── labs.html                     (+ widget HTML + inline agent <script>)
├── style.css                     (+ widget styles section appended)
├── staticwebapp.config.json      ← NEW: SWA routing + API proxy config
├── robots.txt                    (update: allow indexing for production)
├── .github/
│   └── workflows/
│       └── azure-swa-deploy.yml  ← NEW: SWA deployment workflow
└── assets/                       (unchanged)
```

**Structure Decision**: Flat static site structure preserved. No `src/`, `dist/`, or nested directories. Widget code is distributed across existing HTML files as inline scripts. Single new root-level config file (`staticwebapp.config.json`) for SWA. One new GitHub Actions workflow for deployment.

## Architecture

### Request Flow

```
┌──────────────┐     POST /api/chat      ┌──────────────────────┐
│   Browser    │ ──────────────────────→  │  Azure Static Web    │
│  (inline JS) │                          │  Apps (findsolace.io)│
│              │ ←─────── SSE stream ──── │                      │
└──────────────┘                          └──────────┬───────────┘
                                                     │ Ocp-Apim-Subscription-Key
                                                     │ (injected server-side)
                                                     ▼
                                          ┌──────────────────────┐
                                          │  Azure API Mgmt      │
                                          │  (Consumption tier)   │
                                          │  ┌─────────────────┐  │
                                          │  │ CORS policy     │  │
                                          │  │ Rate limit 20/m │  │
                                          │  │ API key inject  │  │
                                          │  └─────────────────┘  │
                                          └──────────┬───────────┘
                                                     │ api-key header
                                                     ▼
                                          ┌──────────────────────┐
                                          │  Azure OpenAI        │
                                          │  (eastus2)           │
                                          │  ┌────────────────┐  │
                                          │  │ GPT-4.1-mini   │  │
                                          │  │ (default)      │  │
                                          │  ├────────────────┤  │
                                          │  │ GPT-5-mini     │  │
                                          │  │ (complex, P3)  │  │
                                          │  └────────────────┘  │
                                          └──────────────────────┘
```

### Widget Component Architecture (Browser)

```
SolaceWidget (root)
├── Launcher (floating button, bottom-right)
├── ChatPanel (expanded state)
│   ├── PanelHeader (title, minimize/close controls)
│   ├── Transcript (message list, auto-scroll)
│   │   ├── UserMessage (visitor bubbles)
│   │   ├── AssistantMessage (agent bubbles, markdown rendered)
│   │   ├── LoadingIndicator (typing dots)
│   │   └── ErrorMessage (friendly recovery)
│   ├── Composer (textarea + send button)
│   └── Attribution ("Powered by Azure AI")
└── StateManager
    ├── sessionStorage (conversation history, profile)
    ├── PageContext (URL, title, active DIY exercise)
    └── HistoryWindow (last 10 message pairs)
```

All components are vanilla JS classes/functions — no framework, no modules, no imports. The entire widget is self-contained in an inline `<script>` block.

## Implementation Phases

### Phase A — Widget Shell (P1, User Stories 1)

Build the chat launcher and panel UI on all 4 pages. No backend connectivity yet — mock responses to validate layout, dark mode, mobile adaptation, keyboard navigation, and accessibility.

**Files changed**: `style.css`, `index.html`, `home.html`, `work.html`, `labs.html`

**Risk**: 🟡 Modifying all 4 HTML files + shared CSS. Tested visually.

### Phase B — Backend Proxy Chain (P1, User Story 2 prerequisite)

Set up Azure resources and the SWA→APIM→OpenAI proxy chain. Create `staticwebapp.config.json` and GitHub Actions workflow. Validate end-to-end with a curl test.

**Files changed**: `staticwebapp.config.json` (new), `.github/workflows/azure-swa-deploy.yml` (new)
**Azure resources**: SWA instance, APIM Consumption instance, Azure OpenAI deployment (GPT-4.1-mini)

**Risk**: 🔴 Infrastructure setup, API key management, CORS configuration.

### Phase C — Live Chat Integration (P1, User Stories 1-2)

Wire the widget to the real backend. Implement SSE streaming, conversation history in `sessionStorage`, page context detection, markdown rendering, error handling.

**Files changed**: All 4 HTML files (inline `<script>` blocks)

**Risk**: 🟡 Real API calls, streaming parsing, state management.

### Phase D — System Prompt & Agent Behavior (P1-P2, User Stories 2-5)

Write the production system prompt with Solace voice, page grounding, DIY exercise knowledge, approved tool list, ChatGPT exclusion, safety boundaries, and few-shot examples. Implement page context extraction (especially labs.html exercise detection).

**Files changed**: System prompt (in APIM Named Value or request body), all 4 HTML inline scripts (context extraction)

**Risk**: 🟡 Prompt engineering, content accuracy.

### Phase E — Personalization & Prompt Builder (P2, User Stories 3-5)

Add visitor profile capture, DIY recommendation logic, prompt placeholder replacement, and progressive skill-building suggestions — all driven by system prompt instructions and conversation context.

**Files changed**: Inline `<script>` blocks (profile state in sessionStorage), system prompt updates

**Risk**: 🟢 Additive behavior, prompt-driven logic.

### Phase F — Production Deployment (P3, User Story 7)

Migrate from GitHub Pages to Azure Static Web Apps. Configure custom domain `findsolace.io`, SSL, DNS records, GitHub Actions deployment. Update `robots.txt` for public indexing.

**Files changed**: `robots.txt`, `.github/workflows/azure-swa-deploy.yml`, DNS configuration (external)

**Risk**: 🔴 DNS migration, production cutover, potential downtime.

### Phase G — Model Routing (P3, User Story 6)

Add Azure Model Router configuration (Cost mode) to automatically select between GPT-4.1-mini and GPT-5-mini based on query complexity. Update APIM to point to router endpoint.

**Files changed**: APIM configuration (external), no frontend changes

**Risk**: 🟡 APIM policy changes, routing validation.

## Complexity Tracking

> No constitution violations to justify — constitution is placeholder. All changes comply with project custom instructions.
