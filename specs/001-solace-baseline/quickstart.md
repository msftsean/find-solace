# Quickstart: Solace Baseline Validation

**Branch**: `001-solace-baseline` | **Date**: 2026-03-15

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge — last 2 versions)
- The repository cloned locally, OR GitHub Pages deployment active

## Validation Scenarios

### 1. Landing Page (index.html)

1. Open `index.html` in a browser
2. Verify the hero text "Your guide to the quiet revolution" appears with character animation
3. Scroll down — verify sections fade in smoothly
4. Click "Explore Home Life" → should navigate to `home.html`
5. Click "Explore Work Life" → should navigate to `work.html`
6. Click "Try a Lab" → should navigate to `labs.html`

### 2. Content Pages (home.html, work.html)

1. Open `home.html` — verify 3 article sections load (Tax Prep, Budget, Vacation)
2. Navigate to `home.html#budget` — page should scroll to Budget Management section
3. Verify tool callout boxes appear with green accent headings
4. Verify alternating grid layouts (text-left / image-left pattern)
5. Repeat for `work.html` with Career, Inbox, Reviews sections

### 3. Labs Page (labs.html)

1. Open `labs.html` — verify 6 lab cards visible across 3 categories
2. Click a lab card header → body should expand, all others collapse
3. Click the "Copy" button next to a prompt → clipboard should contain prompt text, button shows "Copied!" for 2 seconds
4. Press keyboard Enter/Space on a lab header → should toggle accordion

### 4. Dark Mode

1. Click the theme toggle button in the header
2. All colors should switch (background, text, cards, borders)
3. Navigate to a different page — dark mode should persist
4. Set system preference to dark → fresh page load should auto-detect

### 5. Mobile Responsiveness

1. Resize browser to < 768px width
2. Desktop nav should hide, hamburger menu icon should appear
3. Click hamburger → nav links should expand vertically
4. Content should stack to single column, images should be full-width
5. Lab cards should be single column
6. All touch targets should be at least 40px

### 6. Accessibility

1. Tab through the page — focus indicators should be visible (2px copper outline)
2. Skip link should be the first focusable element
3. Screen reader: verify `aria-current="page"` on active nav link
4. Enable `prefers-reduced-motion: reduce` — all animations should complete instantly

### 7. Performance

1. Open browser DevTools → Network tab
2. Hard refresh the page (Ctrl+Shift+R)
3. Total page load should be under 2 seconds on broadband
4. Verify images use `loading="lazy"` (except hero)
