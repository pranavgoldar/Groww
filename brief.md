# Money Plan — prototype brief

You are a senior product designer building a clickable, high-fidelity mobile prototype for a product-management case study. Build it as ONE self-contained HTML file (inline CSS + JS, no external images), rendered inside a centered phone frame (390×844), with working navigation between screens, a back button on each screen, and a small screen-switcher strip below the phone so a reviewer can jump to any screen.

## Context

The feature is "Money Plan" for Groww, an Indian investing app, aimed at first-time investors aged 20–26. Groww already has strong stock/fund research, charts, an AI assistant called GR 1, and order execution. Do NOT redesign any of that. This prototype only adds three moments:

1. PLAN: when money is added for the first time, help the user give that money a job (how much to keep, park, grow, or use for learning).
2. COMMIT: before the first purchase, record what the user will do if it falls.
3. CHECK-IN: the first time the holding falls, replay the user's own plan back to them.

Core insight to make visible in the design: risk capacity belongs to the money, not the person. The app asks "What is this money for?", never "What kind of investor are you?"

## Persona (use these exact numbers everywhere so the story is consistent)

Riya, 22, first salary. She adds ₹40,000 to Groww. She pays ₹12,000 rent and has no emergency fund yet.

* Her plan: Keep ₹15,000 · Park ₹10,000 · Grow ₹12,000 · Learn ₹3,000 (total ₹40,000)
* Her first purchase: ₹10,000 from Grow into a "Large-cap index fund" (generic category, no real fund name)
* Three weeks later: her holding is ₹9,100 (−9%). The broad market index is −7% over the same period.

## Design direction

* Clean, calm fintech look inspired by Groww's style: white background, generous spacing, one green accent (#00B386 or similar), dark grey text, rounded cards, a simple sans-serif (system font stack or Inter from Google Fonts).
* Do NOT use the real Groww logo or any trademarked assets. Use a plain text wordmark "groww" in the accent color as a placeholder.
* Tone of copy: warm, plain, short sentences, no jargon, no exclamation marks, never preachy. Talk like a sensible older sibling, not a bank.
* Red is used only for the loss number. Never use alarm styling on the check-in screen.
* Every rupee amount uses Indian formatting (₹40,000, ₹1,20,000).

## Screens (build exactly these 7, in this order)

### Screen 1 — "What's this money for?"

Purpose: interrupt the jump straight to browsing stocks at first add-funds.

* Success state at top: "₹40,000 added to your Groww balance"
* Headline: "Let's give this money a job"
* Sub-copy: "2 minutes. It helps you decide how much to invest, and what to do if it ever drops."
* Primary CTA: "Plan this money"
* Secondary text link: "Skip, I'll explore on my own" (goes to a simple placeholder explore screen)

### Screen 2 — When & cushion

Purpose: capture the inputs that set risk capacity.

* Q1: "When might you need any of this money?" — chips: Under 3 months / 3–12 months / 1–3 years / 3+ years / Not sure (multi-select allowed with rupee amount per chip is NOT needed; keep it simple single-select, preselect "Not sure" for Riya)
* Q2: "Do you have about 3 months of expenses saved somewhere else?" — Yes / Partly / No (preselect "No")
* Q3: "If your invested money dropped, at what amount would you start feeling uneasy?" — a slider in rupees showing e.g. "I'd be uneasy below ₹10,500 on every ₹12,000"
* Primary CTA: "See my split"

### Screen 3 — Your split

Purpose: turn answers into a rupee plan the user owns.

* Label at top, clearly visible: "You set these numbers. We've shown common starting ranges."
* Four bucket cards, each with name, one-line meaning, rupee amount, and a working slider. Sliders must rebalance so the total always equals ₹40,000:
  * Keep — ₹15,000 — "Stays in your bank. Rent, surprises, your emergency cushion."
  * Park — ₹10,000 — "Low-ups-and-downs options for money you may need within a year."
  * Grow — ₹12,000 — "Money you won't need for 3+ years. Will rise and fall along the way."
  * Learn — ₹3,000 — "A capped amount to try picking stocks. Mistakes here won't hurt your plan."
