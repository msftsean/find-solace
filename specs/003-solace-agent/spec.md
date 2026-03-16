# Feature Specification: Solace Agent

**Feature Branch**: `003-solace-agent`  
**Created**: 2026-03-15  
**Status**: Clarified  
**Supersedes**: `002-ai-chat`  
**Input**: User description: "Add the Solace Agent as an embedded AI guide across the Solace site, with page-aware Q&A, personalized DIY recommendations, prompt-building help, progressive skill building, Azure Foundry integration, and migration from GitHub Pages to Azure Static Web Apps at findsolace.io."

## Clarifications

### Session 2026-03-15

- Q: Should the backend use Azure AI Foundry Agent Service for orchestration or direct Azure OpenAI calls behind APIM? → A: Direct Azure OpenAI behind APIM (simple proxy: browser → APIM → Azure OpenAI, system prompt + conversation history per request).
- Q: Should the APIM subscription key be exposed to the browser, or hidden via a server-side proxy? → A: SWA managed API proxy — browser calls `/api/chat` on the same origin, SWA proxies to APIM with key injected server-side. Key never reaches the browser.
- Q: Which APIM tier should Solace use? → A: Consumption tier (~$3.50/million calls). Pay-per-call, supports policies and Named Values, no monthly minimum.
- Q: Has findsolace.io been purchased and is it under DNS control? → A: Yes, domain is owned and available for Azure Static Web Apps custom domain setup.
- Q: What should the conversation history window size be for the chat widget? → A: Last 10 message pairs (20 messages total). Balances multi-turn context with token cost (~3,000 tokens of history).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open the Solace Agent Anywhere (Priority: P1)

A visitor on any Solace page opens a warm, welcoming chat widget from the bottom-right corner, asks a question in plain language, and gets a helpful response without leaving the page. The experience feels like part of Solace, not a bolted-on support tool.

**Why this priority**: This is the foundation for the entire feature. If the widget is not available, usable, and visually native on every page, none of the higher-value guidance features can be delivered.

**Independent Test**: Can be fully tested by loading each of the four pages, opening the widget, sending a message, minimizing it, restoring it, and verifying the UI works in light mode, dark mode, desktop, and mobile layouts.

**Acceptance Scenarios**:

1. **Given** a visitor on `index.html`, `home.html`, `work.html`, or `labs.html` (presented in navigation as DIY), **When** they activate the floating Solace Agent button, **Then** a chat panel opens with greeting copy, message history, input field, send control, and Azure AI attribution
2. **Given** a visitor with the panel open, **When** they minimize or close it, **Then** the panel collapses without losing the current conversation in that browser session
3. **Given** a visitor on a mobile viewport, **When** they open the agent, **Then** the panel renders as a full-width bottom sheet or equivalent mobile-first layout that keeps input and dismissal controls accessible
4. **Given** a visitor using the site in dark mode, **When** they open the widget, **Then** the widget inherits Solace design tokens and remains legible and visually consistent

---

### User Story 2 - Ask Questions About the Current Page (Priority: P1)

A visitor reading a guide page or working through a DIY exercise asks a question about what they are currently viewing. The agent understands which page or exercise they are on and answers in plain language with page-aware guidance.

**Why this priority**: Context-aware help is the main upgrade from a generic AI chat box to a meaningful Solace learning companion.

**Independent Test**: Can be fully tested by asking page-specific questions from each page and verifying the response reflects the correct URL, title, and current DIY exercise context rather than giving generic advice.

**Acceptance Scenarios**:

1. **Given** a visitor on `home.html`, **When** they ask a question about a Home Life topic, **Then** the agent references the Home Life guide and answers using Solace's tone and scope
2. **Given** a visitor on `work.html`, **When** they ask a question about a Work Life topic, **Then** the agent responds with Work Life-relevant guidance rather than generic AI advice
3. **Given** a visitor on a specific DIY exercise in `labs.html`, **When** they ask for help understanding a term or step, **Then** the agent uses the current page title, URL, and exercise context to answer the question in plain language
4. **Given** a visitor changes pages during the same session, **When** they ask a follow-up question, **Then** the next request includes the new page context so answers reflect where they are now

