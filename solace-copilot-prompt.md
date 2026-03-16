# Solace AI Agent — Copilot CLI + Spec Kit Prompt

Copy and paste the prompt below into your Copilot CLI session after initializing with Spec Kit.

---

## Step 1: Initialize with Spec Kit

```bash
# Install Spec Kit if you haven't
uvx specify init solace-agent --ai copilot

# Or if adding to an existing Solace repo
cd solace
uvx specify init . --ai copilot --force
```

## Step 2: Constitution (paste into `/speckit.constitution`)

```
Create principles for Solace, an AI learning platform for non-technical professionals. 
The site teaches busy adults how to use AI in everyday life through editorial guides 
and hands-on labs. It is warm, approachable, and inspired by publications like Essence 
and Travel & Leisure — not cold or techie.

Principles:
- The audience is non-technical. Every interface decision should reduce intimidation.
- The visual design system uses warm cream (#FAF8F5), espresso text (#2C2418), 
  copper accent (#B87333), sage green (#5B7F6E), Instrument Serif for display, 
  and Satoshi for body text.
- The site supports light and dark mode.
- All AI features must feel like a helpful person, not a chatbot.
- Content must be factually accurate. Making up use cases is fine. Creating phantom 
  truths or alternative facts is not.
- The site must represent diversity — imagery should feature primarily Black men and women.
- Never reference ChatGPT or OpenAI branding. Use Microsoft Copilot as the primary 
  recommended tool, with Claude and Perplexity as alternatives in content.
- The backend runs entirely on Microsoft Azure (Azure Static Web Apps, Azure API 
  Management, Azure AI Foundry). The developer is a Microsoft employee with model discounts.
- The domain is findsolace.io.
```

## Step 3: Specification (paste into `/speckit.specify`)

```
I want to add an AI agent to my existing Solace website. Here's what it should do and 
how to build it.

## What Solace Is Today

Solace is a static HTML/CSS/JS site currently hosted on GitHub Pages. It has 4 pages:
- index.html (landing/guide page)
- home.html (Home Life AI guide) 
- work.html (Work Life AI guide)
- labs.html (6 do-it-yourself exercises with accordion UI, copy-to-clipboard prompts)

The site uses no framework — just vanilla HTML, CSS, and JavaScript. Fonts are loaded 
from Google Fonts (Instrument Serif) and Fontshare (Satoshi).

## What I Want to Build: The Solace Agent

An embedded AI assistant that lives on every page of the site as a chat widget. It 
transforms Solace from a read-only reference into a personalized learning companion.

### Core Capabilities

1. **Personalized lab recommendations** — The agent asks the visitor about their role 
   and experience level, then recommends which labs to start with and why.

2. **In-context Q&A** — When a user is on a specific page or lab, the agent can answer 
   questions about what they're reading. For example, if they're on the Azure APIM lab 
   and ask "what's an OpenAPI spec?", it answers in plain language using Solace's content 
   as context.

3. **Prompt builder** — Instead of users filling in [BRACKETED] placeholders manually, 
   the agent asks them questions and generates a ready-to-paste prompt customized to 
   their situation.

4. **Progressive skill building** — After a user completes a lab, the agent suggests a 
   "next level" challenge to build fluency.

### UX Requirements

- Chat widget in the bottom-right corner of every page.
- Minimized by default — shows a small floating button with a warm, inviting icon 
  (not a robot). Maybe a sun or compass that fits the golden-hour aesthetic.
- Expanded state: a panel (max 400px wide, 600px tall on desktop) with a conversation 
  thread, text input, and send button.
- Messages should render Markdown (bold, links, code blocks, lists).
- The agent's personality is warm, encouraging, and jargon-free — like a knowledgeable 
  friend, not a support bot.
- Must work in both light and dark mode using the existing CSS custom properties.
- Mobile: the chat panel should go full-width at the bottom of the screen.
- Include a "Powered by Azure AI" subtle attribution in the chat panel footer.

### Architecture

```
[Browser] → [Azure API Management (APIM)] → [Azure AI Foundry Agent Service]
                                                    ↓
                                          [Azure OpenAI model deployment]
