import { derive, useStore, type State } from '../state/store'
import { inr } from '../lib/format'
import { HORIZONS, INCOME_HINT, INCOME_LABEL, OCCUPATIONS, bucketOf, durationText, horizonOf, incomeWord, monthlyFor, planSplit, steadyFor, suggestPlan, type Appetite, type Emergency, type Goal, type Occupation } from '../lib/plan'
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

/* Step 1, one page of quick taps: what she does, income and expenses, the safety net, comfort with ups and downs, then goals.
   Everything is prefilled, so most people only change what's different. */
export function Basics() {
  const { s, d, go } = useStore()
  const update = useAnswer()
  const ok = d.surplus > 0
  const setGoal = (id: string, patch: Partial<Goal>) =>
    update({ goals: s.goals.map(g => (g.id === id ? { ...g, ...patch } : g)) })
  const addGoal = () =>
    update({ goals: [...s.goals, { id: `g${Date.now()}`, name: '', amount: 0, months: 12, mode: 'short', unit: 'months' }] })
  const removeGoal = (id: string) => update({ goals: s.goals.filter(g => g.id !== id) })
  // What she does prefills "Is your income steady?"; she can still change it below.
  const setOccupation = (occupation: Occupation) => {
    const steady = steadyFor(occupation)
    update(steady ? { occupation, steady } : { occupation })
  }
  const needTotal = d.goalMonthly + d.growGoalNeed
  return (
    <Shell summary title="Money Plan" footer={
      <button className="btn-primary" disabled={!ok} onClick={() => go('plan')}>{s.added ? 'Review my plan' : 'See what I could invest'}</button>
    }>
      <div className="form-head">
        <div>
          {!s.added && <p className="eyebrow">Step 1 of 2</p>}
          <h1 className="h1">About your money</h1>
        </div>
        <span className="time-badge"><Icon.clock size={15} />Takes about 30 seconds</span>
      </div>
      <p className="lead">Tap what fits and change anything that's different.</p>

      <section className="q" id="moneyQ">
        <h2 className="group-title">What comes in and goes out</h2>
        <p className="q-label sm" id="qOcc" style={{ marginTop: 8 }}>What do you do?</p>
        <Chips options={OCCUPATIONS} value={s.occupation} labelledBy="qOcc" className="chip-row seg3 occ" onChange={setOccupation} />
        <label className="q-label" htmlFor="salary" style={{ marginTop: 18 }}>{INCOME_LABEL[s.occupation]}</label>
        {INCOME_HINT[s.occupation] && <p className="hint" id="incomeHint" style={{ margin: '-4px 0 10px' }}>{INCOME_HINT[s.occupation]}</p>}
        <AmountField id="salary" size="sm" value={s.salary} onChange={n => update({ salary: n })} />
        <label className="q-label" htmlFor="expenses" style={{ marginTop: 16 }}>Monthly expenses</label>
        <AmountField id="expenses" size="sm" value={s.expenses} onChange={n => update({ expenses: n })} describedBy="surplusLine" />
        <p className="hint" id="surplusLine">
          {ok
            ? <>That leaves <b>{inr(d.surplus)}</b> a month to plan.</>
            : `Your expenses are more than your ${incomeWord(s.occupation)}, so there's nothing left to plan yet.`}
        </p>
      </section>

      <section className="q" id="safetyNet">
        <h2 className="group-title">Your safety net</h2>
        <p className="q-label sm" id="qEm">Savings for emergencies?</p>
        <Chips options={EMERGENCY} value={s.emergency} labelledBy="qEm" className="chip-row seg3" onChange={v => update({ emergency: v })} />
        <p className="q-label sm" id="qDep">Does anyone depend on your income?</p>
        <Chips options={DEPENDENTS} value={s.dependents} labelledBy="qDep" className="chip-row seg2" onChange={v => update({ dependents: v })} />
        <p className="q-label sm" id="qSteady">Is your income steady?</p>
        <Chips options={STEADY} value={s.steady} labelledBy="qSteady" className="chip-row seg2" onChange={v => update({ steady: v })} />
      </section>

      <section className="q" id="comfort">
        <h2 className="group-title">Your comfort with ups and downs</h2>
        <p className="q-label sm" id="qAp">If ₹10,000 you invested became ₹8,000, you would…</p>
        <Chips options={APPETITE} value={s.appetite} labelledBy="qAp" onChange={v => update({ appetite: v })} />
      </section>

      <section className="q">
        <h2 className="group-title" id="goalQ">Saving for anything?</h2>
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

export function GoalCard({ g, n, onChange, onRemove }: { g: Goal; n: number; onChange: (p: Partial<Goal>) => void; onRemove: () => void }) {
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
