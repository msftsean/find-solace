# Feature Specification: AI Chat Widget

**Feature Branch**: `002-ai-chat`
**Created**: 2026-03-15
**Status**: Draft
**Input**: Add an AI chat widget powered by Azure OpenAI GPT-4o via Azure API Management (Consumption tier) proxy. The chat helps visitors ask questions about AI tools and get personalized guidance based on the Solace content.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask a Quick Question About AI Tools (Priority: P1)

A visitor is reading the Solace guide and has a specific question — "Which AI tool should I use for meal planning?" or "Can AI help me write a cover letter?" They click a chat icon in the corner, type their question in plain language, and get a helpful, conversational response in Solace's warm tone. The response references relevant Solace content and recommends specific free tools.

**Why this priority**: This is the core value proposition — turning passive reading into interactive guidance. Without this, the chat widget has no purpose.

**Independent Test**: Can be tested by opening any page, clicking the chat icon, typing a question, and verifying a relevant response appears within 5 seconds.

**Acceptance Scenarios**:

1. **Given** a visitor on any Solace page, **When** they click the chat icon, **Then** a chat panel opens with a greeting message and input field
2. **Given** a visitor with the chat panel open, **When** they type a question and press Enter (or click Send), **Then** a loading indicator appears and a response streams in within 5 seconds
3. **Given** a visitor asks about a topic covered on the site, **When** the response is generated, **Then** it references relevant Solace content (e.g., "Check out our Home Life guide for more on budgeting") and recommends Claude or Perplexity
4. **Given** a visitor asks a question unrelated to AI tools, **When** the response is generated, **Then** the assistant politely redirects: "I'm here to help with AI tools for everyday tasks — try asking about taxes, budgeting, career growth, or any of our labs!"

---

### User Story 2 - Continue a Conversation (Priority: P2)

A visitor asks a follow-up question after the initial response. The chat maintains context within the current session so the conversation feels natural and the assistant can build on previous answers.

**Why this priority**: Multi-turn conversation is essential for a useful chat experience, but depends on the basic single-turn flow working first.

**Independent Test**: Can be tested by asking an initial question, then a follow-up that references the first answer, and verifying the response is contextually aware.

**Acceptance Scenarios**:

1. **Given** a visitor has received a response, **When** they ask a follow-up question, **Then** the assistant's response incorporates context from the previous exchange
2. **Given** a visitor has an ongoing conversation, **When** they navigate to a different Solace page, **Then** the conversation history persists in the chat panel
3. **Given** a visitor has been chatting, **When** they close the chat panel and reopen it, **Then** the conversation history is still visible within the same browser session

---

### User Story 3 - Chat on Mobile (Priority: P2)

A mobile visitor uses the chat widget. The chat panel adapts to the smaller viewport — it may take the full screen or a large portion of it — and all touch interactions work correctly.

**Why this priority**: Mobile is a primary use case for the target audience. The chat must not break the existing mobile experience.

**Independent Test**: Can be tested by opening the chat on a viewport below 768px and verifying it's usable with touch input.

**Acceptance Scenarios**:

1. **Given** a visitor on a mobile device, **When** they tap the chat icon, **Then** the chat panel opens in a mobile-optimized layout (full-width or near-full-width)
2. **Given** a mobile visitor with the chat open, **When** they type a message, **Then** the virtual keyboard does not obscure the input field or latest messages
3. **Given** a mobile visitor, **When** they tap a close button or swipe to dismiss, **Then** the chat panel closes and the page content is fully accessible again

---

### User Story 4 - Chat Respects Dark Mode (Priority: P3)

The chat widget's colors adapt to the current theme (light or dark mode), consistent with the rest of the site.

**Why this priority**: Visual consistency matters but is not blocking for the core chat functionality.

**Independent Test**: Toggle dark mode with the chat open and verify all chat elements switch themes correctly.

**Acceptance Scenarios**:

1. **Given** a visitor in dark mode, **When** they open the chat, **Then** the chat panel uses dark mode colors (dark background, light text) matching the site's design tokens
2. **Given** a visitor with the chat open, **When** they toggle the theme, **Then** the chat panel colors update immediately without requiring a re-open

---

### Edge Cases

- What happens when the APIM endpoint is unreachable or returns an error? The chat displays a friendly error message: "I'm having trouble connecting right now. Try again in a moment, or explore our guides directly."
- What happens when the user sends an empty message? The Send button is disabled when the input is empty; pressing Enter with no text does nothing.
- What happens when the Azure OpenAI API returns a rate limit (429)? The chat shows: "I'm getting a lot of questions right now — please try again in a few seconds."
- What happens when the response is very long? The chat panel scrolls to keep the latest content visible; the user can scroll up to read earlier parts.
- What happens when JavaScript is disabled? The chat icon does not appear; no broken UI is shown. The site continues to function normally without the chat feature.
- What happens when the user tries to paste sensitive information (SSN, passwords)? The system prompt instructs the model not to process or store sensitive data and to warn the user.

