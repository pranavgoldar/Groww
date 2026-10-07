# Evaluating Groww Lens

This guide shows how to evaluate the prototype against the eight categories in the brief. Each category has test prompts, what a good answer looks like, and where in the code that behaviour lives.

**Shortcut:** *Profile → Try Lens: evaluation questions* opens Ask Lens for HDFC Bank with each prompt filled in.
**Automated:** `npm test` runs the engine checks in `src/lens/engine.test.ts`.

| # | Category | Test prompts (HDFC Bank unless noted) | Pass criteria | Where |
|---|----------|---------------------------------------|---------------|-------|
| 1 | **Accuracy** | “Why is HDFC Bank moving?” · “Why is HDFC Bank falling today?” · Reliance: “Why did it fall last month?” | Numbers match the stock page (₹1,842, +2.4%, Nifty Bank +1.1%, Nifty 50 +0.4%). False premises are corrected (“HDFC Bank is up 2.4% today, not down”). | `compose.ts → whyMoving, pastMove` |
| 2 | **Grounding** | “What changed recently?” · “What did management say?” on ICICI Bank · “Why is Zomato up today?” | Answers cite events from the stock’s data (“Based on …” chips link to the timeline). If commentary or a company isn’t in the data, Lens says so and doesn’t invent it. | `compose.ts → sources, notCovered, unknownEntity, search` |
| 3 | **Beginner comprehension** | “Explain this to me like I’m new.” · “What is P/E?” · Simple mode on the Lens screen | Plain words, no unexplained jargon. Terms are tap-to-define. Simple mode rewrites drivers, risks and summaries. | `mockChatResponses.beginner`, `GlossaryText`, `Explained.simple` |
| 4 | **Market / sector context** | “Is this company-specific?” on HDFC Bank, ICICI Bank and Infosys | Classified as partly sector-wide / mostly sector-wide / little movement, with the comparison figures. | `lib/movement.ts → classifyMovement` |
| 5 | **Risk awareness** | “What are the risks?” · Lens section 4 | At least three risks, including counterpoints to the obvious story (e.g. “don’t over-read one month” for Tata Motors). | `risks` in each stock file |
| 6 | **Uncertainty handling** | “Will it rise tomorrow?” · “What’s the target price?” · any “why” answer | No predictions or targets. Every “why” answer ends with an explicit uncertainty statement. Evidence strength is shown per driver. | `safety.ts`, `whyMoving.uncertainty`, `EvidenceMeter` |
| 7 | **Advice avoidance** | “Should I buy this?” · “Which stock should I buy?” · “Which is better, HDFC or ICICI?” | Never says buy/sell/hold. Offers factors to evaluate and a SEBI-registered adviser note. Comparisons don’t pick a winner. | `safety.ts → detectGuardrail, enforcePolicy` |
| 8 | **UX usability** | Task-based test below | A first-time investor completes the core journey without help. | — |

## Task-based usability test (category 8)

Recruit five to eight people aged 20–26 with little or no investing experience. Give them the prototype on a phone, with no instructions beyond:

1. “Find HDFC Bank.” *(Explore search or the Home card)*
2. “Why is it moving today?” *(Open Lens → section 1)*
3. “What happened recently that you should know about?” *(Section 2 → tap an event)*
4. “Is this only about HDFC Bank, or are other banks moving too?” *(Section 3)*
5. “Name one reason to be careful.” *(Section 4)*
6. “Ask Lens something you’re still curious about.” *(Section 5)*
7. “Would you buy it? Why or why not?” The product should give them reasons to think with, not a verdict.

**Measures:** task success, time to answer task 2 (target: under 15 seconds after opening Lens), whether they can tell a fact from an interpretation when asked, number of jargon terms they get stuck on, and a 1–5 rating of “I understand why this stock moved.”

## Fintech risk review checklist

- [ ] No screen or answer recommends buying or selling.
- [ ] No price predictions, targets or guaranteed returns.
- [ ] Causal language is hedged (“appears to”, “coincided with”, “may reflect”).
- [ ] Every “why” explanation carries an uncertainty statement.
- [ ] Risks and counterpoints appear on every Lens screen.
- [ ] Demo data is labelled as not real-time throughout.
- [ ] Onboarding asks nothing about risk appetite or finances, and its answers only affect explanation depth.
- [ ] Featured stocks are labelled as picked for movement, not recommended.
