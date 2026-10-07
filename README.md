# Groww Lens — prototype

**Understand before you invest.**

A focused product prototype for the case study *“Designing Groww for the Gen Z Investor.”*
Lens is a contextual layer inside the Groww stock page. It helps first-time investors (roughly 20–26) understand why a stock is moving. It does not tell them what to buy.

> All prices, events, holdings and figures are **illustrative demo data**. Nothing here is real-time or investment advice.

## The problem

Investing apps already make buying easy. A first-time investor can see prices, charts, percentage changes and news, but still can’t answer:

- Why is this stock moving?
- What actually changed?
- Is it just this company, or is the whole sector moving?
- What are the risks I’m not seeing?
- What should I look into next?

**Hypothesis:** first-time investors don’t need more choices. They need better context around the choices already in front of them.

## The Lens experience

Lens opens from a stock page. Its order is fixed on purpose:

| # | Section | Answers |
|---|---------|---------|
| 1 | **Why is it moving?** | The likely drivers, each tagged as an interpretation with an evidence-strength meter and its source |
| 2 | **What changed?** | A short timeline of recent events, each opening into *what happened / why it may matter / what’s unclear* |
| 3 | **Market & sector context** | The stock vs its sector index vs Nifty 50 (today or 1 week), labelled company-specific, sector-wide or market-wide |
| 4 | **Risks & counterpoints** | What you might be missing, including counterpoints to the obvious story |
| 5 | **Ask Lens** | Follow-up questions, answered only from the stock’s own data |

Every statement is visibly labelled **Fact**, **Interpretation** or **Uncertainty**.

Core principle: **Explain → Contextualise → Highlight risks → Let the user decide.**

## Screens

1. **Welcome + onboarding**: two questions (experience, goals). They only set how explanations are written, and are never used for recommendations.
2. **Home**: market overview, “What’s happening today?”, and stocks worth understanding, each with a Lens entry point.
3. **Stock page**: price, chart, key figures. The Lens card sits directly under the price.
4. **Lens** (hero): the five sections above, a Simple/Standard toggle, tap-to-define jargon.
5. **What changed?**: the expanded timeline with event details.
6. **Ask Lens**: a working chat with suggested questions, structured answers, cited sources and follow-ups.
7. **Portfolio**: a simple holdings view that links the day’s biggest move to Lens.

Also included: Explore (search), Profile (preferences and evaluation questions), and index pages for Nifty 50 and Nifty Bank.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Lens engine tests (advice avoidance, grounding, uncertainty…)
npm run build      # type-check + production build in dist/
```

The build is static and uses hash routing, so `dist/` works on any static host or sub-path.

## Architecture

```
src/
  data/            Seeded demo universe, kept separate from UI
    stocks/        One file per stock (HDFC Bank, ICICI Bank, Reliance, Tata Motors, Infosys)
    indices.ts     Nifty 50, Nifty Bank
    glossary.ts    Plain-language definitions used for tap-to-define and "what is X?"
    types.ts       The data model
  lens/            The Ask Lens engine (no UI code)
    types.ts       LensProvider / LensRequest / LensAnswer contract
    safety.ts      Central guardrails (input) + output policy check
    intents.ts     Query understanding: intent, entities, modifiers
    compose.ts     Grounded answer composition from the stock's records
    mockProvider.ts   Deterministic provider used by the prototype
    remoteProvider.ts Sketch of a real backend provider (same contract)
    index.ts       The single place the app gets answers from
  lib/             Formatting, chart series, movement classification
  components/      UI building blocks (layout, ui, stock, lens)
  pages/           One file per screen
  state/           App state (preferences, watchlist, chats) and glossary sheet
```

### Each stock’s data

`name, ticker, price, dailyChange, weeklyChange, sector, sectorChange, marketChange, whyMoving, recentEvents, risks, facts, interpretations, uncertainties, suggestedQuestions, mockChatResponses`, plus chart anchors, key ratios, watchpoints and a past-month breakdown. To add a stock, add a file in `src/data/stocks/` and register it in `stocks/index.ts`.

### Swapping in a real LLM / RAG backend

The UI depends only on the `LensProvider` interface:

```ts
interface LensProvider {
  ask(request: LensRequest): Promise<LensAnswer>
}
```

`LensAnswer` already carries what a production system should return: a lead sentence, blocks tagged fact / interpretation / uncertainty / risk, cited sources, follow-ups, and an optional guardrail flag. Set `VITE_LENS_ENDPOINT` to use `createRemoteLensProvider`. Every response, mock or remote, still passes through `enforcePolicy`, which blocks buy/sell language, price targets, predictions and guarantees.

## Safety behaviour

`detectGuardrail` runs before any answer is composed:

| Query type | Example | Response |
|---|---|---|
| Buy / sell / hold | “Should I buy this?” | Factors to weigh (recent events, valuation, sector, top risk, your situation) + SEBI-registered adviser note |
| Stock picking | “Which stock should I buy?” | Declines; offers to explain any stock in the prototype |
| Prediction | “Will it rise tomorrow?” | Says it can’t predict; lists what could matter from here |
| Target price | “What’s the target price?” | Declines; gives valuation context |
| Guarantee | “Is this a safe investment?” | Says no return is guaranteed; shows risks |
| Out of scope | crypto, F&O, tips | Explains what Lens covers |

The engine also corrects false premises (“Why is HDFC falling?” when it’s up), refuses to guess about companies it has no data on, and says so when information isn’t in its data.

See [`docs/EVALUATION.md`](docs/EVALUATION.md) for the evaluation plan.

## Out of scope (deliberately)

Order execution, KYC, live market data, authentication, derivatives/F&O, crypto, social or copy trading, gamification, portfolio optimisation and price predictions.
