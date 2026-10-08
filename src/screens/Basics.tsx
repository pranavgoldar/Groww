import { derive, useStore, type State } from '../state/store'
import { inr } from '../lib/format'
import { HORIZONS, bucketOf, durationText, horizonOf, monthlyFor, planSplit, suggestPlan, type Appetite, type Emergency, type Goal } from '../lib/plan'
import { AmountField, Chips, Icon, Shell } from '../components/ui'

const EMERGENCY: [Emergency, string][] = [['yes', 'Yes'], ['partly', 'Partly'], ['notyet', 'Not yet']]
const DEPENDENTS: [State['dependents'], string][] = [['yes', 'Yes'], ['no', 'No']]
const STEADY: [State['steady'], string][] = [['yes', 'Yes'], ['notalways', 'Not always']]
const APPETITE: [Appetite, string][] = [['hold', 'Hold calmly'], ['worry', 'Worry but hold'], ['sell', 'Sell']]

/** Any answer re-applies the suggested model plan to the new surplus, so later screens stay consistent. */
function useAnswer() {
  const { set } = useStore()
  return (patch: Partial<State>) => set(prev => {
    const next = { ...prev, ...patch }
    const plan = suggestPlan(next)
    const nd = derive(next)
    const split = planSplit(plan, nd.surplus, nd.goalMonthly)
    return { ...patch, plan, split, orderAmt: prev.invested ? prev.orderAmt : split.grow }
  })
}

/* Screen 2: salary first. Expenses and goals set how much is free to plan, and where goal money waits. */
export function Basics() {
  const { s, d, go } = useStore()
  const update = useAnswer()
  const ok = d.surplus > 0
  const setGoal = (id: string, patch: Partial<Goal>) =>
    update({ goals: s.goals.map(g => (g.id === id ? { ...g, ...patch } : g)) })
  const addGoal = () =>
    update({ goals: [...s.goals, { id: `g${Date.now()}`, name: '', amount: 0, months: 12, mode: 'short', unit: 'months' }] })
  const removeGoal = (id: string) => update({ goals: s.goals.filter(g => g.id !== id) })
  const needTotal = d.goalMonthly + d.growGoalNeed
  return (
    <Shell summary title="Money Plan" footer={
      <button className="btn-primary" disabled={!ok} onClick={() => go('risk')}>Next</button>
    }>
      <p className="eyebrow">Step 1 of 3</p>
      <h1 className="h1">Your money</h1>
      <p className="lead">Start with what comes in and what goes out. We'll work out what's free to invest.</p>

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
        <h2 className="q-label" id="goalQ">Saving for anything?</h2>
        <p className="hint" style={{ margin: '-4px 0 12px' }}>Each goal gets its own time. The time decides where its money waits.</p>
        {s.goals.map((g, i) => (
          <GoalCard key={g.id} g={g} n={i + 1} onChange={p => setGoal(g.id, p)} onRemove={() => removeGoal(g.id)} />
        ))}
        {!s.goals.length && <p className="hint">No goals for now. Park can stay empty.</p>}
        {s.goals.length < 3 && (
          <button className="add-goal" onClick={addGoal}>+ {s.goals.length ? 'Add another goal' : 'Add a goal'}</button>
        )}
        {needTotal > d.surplus && (
          <p className="amt-msg"><span>Your goals need {inr(needTotal)} a month, more than the {inr(d.surplus)} you have. You could give them more time.</span></p>
        )}
      </section>
    </Shell>
  )
}

function GoalCard({ g, n, onChange, onRemove }: { g: Goal; n: number; onChange: (p: Partial<Goal>) => void; onRemove: () => void }) {
  const band = HORIZONS.find(h => h.id === horizonOf(g.months))!
  const toPark = bucketOf(g) === 'park'
  const monthly = monthlyFor(g)
  const name = g.name.trim() || `Goal ${n}`
  const shown = g.unit === 'years' ? Math.max(1, Math.round(g.months / 12)) : g.months
  const setExact = (v: number, unit = g.unit) =>
    onChange({ mode: 'exact', unit, months: Math.max(1, Math.min(360, unit === 'years' ? v * 12 : v)) })
  return (
    <div className="card goal-card" data-goal={g.id}>
      <div className="goal-top">
        <input className="text-field goal-name" aria-label={`Goal ${n} name`} placeholder="What for? e.g. Trip" value={g.name} maxLength={24}
          onChange={e => onChange({ name: e.target.value })} />
        <button className="icon-btn" aria-label={`Remove ${name}`} onClick={onRemove}><Icon.close /></button>
      </div>
      <AmountField id={`goalAmt-${g.id}`} size="sm" label={`${name} amount`} value={g.amount} onChange={v => onChange({ amount: v })} />
      <p className="q-label sm" id={`when-${g.id}`}>When do you need it?</p>
      <div className="hz-row" role="radiogroup" aria-labelledby={`when-${g.id}`}>
        {HORIZONS.map(h => (
          <button key={h.id} className="hz" role="radio" aria-checked={g.mode === h.id}
            onClick={() => onChange({ mode: h.id, months: h.months })}>
            <b>{h.label}</b><span>{h.range}</span>
          </button>
        ))}
        <button className="hz" role="radio" aria-checked={g.mode === 'exact'} onClick={() => onChange({ mode: 'exact' })}>
          <b>Exact</b><span>pick a time</span>
        </button>
      </div>
      {g.mode === 'exact' && (
        <div className="exact-row">
          <input className="text-field" inputMode="numeric" aria-label={`${name}: how long`} value={shown}
            onChange={e => setExact(Number(e.target.value.replace(/\D/g, '').slice(0, 3)) || 1)} />
          <Chips options={[['months', 'Months'], ['years', 'Years']]} value={g.unit} label="Unit" className="chip-row seg2"
            onChange={u => setExact(u === 'years' ? Math.max(1, Math.round(g.months / 12)) : g.months, u)} />
        </div>
      )}
      <p className="goal-meta">
        <b>{band.label} term</b> · {durationText(g.months)} → {toPark ? 'kept steady in Park' : 'in Grow, for now'}
      </p>
      {monthly > 0 && (
        <p className="hint" style={{ marginTop: 6 }}>
          Put aside <b>{inr(monthly)}</b> a month. What you put in alone reaches {inr(g.amount)}. We don't count on returns.
        </p>
      )}
      {!toPark && (
        <p className="hint" style={{ marginTop: 6 }}>
          12 months before you need it, we'll remind you to move it to Park, so a bad year can't hit it.
        </p>
      )}
    </div>
  )
}

/* Screen 3: risk. Capacity (safety) and appetite (comfort) are asked separately. */
export function Risk() {
  const { s, go } = useStore()
  const update = useAnswer()
  return (
    <Shell summary title="Money Plan" footer={<button className="btn-primary" onClick={() => go('pick')}>See what I could invest</button>}>
      <p className="eyebrow">Step 2 of 3</p>
      <h1 className="h1">How much risk your money can take</h1>
      <p className="lead">About your money, not about you. Your answers shape how much of it can take ups and downs.</p>

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
