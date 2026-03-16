# Tasks: Solace Agent

**Input**: Design documents from `/specs/003-solace-agent/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested in the feature specification. Test tasks omitted.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Azure resource provisioning and project configuration

- [ ] T001 Create Azure OpenAI resource and deploy GPT-4.1-mini model (Standard, eastus2) per quickstart.md
- [ ] T002 Create Azure API Management instance (Consumption tier, eastus2) per quickstart.md
- [ ] T003 Create Azure Static Web Apps instance connected to `msftsean/find-solace` repo per quickstart.md
- [ ] T004 [P] Configure APIM Named Value `azure-openai-api-key` with Azure OpenAI API key
- [ ] T005 [P] Configure SWA Application Setting `APIM_SUBSCRIPTION_KEY` with APIM subscription key
- [ ] T006 [P] Create `staticwebapp.config.json` at repo root with `/api/chat` route rewrite to APIM endpoint, navigation fallback, and response overrides per contracts/chat-api.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: APIM policies, widget CSS foundation, and shared widget JavaScript that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Configure APIM inbound policy: CORS restricted to `https://findsolace.io` with dev origins, rate-limit-by-key 20 req/min per IP, Content-Type validation per contracts/chat-api.md
- [ ] T008 Configure APIM backend policy: forward-request to Azure OpenAI chat completions endpoint with `buffer-request-body="false"` for SSE streaming per contracts/chat-api.md
- [ ] T009 Configure APIM outbound policy: SSE header passthrough (`Cache-Control: no-cache`, `Connection: keep-alive`), security headers (`X-Content-Type-Options`, `X-Frame-Options`) per contracts/chat-api.md
- [ ] T010 Configure APIM on-error policy: visitor-safe JSON error responses for 429 (rate limit) and 500 (server error) per contracts/chat-api.md and data-model.md error table
- [ ] T011 Validate APIM proxy end-to-end with curl test: POST to APIM endpoint with test message, verify Azure OpenAI response per quickstart.md
- [ ] T012 Add widget CSS section to `style.css`: launcher button styles (`.solace-launcher`), fixed bottom-right positioning, z-index above site content, hover/focus states, reduced-motion support, using existing `var(--color-*)` tokens
- [ ] T013 [P] Add widget CSS to `style.css`: chat panel styles (`.solace-panel`), max 400px×600px desktop, glassmorphism background matching `.site-header`, border using `var(--color-divider)`, `var(--radius-lg)` corners, `var(--shadow-lg)` elevation
- [ ] T014 [P] Add widget CSS to `style.css`: panel header (`.solace-panel-header`), transcript area (`.solace-transcript`), message bubbles (`.solace-msg--user`, `.solace-msg--assistant`), composer form (`.solace-composer`), attribution footer
- [ ] T015 [P] Add widget CSS to `style.css`: mobile-responsive styles — `@media (max-width: 767px)` full-width bottom sheet, `@media (min-width: 768px)` floating panel, keyboard-visible safe area
- [ ] T016 [P] Add widget CSS to `style.css`: dark mode support via `[data-theme="dark"]` selectors for all widget classes, loading/error/streaming message states, focus-visible outlines
- [ ] T017 Add widget CSS to `style.css`: markdown rendering styles — paragraphs, `<strong>`, `<em>`, `<code>`, `<pre>`, `<a>`, `<ul>/<ol>` inside `.solace-msg--assistant`, inheriting typography tokens

**Checkpoint**: APIM proxy working, widget CSS complete — user story implementation can now begin

---

## Phase 3: User Story 1 — Open the Solace Agent Anywhere (Priority: P1) 🎯 MVP

**Goal**: Chat launcher and panel UI on all 4 pages, with open/close/minimize behavior, keyboard accessibility, and screen reader support. No backend connectivity yet — mock responses only.

**Independent Test**: Load each of the 4 pages, open the widget, type a message, see a mock response, minimize, restore, verify light/dark mode, desktop/mobile layouts, keyboard navigation (Tab/Escape/Enter).

### Implementation for User Story 1

