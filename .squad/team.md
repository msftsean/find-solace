# Squad Team

> Wakanda Forever — protecting the people through technology they can trust.

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| T'Challa | Lead Architect | `.squad/agents/tchalla/charter.md` | ✅ Active |
| Shuri | Engineer | `.squad/agents/shuri/charter.md` | ✅ Active |
| Okoye | QA & Security Lead | `.squad/agents/okoye/charter.md` | ✅ Active |
| Nakia | UX & Content Specialist | `.squad/agents/nakia/charter.md` | ✅ Active |
| M'Baku | Code Reviewer | `.squad/agents/mbaku/charter.md` | ✅ Active |
| Scribe | Session Logger | `.squad/agents/scribe/charter.md` | 📋 Silent |
| Ralph | Work Monitor | — | 🔄 Monitor |

## Coding Agent

<!-- copilot-auto-assign: false -->

| Name | Role | Charter | Status |
|------|------|---------|--------|
| @copilot | Coding Agent | — | 🤖 Coding Agent |

### Capabilities

**🟢 Good fit — auto-route when enabled:**
- Bug fixes with clear reproduction steps
- Test coverage (adding missing tests, fixing flaky tests)
- Lint/format fixes and code style cleanup
- Dependency updates and version bumps
- Small isolated features with clear specs
- Boilerplate/scaffolding generation
- Documentation fixes and README updates

**🟡 Needs review — route to @copilot but flag for squad member PR review:**
- Medium features with clear specs and acceptance criteria
- Refactoring with existing test coverage
- New page sections following established patterns
- Lab card additions with copy-paste prompts

**🔴 Not suitable — route to squad member instead:**
- Architecture decisions and system design
- Multi-system integration (e.g., Azure APIM chat feature)
- Ambiguous requirements needing clarification
- Security-critical changes (API keys, auth, CORS)
- Content strategy and brand voice decisions
- Design system changes (color palette, typography scale)

## Project Context

- **Owner:** msftsean
- **Stack:** HTML5, CSS3 (custom properties, Grid, Flexbox, clamp()), vanilla JavaScript, no build system
- **Description:** A static educational site helping everyday people understand and use AI tools for practical tasks in their personal and professional lives
- **Created:** 2026-03-15
