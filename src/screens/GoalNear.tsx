import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { MOVE_BEFORE_MONTHS, monthlyFor, type Goal } from '../lib/plan'
import { DISCLAIMER, Mark, Shell } from '../components/ui'

// Shown when Riya has no 3+ year goal of her own, clearly labelled as a sample.
const SAMPLE: Goal = { id: 'sample', name: 'Higher studies', amount: 240000, months: 48, mode: 'exact', unit: 'years' }

/* Option D: 12 months before a long-term goal, suggest moving its money from Grow to Park.
   It never states what the money is worth or will be worth; only what was put in. */
export function GoalNear() {
  const { d, say } = useStore()
  const own = d.growGoals[0]
  const g = own ?? SAMPLE
  const name = g.name.trim() || 'Goal'
  const at = g.months - MOVE_BEFORE_MONTHS
  const put = Math.min(g.amount, at * monthlyFor(g))
  return (
    <Shell title="Goal reminder" footer={<>
      <button className="btn-primary" onClick={() => say("This would move this goal's money to a liquid fund in Park and send its future SIPs there. Not part of this prototype.")}>
        Move it to Park
      </button>
      <button className="btn-secondary" onClick={() => say("We'll remind you again next month.")}>Remind me next month</button>
      <button className="link block" onClick={() => say('Noted. It stays in Grow. You can move it any time.')}>Keep it in Grow</button>
    </>}>
      {!own && <p className="sample-note">Sample goal. Add a goal of 3+ years on "Your money" to see your own here.</p>}
      <p className="eyebrow">Month {at} · {MOVE_BEFORE_MONTHS} months to go</p>
      <div className="notif-card" role="status">
        <span className="notif-ic"><Mark size={26} /></span>
        <span className="notif-txt">
          <span className="notif-top"><span>groww</span><span>now</span></span>
          <b>Your {name.toLowerCase()} goal is a year away</b>
          <span>Time to think about moving it somewhere steadier.</span>
        </span>
      </div>
      <h1 className="h2" style={{ marginTop: 20 }}>Move your {name.toLowerCase()} money to Park?</h1>
      <div className="card" style={{ marginTop: 14 }}>
        <div className="kv"><span>Goal</span><b>{name} · {inr(g.amount)}</b></div>
        <div className="kv"><span>You've put in so far</span><b>{inr(put)}</b></div>
        <div className="kv"><span>Where it is now</span><b>Grow, which rises and falls</b></div>
        <div className="kv"><span>Needed in</span><b>{MOVE_BEFORE_MONTHS} months</b></div>
      </div>
      <p className="sec-note" style={{ marginTop: 16 }}>
        In a bad year, funds like this have fallen 20–30%. With a year to go, there may not be time to recover before you need the money.
      </p>
      <p className="tiny" style={{ marginTop: 8 }}>{DISCLAIMER}</p>
      <p className="hint">Moving it to Park keeps it steadier until you need it. It's your call; leaving it in Grow is fine too.</p>
    </Shell>
  )
}
