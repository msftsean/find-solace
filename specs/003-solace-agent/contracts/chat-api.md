# API Contract: Solace Agent Chat

**Feature**: 003-solace-agent | **Date**: 2026-03-15

## Endpoint

```
POST /api/chat
Host: findsolace.io (SWA)
Content-Type: application/json
```

The browser calls `/api/chat` on the same origin. SWA rewrites this to the APIM endpoint and injects the `Ocp-Apim-Subscription-Key` header server-side. The browser never knows the APIM URL or key.

## Request

### Headers

| Header | Value | Source |
|--------|-------|--------|
| `Content-Type` | `application/json` | Browser |
| `Ocp-Apim-Subscription-Key` | `{key}` | SWA (injected server-side) |

### Body

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are the Solace Guide — a warm, knowledgeable companion..."
    },
    {
      "role": "user",
      "content": "What's a good first exercise for a job seeker?"
    },
    {
      "role": "assistant",
      "content": "Great question! I'd recommend starting with..."
    },
    {
      "role": "user",
      "content": "Can you help me fill in the resume prompt?"
    }
  ],
  "stream": true,
  "max_tokens": 800,
  "temperature": 0.7
}
```

### Field Constraints

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `messages` | array | Yes | 1–21 items (1 system + up to 20 conversation messages) |
| `messages[].role` | string | Yes | One of: `system`, `user`, `assistant` |
| `messages[].content` | string | Yes | Non-empty string |
| `stream` | boolean | Yes | Must be `true` |
| `max_tokens` | integer | No | Default: 800, max: 1200 |
| `temperature` | number | No | Default: 0.7, range: 0.0–1.0 |

### System Prompt Composition

The system prompt is built client-side by concatenating:

1. **Base prompt**: Static Solace Guide personality, knowledge, and boundaries
2. **Page context block**: Dynamic, appended per request

```
[Base system prompt]

---
Current visitor context:
- Page: {pageContext.pageName} ({pageContext.title})
- URL: {pageContext.url}
- Active exercise: {pageContext.activeExercise.title || "None"}
- Exercise tool: {pageContext.activeExercise.tool || "N/A"}
```

## Response

### Success — SSE Stream (200 OK)

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

Each line:
```
data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

### Error Responses

All error responses are JSON (not SSE):

#### 429 — Rate Limited (APIM policy)

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please wait before trying again.",
  "retry_after": 60
}
```

#### 400 — Bad Request

```json
{
  "error": "bad_request",
  "message": "Invalid request format."
}
```

#### 500 — Internal Server Error

```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred.",
  "request_id": "abc-123"
}
```

#### 503 — Service Unavailable

```json
{
  "error": "service_unavailable",
  "message": "The AI service is temporarily unavailable."
}
```

## APIM Policy Chain

```
Inbound:
  1. CORS check (allow findsolace.io only)
  2. Rate limit (20 req/min per IP via X-Forwarded-For)
  3. Validate Content-Type is application/json
  4. Inject api-key header from Named Value
  5. Set X-Request-Id for tracing

Backend:
  Forward to Azure OpenAI chat completions endpoint
  buffer-request-body: false (streaming)

Outbound:
  1. Pass through SSE headers (Content-Type: text/event-stream)
  2. Add security headers (X-Content-Type-Options, X-Frame-Options)

On-Error:
  Return visitor-safe JSON error with appropriate HTTP status
```

## SWA Configuration

```json
{
  "routes": [
    {
      "route": "/api/chat",
      "methods": ["POST"],
      "rewrite": "https://{apim-instance}.azure-api.net/solace/chat/completions"
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/api/*"]
  }
}
```

## Rate Limits

| Limit | Value | Enforced By |
|-------|-------|-------------|
| Requests per minute per IP | 20 | APIM `rate-limit-by-key` policy |
| Max tokens per response | 800 (configurable to 1200) | Request body `max_tokens` |
| Conversation history window | 10 message pairs (20 messages) | Frontend (before sending) |
| Max request body size | ~30KB | SWA proxy limit |
