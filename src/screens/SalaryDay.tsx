import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { KEYS, type BucketKey } from '../lib/plan'
import { BUCKET_NAME, Icon, Mark, Shell } from '../components/ui'

/* Salary day: the plan runs with zero effort. Sits between Screen 5 and the check-in. */
export function SalaryDay() {
  const { s, d, openSheet, setLock } = useStore()
  const goal = (s.goalName.trim() || 'goal').toLowerCase()
  const grow = s.split.grow
  const where: Record<BucketKey, string> = {
    keep: 'stays in your bank',
    park: d.goalMonthly ? `liquid fund for your ${goal}` : 'liquid fund',
    grow: s.invested >= grow
      ? 'your index fund SIP'
      : s.invested > 0
        ? `${inr(s.invested)} to your index fund SIP, the rest waits in Grow`
        : 'waits in Grow until you place it',
    learn: 'Learn balance',
  }
  return (
    <Shell title="Salary day" footer={<button className="btn-primary" onClick={() => setLock(true)}>View my money</button>}>
      <p className="eyebrow">Month 1 · your salary is in</p>
      <div className="notif-card" role="status">
        <span className="notif-ic"><Mark size={26} /></span>
        <span className="notif-txt">
          <span className="notif-top"><span>groww</span><span>now</span></span>
          <b>{s.auto ? `${inr(d.surplus)} split as planned` : `${inr(d.surplus)} ready to split`}</b>
          <span>{s.auto ? 'Your monthly plan ran on its own.' : 'Auto-apply is off for this plan.'}</span>
        </span>
      </div>
      <ul className="split-rows card" aria-label="Where this month's money went">
        {KEYS.map(k => (
          <li key={k} data-row={k}>
            <span className="ok-ic"><Icon.check size={14} /></span>
            <span><b>{BUCKET_NAME[k]} {inr(s.split[k])}</b> → {where[k]}</span>
          </li>
        ))}
      </ul>
      <p className="no-action">{s.auto ? 'No action needed.' : "You'd confirm this split with one tap."}</p>
      <button className="link block" onClick={() => openSheet('month')}>This month is different</button>
      <p className="tiny center" style={{ marginTop: 18 }}>Next, this prototype jumps ahead to month 3.</p>
    </Shell>
  )
}
