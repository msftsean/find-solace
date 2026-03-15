# Data Model: Solace Agent

**Feature**: 003-solace-agent | **Date**: 2026-03-15

## Entities

### ChatSession

The root state object for one visitor's interaction with the Solace Agent within a single browser session.

| Field | Type | Description |
|-------|------|-------------|
| `messages` | `Message[]` | Ordered array of all conversation messages (capped at 20) |
| `pageContext` | `PageContext` | Current page metadata, updated on each request |
| `visitorProfile` | `VisitorProfile \| null` | Conversationally gathered visitor info, initially null |
| `isOpen` | `boolean` | Whether the chat panel is currently expanded |
| `createdAt` | `string (ISO 8601)` | Session start timestamp |

**Storage**: `sessionStorage['solace-chat']` — serialized as JSON.

**Lifecycle**:
- Created: First time visitor opens the widget (lazy initialization)
- Updated: After every message send/receive, page navigation, or profile capture
- Destroyed: When the browser tab/window closes (sessionStorage behavior)

**History window**: Only the last 10 message pairs (20 messages) are sent to the API. All messages are kept in sessionStorage for transcript display, but the API payload is trimmed.

---

### Message

A single turn in the conversation.

| Field | Type | Description |
|-------|------|-------------|
| `role` | `'user' \| 'assistant' \| 'system'` | Message author role |
| `content` | `string` | Message text (markdown for assistant, plain text for user) |
| `timestamp` | `string (ISO 8601)` | When the message was created |
| `status` | `'sent' \| 'streaming' \| 'complete' \| 'error'` | Rendering/delivery state |
| `errorDetail` | `string \| null` | Human-readable error description if status is 'error' |

**State transitions**:
```
User messages:    → sent → complete (immediate, no streaming)
Assistant messages: → streaming → complete
                    → streaming → error (stream interrupted)
                    → error (request failed before streaming started)
```

**Validation**:
- `content` must be non-empty and non-whitespace for user messages
- `role` must be one of the three allowed values
- System messages are never displayed in the transcript (used only in API payload)

---

### PageContext

Metadata about the visitor's current location on the Solace site. Updated on every API request.

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | Full page URL (`window.location.href`) |
| `title` | `string` | Page title (`document.title`) |
| `pageName` | `'index' \| 'home' \| 'work' \| 'labs'` | Derived from URL path |
| `activeExercise` | `ExerciseContext \| null` | Currently expanded DIY exercise (labs.html only) |

---

### ExerciseContext

Metadata about the currently active DIY exercise on labs.html. Null on other pages or when no exercise is expanded.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Exercise HTML element ID (e.g., `trip-planner`, `email-drafting`) |
| `title` | `string` | Exercise display title (e.g., "Email Drafting Assistant") |
| `tool` | `string` | Recommended AI tool (e.g., "Claude", "Perplexity") |
| `duration` | `string` | Estimated completion time (e.g., "5 min") |

**Source**: Extracted from `labs.html` DOM — the `.lab-card` with `aria-expanded="true"`.

---

### VisitorProfile

Lightweight, conversationally gathered facts about the visitor. Used for personalized recommendations.

| Field | Type | Description |
|-------|------|-------------|
| `role` | `string \| null` | Self-described role (e.g., "parent", "manager", "job seeker") |
| `goals` | `string[] \| null` | What they want to accomplish with AI |
| `confidenceLevel` | `'beginner' \| 'intermediate' \| 'comfortable' \| null` | AI comfort level |
| `completedExercises` | `string[]` | IDs of exercises they've reported completing |
| `interests` | `string[]` | Topic areas of interest |

**Population**: The system prompt instructs the agent to gather these details conversationally. The frontend stores agent-extracted profile data in `sessionStorage` alongside the chat session.

**Note**: Profile is session-scoped only. No cross-session persistence.

---

### ChatRequest

The payload sent from the browser to the SWA API proxy.

| Field | Type | Description |
|-------|------|-------------|
| `messages` | `{role, content}[]` | Conversation history (last 10 pairs + system prompt) |
| `stream` | `boolean` | Always `true` — SSE streaming enabled |
| `max_tokens` | `number` | Response length cap (default: 800) |
| `temperature` | `number` | Creativity setting (default: 0.7) |
| `pageContext` | `PageContext` | Current page metadata for grounding |

**Note**: The system prompt is prepended to the `messages` array as the first element with `role: 'system'`. It includes the full Solace site knowledge, voice instructions, and current page context.

---

### ChatResponse (SSE stream)

Each SSE chunk from Azure OpenAI follows this format:

```
data: {"id":"...","choices":[{"delta":{"content":"token"},"finish_reason":null}]}
```

Final chunk:
```
data: [DONE]
```

**Error responses** (non-streaming, from APIM):

| HTTP Status | Meaning | Widget Behavior |
|-------------|---------|-----------------|
| 429 | Rate limit exceeded | "You're asking great questions! Let's take a brief pause — try again in about a minute." |
| 500 | Backend error | "Something went wrong on my end. Your message is still here — try sending it again." |
| 503 | Service unavailable | "I'm temporarily unavailable. The guides and exercises are still here for you to explore." |
| 408 | Timeout | "That took longer than expected. Try asking a shorter question, or I can try again." |

## Relationships

```
ChatSession 1──* Message
ChatSession 1──1 PageContext
ChatSession 1──? VisitorProfile
PageContext  1──? ExerciseContext
ChatRequest  *──1 PageContext
ChatRequest  *──* Message (subset: last 10 pairs)
```

## Exercise Reference Table

The system prompt includes knowledge of all 6 DIY exercises for personalized recommendations:

| ID | Title | Tool | Duration | Category | Difficulty | Best For |
|----|-------|------|----------|----------|------------|----------|
| `trip-planner` | Weekend Trip Planner | Perplexity | 15 min | Home Life | Beginner | Anyone planning travel |
| `budget-checkin` | Budget Check-In | Claude | 10 min | Home Life | Beginner | Personal finance |
| `resume-refresh` | Resume Refresh | Claude | 20 min | Work Life | Intermediate | Job seekers |
| `meeting-prep` | Meeting Prep Brief | Perplexity | 10 min | Work Life | Beginner | Professionals |
| `email-drafting` | Email Drafting Assistant | Claude | 5 min | Everyday | Beginner | Everyone (fastest win) |
| `meal-planner` | Weekly Meal Planner | Perplexity | 10 min | Home Life | Beginner | Meal prep, families |
