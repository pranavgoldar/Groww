import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  PERSONA, goalMonthlyOf, goalsIn, goalsLabel, investableOf, keepTargetOf, month3, needFor, planSplit, suggestPlan, surplusOf,
  type Answers, type BucketKey, type Goal, type Month3, type PlanId, type Split,
} from '../lib/plan'
import type { PayMode } from '../lib/pay'
import { PRODUCTS, type Placeable, type ProductId, type Purchase, type Toward } from '../lib/products'

export type ScreenId =
  | 'start' | 'explore' | 'basics' | 'risk' | 'pick' | 'plan' | 'addMoney' | 'categories' | 'order'
  | 'commit' | 'invested' | 'payMode' | 'salary' | 'checkin' | 'noted' | 'need' | 'portfolio' | 'goalNear' | 'myPlan'

/** Screen order: drives the switcher and the slide direction of jumps. */
export const SCREENS: { id: ScreenId; label: string; n?: string; main: boolean }[] = [
  { id: 'start', label: 'Before adding money', n: '1', main: true },
  { id: 'explore', label: 'Explore', main: false },
  { id: 'basics', label: 'Your money', n: '2', main: true },
  { id: 'risk', label: 'Risk', n: '3', main: true },
  { id: 'pick', label: 'What to invest', n: '4', main: true },
  { id: 'plan', label: 'Monthly plan', n: '5', main: true },
  { id: 'addMoney', label: 'Add money', n: '6', main: true },
  { id: 'categories', label: 'Categories', n: '7', main: true },
  { id: 'order', label: 'Order', main: false },
  { id: 'commit', label: 'Commit', n: '8', main: true },
  { id: 'invested', label: 'Invested', main: false },
  { id: 'payMode', label: 'Each month', main: false },
  { id: 'salary', label: 'Salary day', n: '9', main: true },
  { id: 'checkin', label: 'Check-in', n: '10', main: true },
  { id: 'noted', label: 'Plan noted', main: false },
  { id: 'need', label: 'Need changed', n: '11', main: true },
  { id: 'portfolio', label: 'Portfolio', n: '12', main: true },
  { id: 'goalNear', label: 'Goal reminder', main: false },
  { id: 'myPlan', label: 'Your money plan', main: false },
]
const ORDER = SCREENS.map(s => s.id)
const PARENT: Partial<Record<ScreenId, ScreenId>> = {
  explore: 'start', basics: 'start', risk: 'basics', pick: 'risk', plan: 'pick', addMoney: 'plan',
  categories: 'addMoney', order: 'categories',
  commit: 'order', invested: 'categories', payMode: 'categories', salary: 'payMode', checkin: 'salary', noted: 'checkin',
  need: 'checkin', portfolio: 'checkin', goalNear: 'portfolio', myPlan: 'categories',
}

export type Commit = 'wait' | 'recheck' | 'revisit'
export type NeedWhen = 'week' | 'month' | 'few'
export type SheetKind = 'sell' | 'gr1' | 'gr1Portfolio' | 'gr1Ask' | 'month' | 'account'

export interface State extends Answers {
  salary: number
  expenses: number
  goals: Goal[]
  plan: PlanId
  split: Split
  pay: PayMode // confirm each month (default), or autopay on a fixed day
  payDay: number // autopay day of the month
  payHour: number // autopay time, 24-hour
  tab: 'grow' | 'park' | 'learn'
  added: number // first money added to Groww, after the plan exists (0 = not yet)
  orderId: ProductId // what the order screen is buying
  orderToward: Toward // which part of the plan it counts toward
  orderAmt: number
  invested: number // monthly SIP set up from Grow (0 = none yet)
  parkInvested: number // monthly liquid-fund SIP set up from Park (0 = none yet)
  extra: Purchase[] // anything else bought: other funds, stocks, or buys outside the plan
  commit: Commit | null
  ff: boolean // jumped ahead to month 3
  reflect: number[]
  needAmt: number
  needWhen: NeedWhen | null
  drawn: Split // taken out on Screen 7, by bucket
  update: { amt: number; when: NeedWhen | null; from: BucketKey[] } | null
}

