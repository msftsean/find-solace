# Implementation Plan: Solace Agent

**Branch**: `003-solace-agent` | **Updated**: 2026-03-16 | **Spec**: `specs/003-solace-agent/spec.md`
**Input**: Feature specification from `/specs/003-solace-agent/spec.md`

## Summary

Add an embedded AI chat widget ("Solace Agent") to all four Solace pages, backed by Azure OpenAI via APIM Consumption tier, proxied through Azure Static Web Apps with a linked Azure Function. The agent provides page-aware Q&A, personalized DIY recommendations, prompt-building help, and progressive skill guidance — all in Solace's warm, jargon-free voice.

**Technical approach**: Browser → SWA (`/api/chat`) → Managed Azure Function (in `api/` folder) → APIM (Consumption) → Azure OpenAI (GPT-4.1-mini). Streaming via SSE. All frontend code is inline `<script>` blocks + shared `style.css`. No build system.

## Current Status

### ✅ Completed

| Phase | Tasks | Commit | Notes |
|-------|-------|--------|-------|
| Phase 2 — CSS Foundation | T012-T017 | `d1e1a25` | 502 lines of widget CSS |
| Phase 3 — Widget JS Shell | T018-T028 | `86b8794` | DOM creation, state, mock, markdown, a11y |
| Phase 4 — API Integration | T029-T038 | `82b3dfd` | SSE streaming, system prompt, auto-detection |
| Phase 1 — Azure Infrastructure | T001-T006 | (provisioned) | See below |

### ✅ Azure Resources Provisioned

| Resource | Name | Status |
|----------|------|--------|
| Azure OpenAI | `47doors-20260301-resource` | ✅ GPT-4.1-mini deployed |
| APIM (Consumption) | `apim20260308` | ✅ Policy set (key injection, CORS, api-version) |
| APIM Named Value | `openai-api-key` | ✅ Secret stored |
| APIM API Definition | `solace-chat` | ✅ Imported from OpenAI spec |
| Static Web App | `solace-swa` | ✅ Free tier — `nice-plant-08271220f.1.azurestaticapps.net` |
| Storage Account | `solacestorage20260316` | ✅ For Function App |

**Subscription**: `18f577fe-5b74-45cb-99a7-22f2c872fdc4` (Yeyeo tenant) | **RG**: `rg-solace`

**Architecture change**: SWA Free tier doesn't support linked backends. Using **managed Functions** (`api/` folder in repo) instead. The standalone Function App `solace-api-20260316` is superseded.

### 🔲 Remaining Work

| Phase | Tasks | Description | Blocked By |
|-------|-------|-------------|------------|
| **Phase 1b** — Function Code | NEW | Write `/api/chat` Azure Function handler | Nothing |
| **Phase 1c** — SWA Deployment | T046-T050 | Deploy static site to SWA, link Function | Function code |
| **Phase 5** — Recommendations | T039-T041 | Context-aware follow-up suggestions | Nothing |
| **Phase 6** — Prompt Builder | T042-T043 | Interactive prompt templates | Nothing |
| **Phase 7** — Progressive Skills | T044-T045 | Skill tracking across sessions | Nothing |
| **Phase 8** — SWA Deploy + CI/CD | T046-T050 | GitHub Actions, custom domain | Phase 1b, 1c |
| **Phase 9** — Model Routing | T051-T054 | GPT-4.1-mini ↔ GPT-5-mini selection | Phase 8 |
| **Phase 10** — Polish | T055-T060 | Onboarding, analytics, a11y audit | Phase 8 |

## Revised Architecture

### Request Flow (Updated)

```
┌──────────────┐     POST /api/chat      ┌──────────────────────┐
│   Browser    │ ──────────────────────→  │  Azure Static Web    │
│  (inline JS) │                          │  Apps (solace-swa)   │
│              │ ←─────── SSE stream ──── │  Free tier           │
└──────────────┘                          └──────────┬───────────┘
                                                     │ /api/* → managed Function
                                                     ▼
                                          ┌──────────────────────┐
                                          │  Managed Function    │
                                          │  (api/ folder in repo│
                                          │  ┌─────────────────┐ │
                                          │  │ Reads env vars  │ │
                                          │  │ Proxies to APIM │ │
                                          │  │ Streams SSE back│ │
                                          │  └─────────────────┘ │
                                          └──────────┬───────────┘
                                                     │ Ocp-Apim-Subscription-Key
                                                     ▼
                                          ┌──────────────────────┐
                                          │  Azure API Mgmt      │
                                          │  (apim20260308)       │
                                          │  ┌─────────────────┐  │
                                          │  │ CORS policy     │  │
                                          │  │ API key inject  │  │
                                          │  │ api-version     │  │
                                          │  └─────────────────┘  │
                                          └──────────┬───────────┘
                                                     │ api-key header
                                                     ▼
                                          ┌──────────────────────┐
                                          │  Azure OpenAI        │
                                          │  (47doors-20260301)  │
                                          │  ┌────────────────┐  │
                                          │  │ GPT-4.1-mini   │  │
                                          │  └────────────────┘  │
                                          └──────────────────────┘
```

**Key change**: SWA Free tier doesn't support linked backends. Using **managed Functions** (deployed from `api/` folder in repo) instead — no separate Function App needed.

## Priority: Next Implementation Steps

1. **Write Azure Function** (`/api/chat`) — ~50 lines Node.js, reads APIM env vars, proxies POST with streaming passthrough
2. **Deploy Function** — `func azure functionapp publish solace-api-20260316`
3. **Deploy SWA** — push to main or use deployment token
4. **End-to-end test** — call widget on SWA hostname, verify streaming response
5. **Phases 5-7** (frontend features) — can run in parallel with deployment

## Technical Context

**Language/Version**: HTML5, CSS3, Vanilla JavaScript (ES2020+, no transpilation)
**Primary Dependencies**: None (CDN-only: Rough Notation, Splitting.js, Google Fonts, Fontshare)
**Storage**: `sessionStorage` (browser-side conversation state)
**Testing**: Manual smoke tests, Python HTMLParser, Node.js structural checks, IDE diagnostics
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions), mobile-first
**Project Type**: Static website with serverless API proxy
**Constraints**: No npm/bundler/build system, single CSS file, inline JS only, WCAG AA

## Known Issues

1. **No rate limiting** — APIM Consumption SKU doesn't support `rate-limit-by-key`. Consider Azure Function-level throttling or APIM Developer tier upgrade.
2. **Client-side system prompt** — prompt is in browser JS, inspectable via DevTools. Long-term fix: inject via APIM `set-body` policy or in the Azure Function.
3. **PR #1** (`002-ai-chat` → `main`) still open — needs merge for GitHub Pages deployment.
4. **CORS wildcard** — APIM CORS is currently `*`. Should be restricted to SWA hostname after deployment.