* Small "Why this range?" expandable under each card with 1–2 sentences of general education (e.g. "Many people keep 3–6 months of expenses before investing. You told us you don't have this yet, so Keep starts higher.")
* A stacked horizontal bar at top showing the four buckets proportionally, updating live.
* Primary CTA: "Save my plan"

### Screen 4 — Bucket → categories

Purpose: match money to time horizon before choosing a product.

* Tabs: Grow / Park / Learn (Keep has nothing to buy, show a note "Keep stays in your bank. Nothing to buy here.")
* Grow tab: category cards (unranked, no star ratings, no "top pick"): Large-cap index funds, Flexi-cap funds, Hybrid funds. Each card: what it is in one line, "Fits money you won't need for 3+ years", and "Explore funds →".
* Park tab: Liquid funds, Short-duration funds, Fixed deposits.
* Learn tab: "Stocks" card with a progress bar "₹3,000 of ₹3,000 Learn money left".
* Remaining-in-bucket indicator: "₹12,000 in Grow to place".
* Tapping "Explore funds →" on Large-cap index funds goes to a minimal mock order screen: generic fund "Large-cap index fund (sample)", amount field prefilled ₹10,000, button "Continue". That leads to Screen 5.

### Screen 5 — Commit card (shown before order confirmation)

Purpose: record calm-state intent before the first purchase.

* Tag: "From your Grow money · 3+ years"
* Card: "Large-cap index funds have had bad years. On your ₹10,000, a bad year has looked like ₹7,000–8,000 at its lowest." Under it, small grey text: "Illustrative historical range. Placeholder pending compliance review. Past performance does not indicate future results."
* Question: "If it falls like this, what will you do?" — three radio options: "Wait it out — this is 3+ year money" / "Re-check why I bought it" / "It would mean I need the money — I'll revisit my plan"
* Primary CTA: "Confirm & invest ₹10,000"
* After tapping, show a short success state ("Invested. We'll remind you of your plan if it ever drops.") with a button "Fast-forward 3 weeks →" that leads to Screen 6 via a mock push notification banner: "Your index fund is down 9%. Here's what you decided when you invested."

### Screen 6 — First-fall check-in

Purpose: make the first loss readable against the user's own plan.

* Top: "Your ₹10,000 is now ₹9,100" (−₹900, −9%, loss number in red, everything else neutral).
* Comparison bars: "Your fund −9% · Overall market −7% · Over 3 weeks". One line: "Most of this move is the market, not just your fund."
* Card "What you decided": "Grow money · needed in 3+ years · You said: Wait it out."
* Range indicator: a horizontal scale showing the ₹7,000–8,000 bad-year range from Screen 5 and a marker at ₹9,100 labelled "You are here — inside the range you saw before investing."
* Three reflection questions as a short checklist (tappable, no scoring): "Has your need for this money changed?" / "Has your reason for buying changed, or just the price?" / "Are you deciding while upset?"
* Actions, stacked: Primary "Stick with my plan" · Secondary "My need for this money changed" (goes to Screen 7) · Text link "Ask GR 1 why it fell" (shows a placeholder sheet "GR 1 would open here").
* IMPORTANT: a normal "Sell" button must remain visible and equally easy (e.g. in the header or bottom of the holding). The design must never make selling harder or imply the user shouldn't sell. No copy like "Don't panic" or "Stay invested!".
* "Stick with my plan" leads to a calm confirmation: "Noted. Your plan is unchanged." and a link back to the portfolio home.

### Screen 7 — My need changed

Purpose: give a legitimate exit path without panic.

* Question: "How much do you need, and by when?" — rupee input + chips (This week / This month / In a few months)
* Guidance card (order of buckets, not product advice): "People usually draw from Keep first, then Park, before Grow. Keep has ₹15,000 and Park has ₹10,000." Show the four buckets with the ones to draw from highlighted.
* Primary CTA: "Update my plan" (returns to Screen 3 with new values)
* Secondary: "Sell from Grow" (shows a standard placeholder sell sheet)

## Compliance rules the prototype must visibly follow

* Never recommend a specific fund or stock. Only categories, unranked.
* The user sets every number in the split; the UI must say so.
* Any historical range shows a source placeholder and a past-performance disclaimer.
* Selling is always one tap away and never discouraged.
* No streaks, badges, scores, leaderboards, confetti, or social sharing.
* No finfluencer or creator content anywhere.

