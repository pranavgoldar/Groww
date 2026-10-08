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