- [ ] T018 [US1] Implement inline `<script>` widget bootstrapper in `index.html`: create launcher button DOM (`<button class="solace-launcher">`) with a warm flame/sun SVG icon matching Solace's golden-hour aesthetic (FR-003 — not a robot or headset icon), panel DOM structure (`<div class="solace-panel" role="dialog" aria-label="Solace Guide">`), panel header with title and minimize/close button, transcript container (`<div class="solace-transcript" aria-live="polite">`), composer form with textarea and send button, "Powered by Azure AI" attribution
- [ ] T019 [P] [US1] Implement inline `<script>` widget bootstrapper in `home.html`: same widget HTML structure as T018 (shared pattern, separate inline block per dev rules)
- [ ] T020 [P] [US1] Implement inline `<script>` widget bootstrapper in `work.html`: same widget HTML structure as T018
- [ ] T021 [P] [US1] Implement inline `<script>` widget bootstrapper in `labs.html`: same widget HTML structure as T018
- [ ] T022 [US1] Implement widget state manager in `index.html` inline script: open/close/minimize toggle, `sessionStorage['solace-chat']` persistence for `ChatSession` entity per data-model.md, `isOpen` state tracking
- [ ] T023 [US1] Implement launcher click handler and panel open/close logic in `index.html` inline script: focus management (move focus to composer on open, return to launcher on close per FR-057), Escape key closes panel, `aria-expanded` on launcher button
- [ ] T024 [US1] Implement message rendering in `index.html` inline script: add user message to transcript on send (Enter key sends, Shift+Enter newlines per FR-011), add mock assistant response with typing indicator, disable send button for empty input (FR-012), auto-scroll transcript (FR-016)
- [ ] T025 [US1] Implement minimal markdown renderer (~60 lines) in `index.html` inline script: parse `**bold**`, `*italic*`, `` `code` ``, `[link](url)`, `- list items`, `\n\n` paragraph breaks, ` ``` ` fenced code blocks per research.md R3 decision. Sanitize output (no raw innerHTML from user input per FR-014)
- [ ] T026 [US1] Implement theme-change listener in `index.html` inline script: observe `data-theme` attribute mutations on `<html>`, update widget styles immediately when theme toggles without resetting conversation (edge case from spec)
- [ ] T027 [US1] Copy finalized widget inline `<script>` from `index.html` to `home.html`, `work.html`, and `labs.html` — verify all 4 pages have identical widget JavaScript (shared code, separate inline blocks per dev rules)
- [ ] T028 [US1] Verify widget accessibility: keyboard-only operation (Tab through launcher → panel → composer → send → close), screen reader announcements for new messages via `aria-live`, focus trap within panel, `role="dialog"` semantics per research.md R5

**Checkpoint**: Widget UI works on all 4 pages with mock responses. Independently testable — no backend required.

---

## Phase 4: User Story 2 — Ask Questions About the Current Page (Priority: P1)

**Goal**: Wire widget to live Azure OpenAI backend via SWA proxy. Implement SSE streaming, conversation history, and page context detection so the agent answers questions about the visitor's current page.

**Independent Test**: Open widget on each page, ask a page-specific question (e.g., "What is this page about?"), verify the response references the correct page/content. Change pages mid-session and confirm context updates.

**Depends on**: Phase 2 (APIM proxy), Phase 3 (widget UI)

### Implementation for User Story 2

- [ ] T029 [US2] Implement SSE streaming client in `index.html` inline script: `fetch('/api/chat', { method: 'POST', ... })` with `response.body.getReader()`, `TextDecoder` for chunk parsing, SSE `data:` line extraction, `[DONE]` sentinel handling, partial line buffering across chunks per research.md R4 and contracts/chat-api.md
- [ ] T030 [US2] Implement `ChatRequest` payload builder in `index.html` inline script: compose `messages` array with system prompt (role: system) + conversation history (last 10 pairs per FR-020/data-model.md), set `stream: true`, `max_tokens: 800`, `temperature: 0.7` per contracts/chat-api.md. Structure request body to allow future addition of an `images` array field for GPT-4o multimodal support (FR-046) without requiring frontend redesign
- [ ] T031 [US2] Write base system prompt constant in `index.html` inline script: Solace Guide personality, approved tools list (Claude, Perplexity, Microsoft Copilot, NotebookLM, ElevenLabs), ChatGPT exclusion scoped to consumer products (FR-031/031a), off-topic redirect with explicit out-of-scope categories (FR-032/032a), uncertainty acknowledgment with training cutoff (FR-033), simplest-level-first explanations (FR-034), few-shot example exchanges (FR-034a), Azure AI identity guidance per content-review.md
- [ ] T032 [US2] Implement page context detection in `index.html` inline script: extract `PageContext` entity (url, title, pageName derived from pathname) per data-model.md, append context block to system prompt on each request (FR-025/FR-026)
- [ ] T033 [US2] Implement labs.html-specific exercise context detection in `labs.html` inline script: detect active `.lab-card` with `aria-expanded="true"`, extract `ExerciseContext` entity (id, title, tool from `.lab-badge--tool`, duration from `.lab-badge--time`) per data-model.md, include in page context block (FR-026)
- [ ] T034 [US2] Implement error handling in `index.html` inline script: handle HTTP 429/500/503/408 per data-model.md error table with visitor-friendly messages, handle network failure mid-stream (preserve partial response, offer retry per edge case from spec), handle `response.ok === false` before starting stream
- [ ] T035 [US2] Implement conversation history persistence in `index.html` inline script: serialize `ChatSession` to `sessionStorage['solace-chat']` after each message, restore on page load (FR-018/FR-019), enforce 10-pair history window for API payloads (FR-020)
- [ ] T036 [US2] Replace mock response logic from US1 with live SSE streaming in `index.html` inline script: streaming token-by-token display with typing indicator during stream, message status transitions (streaming → complete, streaming → error per data-model.md)
- [ ] T037 [US2] Copy updated inline `<script>` from `index.html` to `home.html` and `work.html` — verify page context detection works correctly on each page (different `pageName` values)
- [ ] T038 [US2] Copy updated inline `<script>` to `labs.html` with exercise context additions from T033 — verify exercise detection works when accordion is open/closed

**Checkpoint**: Live chat works on all 4 pages. Agent answers page-specific questions. SSE streaming displays token-by-token. Conversation persists across page navigation within session.

---

## Phase 5: User Story 3 — Get Personalized DIY Recommendations (Priority: P2)

**Goal**: Agent recommends DIY exercises based on visitor's role, goals, and confidence level.

**Independent Test**: Tell the agent "I'm a job seeker" or "I'm a parent who's never used AI" — verify it recommends relevant exercises with explanations.

**Depends on**: Phase 4 (live chat with system prompt)

### Implementation for User Story 3

- [ ] T039 [US3] Extend system prompt in all 4 HTML files with DIY exercise knowledge table: all 6 exercises with IDs, titles, tools, durations, categories, difficulty levels, and "best for" descriptions per data-model.md exercise reference table
- [ ] T040 [US3] Extend system prompt with recommendation instructions: ask about role/goals/confidence if not yet known, match to exercises by category and difficulty, explain fit in plain language, suggest fastest-win beginner exercise (email-drafting, 5 min) for overwhelmed visitors per FR-022/FR-024
- [ ] T041 [US3] Implement `VisitorProfile` capture in inline scripts: parse agent responses for profile signals (role, goals, confidence), store in `sessionStorage` as part of `ChatSession.visitorProfile` per data-model.md, include in subsequent requests for continuity

**Checkpoint**: Agent recommends exercises. Profile persists within session.

---

## Phase 6: User Story 4 — Build a Customized Prompt Through Conversation (Priority: P2)

**Goal**: Agent helps visitors fill in `[BRACKETED]` placeholders in DIY exercise prompts through follow-up questions.

**Independent Test**: Open email-drafting exercise, ask "help me customize this prompt", answer the agent's follow-up questions, verify the final output has no unresolved placeholders.

**Depends on**: Phase 4 (live chat), Phase 5 (exercise context awareness)

### Implementation for User Story 4

- [ ] T042 [US4] Extend system prompt in all 4 HTML files with prompt-building instructions: when visitor asks for help with a DIY prompt, identify the bracketed placeholders, ask for each one conversationally, generate the completed prompt formatted for copy-paste per FR-023
- [ ] T043 [US4] Extend labs.html exercise context detection to include prompt text: when an exercise is expanded, extract the prompt content from `.lab-prompt` elements (`textContent`) and pass as additional context so the agent knows the exact placeholders to fill

**Checkpoint**: Agent walks visitors through prompt customization. Output is copy-paste ready.

---

## Phase 7: User Story 5 — Grow Skills Progressively After Completion (Priority: P2)

**Goal**: Agent suggests next exercises after a visitor completes one, building a progression path.

**Independent Test**: Tell the agent "I finished the email drafting exercise" — verify it recommends a non-duplicative next step.

**Depends on**: Phase 5 (exercise recommendations), Phase 6 (exercise awareness)

### Implementation for User Story 5

- [ ] T044 [US5] Extend system prompt in all 4 HTML files with progressive skill-building instructions: when visitor reports completion, track in `completedExercises` array, recommend next exercise that builds on the completed skill, avoid repeating recommendations, suggest a progression path if visitor asks per FR-024
- [ ] T045 [US5] Extend `VisitorProfile` handling to track `completedExercises` in `sessionStorage`: add exercise ID to `completedExercises` when agent confirms completion, include completed list in system prompt context for non-duplicative recommendations

**Checkpoint**: Agent tracks progress and suggests next steps without repetition.

---

## Phase 8: User Story 7 — Launch on Azure Static Web Apps (Priority: P3)

**Goal**: Migrate from GitHub Pages to Azure Static Web Apps at `findsolace.io` with SSL, DNS, and GitHub Actions deployment.

**Independent Test**: Push to main, verify GitHub Actions deploys to SWA, verify `https://findsolace.io` loads with valid SSL, verify APIM CORS allows the production origin.