## Interaction details

* Screen transitions: simple slide left/right.
* Sliders on Screen 3 must actually work and keep the total at ₹40,000.
* Selections persist across screens (e.g. the commitment chosen on Screen 5 appears on Screen 6).
* Include a tiny "Reset prototype" link under the phone frame.

## Deliverable

One HTML file. Before writing code, list the 7 screens with one line each to confirm the plan, then build. After building, check that every rupee number matches the persona and that every screen has exactly one primary CTA.

## Revisions after the brief

* Logo: at the user's request, the Groww logo mark (blue #5367FF / mint #00F3BB) now appears in Screen 1's header beside the "groww" wordmark, on the lock-screen notification and as the browser-tab icon. It is drawn as inline SVG so the file stays self-contained. This replaces the "Do NOT use the real Groww logo" rule above.

## Add-on: monthly surplus plan

Keep the existing 7 screens, visual style, colors, fonts, bucket names (Keep, Park, Grow, Learn) and compliance rules exactly as they are. Where a change conflicts with the original prompt, this add-on wins.

### Updated persona (use these numbers everywhere)

Riya, 22, monthly salary ₹40,000. Monthly expenses ₹25,000 (rent ₹12,000 + living ₹13,000). Monthly surplus ₹15,000. No emergency cushion yet. Short-term goal: a laptop for ₹60,000 in 20 months (₹3,000/month). Her risk category: Balanced.

The plan now splits her monthly SURPLUS (₹15,000), not the whole salary.

Bucket meanings (updated):
- Keep: her emergency cushion, building toward 3 months of expenses (₹75,000). Stays in the bank.
- Park: money for short-term goals within 3 years (the laptop). Low ups-and-downs options.
- Grow: money for 3+ years.
- Learn: a small, capped amount to try picking stocks.

### Change 1 — Screen 2 becomes "Your money basics"
- Monthly take-home salary: input, prefilled ₹40,000
- Monthly expenses: input, prefilled ₹25,000. Below it: "That leaves ₹15,000 a month to plan."
- Any goal in the next 3 years? Goal name + amount + months: prefilled "Laptop · ₹60,000 · 20 months"
- Capacity questions (chips): "Savings for emergencies?" Yes / Partly / Not yet (Not yet). "Does anyone depend on your income?" Yes / No (No). "Is your income steady?" Yes / Not always (Yes)
- Appetite question: "If ₹10,000 you invested became ₹8,000, you would…" Hold calmly / Worry but hold / Sell (Worry but hold)
- CTA: "See plans"

### Change 2 — NEW screen 2b "Pick a starting plan"
- Note: "Your answers on safety and on comfort with risk both count. When they differ, we start from the more careful one."
- Line: "People with answers like yours often start with Balanced."
- Three selectable cards with the monthly ₹15,000 split as a stacked bar plus four amounts: Careful (Keep ₹7,500 · Park ₹3,000 · Grow ₹4,500 · Learn ₹0), Balanced (preselected, "Common for answers like yours"; Keep ₹6,000 · Park ₹3,000 · Grow ₹5,500 · Learn ₹500), Growth (Keep ₹5,000 · Park ₹3,000 · Grow ₹6,000 · Learn ₹1,000)
- Line: "Once Keep reaches 3 months of expenses (₹75,000), its share moves into Grow."
- Disclaimer: "General model plans for education, not a personal recommendation. You choose and can change any number. [PENDING COMPLIANCE REVIEW]"
- CTA: "Start with Balanced" (label follows the selected card)

### Change 3 — Screen 3 becomes the monthly plan editor
- Title "Your monthly plan: ₹15,000"; same four buckets with updated meanings (Park shows "Laptop · ₹60,000 in 20 months"); start values from the chosen template; sliders keep ₹15,000; keep the "You set these numbers" label.
- Toggle above the CTA, on by default: "Apply this plan automatically every time my salary comes in"
- CTA: "Save my monthly plan"

