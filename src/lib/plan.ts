import { r100, r50 } from './format'

export type BucketKey = 'keep' | 'park' | 'grow' | 'learn'
export type Split = Record<BucketKey, number>
export const KEYS: BucketKey[] = ['keep', 'park', 'grow', 'learn']
export const STEP = 500

/* ---------- persona (Riya, 22) ---------- */
export const PERSONA = {
  salary: 40000,
  expenses: 25000, // rent ₹12,000 + living ₹13,000
  rent: 12000,
  goal: { name: 'Laptop', amount: 60000, months: 20 },
}
export const CUSHION_MONTHS = 3

export const surplusOf = (salary: number, expenses: number) => Math.max(0, salary - expenses)
export const keepTargetOf = (expenses: number) => expenses * CUSHION_MONTHS
export function goalMonthlyOf(amount: number, months: number): number {
  return amount > 0 && months > 0 ? Math.ceil(amount / months / 100) * 100 : 0
}

/* ---------- goals and time horizons ---------- */
// Goal maths only ever counts what is put in. Returns are never assumed or promised.
export type Horizon = 'short' | 'medium' | 'long'
export type HorizonMode = Horizon | 'exact'
export interface Goal {
  id: string
  name: string
  amount: number
  months: number
  mode: HorizonMode // a band shortcut, or an exact time the user typed
  unit: 'months' | 'years' // how the exact time is shown
}
export const HORIZONS: { id: Horizon; label: string; range: string; months: number }[] = [
  { id: 'short', label: 'Short', range: 'under 1 year', months: 12 },
  { id: 'medium', label: 'Medium', range: '1–3 years', months: 24 },
  { id: 'long', label: 'Long', range: '3+ years', months: 60 },
]
export const LONG_AFTER_MONTHS = 36 // 3+ years is long term, which matches Grow
export const MOVE_BEFORE_MONTHS = 12 // long-term goal money moves to Park this long before the date

export function horizonOf(months: number): Horizon {
  if (months <= 12) return 'short'
  if (months <= LONG_AFTER_MONTHS) return 'medium'
  return 'long'
}
/** Short and medium goals are kept steady in Park; long ones ride out bad years in Grow. */
export const bucketOf = (g: Pick<Goal, 'months'>): 'park' | 'grow' => (horizonOf(g.months) === 'long' ? 'grow' : 'park')
/** Monthly amount to put aside so what you put in alone reaches the goal. */
export const monthlyFor = (g: Pick<Goal, 'amount' | 'months'>) => goalMonthlyOf(g.amount, g.months)
export const goalsIn = (goals: Goal[], bucket: 'park' | 'grow') => goals.filter(g => g.amount > 0 && g.months > 0 && bucketOf(g) === bucket)
export const needFor = (goals: Goal[], bucket: 'park' | 'grow') => goalsIn(goals, bucket).reduce((a, g) => a + monthlyFor(g), 0)

export const durationText = (months: number) =>
  months % 12 === 0 ? `${months / 12} year${months === 12 ? '' : 's'}` : `${months} month${months === 1 ? '' : 's'}`

/** "Laptop · ₹60,000 in 20 months" */
export const goalLine = (g: Goal, inrFn: (n: number) => string) => `${g.name.trim() || 'Goal'} · ${inrFn(g.amount)} in ${durationText(g.months)}`

/** "your laptop", "your laptop and trip", "your goals" */
export function goalsLabel(goals: Goal[]): string {
  const names = goals.map(g => (g.name.trim() || 'goal').toLowerCase())
  if (!names.length) return ''
  if (names.length === 1) return `your ${names[0]}`
  if (names.length === 2) return `your ${names[0]} and ${names[1]}`
  return 'your goals'
}

/* ---------- model plans (rules-based templates, never assigned) ---------- */
export type PlanId = 'careful' | 'balanced' | 'growth'
export const PLAN_ORDER: PlanId[] = ['careful', 'balanced', 'growth']
export const PLAN_NAMES: Record<PlanId, string> = { careful: 'Careful', balanced: 'Balanced', growth: 'Growth' }

// Park is set by the goal. What is left is shared by Keep, Grow and Learn.
// On Riya's ₹12,000 after Park these give exactly the brief's amounts.
const SHARES: Record<PlanId, [keep: number, grow: number, learn: number]> = {
  careful: [5 / 8, 3 / 8, 0], //   ₹7,500 · ₹4,500 · ₹0
  balanced: [1 / 2, 11 / 24, 1 / 24], // ₹6,000 · ₹5,500 · ₹500
  growth: [5 / 12, 1 / 2, 1 / 12], //  ₹5,000 · ₹6,000 · ₹1,000
}

/** Split `amount` by `shares` in ₹500 steps, largest remainder first, so it sums exactly. */
function apportion(amount: number, shares: number[]): number[] {
  const raw = shares.map(s => amount * s)
  const out = raw.map(x => Math.floor(x / STEP) * STEP)
  let left = amount - out.reduce((a, b) => a + b, 0)
  const order = raw.map((x, i) => [x - out[i], i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1])
  for (let j = 0; left >= STEP; j++) {
    out[order[j % order.length][1]] += STEP
    left -= STEP
  }
  if (left > 0) out[order[0][1]] += left // only when the amount isn't a multiple of ₹500
  return out
}

export function planSplit(plan: PlanId, surplus: number, goalMonthly: number): Split {
  const park = Math.min(goalMonthly, surplus)
  const [keep, grow, learn] = apportion(surplus - park, SHARES[plan])
  return { keep, park, grow, learn }
}

