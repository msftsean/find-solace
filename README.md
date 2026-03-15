<p align="center">
  <img src="favicon.svg" alt="Solace" width="80" height="80">
</p>

<h1 align="center">🕯️ Solace</h1>

<p align="center">
  <strong>Your guide to the quiet revolution</strong><br>
  <em>Helping everyday people understand and use AI — without the hype.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status: Active">
  <img src="https://img.shields.io/badge/pages-4-blue?style=flat-square" alt="Pages: 4">
  <img src="https://img.shields.io/badge/labs-6-orange?style=flat-square" alt="Labs: 6">
  <img src="https://img.shields.io/badge/build-none%20needed-lightgrey?style=flat-square" alt="Build: None Needed">
  <img src="https://img.shields.io/badge/license-private-red?style=flat-square" alt="License: Private">
</p>

---

## 🌟 What Is Solace?

Solace is a **static educational website** that helps busy adults (25–65) understand and use AI tools for practical tasks in their personal and professional lives.

It's not a product, SaaS, or app — it's a **warm, editorial guide** that cuts through the noise.

> *"AI isn't about robots. It's about making your life a little easier — from filing taxes to planning vacations to finally getting your inbox under control."*

## 📖 Pages

| Page | Description | Topics |
|------|-------------|--------|
| 🏠 **Guide** (`index.html`) | Landing page — what AI is and why it matters | Introduction, Card grids, Getting started |
| 🏡 **Home Life** (`home.html`) | AI for personal tasks | 💰 Tax prep · 📊 Budgeting · ✈️ Vacation planning |
| 💼 **Work Life** (`work.html`) | AI for professional growth | 📈 Career dev · 📬 Inbox/calendar · 📝 Performance reviews |
| 🧪 **Labs** (`labs.html`) | 6 hands-on AI experiments | Copy-paste prompts, 5–20 min each, zero setup |

## 🧪 Labs

| # | Lab | Tool | ⏱️ Time |
|---|-----|------|---------|
| 1 | Weekend Trip Planner | Perplexity | 10 min |
| 2 | Monthly Budget Check-in | Claude | 15 min |
| 3 | Resume Refresh | Claude | 20 min |
| 4 | Meeting Prep Brief | Perplexity | 10 min |
| 5 | Email Drafting Assistant | Claude | 5 min |
| 6 | Weekly Meal Planner | Perplexity | 10 min |

## 🎨 Design System

<table>
<tr>
<td>

**Colors**
| Token | Light | Dark |
|-------|-------|------|
| Background | `#FAF8F5` | `#1A1714` |
| Primary | `#B87333` 🟠 | `#D4956A` |
| Secondary | `#5B7F6E` 🟢 | `#7DA28E` |
| Text | `#2C2418` | `#D9D0C5` |

</td>
<td>

**Typography**
| Role | Font |
|------|------|
| Headlines | Instrument Serif |
| Body/UI | Satoshi |

**Spacing**: Rem-based scale (`0.25rem` → `8rem`)
**Max width**: 1200px container, 65ch prose

</td>
</tr>
</table>

## ⚡ Features

- 🌗 **Dark mode** — System detection + manual toggle with persistence
- 📱 **Fully responsive** — Mobile-first with breakpoints at 640/768/1024px
- ♿ **Accessible** — WCAG AA, skip links, ARIA attributes, keyboard support
- ✨ **Animated** — Scroll reveals, character animations, rough notation underlines
- 🎯 **Reduced motion** — All animations respect `prefers-reduced-motion`
- 📋 **Copy-to-clipboard** — Lab prompts with "Copied!" feedback
- 🔒 **Not indexed** — `robots.txt` set to `Disallow: /`

## 🏗️ Tech Stack

```
HTML5 + CSS3 + Vanilla JS
├── No frameworks
├── No build system
├── No npm / bundler
└── Files served as-is
```

**CDN Dependencies:**

| Library | Version | Purpose |
|---------|---------|---------|
| Rough Notation | 0.5.1 | Animated underline/highlight annotations |
| Splitting.js | 1.0.6 | Character splitting for hero text animation |
| Google Fonts | — | Instrument Serif typeface |
| Fontshare | — | Satoshi typeface (400/500/700) |

## 📁 Project Structure

```
find-solace/
├── 📄 index.html          Landing page
├── 📄 home.html           Home Life guide
├── 📄 work.html           Work Life guide
├── 📄 labs.html            Hands-on Labs
├── 🎨 style.css            Single shared stylesheet
├── 🕯️ favicon.svg          Brand flame icon
├── 🤖 robots.txt           noindex, nofollow
├── 🖼️ assets/              WebP images
├── 📋 specs/               Feature specifications (Spec Kit)
├── ⚙️ .specify/            Spec Kit internals
├── 🤝 .github/             Copilot agents & prompts
└── 📐 .vscode/             Editor settings
```

## 🚀 Getting Started

No build step required. Just serve the files:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node
npx serve .

# Option 3: VS Code
# Install "Live Server" extension → right-click index.html → "Open with Live Server"
```

Then open `http://localhost:8000` in your browser.

## 📐 Spec Kit

This project uses [Spec Kit](https://github.com/github/spec-kit) for structured development:

```bash
# Slash commands (in Copilot / Claude / your AI agent)
/speckit.constitution    # Establish project principles
/speckit.specify         # Create feature specification
/speckit.clarify         # De-risk ambiguous areas
/speckit.plan            # Create implementation plan
/speckit.tasks           # Generate actionable tasks
/speckit.implement       # Execute implementation
```

## 📊 Version Matrix

| Component | Version | Status |
|-----------|---------|--------|
| Solace Site | 1.0.0 | ✅ Active |
| Spec Kit | 0.3.0 | ✅ Installed |
| Rough Notation | 0.5.1 | ✅ CDN |
| Splitting.js | 1.0.6 | ✅ CDN |
| HTML | 5 | ✅ Semantic |
| CSS | 3 | ✅ Custom Properties |
| JavaScript | ES6+ | ✅ Vanilla |

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | Last 2 versions | ✅ Supported |
| Firefox | Last 2 versions | ✅ Supported |
| Safari | Last 2 versions | ✅ Supported |
| Edge | Last 2 versions | ✅ Supported |
| IE 11 | — | ❌ Not supported |

| Platform | Support | Status |
|----------|---------|--------|
| Desktop | Full | ✅ |
| Tablet | Full | ✅ |
| Mobile | Full (responsive) | ✅ |
| Screen readers | WCAG AA | ✅ |

---

<p align="center">
  <em>Made with care · Powered by Perplexity Computer</em><br>
  <sub>🕯️ Finding solace in the quiet revolution</sub>
</p>