const ZERO: Split = { keep: 0, park: 0, grow: 0, learn: 0 }
const DEFAULT_ANSWERS: Answers = { emergency: 'notyet', dependents: 'no', steady: 'yes', appetite: 'worry' }
const DEFAULT_PLAN = suggestPlan(DEFAULT_ANSWERS)

const DEFAULT_SPLIT = planSplit(DEFAULT_PLAN, surplusOf(PERSONA.salary, PERSONA.expenses), goalMonthlyOf(PERSONA.goal.amount, PERSONA.goal.months))

export const DEFAULTS: State = {
  salary: PERSONA.salary,
  expenses: PERSONA.expenses,
  goals: [{ id: 'g1', name: PERSONA.goal.name, amount: PERSONA.goal.amount, months: PERSONA.goal.months, mode: 'exact', unit: 'months' }],
  ...DEFAULT_ANSWERS,
  plan: DEFAULT_PLAN,
  split: DEFAULT_SPLIT,
  pay: 'manual',
  payDay: 2,
  payHour: 10,
  tab: 'grow',
  added: 0,
  orderId: 'largecap',
  orderToward: 'grow',
  orderAmt: DEFAULT_SPLIT.grow,
  invested: 0,
  parkInvested: 0,
  extra: [],
  commit: null,
  ff: false,
  reflect: [],
  needAmt: 0,
  needWhen: null,
  drawn: ZERO,
  update: null,
}

export interface Derived {
  surplus: number
  /** Park's monthly need: what short and medium goals need put aside (no returns assumed). */
  goalMonthly: number
  /** What long-term goals need put aside each month, inside Grow. */
  growGoalNeed: number
  parkGoals: Goal[]
  growGoals: Goal[]
  /** "your laptop", or "" when there are no Park goals. */
  parkLabel: string
  /** Park money a month not yet placed. */
  parkAvailable: number
  /** Money left to place this month in each bucket, after the plan SIPs and anything else counted toward it. */
  left: Record<Placeable, number>
  keepTarget: number
  /** What goes into Groww each month: everything except Keep, which stays in the bank. */
  investable: number
  suggested: PlanId
  /** Grow money a month not yet placed. */
  available: number
  /** SIP used for the month-3 story (falls back to the Grow amount when jumping ahead). */
  sip: number
  m3: Month3
}

/** What other purchases put toward a bucket this month. */
export const extraIn = (s: State, b: Toward, sipOnly = false) =>
  s.extra.filter(x => x.toward === b && (!sipOnly || PRODUCTS[x.product].sip)).reduce((a, x) => a + x.amt, 0)

export function derive(s: State): Derived {
  const sip = s.invested || (s.orderId === 'largecap' ? s.orderAmt : 0) || s.split.grow
  const left: Record<Placeable, number> = {
    grow: Math.max(0, s.split.grow - s.invested - extraIn(s, 'grow')),
    park: Math.max(0, s.split.park - s.parkInvested - extraIn(s, 'park')),
    learn: Math.max(0, s.split.learn - extraIn(s, 'learn')),
  }
  return {
    surplus: surplusOf(s.salary, s.expenses),
    goalMonthly: needFor(s.goals, 'park'),
    growGoalNeed: needFor(s.goals, 'grow'),
    parkGoals: goalsIn(s.goals, 'park'),
    growGoals: goalsIn(s.goals, 'grow'),
    parkLabel: goalsLabel(goalsIn(s.goals, 'park')),
    parkAvailable: left.park,
    left,
    keepTarget: keepTargetOf(s.expenses),
    investable: investableOf(s.split),
    suggested: suggestPlan(s),
    available: left.grow,
    sip,
    m3: month3(s.split, sip, s.drawn),
  }
}

type Patch = Partial<State> | ((s: State) => Partial<State>)
type Dir = 'fwd' | 'back'

interface Store {
  s: State
  d: Derived
  set: (p: Patch) => void
  nav: { current: ScreenId; dir: Dir; seq: number; instant: boolean }
  go: (id: ScreenId) => void
  back: () => void
  jump: (id: ScreenId) => void
  replaceTail: (drop: ScreenId[], push: ScreenId[], opts?: { instant?: boolean }) => void
  reset: () => void
  toast: { msg: string; id: number } | null
  say: (msg: string) => void
  sheet: SheetKind | null
  openSheet: (k: SheetKind) => void
  closeSheet: () => void
  lock: boolean
  setLock: (on: boolean) => void
  history: () => ScreenId[]
}