---

### User Story 3 - Get Personalized DIY Recommendations (Priority: P2)

A visitor tells the agent about their role, goals, or interests, and the agent recommends which DIY exercises to start with, why those fit, and what outcome to expect.

**Why this priority**: Personalized recommendations turn the DIY page from a static list into a guided starting path, especially for visitors who feel unsure where to begin.

**Independent Test**: Can be fully tested by providing sample visitor profiles such as parent, job seeker, manager, or small-business owner and verifying the agent recommends relevant DIY exercises with clear reasons.

**Acceptance Scenarios**:

1. **Given** a visitor who describes their role and goals, **When** they ask where to start, **Then** the agent recommends one or more DIY exercises matched to that role and explains the fit in plain language
2. **Given** a visitor who appears overwhelmed or unsure, **When** they ask for a first step, **Then** the agent suggests the fastest-win beginner exercise before introducing more advanced options
3. **Given** a visitor asks for alternatives, **When** the first recommendation does not fit, **Then** the agent can recommend a second path based on time available, confidence level, or interest area

---

### User Story 4 - Build a Customized Prompt Through Conversation (Priority: P2)

A visitor wants to use a DIY prompt but does not know how to fill in the `[BRACKETED]` placeholders. The agent asks short follow-up questions, gathers the needed details, and returns a ready-to-paste prompt tailored to the visitor's situation.

**Why this priority**: This removes one of the biggest points of friction for non-technical users: translating a template into something personal and usable.

**Independent Test**: Can be fully tested by selecting any DIY exercise with placeholders, answering the agent's follow-up questions, and verifying the final output contains a completed prompt with placeholders resolved.

**Acceptance Scenarios**:

1. **Given** a visitor starts from a DIY exercise prompt containing placeholders, **When** they ask the agent for help customizing it, **Then** the agent asks for the missing context one step at a time
2. **Given** the agent has gathered the required details, **When** it returns the final prompt, **Then** the output is ready to copy and paste without unresolved bracketed placeholders except those the visitor explicitly chose to keep
3. **Given** a visitor changes one detail after the prompt is generated, **When** they ask for an update, **Then** the agent revises the prompt without requiring the visitor to start over

---

### User Story 5 - Grow Skills Progressively After Completion (Priority: P2)

A visitor finishes or understands one DIY exercise and asks what to do next. The agent suggests the next-best exercise or challenge so the visitor can build confidence step by step.

**Why this priority**: Solace is meant to be a learning companion, not just a one-time answer engine. Progressive guidance helps visitors keep momentum.

**Independent Test**: Can be fully tested by simulating completion of beginner, intermediate, and role-specific DIY exercises and verifying the agent suggests a sensible next step.

**Acceptance Scenarios**:

1. **Given** a visitor says they completed a DIY exercise, **When** they ask what to try next, **Then** the agent recommends a next exercise or challenge that builds on the skill they just practiced
2. **Given** a visitor found an exercise too easy or too hard, **When** they ask for another option, **Then** the agent adjusts the next recommendation to better match their confidence level
3. **Given** a visitor has already discussed multiple exercises in one session, **When** they ask for a learning path, **Then** the agent summarizes a short progression rather than repeating the same recommendation

---

### User Story 6 - Route Complex Questions to the Right Model (Priority: P3)

A visitor asks either a simple question or a more complex multi-step question. The Solace Agent uses Azure model routing so routine requests stay low-cost and fast, while more involved questions can be escalated to a stronger reasoning model.

**Why this priority**: Intelligent routing improves cost control and answer quality, but the widget still delivers value before multi-model optimization is added.

**Independent Test**: Can be fully tested by sending representative simple and complex prompts through the single frontend endpoint and confirming the router stays in cost mode while selecting the expected model path.

**Acceptance Scenarios**:

1. **Given** a visitor asks a simple Q&A or recommendation question, **When** the request is processed, **Then** the system routes it through the primary lower-cost model path by default
2. **Given** a visitor asks a complex, multi-step, or reasoning-heavy question, **When** the request is processed, **Then** the router can escalate the request to the deeper reasoning model without requiring a frontend change
3. **Given** routing is enabled, **When** the frontend sends a request, **Then** it uses a single APIM-backed endpoint and does not choose models directly in browser code