```

**Frontend (static site on Azure Static Web Apps):**
- A single JavaScript module (e.g., `solace-agent.js`) that handles:
  - Widget open/close state
  - Conversation history (stored in sessionStorage)
  - Sending messages to the APIM endpoint
  - Streaming responses (SSE or chunked JSON)
  - Rendering Markdown in responses
  - Detecting which page/lab the user is currently viewing (pass as context)
- No build step, no npm, no framework. Vanilla JS loaded via `<script>` tag.
- Use the existing CSS custom properties (--color-bg, --color-text, --color-accent, etc.)

**Backend (Azure):**
- Azure Static Web Apps to host the site at findsolace.io
  - Configure custom domain with CNAME record pointing to the Static Web App
  - Enable free SSL certificate (automatic with Azure Static Web Apps)
  - Set up GitHub Actions deployment from the Solace repo
- Azure API Management (APIM) as the secure proxy
  - The APIM instance already exists from Lab 9 setup
  - Add a new API operation for the chat agent endpoint
  - CORS policy allowing requests from findsolace.io only
  - Rate limiting: 20 requests per minute per IP (to prevent abuse)
  - The APIM subscription key is passed from the frontend — this requires CORS 
    lockdown to findsolace.io only plus rate limiting to mitigate abuse. Consider 
    using Azure Static Web Apps API proxying as an alternative to exposing the key.
  - Store the Azure OpenAI API key in APIM Named Values (never in frontend code)
- Azure AI Foundry Agent Service for the agent logic
  - Deploy the agent with a system prompt grounded in Solace's content
  - The system prompt should include the full site map, lab descriptions, and 
    tool recommendations so the agent can make informed suggestions
  - Enable Memory (preview) so the agent remembers returning visitors across sessions

### Models to Deploy from Microsoft Foundry

I work at Microsoft and get discounts on Foundry models. Deploy these models for a 
multi-model agent architecture:

1. **Primary conversational model — GPT-4.1-mini**
   - Handles 90% of interactions: recommendations, Q&A, prompt building
   - Why: Fast, cheap, 1M token context window, strong instruction following
   - Deployment: Standard in eastus2
   - This is the default model the agent routes to

2. **Deep reasoning model — GPT-5-mini** 
   - Activated when the user asks complex or multi-step questions (e.g., comparing 
     which AI tools to use for a specific workflow, explaining technical concepts 
     from the Azure APIM lab in depth)
   - Why: Stronger reasoning than 4.1-mini, still cost-efficient vs full GPT-5
   - Deployment: Standard in eastus2

3. **Multimodal model — GPT-4o (2024-11-20)**
   - Activated if/when we add image upload or screenshot analysis features 
     (e.g., user uploads a screenshot of an error message from a lab)
   - Why: Best vision capabilities, handles image+text input natively
   - Deployment: Standard in eastus2

4. **Model Router** 
   - Deploy the Foundry Model Router to automatically select between GPT-4.1-mini 
     and GPT-5-mini based on query complexity
   - Set to "Cost" mode by default (routes to cheaper model unless complexity warrants upgrade)
   - This means the frontend only calls one endpoint — the router handles model selection

### System Prompt for the Agent

```
You are the Solace Guide — a warm, knowledgeable companion helping people discover 
how AI can make their everyday lives easier. 

Your personality:
- You speak like a patient friend, not a tech support bot
- You avoid jargon. If you must use a technical term, you explain it immediately
- You're encouraging — many visitors have never used AI tools before
- You never make people feel stupid for asking basic questions
- You use short paragraphs and occasional humor

Your knowledge:
- You know everything about the Solace website: all guides (Home Life, Work Life) 
  and all 6 DIY exercises
- You can recommend which DIY exercises to try based on someone's role and interests
- You can help fill in the [BRACKETED] placeholders in exercise prompts by asking the 
  user about their specific situation
- You know the AI tools referenced on the site: Microsoft Copilot (primary), Claude, 
  Perplexity, NotebookLM, ElevenLabs
- You do NOT recommend ChatGPT or any OpenAI consumer products

Context awareness:
- You receive the current page URL and page title with each message
- If the user is on a specific exercise, you can reference the steps directly
- If the user seems lost, suggest starting with the "Email Drafting Assistant" exercise 
  (Exercise 5) — it's the fastest win at 5 minutes

