# Feature Specification: Solace — Baseline Site Specification

**Feature Branch**: `001-solace-baseline`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: Baseline specification for the Solace static educational website documenting current site architecture, content structure, design system, and user experience

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover What AI Can Do (Priority: P1)

A busy adult (25–65) who is curious but skeptical about AI lands on the Solace guide. They want to quickly understand what AI actually is, see concrete examples of how it helps with everyday tasks, and decide whether to explore further. The landing page gives them a jargon-free introduction, shows real use cases organized by Home Life and Work Life, and provides clear next steps.

**Why this priority**: This is the primary entry point. If users don't understand AI's value within 30 seconds, they leave. Everything else depends on this first impression landing well.

**Independent Test**: Can be fully tested by loading index.html in a browser and verifying the hero, educational section, card grids, and CTAs render correctly and link to the right destinations.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on index.html, **When** the page loads, **Then** the hero displays "Your guide to the quiet revolution" with three CTA buttons (Explore Home Life, Explore Work Life, Try a Lab)
2. **Given** a visitor scrolling the landing page, **When** they reach the "What is AI, really?" section, **Then** they see a plain-language explanation with a supporting image in a two-column layout
3. **Given** a visitor viewing the card grids, **When** they see the Home Life cards, **Then** three cards are shown (Tax Prep, Budget Management, Vacation Planning) linking to home.html with correct anchors
4. **Given** a visitor viewing the card grids, **When** they see the Work Life cards, **Then** three cards are shown (Career Growth, Inbox & Calendar, Performance Reviews) linking to work.html with correct anchors

---

### User Story 2 - Explore AI for Personal Life (Priority: P1)

A visitor navigates to the Home Life page to learn how AI can help with taxes, budgeting, and vacation planning. Each topic is presented as a standalone article with specific tool recommendations, practical examples, and a conversational pull quote that makes it relatable.

**Why this priority**: Home Life content is one of two core content pillars. Without it, the site delivers no practical value.