---

### User Story 7 - Launch the Public Site on Azure Static Web Apps (Priority: P3)

The maintainer migrates Solace from GitHub Pages to Azure Static Web Apps, connects GitHub Actions deployment, and serves the site from `findsolace.io` with SSL so the agent can operate behind the intended production domain.

**Why this priority**: Production hosting and domain setup are essential for launch readiness, security policy alignment, and APIM origin controls, but they can follow after the core experience is defined.

**Independent Test**: Can be fully tested by deploying from the GitHub repository to Azure Static Web Apps, validating the custom domain and certificate, and confirming the live site serves successfully from `findsolace.io`.

**Acceptance Scenarios**:

1. **Given** changes are pushed to the main branch, **When** the deployment workflow runs, **Then** Azure Static Web Apps publishes the current static site without a build step
2. **Given** DNS validation has been completed, **When** a visitor opens `findsolace.io`, **Then** the site loads over HTTPS with a valid certificate
3. **Given** the site is live on Azure Static Web Apps, **When** the widget calls the backend, **Then** APIM origin policy recognizes `findsolace.io` as the allowed production origin

---

### Edge Cases

- What happens when JavaScript is disabled? The widget does not render, no broken controls are shown, and the rest of the static site remains fully usable.
- What happens when the visitor submits an empty or whitespace-only message? The send control remains disabled and no request is sent.
- What happens when APIM, the model router, or the agent service is unavailable? The widget shows a friendly recovery message and preserves the draft input or conversation already stored in session state.
- What happens when APIM returns HTTP 429 because the visitor exceeded 20 requests per minute? The widget explains the temporary limit in plain language and invites the visitor to retry shortly.
- What happens when the response stream is interrupted mid-reply? The widget stops the loading state, preserves any partial response already rendered, and offers a retry path.
- What happens when page context cannot be detected cleanly, such as a missing section anchor or an unexpected title? The request still sends page URL and title if available, falls back to a generic Solace page context, and the agent avoids pretending to know a specific exercise.
- What happens when a response includes markdown features not supported by the renderer? Unsupported formatting degrades to safe readable text rather than raw HTML injection or broken layout.
- What happens when a visitor toggles theme while the widget is open? The widget updates styles immediately without resetting the conversation.
- What happens when the session contains a long conversation? Older messages are trimmed according to the defined history cap while the most recent context remains available.
- What happens when the visitor opens the widget on a small mobile viewport with the on-screen keyboard visible? The input and latest messages remain reachable without trapping the visitor or obscuring the close control.

## Requirements *(mandatory)*

### Functional Requirements

**Chat Experience & UI**
- **FR-001**: The site MUST present a minimized Solace Agent launcher on all four pages: `index.html`, `home.html`, `work.html`, and `labs.html`.
- **FR-002**: The launcher MUST appear as a floating control anchored near the bottom-right of the viewport on desktop and tablet layouts.
- **FR-003**: The launcher iconography and copy MUST feel warm and editorial, not robotic or support-desk oriented.
- **FR-004**: Activating the launcher MUST open an expanded chat panel containing a conversation transcript, message composer, send control, minimize or close control, and subtle "Powered by Azure AI" attribution.
- **FR-005**: The expanded panel MUST support a desktop layout up to approximately 400px wide and 600px tall without obscuring essential site navigation.
- **FR-006**: On mobile viewports, the expanded panel MUST adapt to a full-width bottom sheet or equivalent mobile-first layout.
- **FR-007**: The widget MUST support minimize and restore behavior within the same page session.
- **FR-008**: The widget MUST use styles defined in the shared `style.css` file; the feature MUST NOT introduce a second stylesheet.
- **FR-009**: The widget's JavaScript MUST be implemented within inline `<script>` blocks at the end of each page body or through an approved inline bootstrapping pattern that still satisfies Solace's no-external-JS rule.
- **FR-010**: The feature MUST NOT require npm, a bundler, module compilation, or any other build system.