export type Emergency = 'yes' | 'partly' | 'notyet'
export type Appetite = 'hold' | 'worry' | 'sell'
export interface Answers {
  emergency: Emergency
  dependents: 'yes' | 'no'
  steady: 'yes' | 'notalways'
  appetite: Appetite
}

/** Safety (capacity) and comfort (appetite) each point to a plan; start from the more careful one. */
export function suggestPlan(a: Answers): PlanId {
  const capacity = Math.max(0, 2 - (a.emergency === 'notyet' ? 1 : 0) - (a.dependents === 'yes' ? 1 : 0) - (a.steady === 'notalways' ? 1 : 0))
  const appetite = a.appetite === 'hold' ? 2 : a.appetite === 'worry' ? 1 : 0
  return PLAN_ORDER[Math.min(capacity, appetite)]
}

/** Lowest and highest amount each bucket gets across the three model plans. */
export function commonRanges(surplus: number, goalMonthly: number): Record<BucketKey, [number, number]> {
  const splits = PLAN_ORDER.map(p => planSplit(p, surplus, goalMonthly))
  const out = {} as Record<BucketKey, [number, number]>
  KEYS.forEach(k => {
    const vals = splits.map(s => s[k])
    out[k] = [Math.min(...vals), Math.max(...vals)]
  })
  return out
}

/* ---------- Screen 3 sliders ---------- */
/** Move one bucket; spread the rest over the other three in proportion, in ₹500 steps, summing to `total`. */
export function rebalance(base: Split, key: BucketKey, value: number, total: number): Split {
  const val = Math.max(0, Math.min(total, Math.round(value / STEP) * STEP))
  const others = KEYS.filter(k => k !== key)
  const baseSum = others.reduce((s, k) => s + base[k], 0)
  const shares = others.map(k => (baseSum > 0 ? base[k] / baseSum : 1 / others.length))
  const amounts = apportion(total - val, shares)
  const next = { ...base, [key]: val }
  others.forEach((k, i) => { next[k] = amounts[i] })
  return next
}

export const sumSplit = (s: Split) => KEYS.reduce((a, k) => a + s[k], 0)

/** Money that goes into Groww each month. Keep stays in the bank. */
export const investableOf = (s: Split) => s.park + s.grow + s.learn

/** Screen 7: draw what's needed from Keep, then Park, then Grow, then Learn. */
export function computeDraw(need: number, balances: Split): Split & { short: number } {
  let left = need
  const d = { keep: 0, park: 0, grow: 0, learn: 0, short: 0 }
  KEYS.forEach(k => {
    const take = Math.min(left, Math.max(0, balances[k]))
    d[k] = take
    left -= take
  })
  d.short = left
  return d
}

/* ---------- story numbers ---------- */
// Commit card: on every ₹10,000 put in, a bad year has bottomed out at ₹7,000–8,000.
export const BAD_LOW = 0.7
export const BAD_HIGH = 0.8
export const FALL = 0.91 // the first fall, over 3 weeks
export const MARKET_FALL_PCT = 7
export const MONTHS_IN = 3 // check-in, Screen 7 and the portfolio all sit in month 3
export const STOCK_IN_GROW = 5000 // month 3: Grow money that went into one stock instead of the SIP
export const LEARN_OVER = 1000 // put into Learn beyond the plan
export const LEARN_TIP = -600 // trades based on a tip, after charges
export const LEARN_TIP_CHARGES = 140
export const LEARN_RESEARCH = 200 // trades based on her own research
export const FUND_RETURN = 3.1 // index fund since she started
export const INDEX_RETURN = 3.3

export const badRange = (amount: number): [number, number] => [r100(amount * BAD_LOW), r100(amount * BAD_HIGH)]
export const fallValue = (amount: number) => r100(amount * FALL)
export const fallPct = (amount: number) => Math.round(((amount - fallValue(amount)) / amount) * 100)

export interface Month3 {
  keep: number
  park: number
  parkExpected: number
  indexPut: number // put into the index fund over 3 months
  indexNow: number // at the check-in, after the fall
  stock: number
  learnPlan: number
  learnPut: number
  learnValue: number
  mutualFunds: number // end of month 3
  stocks: number
  liquid: number
  total: number
  /** What each bucket holds at the check-in (Screen 7). */
  balances: Split
}

export function month3(split: Split, sip: number, drawn: Split): Month3 {
  const indexPut = Math.max(sip, MONTHS_IN * sip - STOCK_IN_GROW)
  const indexNow = fallValue(indexPut)
  const learnPlan = MONTHS_IN * split.learn
  const learnPut = learnPlan + LEARN_OVER
  const learnValue = learnPut + LEARN_TIP + LEARN_RESEARCH
  const keep = Math.max(0, MONTHS_IN * split.keep - drawn.keep)
  const park = Math.max(0, MONTHS_IN * split.park - drawn.park)
  // Money taken from Grow comes out of the fund first, then the stock.
  const mfBefore = r50(indexPut * (1 + FUND_RETURN / 100))
  const fromFund = Math.min(drawn.grow, mfBefore)
  const mutualFunds = mfBefore - fromFund
  const stock = Math.max(0, STOCK_IN_GROW - (drawn.grow - fromFund))
  const learnLeft = Math.max(0, learnValue - drawn.learn)
  const stocks = stock + learnLeft
  return {
    keep,
    park,
    parkExpected: MONTHS_IN * split.park,
    indexPut,
    indexNow,
    stock,
    learnPlan,
    learnPut,
    learnValue,
    mutualFunds,
    stocks,
    liquid: park,
    total: mutualFunds + stocks + park,
    balances: {
      keep,
      park,
      grow: Math.max(0, indexNow + STOCK_IN_GROW - drawn.grow),
      learn: learnLeft,
    },
  }
}
