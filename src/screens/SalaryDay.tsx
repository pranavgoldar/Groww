import { extraIn, useStore } from '../state/store'
import { inr } from '../lib/format'
import { KEYS, type BucketKey } from '../lib/plan'
import { PRODUCTS, type Placeable } from '../lib/products'
import { BUCKET_NAME, Icon, Mark, Shell } from '../components/ui'

/* Salary day: the plan runs with zero effort. Sits between Screen 5 and the check-in. */
export function SalaryDay() {
  const { s, d, openSheet, setLock } = useStore()
  // SIPs repeat every month; one-time buys don't.
  const sips = (b: Placeable) => {
    const names = [
      ...(b === 'grow' && s.invested ? ['index fund'] : []),
      ...(b === 'park' && s.parkInvested ? ['liquid fund'] : []),
      ...s.extra.filter(x => x.toward === b && PRODUCTS[x.product].sip).map(x => PRODUCTS[x.product].short),
    ]
    const amt = (b === 'grow' ? s.invested : b === 'park' ? s.parkInvested : 0) + extraIn(s, b, true)
    const list = [...new Set(names)]
    return { amt, label: `${list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}` : list[0] ?? ''} SIP${list.length > 1 ? 's' : ''}` }
  }
  const sipLine = (b: 'grow' | 'park', full: string) => {
    const x = sips(b)
    return x.amt >= s.split[b] && s.split[b] > 0 ? full.replace('{sips}', x.label)
      : x.amt > 0 ? `${inr(x.amt)} to your ${x.label}, the rest waits in ${b === 'grow' ? 'Grow' : 'Park'}`
        : `waits in ${b === 'grow' ? 'Grow' : 'Park'} until you place it`
  }
  const where: Record<BucketKey, string> = {
    keep: 'stays in your bank',
    park: sipLine('park', `{sips}${d.parkLabel ? ` for ${d.parkLabel}` : ''}`),
    grow: sipLine('grow', 'your {sips}'),
    learn: 'your stocks balance',
  }
  return (
    <Shell title="Salary day" footer={<button className="btn-primary" onClick={() => setLock(true)}>View my money</button>}>
      <p className="eyebrow">Next month · your salary is in</p>
      <div className="notif-card" role="status">
        <span className="notif-ic"><Mark size={26} /></span>
        <span className="notif-txt">
          <span className="notif-top"><span>groww</span><span>now</span></span>
          <b>{s.auto ? `${inr(d.surplus)} split as planned` : `${inr(d.surplus)} ready to split`}</b>
          <span>{s.auto ? `${inr(d.investable)} moved into Groww. ${inr(s.split.keep)} stayed in your bank.` : 'Automatic split is off. You can turn it on in Your money plan.'}</span>
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