### Change 4 — NEW screen "Salary day" (after Screen 5, before the check-in)
- Card "₹15,000 split as planned"; rows: Keep ₹6,000 → stays in your bank · Park ₹3,000 → liquid fund for your laptop · Grow ₹5,500 → your index fund SIP · Learn ₹500 → Learn balance
- "No action needed." Link "This month is different" opens a sheet: Bonus or extra money / Less money this month / My income stopped
- CTA: "View my money"

### Change 5 — NEW screen "Is your money doing its job?" (portfolio, last)
- Total value across all holdings with a Mutual funds / Stocks / Liquid bar
- Plan vs actual: Keep "₹18,000 of ₹75,000 · about 0.7 of 3 months built" (progress); Park "Laptop · ₹9,000 of ₹60,000 · on track for month 20" (progress); Grow "₹5,000 of your Grow money is in one stock. Your plan was a spread across funds." (amber); Learn "You've put ₹2,500 into Learn. Your plan was ₹1,500." (amber)
- Your fund vs its index: "+3.1% since you started. Its index: +3.3%. The small gap is normal for index funds (costs)."
- Patterns in your Learn trades: "Trades based on a tip: −₹600 after ₹140 in charges. Trades based on your own research: +₹200." plus "A few months is too short to judge a method. Treat this as something to notice, not proof."
- Link "Ask GR 1 about your portfolio". No score, grade, healthy/unhealthy label or recommendations.

### Navigation
1 → 2 → 2b → 3 → 4 → 5 → Salary day → 6 → 7 → Portfolio. Screen 7 keeps "draw from Keep, then Park, before Grow" with Keep ₹18,000 and Park ₹9,000, and keeps "Sell from Grow".

### Decisions made while building the add-on
- Delivered as a Vite + React + TypeScript app at the repo root (replacing the earlier Lens prototype and the single HTML file) so it deploys on Vercel.
- Screen 1 shows "₹15,000 added", the surplus the plan splits.
- Timeline: Screens 1–5 and Salary day are month 1. "View my money" jumps to month 3, where the check-in, Screen 7 and the portfolio sit, so Keep ₹18,000 / Park ₹9,000 hold.
- The first purchase is a ₹5,500 monthly SIP (the Grow amount). In month 3, ₹5,000 of Grow went into one stock, so the index fund holds ₹11,500; the check-in reads "Your ₹11,500 is now ₹10,500" (−₹1,000, −9%).
- Portfolio total is rebuilt from the plan: ₹27,950 (Mutual funds ₹11,850 · Stocks ₹7,100 · Liquid ₹9,000), instead of ₹54,300, which didn't reconcile with month 3.
- Screen 5 states the bad-year range per ₹10,000 put in (₹7,000–8,000) and repeats the appetite answer instead of the removed unease slider.
- "Update my plan" on Screen 7 takes the money from bucket balances; the monthly ₹15,000 split stays as it is.

## Revision: plan before money is added

Asking "what is this money for?" after it has already been added is too late. The flow now starts when the user taps Add money for the first time:

1. Before you add money: "Let's work out how much to invest."
2. Your money: salary first, then expenses and a goal.
3. Risk: safety (capacity) and comfort (appetite) questions.
4. What you could invest: salary − expenses = ₹15,000 free each month; Keep ₹6,000 stays in the bank, ₹9,000 a month is invested through Groww (Balanced). The split comes from model plans the user chooses.
5. Monthly plan editor.
6. Add money, prefilled with the plan's ₹9,000.
7. Categories onward, as before. Salary day is now next month's.

Copy says what she "could" invest rather than "should": the amount is calculated from her own numbers, and compliance requires model plans to be chosen, not assigned.

## Revision: bucket names

- "Learn" is renamed **Invest in stocks** (the small, capped amount for picking stocks yourself). The internal key stays `learn`.
- Park's description now says what it is: "Kept safe for goals in the next 3 years", in low ups-and-downs options.

## Revision: goals without return promises (options A + C + D), and the Park SIP

