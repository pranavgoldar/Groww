import { useStore } from '../state/store'
import { inr, oneDecimal } from '../lib/format'
import {
  CUSHION_MONTHS, FUND_RETURN, INDEX_RETURN, LEARN_RESEARCH, LEARN_TIP, LEARN_TIP_CHARGES, type BucketKey,
} from '../lib/plan'
import { BucketIcon, BUCKET_NAME, Meter, Shell } from '../components/ui'

// Neutral ramp: asset types are a different dimension from the bucket colours, and nothing here is judged.
const ASSETS = [
  { key: 'mutualFunds', label: 'Mutual funds', color: '#2F3B47' },
  { key: 'stocks', label: 'Stocks', color: '#6F7C89' },
  { key: 'liquid', label: 'Liquid', color: '#B6C0C9' },
] as const

const signed = (n: number) => (n >= 0 ? `+${inr(n)}` : inr(n))

/* "Is your money doing its job?": one view across everything, judged only against the user's own plan. */
export function Portfolio() {
  const { s, d, go, openSheet } = useStore()
  const m = d.m3
  const goal = s.goalName.trim() || 'Goal'
  const parkOnTrack = m.park >= m.parkExpected

  const rows: { k: BucketKey; line: string; amber?: boolean; meter?: number }[] = [
    {
      k: 'keep',
      line: `${inr(m.keep)} of ${inr(d.keepTarget)} · about ${oneDecimal(s.expenses ? m.keep / s.expenses : 0)} of ${CUSHION_MONTHS} months built`,
      meter: d.keepTarget ? (m.keep / d.keepTarget) * 100 : 0,
    },
    {
      k: 'park',
      line: d.goalMonthly
        ? `${goal} · ${inr(m.park)} of ${inr(s.goalAmt)} · ${parkOnTrack ? `on track for month ${s.goalMonths}` : `${inr(m.parkExpected - m.park)} behind for month ${s.goalMonths}`}`
        : `${inr(m.park)} parked for goals within 3 years`,
      meter: s.goalAmt ? (m.park / s.goalAmt) * 100 : 0,
    },
    {
      k: 'grow',
      line: m.stock > 0
        ? `${inr(m.stock)} of your Grow money is in one stock. Your plan was a spread across funds.`
        : 'Your Grow money is spread across funds, as planned.',
      amber: m.stock > 0,
    },
    {
      k: 'learn',
      line: `You've put ${inr(m.learnPut)} into picking stocks. Your plan was ${inr(m.learnPlan)}.`,
      amber: m.learnPut > m.learnPlan,
    },
  ]

  return (
    <Shell title="Portfolio" footer={<button className="btn-primary" onClick={() => go('plan')}>Edit my plan</button>}>
      <p className="eyebrow">Month 3 of your plan</p>
      <h1 className="h2">Is your money doing its job?</h1>

      <div className="card" style={{ marginTop: 16 }}>
        <p className="label-sm">TOTAL VALUE</p>
        <div className="total-val" id="totalVal">{inr(m.total)}</div>
        <p className="hint" style={{ marginTop: 2 }}>across all your holdings</p>
        <div className="stack" style={{ marginTop: 14 }} role="img"
          aria-label={ASSETS.map(a => `${a.label} ${inr(m[a.key])}`).join(', ')}>
          {ASSETS.filter(a => m[a.key] > 0).map(a => (
            <span key={a.key} style={{ flex: `${m[a.key]} 1 0px`, background: a.color }} title={`${a.label} ${inr(m[a.key])}`} />
          ))}
        </div>
        <div className="legend three">
          {ASSETS.map(a => <div key={a.key}><i style={{ background: a.color }} />{a.label}<b>{inr(m[a.key])}</b></div>)}
        </div>
      </div>

      <section className="sec">
        <h2 className="sec-title">Plan vs actual</h2>
        <div className="status-list">
          {rows.map(r => (
            <div key={r.k} className={'status-row' + (r.amber ? ' amber' : '')} data-status={r.k}>
              <BucketIcon k={r.k} neutral />
              <div className="status-main">
                <b>{BUCKET_NAME[r.k]}</b>
                <p>{r.line}</p>
                {r.meter != null && <Meter pct={r.meter} color="var(--ink-2)" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card sec">
        <h2 className="sec-title">Your fund vs its index</h2>
        <div className="facts">
          <div><span>Large-cap index fund (sample)</span><b>+{FUND_RETURN}% since you started</b></div>
          <div><span>Its index</span><b>+{INDEX_RETURN}%</b></div>
        </div>
        <p className="sec-note">The small gap is normal for index funds (costs).</p>
      </section>

      <section className="card">
        <h2 className="sec-title">Patterns in your stock trades</h2>
        <div className="facts">
          <div><span>Trades based on a tip</span><b>{signed(LEARN_TIP)} after {inr(LEARN_TIP_CHARGES)} in charges</b></div>
          <div><span>Trades based on your own research</span><b>{signed(LEARN_RESEARCH)}</b></div>
        </div>
        <p className="tiny" style={{ marginTop: 8 }}>A few months is too short to judge a method. Treat this as something to notice, not proof.</p>
      </section>

      <button className="link block" style={{ marginTop: 10 }} onClick={() => openSheet('gr1Portfolio')}>Ask GR 1 about your portfolio</button>
      <p className="tiny center">Sample numbers for this prototype.</p>
    </Shell>
  )
}
