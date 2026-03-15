# Research: Solace Agent

**Feature**: 003-solace-agent | **Date**: 2026-03-15

## Research Questions & Decisions

### R1 — SWA API Proxy: Can it forward to APIM without Azure Functions?

**Decision**: Yes — use SWA's built-in managed API route rewriting.

**Rationale**: Azure Static Web Apps supports route rewriting in `staticwebapp.config.json` that can forward `/api/*` requests to external endpoints. The SWA proxy injects headers (including secrets from Application Settings) server-side. This eliminates the need for Azure Functions as a middleware layer.

**Alternatives considered**:
- Azure Functions backend: Full control over request transformation, but adds cold start latency (~1-3s), compute costs, and deployment complexity. Rejected — overkill for a simple passthrough.
- Direct browser-to-APIM calls: Simplest frontend code, but exposes the APIM subscription key in browser DevTools. Rejected — security risk (FR-036).

**Key findings**:
- SWA rewrites are configured via `routes` array in `staticwebapp.config.json`
- Secrets are stored in SWA Application Settings and referenced as `%VARIABLE_NAME%` in headers
- SSE streaming passes through transparently — no special configuration needed
- SWA proxy timeout is ~240 seconds, well within chat response windows
- No request body transformation capability — APIM handles that

### R2 — APIM Consumption Tier: Does it support all required policies?

**Decision**: Yes — Consumption tier supports all needed features.

**Rationale**: APIM Consumption supports custom policies (inbound/outbound/error), Named Values for secret storage, CORS configuration, rate limiting by IP, and SSE passthrough. The only limitation is a ~4-minute connection timeout, which is acceptable for chat responses.

**Alternatives considered**:
- Basic tier (~$50/mo): Higher throughput, longer timeouts. Rejected — Solace's expected traffic (low) doesn't justify the cost.
- Standard tier (~$250/mo): Multi-region, VNet, caching. Rejected — enterprise features not needed for an educational site.

**Key findings**:
- Rate limiting: `rate-limit-by-key` policy with `X-Forwarded-For` or `context.Connection.RemoteIpAddress`
- CORS: Full policy support including `allowed-origins`, `allowed-methods`, `allowed-headers`
- Named Values: Secure storage for `api-key` header injection via `{{named-value-name}}` syntax
- SSE: Works with `buffer-request-body="false"` and `buffer-response-body="false"` in forward-request
- Error handling: `on-error` section supports custom JSON error responses for 429, 500, etc.
- Cost: ~$3.50/million calls, no monthly minimum

### R3 — Inline Markdown Rendering Without Libraries

**Decision**: Build a minimal markdown-to-HTML renderer (~60 lines of vanilla JS).

**Rationale**: The spec requires markdown rendering (paragraphs, emphasis, lists, links, inline code, fenced code blocks) but prohibits external JS files and npm. A lightweight custom renderer is feasible for this subset of markdown and avoids CDN dependencies.

**Alternatives considered**:
- marked.js via CDN: Full markdown support, well-tested. Rejected — adds external dependency, 28KB minified, and the full feature set (tables, footnotes, etc.) is unnecessary.
- showdown.js via CDN: Similar to marked, slightly smaller. Rejected — same dependency concern.
- DOMPurify + custom parser: Sanitization library + custom parsing. Rejected — DOMPurify alone is 14KB, and the custom parser still needed.

**Key findings**:
- Required features: `**bold**`, `*italic*`, `` `code` ``, `[link](url)`, `- lists`, `\n\n` paragraphs, `` ``` `` fenced code blocks
- Sanitization: Use a regex-based renderer that produces safe HTML (no innerHTML from user input, only from parsed assistant responses). Use `textContent` for code blocks.
- Size estimate: ~60-80 lines including sanitization
- Edge case: Nested emphasis (`***bold italic***`) — handled by ordering regex replacements

### R4 — SSE Streaming in Vanilla JS (No EventSource)

**Decision**: Use `fetch()` with `ReadableStream` for SSE parsing.

**Rationale**: The native `EventSource` API only supports GET requests. Azure OpenAI's streaming endpoint requires POST with a JSON body. The `fetch()` API with `response.body.getReader()` provides full control over POST+stream.

**Alternatives considered**:
- EventSource polyfill: Would enable EventSource-style API for POST. Rejected — adds external dependency.
- XMLHttpRequest with `onprogress`: Works but less clean API. Rejected — `fetch` + ReadableStream is the modern standard.

**Key findings**:
- Parse SSE format: lines starting with `data: ` followed by JSON
- Handle `data: [DONE]` sentinel to close the stream
- Use `TextDecoder` for chunk decoding
- Buffer partial lines across chunks (SSE lines can split across chunk boundaries)
- Error handling: check `response.ok` before starting stream, handle network interruption mid-stream

### R5 — Widget Focus Management & Accessibility Patterns

**Decision**: Follow WAI-ARIA dialog pattern with `role="dialog"` and focus trap.

**Rationale**: The chat panel is functionally a non-modal dialog (user can still scroll the page). WAI-ARIA provides clear patterns for this: `role="dialog"`, `aria-label`, focus management on open/close, and `aria-live="polite"` for new messages.

**Alternatives considered**:
- HTML `<dialog>` element: Native dialog with `showModal()`. Rejected — modal behavior blocks page interaction, and `show()` (non-modal) has limited browser focus management.
- Custom focus trap: DIY Tab key interception. Considered — may be needed as enhancement, but base behavior uses `role="dialog"` + manual focus management.

**Key findings**:
- Open: move focus to the text input (composer)
- Close: return focus to the launcher button (FR-057)
- New messages: `aria-live="polite"` region announces new assistant responses
- Loading state: `aria-busy="true"` on the transcript during streaming
- Keyboard: Escape key closes panel, Enter sends message, Shift+Enter inserts newline
- Screen reader: message role announced ("You said:", "Solace Guide says:")

### R6 — Azure Static Web Apps Deployment Workflow

**Decision**: Use the standard SWA GitHub Actions workflow with no build step.

**Rationale**: SWA provides an official `Azure/static-web-apps-deploy@v1` GitHub Action. Since Solace has no build system, the action deploys the root directory directly. The `app_location` is `/` and `skip_app_build` is `true`.

**Alternatives considered**:
- Azure CLI deployment: `az staticwebapp deploy`. Rejected — less integrated with GitHub, no automatic PR previews.
- Manual FTP/zip upload: Direct deployment. Rejected — no CI/CD automation.

**Key findings**:
- Workflow trigger: push to `main` branch
- Action: `Azure/static-web-apps-deploy@v1`
- Config: `app_location: "/"`, `skip_app_build: true`, `output_location: ""`
- Secret: `AZURE_STATIC_WEB_APPS_API_TOKEN` stored in GitHub repository secrets
- PR previews: Automatic staging environments for pull requests (bonus feature)

### R7 — Custom Domain & SSL for findsolace.io

**Decision**: Standard SWA custom domain setup with Azure-managed SSL.

**Rationale**: SWA provides automatic SSL certificate provisioning once DNS validation completes. The domain `findsolace.io` is owned and ready.

**Key findings**:
- DNS validation: TXT record `_dnsauth.findsolace.io` → validation token from Azure portal
- WWW subdomain: CNAME `www` → `<app-name>.azurestaticapps.net`
- Apex domain: Requires ALIAS/ANAME record (or Azure DNS zone if registrar doesn't support ALIAS)
- SSL: Automatic provisioning after DNS validation, no manual certificate management
- Redirect: Configure `www` → apex (or vice versa) in `staticwebapp.config.json`
