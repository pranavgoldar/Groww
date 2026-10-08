import { derive, useStore, type State } from '../state/store'
import { inr } from '../lib/format'
import { planSplit, suggestPlan, type Appetite, type Emergency } from '../lib/plan'
import { AmountField, Chips, Shell } from '../components/ui'

const EMERGENCY: [Emergency, string][] = [['yes', 'Yes'], ['partly', 'Partly'], ['notyet', 'Not yet']]
const DEPENDENTS: [State['dependents'], string][] = [['yes', 'Yes'], ['no', 'No']]
const STEADY: [State['steady'], string][] = [['yes', 'Yes'], ['notalways', 'Not always']]
const APPETITE: [Appetite, string][] = [['hold', 'Hold calmly'], ['worry', 'Worry but hold'], ['sell', 'Sell']]

/* Screen 2: money basics. Capacity (safety) and appetite (comfort) are asked separately. */
export function Basics() {
  const { s, d, set, go } = useStore()

  // Any change re-applies the suggested model plan to the new surplus, so later screens stay consistent.
  const update = (patch: Partial<State>) => set(prev => {
    const next = { ...prev, ...patch }
    const plan = suggestPlan(next)
    const nd = derive(next)
    const split = planSplit(plan, nd.surplus, nd.goalMonthly)
    return { ...patch, plan, split, orderAmt: prev.invested ? prev.orderAmt : split.grow }
  })

  const ok = d.surplus > 0
  return (
    <Shell title="Money Plan" footer={
      <button className="btn-primary" disabled={!ok} onClick={() => go('pick')}>See what I can invest</button>
    }>
      <p className="eyebrow">Step 1 of 2</p>
      <h1 className="h1">Your money basics</h1>
      <p className="lead">About your money, not about you. We'll use this to work out how much you can invest each month.</p>

      <section className="q">
        <label className="q-label" htmlFor="salary">Monthly take-home salary</label>
        <AmountField id="salary" size="sm" value={s.salary} onChange={n => update({ salary: n })} />
        <label className="q-label" htmlFor="expenses" style={{ marginTop: 16 }}>Monthly expenses</label>
        <AmountField id="expenses" size="sm" value={s.expenses} onChange={n => update({ expenses: n })} describedBy="surplusLine" />
        <p className="hint" id="surplusLine">
          {ok
            ? <>That leaves <b>{inr(d.surplus)}</b> a month to plan.</>
            : "Your expenses are more than your salary, so there's nothing left to plan yet."}
        </p>
      </section>

      <section className="q">
        <h2 className="q-label" id="goalQ">Any goal in the next 3 years?</h2>
        <div className="goal-grid" role="group" aria-labelledby="goalQ">
          <input className="text-field goal-name" aria-label="Goal name" value={s.goalName} maxLength={24}
            onChange={e => update({ goalName: e.target.value })} />
          <AmountField id="goalAmt" size="sm" label="Goal amount" value={s.goalAmt} onChange={n => update({ goalAmt: n })} />
          <div className="months-field">
            <input aria-label="Months" inputMode="numeric" value={s.goalMonths || ''}
              onChange={e => update({ goalMonths: Math.min(36, Number(e.target.value.replace(/\D/g, '').slice(0, 2)) || 0) })} />
            <span>months</span>
          </div>
        </div>
        <p className="hint">
          {d.goalMonthly
            ? <>That's <b>{inr(d.goalMonthly)}</b> a month{d.goalMonthly > d.surplus ? `, more than the ${inr(d.surplus)} you have to plan` : ''}.</>
            : 'No goal for now. Park can stay empty.'}
        </p>
      </section>

      <section className="q">
        <h2 className="group-title">Your safety net</h2>
        <p className="q-label sm" id="qEm">Savings for emergencies?</p>
        <Chips options={EMERGENCY} value={s.emergency} labelledBy="qEm" className="chip-row seg3" onChange={v => update({ emergency: v })} />
        <p className="q-label sm" id="qDep">Does anyone depend on your income?</p>
        <Chips options={DEPENDENTS} value={s.dependents} labelledBy="qDep" className="chip-row seg2" onChange={v => update({ dependents: v })} />
        <p className="q-label sm" id="qSteady">Is your income steady?</p>
        <Chips options={STEADY} value={s.steady} labelledBy="qSteady" className="chip-row seg2" onChange={v => update({ steady: v })} />
      </section>

      <section className="q">
        <h2 className="group-title">Your comfort with ups and downs</h2>
        <p className="q-label sm" id="qAp">If ₹10,000 you invested became ₹8,000, you would…</p>
        <Chips options={APPETITE} value={s.appetite} labelledBy="qAp" onChange={v => update({ appetite: v })} />
      </section>
    </Shell>
  )
}