**Depends on**: Phase 2 (SWA resource created), all widget work ideally complete

### Implementation for User Story 7

- [ ] T046 [US7] Create `.github/workflows/azure-swa-deploy.yml`: trigger on push to main, use `Azure/static-web-apps-deploy@v1` action, `app_location: "/"`, `skip_app_build: true`, reference `AZURE_STATIC_WEB_APPS_API_TOKEN` secret per research.md R6
- [ ] T047 [P] [US7] Configure custom domain `findsolace.io` on SWA: add TXT record `_dnsauth.findsolace.io`, CNAME `www` → `<app>.azurestaticapps.net`, ALIAS/ANAME for apex domain per research.md R7 and quickstart.md
- [ ] T048 [P] [US7] Update `robots.txt` to allow indexing: change from `Disallow: /` to appropriate `Allow` rules for public site launch
- [ ] T049 [US7] Update APIM CORS policy to use production origin `https://findsolace.io` (remove or restrict dev origins)
- [ ] T049a [P] [US7] Configure redirect from legacy GitHub Pages URL (`msftsean.github.io/find-solace`) to `https://findsolace.io`: either via GitHub Pages custom 404 with meta-refresh, or by updating the GitHub repo settings to point to the new domain (FR-054)
- [ ] T050 [US7] Validate end-to-end: push to main → GitHub Actions deploys → `https://findsolace.io` loads → widget connects to APIM → chat works with streaming response → CORS blocks non-production origins. Also verify: no secrets in shipped code (SC-010), response latency <2s (SC-002)

