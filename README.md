# Money Plan for Groww — prototype

**Give every rupee a job.**

A clickable, high-fidelity mobile prototype for a product case study. Money Plan helps first-time investors (roughly 20–26) split their monthly surplus into four buckets, commit to a plan before their first purchase, and see that plan replayed back to them when their money first falls.

Core idea: risk capacity belongs to the money, not the person. The app asks *"What is this money for?"*, never *"What kind of investor are you?"*

> All numbers are illustrative demo data for one persona. Nothing here is real-time data or investment advice. Fund names are generic samples.

## Persona

Riya, 22. Salary ₹40,000 a month, expenses ₹25,000 (rent ₹12,000 + living ₹13,000), so **₹15,000 a month to plan**. No emergency cushion yet. Goal: a laptop for ₹60,000 in 20 months (₹3,000 a month). Her answers suggest **Balanced**.

| Bucket | What it's for | Balanced |
|---|---|---|
| Keep | Emergency cushion, building to 3 months of expenses (₹75,000). Stays in the bank. | ₹6,000 |
| Park | Goals within 3 years (the laptop). Low ups and downs. | ₹3,000 |
| Grow | Money for 3+ years. | ₹5,500 |
| Learn | A small, capped amount to try picking stocks. | ₹500 |

## The flow

1. **What's this money for?** ₹15,000 added; give it a job.
2. **Your money basics.** Salary, expenses, a goal, safety questions (capacity) and one comfort question (appetite).
3. **Pick a starting plan (2b).** Careful, Balanced or Growth, as rules-based templates the user chooses. When safety and comfort disagree, it starts from the more careful one.
4. **Your monthly plan (3).** Four sliders that always add up to ₹15,000, with common starting ranges and an auto-apply toggle.
5. **Categories (4).** Unranked categories per bucket. Large-cap index funds opens a mock SIP order.
6. **Commit card (5).** Before the first purchase: how bad years have looked, and what you'll do if it falls.
7. **Salary day.** ₹15,000 split as planned. No action needed.
8. **First-fall check-in (6), month 3.** Your ₹11,500 is now ₹10,500, read against your own plan. Selling stays one tap away.
9. **My need changed (7).** Draw from Keep, then Park, before Grow.
10. **Is your money doing its job? (Portfolio).** Plan vs actual, fund vs its index, patterns in Learn trades. No scores or grades.

Supporting screens: Explore, Order, Invested, Plan noted. A switcher under the phone jumps to any screen; **Reset prototype** restores Riya's numbers.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the money logic
npm run build      # type-check + production build in dist/
```

### Deploying to Vercel

Import the repository in Vercel. It detects Vite; `vercel.json` pins the build (`npm run build`) and output (`dist`). No environment variables are needed.

## Structure

```
src/
  lib/format.ts      Indian rupee formatting (₹1,20,000), done by hand
  lib/plan.ts        Persona, model plans, slider rebalancing, the month-3 snapshot
  state/store.tsx    One state object, history-stack navigation, toast, sheets, lock screen
  components/        Phone frame + slide transitions, sheets, shared UI
  screens/           One file per screen (or pair of screens)
  styles.css         All styles
```

Every number on the later screens is derived from the saved plan, so the default path reproduces the brief's figures exactly and edits flow through consistently.

## Compliance rules the prototype follows

- Only unranked categories; never a specific fund or stock recommendation.
- The user sets every number; model plans are labelled as education, not advice.
- Historical ranges carry a source placeholder and a past-performance disclaimer.
- Selling is always one tap away and never discouraged. Red is used only for losses.
- No streaks, badges, scores, leaderboards, confetti, social sharing or creator content.

The full brief and add-on are in [`brief.md`](brief.md).
