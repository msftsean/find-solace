# Solace — Copilot Project Prompt

Project context for Copilot sessions working on the Solace codebase.

---

## What Solace Is

Solace is an AI learning platform for non-technical professionals. It teaches busy adults how to use AI in everyday life through editorial guides and hands-on DIY exercises. The site is warm, approachable, and inspired by publications like Essence and Travel & Leisure — not cold or techie.

The site includes a **Solace Agent** — an embedded AI chat widget on every page that transforms Solace from a read-only reference into a personalized learning companion. The agent provides page-aware Q&A, personalized DIY recommendations, prompt-building help, and progressive skill-building guidance.

## Design Principles

- The audience is non-technical. Every interface decision should reduce intimidation.
- The visual design system uses warm cream (#FAF8F5), espresso text (#2C2418), copper accent (#B87333), sage green (#5B7F6E), Instrument Serif for display, and Satoshi for body text.
- The site supports light and dark mode.
- All AI features must feel like a helpful person, not a chatbot.
- Content must be factually accurate. Making up use cases is fine. Creating phantom truths or alternative facts is not.
- The site must represent diversity — imagery should feature primarily Black men and women.
- Never reference ChatGPT or OpenAI branding in user-facing content. Recommend Claude, Perplexity, or Copilot as tools for visitors.
- The backend runs entirely on Microsoft Azure (Azure Static Web Apps, Azure API Management, Azure OpenAI).
- The domain is findsolace.io.

## Architecture

```
[Browser] → [Azure Static Web Apps] → [Managed Azure Function (api/chat/index.js)] → [APIM] → [Azure OpenAI (gpt-4.1-mini)]
```

| Layer | Technology | Details |
|---|---|---|
| Hosting | Azure Static Web Apps (Free SKU) | Hostname: `nice-plant-08271220f.1.azurestaticapps.net` |
| Frontend | Vanilla HTML/CSS/JS | 4 pages, no framework, no build step |
| API Proxy | SWA Managed Functions (Node.js) | `api/chat/index.js` — injects APIM subscription key server-side |
| API Gateway | Azure API Management (Consumption SKU) | CORS enforcement, API key injection for Azure OpenAI |
| AI Model | Azure OpenAI GPT-4.1-mini | Standard deployment in eastus2 |
| Deployment | GitHub Actions | `.github/workflows/azure-swa-deploy.yml` |

### Key Architecture Decisions

- **Managed Functions over linked backend**: SWA Free SKU does not support linked backends. The `api/` folder uses SWA's built-in managed Functions (v3 model).
- **APIM for key injection**: The APIM subscription key is stored in SWA application settings and injected server-side by the Function. The browser never sees the key.
- **APIM Consumption SKU**: Pay-per-call pricing (~$3.50/million calls). Supports policies and Named Values. Note: Consumption SKU does not support built-in rate limiting — rate-limit policies require Developer tier or higher.
- **Client-side system prompt**: The system prompt is assembled in the browser and sent with each request. This is a known limitation — the prompt is inspectable via browser DevTools. Acceptable for this use case (the prompt contains no secrets, only behavioral instructions).
- **SSE streaming with SWA v3 buffering**: Azure OpenAI returns SSE natively, but SWA v3 managed Functions buffer the response before forwarding to the browser. The client still processes the response as a stream, but latency is higher than true end-to-end streaming.

## Site Architecture

```
find-solace/
├── index.html              Landing page + inline agent widget script
├── home.html               Home Life AI guide + inline agent widget script
├── work.html               Work Life AI guide + inline agent widget script
├── labs.html                6 DIY exercises + inline agent widget script
├── style.css                Single stylesheet (~1,509 lines)
│                            Lines 1187–1601: Solace Agent widget styles
├── favicon.svg
├── robots.txt
├── staticwebapp.config.json SWA routing, fallbacks, security headers
├── api/
│   ├── host.json            Azure Functions host configuration
│   ├── package.json         Node.js dependencies for the managed Function
│   ├── local.settings.json  Local dev settings (APIM_GATEWAY_URL, APIM_SUBSCRIPTION_KEY)
│   └── chat/
│       ├── function.json    HTTP trigger binding (POST /api/chat)
│       └── index.js         Chat proxy: POST handler → APIM → Azure OpenAI (SSE)
├── assets/
│   └── *.webp               Site images (6 files)
├── specs/
│   └── 003-solace-agent/    Feature specification
├── .github/
│   └── workflows/
│       └── azure-swa-deploy.yml   Deploys to SWA on push to main
└── solace-copilot-prompt.md This file
```

## Solace Agent Widget

The chat widget is embedded on all 4 HTML pages via identical inline `<script>` blocks at the end of `<body>`.

### Widget Features

| Feature | Description |
|---|---|
| SSE streaming | Streams assistant responses from `POST /api/chat` via Server-Sent Events |
| Session persistence | Conversation history stored in `sessionStorage`; survives page navigation |
| Dark mode | Widget inherits Solace design tokens; updates when theme is toggled |
| Suggestion chips | Context-aware follow-up suggestions shown after assistant responses |
| Prompt builder | Extracts `[BRACKETED]` placeholders from DIY exercise templates and walks the visitor through filling them in conversationally |
| Visitor profiling | Captures role, goals, and confidence level during conversation for personalized recommendations |
| Page context | Each request includes current page URL and title so the agent answers in context |
| Markdown rendering | Assistant messages render paragraphs, bold, lists, links, inline code, and fenced code blocks |
| Accessibility | Keyboard-operable, ARIA live regions for new messages, focus management on open/close |
| Mobile layout | Full-width bottom sheet on small viewports |

### Widget CSS

Widget styles live in `style.css` at approximately lines 1187–1601, organized by implementation task:

| Lines | Task | Content |
|---|---|---|
| 1191–1254 | T012 | Launcher button, hover/active states, glow effect |
| 1256–1280 | T013 | Chat panel shell (`.solace-panel`) |
| 1287–1530 | T014 | Panel header, transcript, message bubbles, composer, attribution footer |
| 1541–1574 | T015 | Mobile responsive breakpoints |
| 1576–1599 | T016 | Dark mode widget overrides, focus-visible styles |
| 1601+ | T017 | Markdown rendering in assistant messages |

### JavaScript Behaviors

All widget JS is inline in each HTML file. The script block must be **identical across all 4 pages** — changes to one must be replicated to the other three.

| Behavior | Description |
|---|---|
| Widget lifecycle | Open/close/minimize panel, focus management, keyboard shortcuts (Escape to close) |
| Message send | Send on click or Enter; Shift+Enter for newline; disabled on empty input |
| SSE client | Streams `POST /api/chat` response; handles connection errors and partial responses |
| History management | Stores messages in `sessionStorage`; enforces 10-pair (20 message) window |
| System prompt | Assembled client-side with personality, site knowledge, page context, and visitor profile |
| Suggestion chips | Displayed after assistant responses; context-aware based on current page |
| Prompt builder | Detects `[BRACKETED]` placeholders in exercise prompts; asks follow-up questions; generates completed prompt |
| Visitor profile | Extracts role/goals/confidence from conversation; includes in system prompt for personalization |
| Theme sync | Listens for theme toggle; widget inherits CSS custom properties automatically |
| Error handling | Friendly messages for network errors, 429 rate limits, and upstream failures |

## Development Rules

1. **No frameworks, no build step.** Vanilla HTML, CSS, and JavaScript only.
2. **Single stylesheet.** All styles go in `style.css`. No external CSS files.
3. **Inline scripts only.** All JavaScript is in `<script>` blocks at the end of `<body>`. No external `.js` files for page logic.
4. **Widget script must be identical across all 4 HTML files.** Any change to the agent widget script must be applied to `index.html`, `home.html`, `work.html`, and `labs.html`.
5. **Fonts from Google Fonts (Instrument Serif) and Fontshare (Satoshi).** No self-hosted font files.
6. **Images in WebP format** in the `assets/` directory.
7. **No secrets in frontend code.** APIM subscription key is injected server-side by the managed Function.

## Azure Resources

| Resource | SKU / Tier | Region | Purpose |
|---|---|---|---|
| Azure Static Web Apps | Free | N/A (global) | Host findsolace.io |
| Azure API Management | Consumption | eastus2 | API key injection, CORS |
| Azure OpenAI (GPT-4.1-mini) | Standard | eastus2 | Primary agent model |

## DNS Records for findsolace.io

| Type | Host | Value |
|---|---|---|
| TXT | `_dnsauth.findsolace.io` | (from Azure portal) |
| CNAME | www | `nice-plant-08271220f.1.azurestaticapps.net` |
| ALIAS/ANAME | @ (apex) | `nice-plant-08271220f.1.azurestaticapps.net` |
