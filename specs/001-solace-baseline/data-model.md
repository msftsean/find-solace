# Data Model: Solace Baseline

**Branch**: `001-solace-baseline` | **Date**: 2026-03-15

> Note: Solace is a static site with no database or server-side data. This document describes the **content entities** — the conceptual data model that the HTML structure represents.

## Entities

### Page

The top-level content unit. Each page is a standalone HTML file at the repository root.

| Attribute | Description |
|-----------|-------------|
| filename | HTML file name (index.html, home.html, work.html, labs.html) |
| title | Page heading displayed in hero section |
| lead | Subtitle/description text below the heading |
| type | landing, guide, or labs |
| sections | Ordered list of Article Sections or Lab Categories |

**Relationships**: Page → has many Article Sections (guide pages) or Lab Categories (labs page)

### Article Section

A topic-focused content block within a guide page (home.html, work.html).

| Attribute | Description |
|-----------|-------------|
| id | Deep-link anchor (e.g., "taxes", "budget", "career") |
| eyebrow | Category label above heading |
| heading | Section title (h2) |
| lead | Introductory paragraph |
| body | Rich text content with subheadings, paragraphs, tool callouts |
| pullQuote | Testimonial-style quote |
| sidebarImage | Associated image (WebP, lazy-loaded) |
| layoutReverse | Boolean — whether image appears on left (reversed grid) |
| toolCallouts | List of Tool Callout entities |

**Relationships**: Article Section → belongs to Page, has many Tool Callouts

### Tool Callout

A highlighted recommendation for a specific AI tool.

| Attribute | Description |
|-----------|-------------|
| toolName | Name of the AI tool (e.g., "Claude", "Perplexity", "Reclaim.ai") |
| description | What the tool does in this context |
| url | External link to the tool (target="_blank") |
| isFree | Whether the tool is free/freemium (required: must be true) |

### Lab

An interactive hands-on experiment on the labs page.

| Attribute | Description |
|-----------|-------------|
| id | Deep-link anchor (e.g., "trip-planner", "resume-refresh") |
| title | Lab name |
| tool | Recommended AI tool (badge) |
| timeEstimate | Duration in minutes (badge) |
| category | Home Life, Work Life, or Everyday |
| steps | Ordered list of Lab Steps |
| whyItWorks | Explanatory text about the approach |

**Relationships**: Lab → belongs to Lab Category, has many Lab Steps

### Lab Step

An individual step within a lab.

| Attribute | Description |
|-----------|-------------|
| label | Step number (e.g., "Step 1", "Step 2") |
| instruction | What to do |
| prompt | Copy-paste prompt text with [BRACKETED] placeholders |

### Design Token

A CSS custom property that defines a reusable design system value.

| Attribute | Description |
|-----------|-------------|
| name | CSS variable name (e.g., --color-primary, --space-4) |
| lightValue | Value in light mode |
| darkValue | Value in dark mode (may differ) |
| category | color, typography, spacing, shadow, radius, animation |

## State Transitions

### Theme State

```
[System Preference] → Light | Dark
       ↓
[User Toggle Click] → switches to opposite
       ↓
[Page Navigation] → persists via localStorage
```

### Lab Accordion State

```
[All Collapsed] → initial state
       ↓
[Click Header] → expand clicked, collapse all others
       ↓
[Click Same Header] → collapse (return to all collapsed)
```