**Message Rendering & Input**
- **FR-011**: Visitors MUST be able to send messages using the send control or the Enter key, while Shift+Enter inserts a newline.
- **FR-012**: The send control MUST remain disabled for empty or whitespace-only input.
- **FR-013**: The widget MUST render assistant responses with markdown support for paragraphs, emphasis, lists, links, inline code, and fenced code blocks.
- **FR-014**: Markdown rendering MUST be sanitized so assistant output cannot inject unsafe HTML or script execution into the page.
- **FR-015**: The transcript MUST visually distinguish visitor messages, assistant messages, loading states, and error states.
- **FR-016**: The transcript MUST auto-scroll to the latest message as new content arrives unless the visitor is actively reviewing earlier content.
- **FR-017**: The widget MUST communicate request progress with an in-progress state that is understandable to sighted users and assistive technologies.

**Conversation State & Personalization**
- **FR-018**: The widget MUST persist conversation state in `sessionStorage` so the conversation survives page navigation within the same browser session.
- **FR-019**: The stored conversation MUST include the ordered message history needed for multi-turn replies.
- **FR-020**: The frontend MUST enforce a conversation history window of the last 10 message pairs (20 messages: 10 user + 10 assistant) to control payload size and model cost while preserving sufficient context for multi-turn flows.
- **FR-021**: The widget MUST be able to capture lightweight visitor profile details shared during conversation, such as role, goals, confidence level, or interest areas, for use within the same session.
- **FR-022**: The system MUST support personalized DIY exercise recommendations based on the visitor profile gathered during the conversation.
- **FR-023**: The system MUST support prompt-building flows that replace DIY prompt placeholders through conversational follow-up questions.
- **FR-024**: The system MUST support progressive skill-building guidance by recommending a next exercise or challenge after the visitor reports completion or readiness.

**Page Context Awareness**
- **FR-025**: Each chat request MUST include the current page URL and page title as context sent from the browser.
- **FR-026**: When available, each chat request MUST also include the current section, anchor, or DIY exercise identifier relevant to the visitor's current view.
- **FR-027**: The agent MUST use supplied page context to answer questions about the visitor's current guide page or DIY exercise in plain language.
- **FR-028**: When specific page context is unavailable or ambiguous, the agent MUST fall back gracefully to broader Solace site knowledge instead of inventing page-specific details.

**Agent Behavior & Prompting**
- **FR-029**: The system MUST define a Solace-specific system prompt that frames the assistant as a warm, encouraging, jargon-free learning companion.
- **FR-030**: The system prompt MUST ground the assistant in the Solace site map, Home Life and Work Life guides, DIY exercises, and approved tool recommendations (Claude, Perplexity, Microsoft Copilot, NotebookLM, ElevenLabs).
- **FR-031**: The system prompt MUST prohibit recommending ChatGPT or other OpenAI consumer products as tools for users to sign up for or use directly. The exclusion applies to consumer product recommendations only — the agent runs on Azure AI infrastructure and may acknowledge this if asked directly.
- **FR-031a**: If asked what technology powers it, the agent MAY say it is powered by Azure AI. It MUST NOT elaborate further on the underlying model architecture.
- **FR-032**: The system prompt MUST instruct the agent to redirect politely when asked for off-topic help outside the Solace domain, including explicit out-of-scope categories: medical advice, legal advice, financial planning, and crisis intervention.
- **FR-032a**: For messages indicating emotional distress, the agent MUST respond with a warm acknowledgment and direct the visitor to appropriate resources (e.g., crisis hotline numbers) rather than attempting to counsel.
- **FR-033**: The system prompt MUST instruct the agent to avoid inventing facts about AI tools or site content and to acknowledge uncertainty when needed, including noting its training cutoff for fast-changing feature claims.
- **FR-034**: The assistant MUST explain technical terms immediately in plain language when such terms are necessary, using a "simplest-level-first" approach before offering deeper detail.
- **FR-034a**: The system prompt SHOULD include 1–2 few-shot example exchanges that model the Solace voice (warm, conversational, analogy-driven) to reduce variance in agent tone.

