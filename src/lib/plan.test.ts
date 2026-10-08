import { describe, expect, it } from 'vitest'
import {
  KEYS, PERSONA, badRange, bucketOf, horizonOf, investableOf, needFor, type Goal, commonRanges, computeDraw, fallPct, goalMonthlyOf, keepTargetOf, month3, planSplit,
  rebalance, suggestPlan, sumSplit, surplusOf, type Split,
} from './plan'

const surplus = surplusOf(PERSONA.salary, PERSONA.expenses)
const goalMonthly = goalMonthlyOf(PERSONA.goal.amount, PERSONA.goal.months)
const ZERO: Split = { keep: 0, park: 0, grow: 0, learn: 0 }

describe('persona', () => {
  it('plans a ₹15,000 monthly surplus with a ₹3,000 laptop goal and a ₹75,000 Keep target', () => {
    expect(surplus).toBe(15000)
    expect(goalMonthly).toBe(3000)
    expect(keepTargetOf(PERSONA.expenses)).toBe(75000)
  })
})

describe('model plans', () => {
  it('match the brief exactly', () => {
    expect(planSplit('careful', surplus, goalMonthly)).toEqual({ keep: 7500, park: 3000, grow: 4500, learn: 0 })
    expect(planSplit('balanced', surplus, goalMonthly)).toEqual({ keep: 6000, park: 3000, grow: 5500, learn: 500 })
    expect(planSplit('growth', surplus, goalMonthly)).toEqual({ keep: 5000, park: 3000, grow: 6000, learn: 1000 })
  })
  it('invest through Groww everything except Keep: ₹7,500 / ₹9,000 / ₹10,000', () => {
    expect(investableOf(planSplit('careful', surplus, goalMonthly))).toBe(7500)
    expect(investableOf(planSplit('balanced', surplus, goalMonthly))).toBe(9000)
    expect(investableOf(planSplit('growth', surplus, goalMonthly))).toBe(10000)
  })
  it('always add up to the surplus', () => {
    for (let i = 0; i < 2000; i++) {
      const s = Math.floor(Math.random() * 60000)
      const g = Math.floor(Math.random() * 8000)
      for (const p of ['careful', 'balanced', 'growth'] as const) expect(sumSplit(planSplit(p, s, g))).toBe(s)
    }
  })
  it('common ranges span the three plans', () => {
    const r = commonRanges(surplus, goalMonthly)
    expect(r.keep).toEqual([5000, 7500])
    expect(r.park).toEqual([3000, 3000])
    expect(r.grow).toEqual([4500, 6000])
    expect(r.learn).toEqual([0, 1000])
  })
})

describe('suggestPlan', () => {
  const riya = { emergency: 'notyet', dependents: 'no', steady: 'yes', appetite: 'worry' } as const
  it('suggests Balanced for Riya', () => expect(suggestPlan(riya)).toBe('balanced'))
  it('starts from the more careful answer', () => {
    expect(suggestPlan({ ...riya, emergency: 'yes', appetite: 'hold' })).toBe('growth')
    expect(suggestPlan({ ...riya, emergency: 'yes', appetite: 'sell' })).toBe('careful')
    expect(suggestPlan({ ...riya, dependents: 'yes', appetite: 'hold' })).toBe('careful')
  })
})

describe('rebalance', () => {
  const balanced = planSplit('balanced', surplus, goalMonthly)
  it('keeps the total at ₹15,000', () => {
    const next = rebalance(balanced, 'keep', 9000, surplus)
    expect(next.keep).toBe(9000)
    expect(sumSplit(next)).toBe(15000)
  })
  it('always sums exactly, in ₹500 steps', () => {
    for (let t = 0; t < 5000; t++) {
      const total = 15000 - Math.floor(Math.random() * 10) * 250
      const base = { ...ZERO }
      let left = total
      KEYS.forEach((k, i) => { const v = i === 3 ? left : Math.floor(Math.random() * left); base[k] = v; left -= v })
      const out = rebalance(base, KEYS[t % 4], Math.random() * (total + 1000), total)
      expect(sumSplit(out)).toBe(total)
      KEYS.forEach(k => expect(out[k]).toBeGreaterThanOrEqual(0))
    }
  })
})

describe('month 3 snapshot (Balanced, ₹5,500 SIP)', () => {
  const m = month3(planSplit('balanced', surplus, goalMonthly), 5500, ZERO)
  it('matches the portfolio and Screen 7 numbers', () => {
    expect(m.keep).toBe(18000)
    expect(m.park).toBe(9000)
    expect(m.stock).toBe(5000)
    expect(m.learnPut).toBe(2500)
    expect(m.learnPlan).toBe(1500)
    expect(m.mutualFunds).toBe(11850)
    expect(m.stocks).toBe(7100)
    expect(m.liquid).toBe(9000)
    expect(m.total).toBe(27950)
  })
  it('first fall: ₹11,500 becomes ₹10,500 (−9%)', () => {
    expect(m.indexPut).toBe(11500)
    expect(m.indexNow).toBe(10500)
    expect(fallPct(m.indexPut)).toBe(9)
  })
  it('Screen 7 draws from Keep first', () => {
    expect(m.balances.keep).toBe(18000)
    expect(m.balances.park).toBe(9000)
    const d = computeDraw(8000, m.balances)
    expect(d).toMatchObject({ keep: 8000, park: 0, grow: 0, learn: 0, short: 0 })
    expect(computeDraw(20000, m.balances)).toMatchObject({ keep: 18000, park: 2000 })
  })
})

it('bad-year range on every ₹10,000 is ₹7,000–8,000', () => {
  expect(badRange(10000)).toEqual([7000, 8000])
})

describe('goals and horizons', () => {
  const g = (name: string, amount: number, months: number): Goal => ({ id: name, name, amount, months, mode: 'exact', unit: 'months' })
  it('sorts time into short, medium and long (3+ years)', () => {
    expect([1, 12, 13, 20, 36, 37, 60].map(horizonOf)).toEqual(['short', 'short', 'medium', 'medium', 'medium', 'long', 'long'])
  })
  it('keeps short and medium goals in Park, long ones in Grow', () => {
    expect(bucketOf(g('Laptop', 60000, 20))).toBe('park')
    expect(bucketOf(g('Studies', 240000, 48))).toBe('grow')
  })
  it('counts only what is put in, never returns', () => {
    const goals = [g('Laptop', 60000, 20), g('Trip', 24000, 8), g('Studies', 240000, 48)]
    expect(needFor(goals, 'park')).toBe(3000 + 3000)
    expect(needFor(goals, 'grow')).toBe(5000)
  })
})