## Requirements *(mandatory)*

### Functional Requirements

**Chat UI**
- **FR-001**: Site MUST display a floating chat icon (bottom-right corner) on all four pages
- **FR-002**: Clicking the chat icon MUST open a chat panel with a greeting message, conversation area, and text input with Send button
- **FR-003**: Chat panel MUST support closing via a close button (and Escape key on desktop)
- **FR-004**: Chat panel MUST auto-scroll to the latest message when new content arrives
- **FR-005**: Chat input MUST support Enter to send and Shift+Enter for new line
- **FR-006**: Send button MUST be disabled when the input field is empty
- **FR-007**: Chat panel MUST display a loading indicator while waiting for a response

**Conversation**
- **FR-008**: Chat MUST maintain conversation history within the current browser session (not persisted across sessions)
- **FR-009**: Conversation history MUST persist when navigating between Solace pages within the same session
- **FR-010**: Chat MUST support multi-turn conversation with context maintained across messages (conversation history sent to the API)
- **FR-011**: Chat MUST limit conversation history to the most recent 20 messages to control token usage and API costs

**Backend Proxy (Azure API Management)**
- **FR-012**: Chat requests MUST be routed through an Azure API Management (Consumption tier) endpoint — the Azure OpenAI API key MUST NOT be exposed in client-side code
- **FR-013**: APIM policy MUST restrict CORS to the Solace GitHub Pages domain only
- **FR-014**: APIM policy MUST enforce a rate limit per IP (e.g., 20 requests per minute) to prevent abuse
- **FR-015**: APIM policy MUST set a maximum token limit per request (e.g., 800 max_tokens) to control costs

**System Prompt & Behavior**
- **FR-016**: The system prompt MUST instruct the model to respond in Solace's warm, jargon-free tone
- **FR-017**: The system prompt MUST limit responses to AI tool guidance and redirect off-topic questions
- **FR-018**: The system prompt MUST include awareness of Solace content (pages, labs, tools featured) so responses can reference specific guides
- **FR-019**: The model MUST warn users not to share sensitive personal information and MUST NOT process or store it if shared

**Accessibility**
- **FR-020**: Chat icon and panel MUST be keyboard-navigable (Tab to reach, Enter to open, Escape to close)
- **FR-021**: Chat panel MUST use appropriate ARIA attributes (`role="dialog"`, `aria-label`, `aria-live="polite"` for new messages)
- **FR-022**: Chat MUST work with screen readers — messages announced as they arrive

**Design**
- **FR-023**: Chat panel MUST use existing Solace design tokens (colors, typography, spacing, radius) from style.css
- **FR-024**: Chat MUST support both light and dark modes using existing CSS custom properties
- **FR-025**: Chat icon and panel MUST be responsive across all breakpoints (640px, 768px, 1024px)

### Key Entities

- **Chat Session**: A conversation between the visitor and the AI assistant, stored in browser sessionStorage. Contains an ordered list of Messages. Scoped to a single browser session.
- **Message**: A single exchange unit with role (user or assistant), content (text), and timestamp. User messages are plain text; assistant messages may contain markdown-style formatting.
- **System Prompt**: A hidden instruction message sent with every API request that defines the assistant's personality, knowledge scope, and behavioral constraints. Not visible to the user.
- **APIM Proxy**: Azure API Management endpoint (Consumption tier) that holds the Azure OpenAI API key, enforces CORS, rate limits, and token caps, and forwards requests to the GPT-4o deployment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Chat responses appear within 5 seconds of sending a message on broadband
- **SC-002**: Chat widget renders correctly on all 4 pages in both light and dark modes
- **SC-003**: Chat is fully keyboard-navigable and screen-reader compatible
- **SC-004**: Conversation context is maintained across at least 10 back-and-forth exchanges within a session
- **SC-005**: Chat panel works on mobile viewports down to 320px width
- **SC-006**: Error states (network failure, rate limit, API error) display user-friendly messages instead of raw errors
- **SC-007**: Azure OpenAI API key is not present anywhere in client-side code, HTML, or JavaScript
- **SC-008**: APIM rate limiting correctly blocks requests exceeding 20/minute per IP
- **SC-009**: Existing site functionality (navigation, dark mode, labs, animations) continues to work unchanged with the chat widget present

## Assumptions

- Azure API Management (Consumption tier) is provisioned and configured by the developer before implementation begins
- The Azure OpenAI GPT-4o deployment is already active and accessible via the APIM proxy endpoint
- The APIM endpoint URL will be stored as a configuration value in the JavaScript (not a secret — it's CORS-restricted and rate-limited)
- Chat conversation history is ephemeral (sessionStorage) — no server-side storage of conversations
- The chat widget is implemented as inline HTML/CSS/JS consistent with the existing site architecture (no frameworks, no build system)
- The system prompt will be maintained as a JavaScript constant and updated when site content changes
- Token costs are controlled via APIM policy (max_tokens cap) and conversation history limits (20 messages)
