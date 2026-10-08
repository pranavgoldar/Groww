import type { KeyboardEvent } from 'react'
import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { KEYS, PLAN_NAMES, PLAN_ORDER, planSplit, type PlanId } from '../lib/plan'
import { BUCKET_NAME, Icon, Shell, StackBar } from '../components/ui'

/* Screen 2b: rules-based model plans the user chooses from. Never assigned. */
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
  return (
    <Shell title="Money Plan" footer={
      <button className="btn-primary" onClick={start}>Start with {PLAN_NAMES[s.plan]}</button>
    }>
      <p className="eyebrow">Step 2 of 2</p>
      <h1 className="h1">Pick a starting plan</h1>
      <div className="callback" style={{ marginTop: 14 }}>
        <Icon.scale />
        <p>Your answers on safety and on comfort with risk both count. When they differ, we start from the more careful one.</p>
      </div>
      <p className="hint" style={{ margin: '16px 0 12px' }}>
        People with answers like yours often start with <b>{PLAN_NAMES[d.suggested]}</b>.
      </p>
      <div className="plans" role="radiogroup" aria-label={`Ways to split ${inr(d.surplus)} a month`}>
        {PLAN_ORDER.map(p => {
          const sp = planSplit(p, d.surplus, d.goalMonthly)
          const on = s.plan === p
          return (
            <div key={p} className="plan-opt" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
              data-plan={p} onClick={() => choose(p)} onKeyDown={onKey(p)}>
              <div className="plan-opt-top">
                <span className="radio-dot" />
                <b>{PLAN_NAMES[p]}</b>
                {p === d.suggested && <span className="tag sm">Common for answers like yours</span>}
              </div>
              <StackBar split={sp} />
              <div className="plan-amts">
                {KEYS.map(k => (
                  <span key={k}><i style={{ background: `var(--${k})` }} />{BUCKET_NAME[k]}<b>{inr(sp[k])}</b></span>
                ))}
              </div>
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