**Azure API Management Proxy & Security**
- **FR-035**: Browser requests for chat responses MUST be sent to the SWA managed API proxy (`/api/chat` on the same origin), which forwards to Azure API Management. The browser MUST NOT call APIM directly.
- **FR-036**: The APIM subscription key MUST be stored in SWA application settings and injected server-side by the SWA API proxy. The key MUST NOT appear in frontend code, HTML, or browser network requests.
- **FR-037**: APIM MUST restrict CORS to the approved production origin for Solace, `https://findsolace.io`, with any additional non-production origins explicitly controlled during development.
- **FR-038**: APIM MUST enforce a rate limit of 20 requests per minute per client IP for the public chat endpoint.
- **FR-039**: APIM MUST return visitor-safe error responses for common failure states such as upstream timeout, upstream quota exhaustion, or policy rejection.
- **FR-040**: *(Resolved — APIM subscription key is NOT exposed to the browser. SWA API proxy injects it server-side.)*

**Azure OpenAI Backend & Model Routing**
- **FR-041**: The backend MUST use direct Azure OpenAI chat completions calls behind APIM (browser → APIM → Azure OpenAI). Azure AI Foundry Agent Service is not used in this release.
- **FR-042**: The architecture MUST support a single frontend endpoint that can route requests without the browser selecting a model directly.
- **FR-043**: GPT-4.1-mini MUST be the default conversational model path for ordinary Q&A, recommendations, and prompt-building flows.
- **FR-044**: GPT-5-mini MUST be available as the higher-reasoning path for complex or multi-step questions.
- **FR-045**: The solution MUST support Azure model routing in Cost mode so routine requests prefer the cheaper model unless complexity warrants escalation.
- **FR-046**: The architecture MUST allow future enablement of GPT-4o multimodal capabilities without requiring a redesign of the widget shell.
- **FR-047**: *(Removed — Agent Service memory not applicable for direct Azure OpenAI calls. Conversation state is browser-side only via sessionStorage.)*

**Deployment, Hosting & Domain Migration**
- **FR-048**: The production site MUST be hosted on Azure Static Web Apps rather than GitHub Pages.
- **FR-049**: Azure Static Web Apps deployment MUST be driven by a GitHub Actions workflow connected to the Solace repository.
- **FR-050**: The deployment workflow MUST publish the site as static files without introducing a build pipeline.
- **FR-051**: The production site MUST be served from the custom domain `findsolace.io`.
- **FR-052**: The production site MUST provide valid HTTPS with SSL certificate provisioning for the custom domain.
- **FR-053**: The deployment plan MUST specify how apex and `www` DNS records are configured for Azure Static Web Apps.
- **FR-054**: The migration plan MUST specify whether and how the legacy GitHub Pages URL redirects to the new production domain.

**Accessibility & Progressive Enhancement**
- **FR-055**: The launcher, panel, transcript, and composer MUST be fully operable by keyboard alone.
- **FR-056**: The expanded chat panel MUST expose appropriate semantics, including dialog labeling and live-region behavior for newly added assistant messages.
- **FR-057**: Opening the panel MUST place focus predictably, and closing it MUST restore focus to the control that opened it.
- **FR-058**: The widget MUST remain usable with screen readers, including understandable announcements for new messages, errors, and loading states.
- **FR-059**: The feature MUST preserve the existing Solace reduced-motion expectations and avoid introducing motion that ignores `prefers-reduced-motion`.
- **FR-060**: If JavaScript is unavailable, the site MUST continue to operate as a normal static site without broken agent UI artifacts.

### Key Entities

