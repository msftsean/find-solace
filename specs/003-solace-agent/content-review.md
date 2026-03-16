# Solace Agent — Content & Brand Voice Review

**Reviewer:** Nakia, UX & Content Specialist  
**Date:** 2025-07-15  
**Artifact reviewed:** System Prompt for the Agent (lines 166–200 of `solace-copilot-prompt.md`)  
**Reference materials:** `index.html`, `home.html`, project constitution (`.github/copilot-instructions.md`)

---

## 1. Voice Alignment

### Overall verdict: **Mostly aligned, with gaps**

The prompt establishes the right foundation — warm, jargon-aware, non-condescending. But the site's actual voice goes further than the prompt captures.

| Voice Trait | Site Does It | Prompt Captures It | Gap? |
|---|---|---|---|
| Speaks like a knowledgeable friend | ✅ "like a brilliant travel-savvy friend" | ✅ "patient friend, not a tech support bot" | None |
| Plain language over jargon | ✅ "ask it a question in plain English" | ✅ "avoid jargon; explain technical terms immediately" | None |
| Permission-giving reassurance | ✅ "You don't understand your car engine either" | ⚠️ Mentioned but not modeled | Partial |
| Metaphors & analogies | ✅ Spell-check, research assistant, travel friend | ❌ Not mentioned | **Missing** |
| Concrete benefits & outcomes | ✅ "$800 in deductions", "2-week trip in one afternoon" | ❌ Not mentioned | **Missing** |
| Honest about limitations | ✅ "What AI can't do (yet)" | ✅ "If you're unsure, say so" | Partial (see §3) |
| Optimistic, never hype | ✅ "practical apps you can use today" | ⚠️ Implied but not explicit | Partial |
| Short paragraphs, occasional humor | ✅ "Forget everything you've seen in the movies" | ✅ Stated directly | None |

### Specific gap: the prompt has no modeling guidance

The site doesn't just *describe* the voice — it *demonstrates* it with consistent rhetorical moves: a light pivot ("AI isn't about robots — it's about…"), the honest caveat framed as relief not warning ("AI won't file your taxes for you — but…"), and the permission statement ("you don't need to understand how it works"). The system prompt describes personality traits but never shows the agent how to apply them in structure or phrasing.

**Recommendation:** Add one or two example exchanges in the system prompt (few-shot style) that show the voice in action, not just describe it.

---

## 2. Brand Compliance

### 2a. Tool recommendations

**Finding: Mostly correct, one ambiguity**

The prompt lists: *Claude, Perplexity, Copilot, NotebookLM, ElevenLabs* — all consistent with site content. The ChatGPT exclusion is stated clearly.

However, the prompt names **Copilot** as a recommended tool. This is correct per brand rules (Microsoft Copilot is approved), but the word alone is ambiguous — Microsoft Copilot (the consumer product) is fine; GitHub Copilot (a developer tool) is out of scope for a non-technical audience. The prompt should specify "Microsoft Copilot" to avoid the agent accidentally steering users toward a developer product.

### 2b. Audience framing

**Finding: Good, one drift risk**

The prompt says "many visitors have never used AI tools before" — accurate to the 25–65 non-technical target. But the "in-context Q&A" capability in the spec includes answering questions like *"what's an OpenAPI spec?"* — a question that implies a user deep in a technical Azure lab. The system prompt doesn't distinguish between Solace's editorial audience (the majority) and its more technically-adventurous labs audience. If the agent answers "what's an OpenAPI spec" with real technical depth, it risks breaking the jargon-free voice promise for everyone watching the conversation.

**Recommendation:** Add a note that even technical questions should be answered at the *simplest possible level first*, with the user able to ask for more detail.

### 2c. Diversity & representation

**Finding: Not addressed in system prompt**

The constitution requires imagery to feature primarily Black men and women. While the system prompt can't control images, it *can* control how the agent talks about scenarios and examples. The prompt gives no guidance on inclusive language or representative personas when building example prompts (e.g., the prompt builder feature). This is a minor gap but worth closing.

**Recommendation:** Add a line: "When offering example scenarios, use diverse names, roles, and situations that reflect a broad range of people."

---

## 3. Safety Boundaries

### 3a. Redirect phrasing: **On-brand and natural**

> "That's outside my wheelhouse, but I can help you find an AI tool that might be able to help with that."

This is genuinely good — it sounds like a person, not a policy. "Wheelhouse" is colloquial and warm, the pivot to action ("I can help you find") keeps it forward-moving rather than a dead end. No changes needed here.

### 3b. Scope definition: **Too vague**

"You only answer questions related to AI tools, the Solace content, and the exercises" is broad enough that the agent could justify answering almost anything ("but AI tools can be used for *anything*, so…"). The boundary needs sharper guardrails:

- What does "AI tools" mean here — just the tools on the site, or any AI tool ever? If a user asks "how do I jailbreak Claude?" is that in-scope because it's about Claude?
- The prompt says nothing about sensitive or personally distressing topics (e.g., a user expressing financial hardship or anxiety). The site's audience is adults who mention stress in their lives (tax anxiety, work pressure) — the agent should be warm but not try to be a counselor.

**Recommendation:** Add explicit out-of-scope categories: medical/legal/financial advice (beyond tool introductions), emotionally sensitive topics, and instructions that misuse AI tools. Add a warmer fallback for emotionally-loaded messages: *"That sounds stressful. I'm not the right support for that, but here's what I can help with…"*

### 3c. Fact accuracy: **Good but under-specified**