- **A. Put aside, don't promise.** Goal maths counts only contributions (amount ÷ months). Screens say "We don't count on returns; anything extra is a bonus", and goal progress shows what's been put in, not market value.
- **C. Time decides where money waits.** Each goal picks Short (under 1 year), Medium (1–3 years), Long (3+ years) or an exact time in months or years. Short and medium goals go to Park; long goals to Grow. Up to three goals.
- **D. Move to safety as the date nears.** 12 months before a long-term goal, a reminder suggests moving its money from Grow to Park. Moving, waiting a month or keeping it in Grow are all one tap.
- **Park SIP.** Park money stays inside Groww: Liquid funds opens a ₹3,000 monthly SIP, like the Grow order. Salary day shows "liquid fund SIP for your laptop".

## Revision: a real web app, not a phone mock-up

- No phone frame and no reviewer switcher. Someone opening the link moves through it on their own: every screen is reached from the one before it, and Portfolio links to the Goal reminder example.
- **Phones** get the app layout: a top app bar with back, and the main buttons pinned to the bottom of the screen.
- **Laptops** (900px and wider) get Groww's web layout: the top bar with the logo, the page on the left, and a sticky card on the right with the plan summary (free each month, the four-part split, what goes through Groww) and the screen's buttons. Sheets open as centred dialogs.
- Styling follows Groww's web screens: grey text (#44475B), thin grey borders, Groww green (#00B386) for the main button and selected tabs, underlined tabs, grey selected chips, 12px cards.
- Each screen has its own link (`#/portfolio`, `#/checkin` and so on). Opening one fills in what that screen needs. Reloading the page without a link starts over.

## Revision: account menu

- The avatar opens an account menu modelled on Groww's: name and email, settings, Your portfolio, Your money plan, All orders, Bank details, 24 x 7 Customer Support, Reports, Log out. On laptops it drops down under the avatar; on phones the avatar sits in the app bar and the menu opens as a bottom sheet.
- Your portfolio opens at any time. Before money is added it says nothing is invested yet, with "Plan my money". After money is added it shows what's been put in so far, what's placed, and the Groww balance, with Keep noted as staying in the bank. From month 3 it's the full "Is your money doing its job?" view.
- Items that belong to the real app show a short note instead of opening.

## Revision: Groww's web top bar

- Laptops get Groww's top bar: logo, Money Plan (the current section, in bold), Stocks, Explore, Holdings, Positions, Orders, Watchlist, then "Search Groww..." with Ctrl+K, the GR 1 icon, notifications and the avatar.
- Holdings opens the portfolio and is highlighted there; Explore opens Explore; Money Plan returns to the plan (the monthly plan editor from month 3, where saving goes back to the portfolio). The GR 1 icon opens GR 1. Stocks, Positions, Orders, Watchlist, search, Ctrl+K and notifications show a short note.
- The page widens to 1240px to line up with the bar. Below 1240px search shrinks to an icon; below 960px Positions and Watchlist are hidden so the bar never overflows.

## Revision: Your money plan, under the profile

- The "Apply this plan automatically every time my salary comes in" toggle is gone from the monthly plan screen. It's a standing setting, not part of deciding the split, so first-time users no longer meet it during setup. It stays on by default, since the SIPs they start already run on salary day.
- Once a plan exists, **Your money plan** (avatar menu, or Money Plan in the top bar) shows the monthly split with Keep labelled as the emergency fund, each goal and where it waits, and a **Salary day** card: "Split my salary automatically", or turn it off to confirm each month's split with one tap. Edit my split opens the sliders; Change salary, expenses or goals reopens the first steps.
- Salary day reflects the setting, and points to Your money plan when it's off.

## Revision: other funds, other stocks, and buys outside the plan

- Money Plan never blocks a purchase. The order screen used to stop a SIP above what was left in Grow ("Invest less, or change your plan first"); it now lets it through with a neutral line: "This is ₹500 a month more than the ₹5,500 a month left in Grow. It still goes through, and Portfolio will show it next to your plan."
- Every order shows **Counts toward**, set automatically by type: funds that hold shares count toward Grow, liquid and short-duration funds toward Park, single stocks toward Invest in stocks. "Change" offers Grow, Park, Invest in stocks or **Outside my plan** in one tap.
- Flexi-cap, hybrid and short-duration funds now open sample orders like the index and liquid funds, and "Explore stocks" opens a one-time buy of a sample stock. Fixed deposits explain that they live in Groww's FD section.
- What's left to place in each bucket counts these purchases. Outside-plan buys leave the plan untouched. Portfolio lists every other purchase and what it counts toward, before and after month 3, and salary day names every SIP counted toward a bucket.