- **Chat Session**: The in-browser conversation state for one visitor session, including ordered messages, current page context, and lightweight profile details stored in `sessionStorage`.
- **Message**: A single user or assistant turn with role, content, timestamp, rendering state, and optional metadata such as error or loading status.
- **Page Context**: The request metadata describing the visitor's current page, title, and optionally current section or DIY exercise anchor.
- **Visitor Profile**: The conversationally gathered facts about a visitor, such as role, goals, interests, confidence level, and recently completed exercises, used to personalize recommendations.
- **DIY Exercise Recommendation**: A suggested starting point or next step tied to one or more Solace DIY exercises, with an explanation of why it fits the visitor.
- **Prompt Build Session**: The intermediate state used while the agent asks follow-up questions to replace bracketed placeholders and generate a ready-to-paste prompt.
- **Agent Endpoint**: The APIM-backed public endpoint that receives browser requests, applies policy controls, and forwards allowed requests to the selected Azure AI backend path.
- **Deployment Target**: The Azure Static Web Apps environment serving the Solace site at `findsolace.io` and integrated with GitHub Actions deployment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Solace Agent launcher is present and operable on all four pages with no layout breakage in supported desktop and mobile viewports.
- **SC-002**: For simple questions, the agent begins returning a response in under 2 seconds under normal broadband conditions from the production site.
- **SC-003**: In validation scenarios covering all four pages, the agent identifies the active page or DIY exercise context correctly in at least 95% of test prompts.
- **SC-004**: In representative profile tests, the agent recommends at least one relevant DIY exercise with a reasoned explanation for 100% of tested role or interest inputs.
- **SC-005**: In prompt-builder tests, visitors can complete a ready-to-paste customized prompt with no unresolved required placeholders in at least 90% of sampled exercise flows.
- **SC-006**: After a visitor reports completing an exercise, the agent returns a non-duplicative next-step recommendation in at least 90% of progression test cases.
- **SC-007**: The widget remains visually consistent with Solace light and dark themes and passes keyboard and screen-reader acceptance testing on all four pages.
- **SC-008**: Public chat traffic exceeding 20 requests per minute per IP is blocked by APIM with a friendly visitor-facing error state instead of raw backend output.
- **SC-009**: Production CORS policy allows requests from `https://findsolace.io` and rejects disallowed origins in deployment validation.
- **SC-010**: No backend secret, Azure OpenAI key, or Foundry credential appears in shipped HTML, inline JavaScript, or CSS.
- **SC-011**: A push to the main branch triggers GitHub Actions deployment to Azure Static Web Apps without requiring a manual build step.
- **SC-012**: The live production site is accessible at `https://findsolace.io` with a valid SSL certificate.

## Assumptions

- Solace remains a static site composed of root-level HTML pages plus a shared `style.css`, with no framework, package manager, bundler, or server-rendered layer.
- The UI label may present the DIY page as "DIY" while the source file remains `labs.html` unless a separate feature renames the file.
- Existing Solace navigation, theme toggle, copy-to-clipboard labs behavior, and other baseline interactions must continue to work unchanged.
- The initial browser-side conversation memory is session-scoped via `sessionStorage`; any cross-session memory is optional until clarified.
- Azure resources can be provisioned in the Microsoft ecosystem already preferred for the project, including Azure Static Web Apps, APIM, and Azure AI services.
- The APIM instance used for Solace may already exist from prior lab work, but this feature may require policy changes and a dedicated chat operation.
- The content corpus used to ground the agent is limited to published Solace pages and approved tool guidance; the agent is not a general-purpose assistant.
- Solace continues to optimize for non-technical adults who need plain-language help, confidence-building, and concrete next steps rather than technical depth for its own sake.

## Open Questions

- **OQ-001 — APIM tier**: ✅ Resolved — Consumption tier. Pay-per-call pricing, supports required policies. Upgrade path available if traffic grows.
- **OQ-002 — APIM subscription key exposure**: ✅ Resolved — SWA managed API proxy hides the key server-side. Browser calls `/api/chat` on same origin.
- **OQ-003 — Agent orchestration path**: ✅ Resolved — Direct Azure OpenAI calls behind APIM. No Foundry Agent Service in this release.
- **OQ-004 — Domain readiness**: ✅ Resolved — `findsolace.io` is owned and available for Azure Static Web Apps custom domain configuration.
- **OQ-005 — Streaming protocol**: ✅ Resolved — Server-Sent Events (SSE) via Azure OpenAI's native streaming support. SSE is the standard for OpenAI chat completions and works through both SWA proxy and APIM without special configuration.