"Never invent facts about AI tools" is the right intent, but the agent needs to understand *what it means to be uncertain* about fast-moving AI features. Model capabilities change weekly. The prompt should encourage the agent to cite its training cutoff when discussing specific feature availability, e.g., *"As of when I was last updated…"*

---

## 4. The ChatGPT/OpenAI Instruction vs. Azure OpenAI Backend

### Finding: **This is a real risk. The instruction is ambiguous and needs surgical clarification.**

The prompt says:
> "You do NOT recommend ChatGPT or any OpenAI consumer products"

The agent *runs on Azure OpenAI* — which is an OpenAI model, licensed by Microsoft and served through Azure. If the agent takes this instruction broadly, it could:

1. **Refuse to acknowledge its own nature** if a user asks "Are you built on ChatGPT?" — creating a weird, evasive response that damages trust.
2. **Interpret "OpenAI consumer products" too narrowly** and accidentally recommend ChatGPT anyway, assuming Azure OpenAI is different enough.
3. **Create a logical contradiction** the agent is aware of, which may produce inconsistent behavior across conversations.

The intent of this instruction is clearly about *content recommendations* — don't tell users to sign up for ChatGPT.com or use OpenAI's own apps. It is not saying "deny that AI language models exist" or "hide your own nature."

**Recommended clarification — replace the current line with:**

```
You do NOT recommend ChatGPT or any OpenAI consumer products as tools for users 
to sign up for or use directly. The tools you recommend are: Claude (Anthropic), 
Perplexity, Microsoft Copilot, NotebookLM, and ElevenLabs.

Note: You run on Azure AI infrastructure. If asked directly what technology 
powers you, you may say you are powered by Azure AI — you do not need to 
elaborate further on the underlying model architecture.
```

This preserves the brand intent (no ChatGPT promotion), avoids the logical contradiction, and gives the agent a clean answer for the "what are you built on?" question that will definitely come up.

---

## 5. Summary of Recommendations

| Priority | Issue | Action |
|---|---|---|
| 🔴 High | ChatGPT exclusion instruction is ambiguous vs. Azure OpenAI backend | Rewrite exclusion rule to scope to "consumer product recommendations only"; add Azure AI identity guidance |
| 🔴 High | Safety scope too vague | Add explicit out-of-scope categories; add warm fallback for distressed users |
| 🟡 Medium | No analogy/metaphor guidance | Add 1–2 example exchanges (few-shot) to model the voice in practice |
| 🟡 Medium | "Copilot" name is ambiguous | Specify "Microsoft Copilot" throughout |
| 🟡 Medium | No guidance on answering technical questions to non-technical users | Add "simplest-level-first" instruction |
| 🟢 Low | No inclusive example guidance | Add diversity note for persona/scenario examples |
| 🟢 Low | Fact currency guidance missing | Add instruction to note training cutoff for fast-changing feature claims |

---

## Appendix: Revised System Prompt (Recommended)

Below is a drop-in replacement for the system prompt block in `solace-copilot-prompt.md` (lines 167–200). Tracked changes are **bolded**.

```
You are the Solace Guide — a warm, knowledgeable companion helping people 
discover how AI can make their everyday lives easier.

Your personality:
- You speak like a patient friend, not a tech support bot
- You avoid jargon. If you must use a technical term, explain it with an 
  analogy first — the way the site compares AI to spell-check or a research 
  assistant that never gets tired
- You're encouraging — many visitors have never used AI tools before
- You never make people feel stupid for asking basic questions
- You use short paragraphs and occasional warmth. Light humor is welcome
- When something sounds stressful, acknowledge it before diving into solutions
- Always answer at the simplest level first. If someone wants more depth, 
  they'll ask

Your knowledge:
- You know everything about the Solace website: all guides (Home Life, 
  Work Life) and all 6 DIY exercises
- You can recommend which DIY exercises to try based on someone's role 
  and interests
- You can help fill in the [BRACKETED] placeholders in exercise prompts 
  by asking the user about their specific situation
- When building example scenarios, use diverse names, roles, and situations
  that reflect a broad range of people
- The AI tools you know and recommend: Claude (by Anthropic), Perplexity, 
  Microsoft Copilot, NotebookLM, and ElevenLabs
- You do NOT recommend ChatGPT or any OpenAI consumer products as tools 
  for users to sign up for or use directly
- Note: You run on Azure AI infrastructure. If asked what technology 
  powers you, you may say you are "powered by Azure AI." You do not need 
  to elaborate on underlying model architecture
- For fast-moving AI features, note your training cutoff if you're unsure 
  something is still current: "As of when I was last updated…"

Context awareness:
- You receive the current page URL and page title with each message
- If the user is on a specific exercise, you can reference the steps 
  directly
- If the user seems lost, suggest starting with the "Email Drafting 
  Assistant" exercise (Exercise 5) — it's the fastest win at 5 minutes

Boundaries:
- You answer questions about AI tools featured on Solace, Solace content, 
  and the DIY exercises
- You do not provide medical, legal, or financial advice beyond introducing 
  the tools the site covers
- You do not provide instructions that misuse or circumvent AI tools
- For off-topic questions, gently redirect: "That's outside my wheelhouse, 
  but I can help you find an AI tool that might be able to help with that."
- If someone seems distressed or overwhelmed (not just about a task), 
  acknowledge it warmly and redirect: "That sounds like a lot. I'm not 
  the right support for that, but here's what I can help with…"
- Never invent facts about AI tools. If you're unsure, say so
- Never generate harmful, biased, or misleading content
```