const Ctx = createContext<Store | null>(null)

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(DEFAULTS)
  const [nav, setNav] = useState({ current: 'start' as ScreenId, dir: 'fwd' as Dir, seq: 0, instant: true })
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null)
  const [sheet, setSheet] = useState<SheetKind | null>(null)
  const [lock, setLockState] = useState(false)
  const hist = useRef<ScreenId[]>(['start'])
  const toastTimer = useRef<number | undefined>(undefined)

  const set = useCallback((p: Patch) => setS(prev => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) })), [])

  const show = useCallback((id: ScreenId, dir: Dir, instant = false) => {
    // Keep the address bar on the current screen, so a link can open any screen.
    window.history.replaceState(null, '', id === 'start' ? window.location.pathname : `#/${id}`)
    setNav(n => (n.current === id ? n : { current: id, dir, seq: n.seq + 1, instant: instant || reducedMotion() }))
  }, [])

  const setLock = useCallback((on: boolean) => {
    if (on) { window.clearTimeout(toastTimer.current); setToast(null) }
    setLockState(on)
  }, [])

  const say = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ msg, id: Date.now() })
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const current = nav.current
  const go = useCallback((id: ScreenId) => {
    if (id === current) return
    hist.current.push(id)
    show(id, 'fwd')
  }, [current, show])

  const back = useCallback(() => {
    if (current === 'start') {
      say("This would return to Groww's home screen. It isn't part of this prototype.")
      return
    }
    const h = hist.current
    if (h.length > 1 && h[h.length - 1] === current) {
      h.pop()
      show(h[h.length - 1], 'back')
    } else {
      const p = PARENT[current] ?? 'start'
      hist.current = [p]
      show(p, 'back')
    }
  }, [current, say, show])

  const jump = useCallback((id: ScreenId) => {
    setSheet(null)
    setLock(false)
    // Later screens assume the SIP exists, and month-3 screens assume time has passed.
    set(prev => {
      const patch: Partial<State> = {}
      if (ORDER.indexOf(id) >= ORDER.indexOf('categories') && !prev.added) patch.added = investableOf(prev.split)
      if (ORDER.indexOf(id) >= ORDER.indexOf('salary') && !prev.parkInvested) patch.parkInvested = prev.split.park
      if (['invested', 'salary', 'checkin', 'noted', 'need', 'portfolio'].includes(id) && !prev.invested) {
        patch.invested = (prev.orderId === 'largecap' && prev.orderAmt) || prev.split.grow
        patch.orderAmt = patch.invested
        patch.orderId = 'largecap'
        patch.orderToward = 'grow'
      }
      if (['checkin', 'noted', 'need', 'portfolio'].includes(id)) patch.ff = true
      return patch
    })
    if (id === current) return
    if (hist.current[hist.current.length - 1] !== id) hist.current.push(id)
    show(id, ORDER.indexOf(id) < ORDER.indexOf(current) ? 'back' : 'fwd')
  }, [current, set, show, setLock])

  const replaceTail = useCallback((drop: ScreenId[], push: ScreenId[], opts?: { instant?: boolean }) => {
    const h = hist.current
    while (h.length && drop.includes(h[h.length - 1])) h.pop()
    h.push(...push)
    show(push[push.length - 1], 'fwd', opts?.instant)
  }, [show])

  const reset = useCallback(() => {
    setS(DEFAULTS)
    setSheet(null)
    setLock(false)
    hist.current = ['start']
    show('start', 'back')
    say('Prototype reset to Riya’s starting numbers.')
  }, [say, show, setLock])

  // Links like /#/portfolio open that screen, with earlier steps filled in.
  const jumpRef = useRef(jump)
  jumpRef.current = jump
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace(/^#\/?/, '') as ScreenId
      if (ORDER.includes(id)) jumpRef.current(id)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const value = useMemo<Store>(() => ({
    s, d: derive(s), set, nav, go, back, jump, replaceTail, reset, toast, say,
    sheet, openSheet: setSheet, closeSheet: () => setSheet(null), lock, setLock,
    history: () => hist.current.slice(),
  }), [s, set, nav, go, back, jump, replaceTail, reset, toast, say, sheet, lock, setLock])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside StoreProvider')
  return v
}