**Checkpoint**: Site live at findsolace.io with SSL, automated deployment, and working chat agent.

---

## Phase 9: User Story 6 — Route Complex Questions to the Right Model (Priority: P3)

**Goal**: Add Azure Model Router to select between GPT-4.1-mini (fast/cheap) and GPT-5-mini (complex reasoning) based on query complexity.

**Independent Test**: Send simple Q&A and complex multi-step questions — verify the router stays in cost mode and selects the expected model path.

**Depends on**: Phase 8 (production deployment), Phase 4 (live chat)

### Implementation for User Story 6

- [ ] T051 [US6] Deploy GPT-5-mini model to Azure OpenAI (Standard, eastus2) per quickstart.md
- [ ] T052 [US6] Deploy Azure AI Model Router in Cost mode targeting GPT-4.1-mini (default) and GPT-5-mini (complex) per plan.md architecture
- [ ] T053 [US6] Update APIM backend policy to point to Model Router endpoint instead of direct GPT-4.1-mini deployment
- [ ] T054 [US6] Validate model routing: send representative simple and complex prompts, confirm router selects expected model, verify no frontend changes needed (FR-042)

**Checkpoint**: Multi-model routing active. Simple queries stay cheap, complex queries get better reasoning.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T055 [P] Update `solace-copilot-prompt.md` to reflect final architecture decisions (direct OpenAI, SWA proxy, Consumption tier)
- [ ] T056 [P] Update `.github/agents/copilot-instructions.md` with widget code patterns and inline script conventions
- [ ] T057 Run accessibility audit: keyboard navigation across all 4 pages, screen reader testing, focus management, color contrast in both themes
- [ ] T058 Run performance check: measure widget script size, ensure no layout shift on load, verify lazy initialization doesn't block page render
- [ ] T059 [P] Update `specs/003-solace-agent/spec.md` status from "Clarified" to "Implemented" and record final architecture decisions
- [ ] T060 Run quickstart.md validation: follow the quickstart guide end-to-end on a clean setup to verify accuracy

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (Azure resources exist) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 (widget CSS) — can proceed without APIM (uses mocks)
- **US2 (Phase 4)**: Depends on Phase 2 (APIM proxy) + Phase 3 (widget UI)
- **US3 (Phase 5)**: Depends on Phase 4 (live chat with system prompt)
- **US4 (Phase 6)**: Depends on Phase 4 + Phase 5 (exercise context)
- **US5 (Phase 7)**: Depends on Phase 5 + Phase 6 (exercise awareness + profile)
- **US7 (Phase 8)**: Depends on Phase 2 (SWA created) — can proceed in parallel with US3-US5
- **US6 (Phase 9)**: Depends on Phase 4 (live chat) + Phase 8 (production)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Foundational)
            ├── Phase 3 (US1: Widget Shell) ← MVP
            │       └── Phase 4 (US2: Live Chat + Page Context) ← MVP
            │               ├── Phase 5 (US3: Recommendations)
            │               │       └── Phase 6 (US4: Prompt Builder)
            │               │               └── Phase 7 (US5: Progressive Skills)
            │               └── Phase 9 (US6: Model Routing)
            └── Phase 8 (US7: SWA Deployment) ← can parallel with US3-US5
                    └── Phase 10 (Polish)
