import { useState } from 'react'
import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { KEYS, PLAN_NAMES, bucketOf, durationText, monthlyFor, needFor, shiftPark, type Goal } from '../lib/plan'
import { BucketIcon, BUCKET_NAME, Icon, PlanRows, Shell, StackBar } from '../components/ui'
import { PaySettings } from '../components/PaySettings'
import { GoalCard } from './Basics'

/* "Your money plan", under the profile: the plan once it exists, its goals and its salary-day setting. */
export function MyPlan() {
  const { s, d, set, go, openSheet } = useStore()
  const editGoal = (id: string) => { set({ editing: id }); openSheet('goal') }
  const goals = s.goals.filter(g => g.amount > 0 && g.months > 0)
  const unplaced = !s.ff && (s.invested < s.split.grow || s.parkInvested < s.split.park)
  return (
    <Shell title="Your money plan" footer={<>
      <button className="btn-primary" onClick={() => go('plan')}>Edit my split</button>
      <button className="link block" onClick={() => go('basics')}>Change salary or expenses</button>
    </>}>
      <p className="eyebrow">Started from {PLAN_NAMES[s.plan]} · you set every number</p>
      <h1 className="h2">{inr(d.surplus)} a month</h1>
      <p className="lead">{inr(s.salary)} salary − {inr(s.expenses)} expenses.</p>

      {unplaced && (
        <div className="banner" role="status">
          <Icon.info />
          <span>Some of this month's money isn't placed yet. <button className="link-inline" onClick={() => go('categories')}>Place my money →</button></span>
        </div>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <StackBar split={s.split} />
        <PlanRows split={s.split} />
        <p className="tiny">Invest through Groww: {inr(d.investable)} a month. Keep stays in your bank as your emergency fund.</p>
      </div>

      <section className="sec">
        <h2 className="sec-title">Your goals</h2>
        {goals.length ? (
          <div className="status-list">
            {goals.map(g => {
              const park = bucketOf(g) === 'park'
              return (
                <div className="status-row" key={g.id} data-goal={g.id}>
                  <BucketIcon k={park ? 'park' : 'grow'} neutral />
                  <div className="status-main">
                    <b>{g.name.trim() || 'Goal'}</b>
                    <p>{inr(g.amount)} in {durationText(g.months)} · {inr(monthlyFor(g))} a month, {park ? 'kept steady in Park' : 'in Grow for now'}</p>
                  </div>
                  <button className="link-inline goal-edit" aria-label={`Edit ${g.name.trim() || 'goal'}`} onClick={() => editGoal(g.id)}>Edit</button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="hint" style={{ marginTop: 4 }}>No goals yet.</p>
        )}
        {s.goals.length < 3 && (
          <button className="add-goal" onClick={() => editGoal('new')}>+ {goals.length ? 'Add another goal' : 'Add a goal'}</button>
        )}
      </section>

      <section className="card sec" id="paySetting">
        <h2 className="sec-title">Each month</h2>
        <PaySettings />
      </section>
    </Shell>
  )
}

const NEW_GOAL = (): Goal => ({ id: `g${Date.now()}`, name: '', amount: 0, months: 12, mode: 'short', unit: 'months' })

/* Edit, add or remove one goal from Your money plan, and see what it does to the split before saving.
   Only Park moves (from or to Grow first); nothing else she set is reset. */
export function GoalSheet() {
  const { s, set, closeSheet, say } = useStore()
  const existing = s.goals.find(g => g.id === s.editing)
  const [draft, setDraft] = useState<Goal>(() => existing ?? NEW_GOAL())
  const [removing, setRemoving] = useState(false)
  const name = draft.name.trim() || 'This goal'
  const nextGoals = removing ? s.goals.filter(g => g.id !== draft.id)
    : existing ? s.goals.map(g => (g.id === draft.id ? draft : g)) : [...s.goals, draft]
  const valid = removing || (draft.amount > 0 && draft.months > 0)
  // Park aims at what its goals need, plus anything extra she chose to keep there.
  const extra = Math.max(0, s.split.park - needFor(s.goals, 'park'))
  const delta = needFor(nextGoals, 'park') + extra - s.split.park
  const { split, short } = shiftPark(s.split, delta)
  const changed = KEYS.filter(k => split[k] !== s.split[k])
  const growNeed = needFor(nextGoals, 'grow')

  const save = (updateSplit: boolean) => {
    set({ goals: nextGoals, ...(updateSplit ? { split } : {}), editing: null })
    closeSheet()
    say(removing ? `${name} removed.` : updateSplit && changed.length ? `${name} saved. Your plan is updated.` : `${name} saved.`)
  }

  return (
    <>
      <h2 className="sheet-title" id="sheetTitle">{removing ? `Remove ${name}?` : existing ? 'Edit goal' : 'Add a goal'}</h2>
      {!removing && (
        <GoalCard g={draft} n={s.goals.length + 1} onChange={p => setDraft(g => ({ ...g, ...p }))}
          onRemove={() => (existing ? setRemoving(true) : closeSheet())} />
      )}
      {valid && (
        <div className="goal-impact" id="goalImpact" role="status">
          <p className="label-sm">WHAT CHANGES</p>
          {!removing && <p>{name} needs <b>{inr(monthlyFor(draft))}</b> a month, {bucketOf(draft) === 'park' ? 'kept steady in Park' : 'in Grow for now'}.</p>}
          {changed.length ? (
            <div className="impact-rows">
              {changed.map(k => (
                <div key={k} className="kv" data-k={k}><span>{BUCKET_NAME[k]}</span><b>{inr(s.split[k])} → {inr(split[k])} a month</b></div>
              ))}
            </div>
          ) : <p>Your split doesn't change.</p>}
          {short > 0 && <p className="amt-msg"><span>Your plan has {inr(short)} a month too little for this. You could give it more time.</span></p>}
          {growNeed > split.grow && <p className="hint">Your long-term goals need {inr(growNeed)} a month; Grow is {inr(split.grow)}. You could give a goal more time.</p>}
          <p className="tiny">Park follows your goals, and Grow gives or takes the difference first. Everything else stays as you set it.</p>
        </div>
      )}
      <div className="sheet-actions">
        {changed.length
          ? <>
            <button className="btn-primary" disabled={!valid} onClick={() => save(true)}>{removing ? 'Remove and update my plan' : 'Save and update my plan'}</button>
            <button className="btn-secondary" disabled={!valid} onClick={() => save(false)}>{removing ? 'Remove, keep my split' : 'Save, keep my split'}</button>
          </>
          : <button className="btn-primary" disabled={!valid} onClick={() => save(false)}>{removing ? 'Remove goal' : 'Save goal'}</button>}
        {existing && !removing && <button className="link block" onClick={() => setRemoving(true)}>Remove this goal</button>}
        <button className="link block" onClick={() => { set({ editing: null }); closeSheet() }}>Cancel</button>
      </div>
    </>
  )
}
