import type { KeyboardEvent } from 'react'
import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { KEYS, PLAN_NAMES, PLAN_ORDER, investableOf, planSplit, type PlanId } from '../lib/plan'
import { BUCKET_NAME, Dot, Icon, Shell, StackBar } from '../components/ui'

/* Screen 4: what she could invest each month, worked out from salary, expenses and goals.
   The split comes from rules-based model plans the user chooses from. Never assigned. */
export function PickPlan() {
  const { s, d, set, go } = useStore()
  const choose = (p: PlanId) => set(prev => {
    const split = planSplit(p, d.surplus, d.goalMonthly)
    return { plan: p, split, orderAmt: prev.invested ? prev.orderAmt : split.grow }
  })
  const onKey = (p: PlanId) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(p) }
  }
  const start = () => {
    choose(s.plan)
    go('plan')
  }
  const sp = planSplit(s.plan, d.surplus, d.goalMonthly)
  const invest = investableOf(sp)

  return (
    <Shell title="Money Plan" footer={
      <button className="btn-primary" onClick={start}>Start with {PLAN_NAMES[s.plan]}</button>
    }>
      <p className="eyebrow">Step 3 of 3</p>
      <h1 className="h1">Here's what you could invest</h1>

      <div className="card calc" style={{ marginTop: 16 }} aria-label="How much is free each month">
        <div className="calc-row"><span>Salary</span><b>{inr(s.salary)}</b></div>
        <div className="calc-row"><span>Expenses</span><b>{inr(-s.expenses)}</b></div>
        <div className="calc-row total"><span>Free each month</span><b id="freeAmt">{inr(d.surplus)}</b></div>
      </div>

      <div className="invest-split">
        <div className="is-row">
          <span className="is-label"><Dot k="keep" />Keep in your bank</span>
          <b id="keepAmt">{inr(sp.keep)}</b>
          <span className="is-note">Your emergency cushion, until it reaches {inr(d.keepTarget)}</span>
        </div>
        <div className="is-row main">
          <span className="is-label">Invest through Groww</span>
          <b id="investAmt">{inr(invest)} a month</b>
          <span className="is-note">
            Park {inr(sp.park)}{d.parkLabel ? ` put aside for ${d.parkLabel}` : ''} · Grow {inr(sp.grow)} · Stocks {inr(sp.learn)}
          </span>
        </div>
      </div>
      <p className="hint" id="noReturns" style={{ marginTop: 10 }}>
        Goal amounts count only what you put in. We don't count on returns; anything extra is a bonus.
      </p>
      {d.growGoalNeed > sp.grow && (
        <p className="amt-msg"><span>Your long-term goals need {inr(d.growGoalNeed)} a month put aside; this plan's Grow is {inr(sp.grow)}. You can move more into Grow on the next screen, or give a goal more time.</span></p>
      )}

      <div className="callback" style={{ marginTop: 18 }}>
        <Icon.scale />
        <p>Your answers on safety and on comfort with risk both count. When they differ, we start from the more careful one.</p>
      </div>
      <p className="hint" style={{ margin: '16px 0 12px' }}>
        People with answers like yours often start with <b>{PLAN_NAMES[d.suggested]}</b>.
      </p>
      <div className="plans" role="radiogroup" aria-label={`Ways to split ${inr(d.surplus)} a month`}>
        {PLAN_ORDER.map(p => {
          const split = planSplit(p, d.surplus, d.goalMonthly)
          const on = s.plan === p
          return (
            <div key={p} className="plan-opt" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
              data-plan={p} onClick={() => choose(p)} onKeyDown={onKey(p)}>
              <div className="plan-opt-top">
                <span className="radio-dot" />
                <b>{PLAN_NAMES[p]}</b>
                {p === d.suggested && <span className="tag sm">Common for answers like yours</span>}
              </div>
              <StackBar split={split} />
              <div className="plan-amts">
                {KEYS.map(k => (
                  <span key={k}><span><i style={{ background: `var(--${k})` }} />{BUCKET_NAME[k]}</span><b>{inr(split[k])}</b></span>
                ))}
              </div>
              <p className="plan-invest">Invest {inr(investableOf(split))} a month · keep {inr(split.keep)} in the bank</p>
            </div>
          )
        })}
      </div>
      <p className="hint" style={{ marginTop: 16 }}>
        Once Keep reaches 3 months of expenses ({inr(d.keepTarget)}), its share moves into Grow.
      </p>
      <p className="tiny" style={{ marginTop: 14 }}>
        General model plans for education, not a personal recommendation. You choose and can change any number. [PENDING COMPLIANCE REVIEW]
      </p>
    </Shell>
  )
}
