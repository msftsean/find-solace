# Tasks: Solace Baseline

**Input**: Design documents from `/specs/001-solace-baseline/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish project foundation and validate existing architecture

- [ ] T001 Verify all HTML files parse without errors (index.html, home.html, work.html, labs.html)
- [ ] T002 Verify style.css parses without errors and all custom properties resolve
- [ ] T003 [P] Verify all asset files exist and are referenced correctly in assets/
- [ ] T004 [P] Verify robots.txt contains `Disallow: /`

**Checkpoint**: Project foundation validated — all files present and parseable

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Validate shared infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story validation can proceed until this phase confirms the shared components work

- [ ] T005 Validate sticky header renders on all 4 pages with logo, nav links, theme toggle, and mobile menu button
- [ ] T006 Validate footer renders on all 4 pages with 4 nav links and "Made with care" tagline
- [ ] T007 [P] Validate skip-to-content link exists as first focusable element on every page
- [ ] T008 [P] Validate `aria-current="page"` is set on the correct nav link per page
- [ ] T009 Validate CSS custom properties define complete color, typography, spacing, shadow, and radius tokens in style.css
- [ ] T010 [P] Validate dark mode overrides exist for all color tokens in `[data-theme="dark"]` in style.css
- [ ] T011 Validate responsive breakpoints at 640px, 768px, and 1024px in style.css

**Checkpoint**: Foundation ready — shared header, footer, nav, design tokens, and responsive framework confirmed

---

## Phase 3: User Story 1 — Discover What AI Can Do (Priority: P1) 🎯 MVP

**Goal**: Landing page delivers a clear, jargon-free introduction to AI with navigation to all content areas

**Independent Test**: Load index.html, verify hero, educational section, card grids, and CTAs render correctly and link to correct destinations

### Implementation for User Story 1

- [ ] T012 [US1] Validate hero section in index.html displays heading, subtitle, and 3 CTA buttons (Explore Home Life, Explore Work Life, Try a Lab)
- [ ] T013 [P] [US1] Validate "What is AI, really?" two-column section renders with image and educational text in index.html
- [ ] T014 [P] [US1] Validate Home Life card grid (3 cards: Tax Prep, Budget Management, Vacation Planning) links to correct home.html anchors in index.html
- [ ] T015 [P] [US1] Validate Work Life card grid (3 cards: Career Growth, Inbox & Calendar, Performance Reviews) links to correct work.html anchors in index.html
- [ ] T016 [US1] Validate "Getting started" 3-step section renders in index.html
- [ ] T017 [US1] Validate Splitting.js hero character animation triggers on page load in index.html
- [ ] T018 [P] [US1] Validate Rough Notation underline annotations trigger on scroll in index.html

**Checkpoint**: User Story 1 complete — landing page fully functional as standalone MVP

---

## Phase 4: User Story 2 — Explore AI for Personal Life (Priority: P1)

**Goal**: Home Life page delivers 3 practical AI guides for taxes, budgeting, and vacation planning

**Independent Test**: Load home.html, verify all 3 article sections render with headings, tool callouts, images, and deep-link anchors

### Implementation for User Story 2

- [ ] T019 [US2] Validate page hero with back link and heading in home.html
- [ ] T020 [P] [US2] Validate full-bleed banner image renders in home.html
- [ ] T021 [US2] Validate Tax Preparation article section (#taxes) with tool callouts (TurboTax AI, Perplexity) in home.html
- [ ] T022 [US2] Validate Budget Management article section (#budget) with reversed grid layout in home.html
- [ ] T023 [US2] Validate Vacation Planning article section (#vacation) with tool callouts (Mindtrip, Kayak, Google Gemini) in home.html
- [ ] T024 [P] [US2] Validate pull quotes render with serif italic styling in home.html
- [ ] T025 [P] [US2] Validate section dividers between articles in home.html
- [ ] T026 [US2] Validate cross-promotion CTA to Work Life at bottom of home.html

**Checkpoint**: User Story 2 complete — Home Life guide fully functional

---

## Phase 5: User Story 3 — Explore AI for Professional Life (Priority: P1)

**Goal**: Work Life page delivers 3 practical AI guides for career, inbox/calendar, and performance reviews

**Independent Test**: Load work.html, verify all 3 article sections render with headings, tool callouts, and deep-link anchors

### Implementation for User Story 3

- [ ] T027 [US3] Validate page hero with back link and heading in work.html
- [ ] T028 [P] [US3] Validate full-bleed banner image renders in work.html
- [ ] T029 [US3] Validate Career Development article section (#career) with Claude tool callout in work.html
- [ ] T030 [US3] Validate Inbox & Calendar article section (#inbox) with "7.6 hours saved" stat highlighted in work.html
- [ ] T031 [US3] Validate Performance Reviews article section (#reviews) with Claude tool callout in work.html
- [ ] T032 [P] [US3] Validate Rough Notation annotations on key stats in work.html
- [ ] T033 [US3] Validate cross-promotion CTA to Home Life at bottom of work.html

**Checkpoint**: User Story 3 complete — Work Life guide fully functional

---

## Phase 6: User Story 4 — Try a Hands-On Lab (Priority: P2)

**Goal**: Labs page delivers 6 interactive AI experiments with accordion UI and copy-to-clipboard functionality

**Independent Test**: Load labs.html, click a lab card to expand, copy a prompt, verify clipboard content

### Implementation for User Story 4

- [ ] T034 [US4] Validate "How It Works" 3-step section renders in labs.html
- [ ] T035 [P] [US4] Validate 6 lab cards render across 3 categories (Home Life: 2, Work Life: 2, Everyday: 2) in labs.html
- [ ] T036 [US4] Validate lab card accordion single-open behavior (expanding one collapses others) in labs.html
- [ ] T037 [US4] Validate lab badges display tool name and time estimate on each card in labs.html
- [ ] T038 [US4] Validate copy-to-clipboard buttons copy prompt text and show "Copied!" feedback for 2 seconds in labs.html
- [ ] T039 [P] [US4] Validate all lab prompts use [BRACKETED] placeholders for personalization in labs.html
- [ ] T040 [US4] Validate keyboard support (Enter/Space) on accordion headers in labs.html
- [ ] T041 [US4] Validate CTA section at bottom links to Home Life and Work Life guides in labs.html

**Checkpoint**: User Story 4 complete — Labs page fully interactive

---

## Phase 7: User Story 5 — Toggle Dark Mode (Priority: P3)

**Goal**: Users can switch between light and dark themes, with system preference detection and persistence

**Independent Test**: Click theme toggle, verify color changes across all elements; set system to dark, verify auto-detection

### Implementation for User Story 5

- [ ] T042 [US5] Validate theme toggle button switches `data-theme` attribute on `<html>` element across all pages
- [ ] T043 [US5] Validate system `prefers-color-scheme` detection sets initial theme on first visit
- [ ] T044 [US5] Validate theme preference persists across page navigation via localStorage
- [ ] T045 [P] [US5] Validate all color tokens properly switch between light and dark values in style.css

**Checkpoint**: User Story 5 complete — dark mode functional site-wide

---

## Phase 8: User Story 6 — Navigate on Mobile (Priority: P3)

**Goal**: Mobile users can navigate via hamburger menu, content stacks correctly, touch targets are accessible

**Independent Test**: Resize browser below 768px, verify hamburger menu, content stacking, and touch target sizes

### Implementation for User Story 6

- [ ] T046 [US6] Validate hamburger menu button appears below 768px and toggles nav links with `aria-expanded` on all pages
- [ ] T047 [US6] Validate content stacks to single column below 768px on all pages
- [ ] T048 [P] [US6] Validate card grids collapse from 3-column to 1-column below 768px in index.html
- [ ] T049 [P] [US6] Validate lab cards collapse to single column below 768px in labs.html
- [ ] T050 [US6] Validate sticky header gains shadow class (`site-header--scrolled`) after 50px scroll on all pages
- [ ] T051 [US6] Validate all interactive touch targets are at least 40px on mobile

**Checkpoint**: User Story 6 complete — mobile navigation fully functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Site-wide quality validation

- [ ] T052 [P] Validate all external tool links use target="_blank" with rel="noopener noreferrer"
- [ ] T053 [P] Validate all images have descriptive, context-specific alt text (not generic "image")
- [ ] T054 Validate WCAG AA color contrast compliance in both light and dark modes
- [ ] T055 Validate `prefers-reduced-motion: reduce` disables all animations (character reveal, scroll fade-ins, rough notation)
- [ ] T056 [P] Validate all WebP images use `loading="lazy"` except above-fold hero
- [ ] T057 Validate page load time under 2 seconds on broadband (all 4 pages)
- [ ] T058 [P] Run quickstart.md validation scenarios end-to-end
- [ ] T059 Validate inline SVG logo uses unique gradient/clipPath IDs per page to avoid conflicts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US3 can proceed in parallel (different HTML files)
  - US4 can proceed in parallel with US2/US3 (different HTML file)
  - US5 and US6 can proceed in parallel (different concerns)
- **Polish (Phase 9)**: Depends on all user stories being validated

### User Story Dependencies

- **User Story 1 (P1)**: index.html only — no dependencies on other stories
- **User Story 2 (P1)**: home.html only — no dependencies on other stories
- **User Story 3 (P1)**: work.html only — no dependencies on other stories
- **User Story 4 (P2)**: labs.html only — no dependencies on other stories
- **User Story 5 (P3)**: CSS + JS across all pages — can run after foundational
- **User Story 6 (P3)**: CSS + responsive across all pages — can run after foundational

### Parallel Opportunities

- T003, T004 can run in parallel (different files)
- T007, T008, T010 can run in parallel (different checks)
- T013, T014, T015, T018 can run in parallel within US1
- US1 (index.html), US2 (home.html), US3 (work.html), US4 (labs.html) can all run in parallel since they touch different files
- T052, T053, T056, T058, T059 can run in parallel (independent validations)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — validate all files exist
2. Complete Phase 2: Foundational — confirm shared components
3. Complete Phase 3: User Story 1 — landing page validated
4. **STOP and VALIDATE**: index.html independently functional

### Incremental Delivery

1. Complete Setup + Foundational → Foundation confirmed
2. Validate US1 (index.html) → Landing page ✓
3. Validate US2 (home.html) → Home Life guide ✓
4. Validate US3 (work.html) → Work Life guide ✓
5. Validate US4 (labs.html) → Labs page ✓
6. Validate US5 (dark mode) → Theme support ✓
7. Validate US6 (mobile) → Responsive design ✓
8. Polish → Site-wide quality ✓

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently validatable since each targets a different HTML file
- This is a baseline validation plan — tasks verify existing behavior, not new implementation
- Commit after each phase or logical group