Boundaries:
- You only answer questions related to AI tools, the Solace content, and the exercises
- For off-topic questions, gently redirect: "That's outside my wheelhouse, but I 
  can help you find an AI tool that might be able to help with that."
- Never invent facts about AI tools. If you're unsure about a feature, say so.
- Never generate harmful, biased, or misleading content
```

### Migration from GitHub Pages to Azure Static Web Apps

The site currently lives at https://msftsean.github.io and needs to move to 
findsolace.io hosted on Azure Static Web Apps.

Steps to implement:
1. Create an Azure Static Web App resource in the same resource group as APIM
2. Connect it to the GitHub repo (msftsean/solace or wherever the repo lives)
3. Configure the GitHub Actions workflow for automatic deployment on push
4. Add custom domain findsolace.io:
   - Add TXT record `_dnsauth.findsolace.io` with the validation value from Azure
   - Add CNAME record `www` pointing to `<app-name>.azurestaticapps.net`
   - For the apex domain (findsolace.io without www), add an ALIAS/ANAME record 
     or use Azure DNS for full apex domain support
5. SSL certificate is provisioned automatically by Azure once DNS validates
6. Update robots.txt: change from noindex/nofollow to allow indexing (the site is 
   going public)
7. Add a redirect from the old GitHub Pages URL to findsolace.io

### File Structure (after implementation)

> **Note:** Per Solace development rules, all styles go in the single `style.css` 
> and all JavaScript uses inline `<script>` blocks at end of `<body>`. No external 
> JS or CSS files.

```
solace/
├── index.html          (+ inline agent <script> block)
├── home.html           (+ inline agent <script> block)
├── work.html           (+ inline agent <script> block)
├── labs.html            (+ inline agent <script> block)
├── style.css            (+ agent widget styles appended)
├── favicon.svg
├── robots.txt
├── assets/
│   └── *.webp (6 images)
└── .github/
    └── workflows/
        └── azure-static-web-apps.yml  ← NEW: deployment workflow
```

### Success Criteria

- [ ] Chat widget loads on all 4 pages without affecting existing page performance
- [ ] Agent responds in under 2 seconds for simple questions
- [ ] Agent correctly identifies which page/lab the user is on
- [ ] Agent can recommend labs based on user description of their role
- [ ] Agent can help build customized prompts from lab templates
- [ ] Widget looks native to the Solace design system (not like a bolt-on)
- [ ] Works correctly in both light and dark mode
- [ ] Mobile layout: full-width chat panel, easy to dismiss
- [ ] Rate limiting prevents abuse (20 req/min per IP)
- [ ] CORS locked to findsolace.io only
- [ ] Site loads at findsolace.io with valid SSL
- [ ] GitHub Actions deploys on push to main branch
- [ ] No references to ChatGPT or OpenAI branding in any agent responses
```

## Step 4: Clarify, Plan, and Implement

After pasting the spec, run these Spec Kit commands in order:

```
/speckit.clarify          — Let Copilot ask questions about anything underspecified
/speckit.plan             — Generate the technical implementation plan
/speckit.analyze          — Check for consistency issues
/speckit.tasks            — Break it into implementable tasks
/speckit.implement        — Build it
```

---

## Quick Reference: Azure Resources You'll Need

| Resource | SKU / Tier | Region | Purpose |
|---|---|---|---|
| Azure Static Web Apps | Free or Standard | N/A (global) | Host findsolace.io |
| Azure API Management | Consumption or Standard | eastus2 | Secure proxy, rate limiting |
| Azure OpenAI (GPT-4.1-mini) | Standard | eastus2 | Primary agent model |
| Azure OpenAI (GPT-5-mini) | Standard | eastus2 | Deep reasoning fallback |
| Azure OpenAI (GPT-4o) | Standard | eastus2 | Multimodal (future) |
| Model Router | Standard | eastus2 | Auto-selects model by complexity |
| Foundry Agent Service | Standard | eastus2 | Agent orchestration + memory |

## DNS Records for findsolace.io

| Type | Host | Value |
|---|---|---|
| TXT | `_dnsauth.findsolace.io` | (copy from Azure portal) |
| CNAME | www | `<app-name>.azurestaticapps.net` |
| ALIAS/ANAME | @ (apex) | `<app-name>.azurestaticapps.net` |
