import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { PLAN_NAMES, bucketOf, durationText, monthlyFor } from '../lib/plan'
import { BucketIcon, Icon, PlanRows, Shell, StackBar } from '../components/ui'
import { PaySettings } from '../components/PaySettings'

/* "Your money plan", under the profile: the plan once it exists, its goals and its salary-day setting. */
export function MyPlan() {
  const { s, d, go } = useStore()
  const goals = s.goals.filter(g => g.amount > 0 && g.months > 0)
  const unplaced = !s.ff && (s.invested < s.split.grow || s.parkInvested < s.split.park)
  return (
    <Shell title="Your money plan" footer={<>
      <button className="btn-primary" onClick={() => go('plan')}>Edit my split</button>
      <button className="link block" onClick={() => go('basics')}>Change salary, expenses or goals</button>
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
                </div>
              )
            })}
          </div>
        ) : (
          <p className="hint" style={{ marginTop: 4 }}>No goals yet. Add one under salary, expenses or goals.</p>
        )}
      </section>

      <section className="card sec" id="paySetting">
        <h2 className="sec-title">Each month</h2>
        <PaySettings />
      </section>
    </Shell>
  )
}
