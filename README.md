# Money Plan for Groww — prototype

**Give every rupee a job.**

A clickable, high-fidelity prototype for a product case study. It's a responsive web app: phones get the app layout, laptops get Groww's web layout. Money Plan helps first-time investors (roughly 20–26) split their monthly surplus into four buckets, commit to a plan before their first purchase, and see that plan replayed back to them when their money first falls.

Core idea: risk capacity belongs to the money, not the person. The app asks *"What is this money for?"*, never *"What kind of investor are you?"*

> All numbers are illustrative demo data for one persona. Nothing here is real-time data or investment advice. Fund names are generic samples.

## Persona

Riya, 22. Salary ₹40,000 a month, expenses ₹25,000 (rent ₹12,000 + living ₹13,000), so **₹15,000 a month to plan**. No emergency cushion yet. Goal: a laptop for ₹60,000 in 20 months (₹3,000 a month). Her answers suggest **Balanced**.

| Bucket | What it's for | Balanced |
|---|---|---|
| Keep | Emergency cushion, building to 3 months of expenses (₹75,000). Stays in the bank. | ₹6,000 |
| Park | Kept safe for goals in the next 3 years (the laptop), in low ups-and-downs options inside Groww. | ₹3,000 |
| Grow | Money for 3+ years. | ₹5,500 |
| Invest in stocks | A small, capped amount for picking stocks yourself. | ₹500 |

## The flow

Money gets a plan before it is added. The app never asks "what's this for?" after the money is already in.

1. **Before you add money.** Tapping Add money for the first time opens this: "Let's work out how much you can invest."
2. **Your money.** Salary, expenses and goals. ₹40,000 − ₹25,000 leaves ₹15,000 a month to plan. Each goal has its own time: Short (under 1 year), Medium (1–3 years), Long (3+ years) or an exact number of months or years. Short and medium goals are kept steady in Park; long ones sit in Grow. Up to three goals.
3. **Risk.** Safety questions (capacity) and one comfort question (appetite).
4. **What you could invest.** One screen: ₹15,000 free each month, a model plan to start from (Careful, Balanced or Growth, rules-based and chosen by the user; when safety and comfort disagree it starts from the more careful one), and four sliders that always add up to ₹15,000. Keep's ₹6,000 stays in the bank as the emergency fund. It ends with **Add ₹9,000 to Groww**.
5. **Place your money.** Unranked categories per bucket. Liquid funds opens a ₹3,000 Park SIP; Large-cap index funds opens a ₹5,500 Grow SIP. The other categories and stocks open sample products too. Tabs tick once their money is placed.
6. **Commit card.** Before the first Grow purchase: how bad years have looked, and what you'll do if it falls. Confirming returns straight to placing money, on the next bucket with money left.
7. **Each month.** Asked once, after the money is placed: **I'll confirm each month** (the default: nothing leaves the account until a tap, and any month can be skipped) or **Autopay on a fixed day**, with the day and time picked and a reminder the day before and 3 hours before.
8. **Next month.** By default: "Ready to invest ₹9,000 as planned?" with Confirm and pay, or Skip this month. With autopay: the two reminders, then "₹9,000 invested as planned". Keep's ₹6,000 stays in the bank either way.
9. **First-fall check-in, month 3.** Your ₹11,500 is now ₹10,500, read against your own plan. Selling stays one tap away.
10. **My need changed.** Draw from Keep, then Park, before Grow.
11. **Is your money doing its job? (Portfolio).** Plan vs actual, each goal's progress by what's been put in, fund vs its index, patterns in stock trades. No scores or grades.
### Buying other funds or stocks

Every order shows what it **counts toward**, set by type (funds that hold shares → Grow, liquid and short-duration funds → Park, single stocks → Invest in stocks) and changeable in one tap, including **Outside my plan**. Going over what's left in a bucket never blocks a buy: a neutral line says by how much, and Portfolio shows it next to the plan. Outside-plan buys leave the plan untouched and are listed separately.

### Goals never promise returns

Goal maths counts only what is put in (₹60,000 ÷ 20 months = ₹3,000 a month), and the app says so: "We don't count on returns; anything extra is a bonus." Time decides where goal money waits, and 12 months before a long-term goal the app suggests moving it from Grow to Park (see the **Goal reminder** screen).

Supporting screens: Explore, Order, Plan noted, Goal reminder, Your money plan.

**Your money plan** lives under the profile (avatar menu, or Money Plan in the top bar once set up). It shows the split, each goal, and how money goes in each month (confirm each month, or autopay with its day, time and reminders), with Edit my split and Change salary or expenses. Saving an edit returns to the page it was opened from.

**Goals are edited right there.** Each goal has Edit, and there's Add a goal (up to three). Before saving, the editor shows what changes: Park follows what its goals need, and Grow gives or takes the difference first; nothing else is reset. Riya can **Save and update my plan** or **Save, keep my split**. Changing salary or expenses later goes straight back to the plan, without the risk questions.

## Layout

- **Phone:** an app bar with back at the top; the main buttons stay pinned to the bottom.
- **Laptop (900px and wider):** Groww's web top bar (Money Plan, Stocks, Explore, Holdings, Positions, Orders, Watchlist, then search with Ctrl+K, GR 1, notifications and the avatar), the page on the left, and a sticky card on the right with the plan summary and the screen's buttons. Sheets open as centred dialogs.

In the top bar, Holdings opens the portfolio, Explore opens Explore, Money Plan returns to the plan, and the GR 1 icon opens GR 1; the other links, search and notifications say they belong to the real app. On windows narrower than 1240px search shrinks to an icon, and below 960px Positions and Watchlist step back.

The **R** avatar (top right) opens Riya's account menu, like Groww's: Your portfolio and Your money plan open here; All orders, Bank details, Customer Support, Reports and Log out explain that they belong to the real app. Before month 3, Portfolio shows nothing yet, or what's been added and placed so far.

There's no phone frame or screen switcher: you move through it as a customer would. Each screen also has its own link, such as `/#/plan` or `/#/portfolio`; opening one fills in what the screen needs. Reloading without a link starts over with Riya's numbers.

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
  state/store.tsx    One state object, history-stack navigation, #/screen links, toast, sheets, lock screen
  components/        App shell (top bar, toast, sheets, lock screen), shared UI
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