**Independent Test**: Can be fully tested by loading home.html and verifying all three article sections render with correct headings, tool callouts, images, and deep-link anchors (#taxes, #budget, #vacation).

**Acceptance Scenarios**:

1. **Given** a visitor on home.html, **When** they scroll to the Tax Preparation section, **Then** they see tool recommendations (TurboTax AI, Perplexity) in styled callout boxes with external links
2. **Given** a visitor on home.html, **When** they navigate to #budget, **Then** the page scrolls to the Budget Management article with a reversed grid layout (image left, text right)
3. **Given** a visitor finishing the Home Life content, **When** they reach the bottom, **Then** a cross-promotion CTA suggests exploring the Work Life guide

---

### User Story 3 - Explore AI for Professional Life (Priority: P1)

A visitor navigates to the Work Life page to learn how AI can help with career development, inbox/calendar management, and performance reviews. The structure mirrors Home Life for consistency.

**Why this priority**: Work Life is the second core content pillar. The career and productivity topics are the highest-impact use cases for the target audience.

**Independent Test**: Can be fully tested by loading work.html and verifying all three article sections render with correct headings, tool callouts, and deep-link anchors (#career, #inbox, #reviews).

**Acceptance Scenarios**:

1. **Given** a visitor on work.html, **When** they read the Inbox & Calendar section, **Then** they see the stat "7.6 hours saved per week" highlighted with an animated underline
2. **Given** a visitor on work.html, **When** they click "Explore home life" in the cross-promotion section, **Then** they are taken to home.html

---

### User Story 4 - Try a Hands-On Lab (Priority: P2)

A visitor goes to the Labs page to try a practical AI experiment. They pick a lab, copy a pre-written prompt (with bracketed placeholders for personalization), paste it into the recommended free AI tool, and see results in 5–20 minutes with zero setup.

**Why this priority**: Labs are the conversion mechanism — they turn passive readers into active AI users. Critical for engagement, but depends on the educational content (P1) for context.

**Independent Test**: Can be fully tested by loading labs.html, clicking a lab card to expand it, copying a prompt via the copy button, and verifying the clipboard contains the correct prompt text.

**Acceptance Scenarios**:

1. **Given** a visitor on labs.html, **When** they click a lab card header, **Then** the card body expands (accordion-style) and all other open cards collapse
2. **Given** a visitor viewing an expanded lab, **When** they click the "Copy" button next to a prompt, **Then** the prompt text is copied to clipboard and the button shows "Copied!" for 2 seconds
3. **Given** a visitor on labs.html, **When** they view the lab cards, **Then** each card shows tool badges (e.g., "Perplexity", "Claude") and time estimates (e.g., "10 min")
4. **Given** a visitor who prefers keyboard navigation, **When** they press Enter or Space on a lab card header, **Then** the accordion toggles open/closed

---

### User Story 5 - Toggle Dark Mode (Priority: P3)

A visitor prefers dark mode (or is browsing at night). They click the theme toggle in the header to switch between light and dark modes. The site also respects their system preference on first visit.

**Why this priority**: Dark mode is a comfort/accessibility feature. Important for user experience but not essential for content delivery.

**Independent Test**: Can be fully tested by clicking the theme toggle button and verifying colors change across all page elements, or by setting system preference to dark and loading any page.

**Acceptance Scenarios**:

1. **Given** a visitor with system dark mode enabled, **When** they first load any page, **Then** the site renders in dark mode automatically
2. **Given** a visitor on any page, **When** they click the theme toggle, **Then** all colors switch to the alternate theme and the toggle icon updates
3. **Given** a visitor who toggled to dark mode, **When** they navigate to a different page, **Then** dark mode persists

---

### User Story 6 - Navigate on Mobile (Priority: P3)

A visitor on a phone or small tablet uses the hamburger menu to navigate between pages. The sticky header remains accessible as they scroll. All content is readable and interactive elements are touch-friendly.

**Why this priority**: Mobile accessibility is essential for the target audience but the site already works mobile-first by design.

**Independent Test**: Can be tested by resizing the browser below 768px and verifying the hamburger menu works, content stacks vertically, and touch targets are at least 40px.

**Acceptance Scenarios**:

1. **Given** a visitor on a screen narrower than 768px, **When** they click the hamburger menu, **Then** the nav links expand into a visible menu with `aria-expanded="true"`
2. **Given** a mobile visitor scrolling, **When** they scroll past 50px, **Then** the sticky header gains a shadow for visual separation
3. **Given** a mobile visitor on labs.html, **When** they interact with lab cards, **Then** the accordion and copy buttons work correctly with touch input

---

### Edge Cases

- What happens when JavaScript is disabled? Core content (text, images, navigation links) remains accessible; animations and interactive features (accordion, copy-to-clipboard, dark mode toggle) degrade gracefully
- What happens when a visitor has `prefers-reduced-motion` enabled? All animations complete instantly — no character reveal, no scroll fade-ins, no rough-notation animations
- What happens when the clipboard API is unavailable? The copy button should fail silently without crashing the page
- What happens when external CDN resources (fonts, Rough Notation, Splitting.js) fail to load? Content remains readable with fallback system fonts; animations simply don't run
- What happens when a visitor deep-links to a section anchor (e.g., home.html#budget) that doesn't exist? The page loads at the top without error

## Requirements *(mandatory)*

### Functional Requirements

**Navigation & Layout**
- **FR-001**: Site MUST provide a sticky header with logo, four navigation links (Guide, Home Life, Work Life, Labs), a dark mode toggle, and a mobile hamburger menu on every page
- **FR-002**: Site MUST include a skip-to-content link as the first focusable element on every page
- **FR-003**: Site MUST indicate the current page in navigation using `aria-current="page"`
- **FR-004**: Site MUST provide a footer on every page with the same four navigation links and a "Made with care" tagline

**Content Pages**
- **FR-005**: Landing page (index.html) MUST present an educational introduction to AI, card grids for Home Life and Work Life topics, and a getting-started section
- **FR-006**: Home Life page (home.html) MUST contain three article sections: Tax Preparation, Budget Management, and Vacation Planning — each with tool recommendations and deep-link anchors
- **FR-007**: Work Life page (work.html) MUST contain three article sections: Career Development, Inbox & Calendar Management, and Performance Reviews — each with tool recommendations and deep-link anchors
- **FR-008**: Labs page (labs.html) MUST present six hands-on labs organized into three categories (Home Life, Work Life, Everyday) with accordion expand/collapse behavior

**Interactivity**
- **FR-009**: Lab cards MUST implement single-open accordion behavior where expanding one card collapses all others
- **FR-010**: Each lab prompt MUST have a copy-to-clipboard button that provides 2-second "Copied!" visual feedback
- **FR-011**: Site MUST support dark mode toggle that persists across page navigation and respects system `prefers-color-scheme` preference on first visit
- **FR-012**: All interactive elements MUST be operable via keyboard (Enter/Space for buttons and accordion headers)

**Accessibility**
- **FR-013**: Site MUST use semantic HTML elements (`header`, `nav`, `main`, `article`, `section`, `footer`) with appropriate ARIA attributes
- **FR-014**: All images MUST have descriptive, context-specific alt text
- **FR-015**: Site MUST meet WCAG AA color contrast requirements in both light and dark modes
- **FR-016**: All animations MUST respect `prefers-reduced-motion: reduce` by completing instantly

**Design System**
- **FR-017**: Site MUST use a warm color palette (copper primary, sage green secondary, warm neutrals) consistent across all pages
- **FR-018**: Site MUST use fluid typography via `clamp()` scaling from mobile to desktop viewports
- **FR-019**: Site MUST be fully responsive with breakpoints at 640px, 768px, and 1024px

**Content Standards**
- **FR-020**: Every AI tool mentioned MUST be currently available and free or freemium
- **FR-021**: The primary AI tools featured MUST be Claude and Perplexity
- **FR-022**: Lab prompts MUST use `[BRACKETED]` placeholders for user personalization
- **FR-023**: Site MUST remain non-indexed (`robots.txt` set to `Disallow: /`)

### Key Entities

- **Page**: A standalone HTML document (index, home, work, labs) with shared header/footer navigation and consistent design system
- **Article Section**: A topic-focused content block within Home Life or Work Life pages, containing tool recommendations, educational text, pull quotes, and a deep-link anchor
- **Lab**: An interactive accordion card containing a title, tool badge, time estimate, one or more steps with copyable prompts, and an explanatory "why this works" section
- **Tool Callout**: A highlighted recommendation box featuring a specific AI tool name and description of its capability
- **Design Token**: A CSS custom property defining a reusable value (color, spacing, typography, shadow, radius) that ensures visual consistency site-wide

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four pages load and render correctly in modern browsers (Chrome, Firefox, Safari, Edge) with no layout errors or broken elements
- **SC-002**: Site achieves WCAG AA compliance for color contrast in both light and dark modes
- **SC-003**: All six lab copy-to-clipboard buttons successfully copy prompt text and display confirmation feedback
- **SC-004**: Navigation between all pages works correctly, including deep-link anchors to all nine article sections
- **SC-005**: Mobile layout renders correctly at 320px viewport width with all content accessible and touch targets at least 40px
- **SC-006**: Dark mode toggle switches themes on all pages and the preference persists across navigation
- **SC-007**: Site renders readable content with fallback fonts when external CDN resources are unavailable
- **SC-008**: All animations respect `prefers-reduced-motion` and complete instantly when the preference is set
- **SC-009**: All pages load in under 2 seconds on a broadband connection when served from GitHub Pages

## Clarifications

### Session 2026-03-15

- Q: Where is the site hosted/deployed? → A: GitHub Pages (static hosting from repo)
- Q: Who maintains content and how are updates published? → A: Solo maintainer, direct edits + push to main
- Q: Should the spec define a page load time target? → A: Pages load in under 2 seconds on broadband
- Q: What is the planned growth direction? → A: Static for now, eventually add dynamic features (newsletter, search, etc.)
- Q: What is the browser support minimum? → A: Last 2 major versions of Chrome, Firefox, Safari, and Edge

## Assumptions

- The site is hosted on **GitHub Pages** and served as static files with no build system, bundler, or server-side processing
- Content is maintained by a **solo maintainer** who edits files directly and pushes to main
- External CDN dependencies (Google Fonts, Fontshare, Rough Notation, Splitting.js) will remain available at their current URLs
- The site targets the **last 2 major versions** of Chrome, Firefox, Safari, and Edge; IE11 and legacy browser support is not required
- The site is intentionally not indexed by search engines and has no SEO requirements
- There is no user authentication, data persistence, or server-side functionality
- All content is hand-authored; there is no CMS or content generation pipeline
- The site is **static for now** but may eventually add dynamic features (newsletter signup, search, etc.) — the architecture should not preclude this growth
- Pages MUST load in **under 2 seconds** on broadband connections