```

### Within Each User Story

- Models/entities before services
- Core implementation before integration
- index.html first (reference implementation), then copy to other pages
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1**: T004, T005, T006 can run in parallel (different Azure resources)
**Phase 2**: T012-T017 CSS tasks (T013-T016 are parallel — different style sections)
**Phase 3**: T019, T020, T021 can run in parallel after T018 (different HTML files)
**Phase 8**: T047, T048 can run in parallel (DNS + robots.txt are independent)
**Cross-phase**: Phase 8 (US7: deployment) can proceed in parallel with Phases 5-7 (US3-US5)

---

## Parallel Example: User Story 1 (Widget Shell)

```bash
# After T018 (index.html reference implementation), launch in parallel:
Task T019: "Widget bootstrapper in home.html"
Task T020: "Widget bootstrapper in work.html"
Task T021: "Widget bootstrapper in labs.html"
```

## Parallel Example: Foundational CSS

```bash
# After T012 (launcher CSS), launch in parallel:
Task T013: "Chat panel CSS"
Task T014: "Message and composer CSS"
Task T015: "Mobile responsive CSS"
Task T016: "Dark mode and state CSS"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (Azure resources)
2. Complete Phase 2: Foundational (APIM policies + widget CSS)
3. Complete Phase 3: US1 — Widget Shell with mock responses
4. **STOP and VALIDATE**: Test widget UI on all 4 pages, both themes, mobile/desktop
5. Complete Phase 4: US2 — Live Chat with page context
6. **STOP and VALIDATE**: Test live chat, streaming, page-specific answers
7. Deploy/demo if ready — this is the MVP

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. US1 → Widget UI works (mock) → First demo ✨
3. US2 → Live chat works → **MVP ship** 🚀
4. US3 → Personalized recommendations → Enhanced value
5. US4 → Prompt builder → Key differentiator
6. US5 → Progressive skills → Learning companion complete
7. US7 → Production at findsolace.io → Public launch
8. US6 → Model routing → Cost optimization
9. Polish → Documentation, accessibility audit, performance

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **index.html is always the reference implementation** — build there first, then copy to other pages
- Widget JavaScript is duplicated across 4 HTML files (inline script per dev rules) — changes must be synced
- All widget CSS goes in `style.css` in a dedicated `/* --- Chat Widget --- */` section
- No external JS files, no npm, no build step — all verified against dev rules
