# Implementation Plan: Solace Baseline

**Branch**: `001-solace-baseline` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-solace-baseline/spec.md`

## Summary

Establish a baseline specification and maintenance framework for the Solace static educational website. The site helps non-technical adults understand and use AI tools for practical tasks. It consists of 4 HTML pages (landing, home life, work life, labs), a single CSS file, and inline vanilla JavaScript. Hosted on GitHub Pages with no build system. This plan documents the existing architecture to enable structured changes going forward, including eventual dynamic features.

## Technical Context

**Language/Version**: HTML5, CSS3, ES6+ JavaScript (vanilla, no transpilation)
**Primary Dependencies**: Rough Notation 0.5.1 (CDN), Splitting.js 1.0.6 (CDN), Google Fonts (Instrument Serif), Fontshare (Satoshi)
**Storage**: N/A — static site, no data persistence
**Testing**: Manual browser testing — no automated test framework
**Target Platform**: Web — last 2 major versions of Chrome, Firefox, Safari, Edge
**Project Type**: Static website (educational content)
**Performance Goals**: Pages load in under 2 seconds on broadband from GitHub Pages
**Constraints**: No build system, no bundler, no npm, no frameworks, single CSS file, inline JS only
**Scale/Scope**: 4 pages, ~1200 lines CSS, solo maintainer, direct push to main

## Constitution Check

*GATE: Constitution template not yet filled — no violations to check. Recommend running `/speckit.constitution` to establish project principles.*

**Post-Phase 1 re-check**: N/A (constitution pending)

## Project Structure

### Documentation (this feature)

```text
specs/001-solace-baseline/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Content entities
├── quickstart.md        # Phase 1: Validation scenarios
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
find-solace/
├── index.html           # Landing page
├── home.html            # Home Life guide (taxes, budget, vacation)
├── work.html            # Work Life guide (career, inbox, reviews)
├── labs.html            # 6 hands-on AI labs with accordion UI
├── style.css            # Single shared stylesheet (~1200 lines)
├── favicon.svg          # Brand flame icon (inline SVG)
├── robots.txt           # noindex, nofollow (intentional)
├── assets/              # WebP images (hero, section, sidebar)
│   ├── hero.webp
│   ├── ai-explain.webp
│   ├── home-life.webp
│   ├── work-life.webp
│   ├── getting-started.webp
│   └── vacation.webp
├── specs/               # Speckit specifications
├── .specify/            # Speckit internals
├── .github/             # Copilot agents, prompts, skills
└── .vscode/             # Editor settings
```

**Structure Decision**: Flat static site — all pages at root, assets in `assets/`, no source directories needed. This is not a compiled or bundled project.

## Complexity Tracking

No constitution violations — flat static site with no unnecessary abstractions.
