# Squad ↔ Anvil ↔ Spec Kit Integration

> How the Wakanda squad executes structured development workflows.

## Anvil Loop → Squad Dispatch

When executing an Anvil task, the coordinator dispatches steps to Squad members:

| Anvil Step | Squad Member | What They Do |
|------------|-------------|--------------|
| **0. Boost** | T'Challa | Refines the prompt into a precise specification |
| **0b. Git Hygiene** | Coordinator | Direct mode — no agent spawn needed |
| **1. Understand** | T'Challa | Parses goal, acceptance criteria, assumptions |
| **1b. Recall** | Coordinator | Direct mode — SQL query, no agent spawn |
| **2. Survey** | Shuri | Searches codebase for reusable code and patterns |
| **3. Plan** | T'Challa | Plans which files change, risk classification |
| **3b. Baseline** | Okoye | Captures pre-change diagnostics and test state |
| **4. Implement** | Shuri | Writes the code, follows existing patterns |
| **5a. IDE Diagnostics** | Okoye | Runs diagnostics on all changed files |
| **5b. Verification Cascade** | Okoye | Parse checks, build, lint, tests — all tiers |
| **5c. Adversarial Review** | M'Baku | Code review via subagents, challenges assumptions |
| **5d. Operational Readiness** | Okoye | Secrets, degradation, observability checks |
| **5e. Evidence Bundle** | Okoye | Generates verification report from SQL ledger |
| **6. Learn** | Scribe | Stores confirmed facts to memory |
| **7. Present** | Coordinator | Assembles final output for the user |
| **8. Commit** | Coordinator | Direct mode — git commit and report |
| **Content changes** | Nakia | Reviews any content/copy changes for brand voice |

### Parallel Opportunities

These steps can run simultaneously:
- **Shuri (implement)** + **Okoye (write test cases)** — TDD style
- **M'Baku (review)** + **Nakia (content review)** — when changes include both code and content
- **Okoye (baseline)** + **Shuri (survey)** — baseline capture while surveying codebase

## Spec Kit Workflow → Squad Dispatch

| Spec Kit Command | Lead | Supporting | What Happens |
|-----------------|------|-----------|--------------|
| `/speckit.specify` | T'Challa | Nakia | T'Challa writes the spec; Nakia reviews user stories for clarity and audience fit |
| `/speckit.clarify` | Nakia | T'Challa | Nakia drives clarification questions (user-facing); T'Challa handles technical questions |
| `/speckit.plan` | T'Challa | Shuri | T'Challa architects the plan; Shuri validates technical feasibility |
| `/speckit.tasks` | T'Challa | Okoye | T'Challa breaks down tasks; Okoye identifies testing tasks |
| `/speckit.checklist` | Okoye | — | Okoye creates and validates quality checklists |
| `/speckit.implement` | Shuri | Okoye, M'Baku | Shuri builds; Okoye verifies each phase; M'Baku reviews before phase completion |
| `/speckit.analyze` | M'Baku | — | M'Baku runs consistency analysis across specs |
| `/speckit.constitution` | T'Challa | Nakia | T'Challa defines technical constitution; Nakia ensures brand/content rules |
| `/speckit.taskstoissues` | T'Challa | — | T'Challa triages and creates GitHub issues from tasks |

## Combined Workflow: Spec Kit → Anvil

When `/speckit.implement` triggers an Anvil task:

```
1. T'Challa reads tasks.md, selects next task        (Anvil Step 1: Understand)
2. Shuri surveys codebase for patterns                (Anvil Step 2: Survey)
3. T'Challa plans the implementation approach         (Anvil Step 3: Plan)
4. Okoye captures baseline diagnostics                (Anvil Step 3b: Baseline)
5. Shuri implements the change                        (Anvil Step 4: Implement)
6. Okoye runs full verification cascade               (Anvil Step 5a-5b: Verify)
7. M'Baku runs adversarial review                     (Anvil Step 5c: Review)
8. Nakia reviews content changes (if any)             (Content gate)
9. Scribe logs the session                            (Anvil Step 6: Learn)
10. Coordinator commits and reports                   (Anvil Step 7-8: Present + Commit)
```

## Escalation Rules

| Situation | Action |
|-----------|--------|
| Shuri's implementation fails verification twice | T'Challa steps in to reassess the approach |
| M'Baku rejects a review | Different agent revises (never the original author) |
| Nakia flags content/brand issues | Block merge until resolved |
| Okoye finds a security concern | Escalate to T'Challa — 🔴 risk, full Anvil Loop required |
| Baseline is already broken | Okoye notes it; team proceeds but must not make it worse |

## Model Preferences

| Squad Member | Preferred Model | Rationale |
|-------------|----------------|-----------|
| T'Challa | claude-sonnet-4.6 | Strategic reasoning, architectural decisions |
| Shuri | claude-sonnet-4.6 | Code generation quality |
| Okoye | claude-haiku-4.5 | Fast verification, structured checks |
| Nakia | claude-sonnet-4.6 | Content quality and nuance |
| M'Baku | gpt-5.3-codex | Adversarial review benefits from different model family |
| Scribe | claude-haiku-4.5 | Logging and memory — speed over depth |