## Revision: confirm each month by default; autopay is opt-in

Autopay suits people who are sure of their plan. Students who are still exploring shouldn't find money leaving their account every month by default.

- After placing their money, people are asked once: **How do you want to invest each month?**
  - **I'll confirm each month** (selected by default): when salary comes in, Groww reminds them; nothing leaves the account until they tap Confirm, and any month can be skipped.
  - **Autopay on a fixed day**: they pick the day of the month (1st–28th) and time. Groww notifies them **the day before** and **3 hours before**, each with a way to skip that month, and they'd approve the autopay once in their UPI app.
- Next month follows the choice. Default: "Ready to invest ₹9,000 as planned?" with **Confirm and pay ₹9,000** or **Skip this month** (nothing taken, plan unchanged). Autopay: the two reminders, then "₹9,000 invested as planned", with Skip next month's autopay.
- The choice lives in **Your money plan → Each month** and can be changed any time. It replaces the earlier "Split my salary automatically" toggle.
- SIP orders say "Paying each month: You confirm it (autopay is optional)", or the autopay day and time once chosen.

## Revision: a shorter flow, and goals edited in place

The path to the first month went from 15 steps to 12, with three fewer screens, and the same information stopped repeating.

- **What you could invest, Monthly plan and Add money are one screen.** It shows ₹15,000 free each month (₹40,000 − ₹25,000), Careful / Balanced / Growth as chips (Balanced preselected for Riya, with the careful-first note), the four sliders, and ends with **Add ₹9,000 to Groww**. The side summary card isn't repeated next to it on laptops.
- **No Invested screen.** Confirming the index fund on the commit card returns straight to placing money, on the next bucket with money left, with a toast: "Index fund SIP set up: ₹5,500 a month. If it falls, we'll show you what you decided here." Done for now leads to Each month.
- **The Keep note isn't repeated** on the categories screen; the plan screen says once that Keep stays in the bank as the emergency fund.
- **Goals are edited in Your money plan.** Each goal has Edit; Add a goal (up to three) and Remove this goal sit in the same editor. A "What changes" preview shows the effect before saving: Park follows what its goals need (plus anything extra Riya chose to keep there), Grow gives or takes the difference first, then stocks, then Keep; nothing else is reset. She chooses **Save and update my plan** or **Save, keep my split**.
- **Changing salary or expenses later** opens Your money and goes straight back to the plan ("Review my plan"), without the risk questions again.

## Revision: one page of quick taps

Modelled on account-opening declaration forms (one page, tap-to-select pills, prefilled answers, a time estimate, one button):

- **Your money and Risk are one page, "About your money"**, with "Takes about 30 seconds": salary and expenses, then the safety net (emergency savings, dependents, steady income), comfort with ups and downs, and goals. Everything is prefilled, so most people only change what's different. The button goes straight to What you could invest.
- **Setup is two steps**: About your money, then What you could invest. The path to the first month is now 11 steps, down from 15.
- **Selected answers are solid green with a white tick** everywhere (chips and goal-time options), so it's obvious what's chosen.
- Changing salary or expenses later opens the same page, which then leads to "Review my plan".

## Revision: what you do

- About your money now starts with **What do you do?**: Full-time job, Part-time job, Student, Own business, Freelance or gig, Other. Riya: Full-time job.
- It changes the wording, not the maths. The income question becomes "Monthly take-home salary" (full-time), "Monthly take-home from your job" (part-time), "Money coming in each month" with the hint "Allowance, stipend or part-time pay. Count only what comes in regularly." (student), "Average monthly income" with "use a typical month, or a little less" (own business, freelance), or "Monthly income" (other).
- It prefills **Is your income steady?**: Yes for a full-time job, Not always for part-time, student, own business and freelance; Other leaves the answer as it was. She can change it, and that answer (not the occupation) feeds the suggested plan, so a student usually starts from Careful.
- Outside a full-time job the app says "income" instead of "salary": the plan's free-each-month line, Your money plan, the Each month reminder and next month.
