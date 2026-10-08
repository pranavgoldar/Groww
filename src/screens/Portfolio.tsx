import { useStore } from '../state/store'
import { inr, oneDecimal } from '../lib/format'
import {
  CUSHION_MONTHS, FUND_RETURN, INDEX_RETURN, LEARN_RESEARCH, LEARN_TIP, LEARN_TIP_CHARGES, MONTHS_IN, MOVE_BEFORE_MONTHS,
  bucketOf, monthlyFor, type BucketKey,
} from '../lib/plan'
import { BucketIcon, BUCKET_NAME, Dot, Icon, Meter, Shell } from '../components/ui'
import { PRODUCTS } from '../lib/products'
import type { State } from '../state/store'

// Neutral ramp: asset types are a different dimension from the bucket colours, and nothing here is judged.
const ASSETS = [
  { key: 'mutualFunds', label: 'Mutual funds', color: '#2F3B47' },
  { key: 'stocks', label: 'Stocks', color: '#6F7C89' },
  { key: 'liquid', label: 'Liquid', color: '#B6C0C9' },
] as const

const signed = (n: number) => (n >= 0 ? `+${inr(n)}` : inr(n))

/* Before month 3: nothing yet, or what has been put in so far. Opened from the account menu. */
function PortfolioSoFar() {
  const { s, go } = useStore()
  if (!s.added) {
    return (
      <Shell title="Portfolio" footer={<button className="btn-primary" onClick={() => go('basics')}>Plan my money</button>}>
        <div className="done">
          <span className="done-ic neutral"><Icon.chart /></span>
          <h1 className="h2">Nothing invested yet</h1>
          <p className="lead">Plan your money first. Once you've added money and placed it, your holdings show up here, checked against your plan.</p>
        </div>
      </Shell>
    )
  }
  const balance = Math.max(0, s.added - s.invested - s.parkInvested - s.extra.reduce((a, x) => a + x.amt, 0))
  const unplaced = !s.invested || (s.split.park > 0 && !s.parkInvested)
  const rows: { k: BucketKey; what: string; amt: string }[] = [
    { k: 'grow', what: 'Large-cap index fund (sample)', amt: s.invested ? `${inr(s.invested)} a month SIP` : 'Not placed yet' },
    { k: 'park', what: 'Liquid fund (sample)', amt: s.parkInvested ? `${inr(s.parkInvested)} a month SIP` : 'Not placed yet' },
  ]
  return (
    <Shell title="Portfolio" footer={<>
      {unplaced
        ? <button className="btn-primary" onClick={() => go('categories')}>Place my money</button>
        : <button className="btn-primary" onClick={() => go('plan')}>Edit my plan</button>}
    </>}>
      <p className="eyebrow">Your first month</p>
      <h1 className="h2">Your portfolio so far</h1>
      <div className="card" style={{ marginTop: 16 }}>
        <p className="label-sm">ADDED TO GROWW</p>
        <div className="total-val" id="totalVal">{inr(s.added)}</div>
        <p className="hint" style={{ marginTop: 2 }}>You've just started, so this is what you've put in.</p>
        <div className="kv-list">
          {rows.map(r => (
            <div className="kv" key={r.k} data-hold={r.k}><span><Dot k={r.k} /> {BUCKET_NAME[r.k]} · {r.what}</span><b>{r.amt}</b></div>
          ))}
          {s.extra.map(x => (
            <div className="kv" key={x.id} data-hold="extra">
              <span>{x.toward === 'outside' ? 'Outside your plan' : <><Dot k={x.toward} /> {BUCKET_NAME[x.toward]}</>} · {PRODUCTS[x.product].name}</span>
              <b>{inr(x.amt)}{PRODUCTS[x.product].sip ? ' a month SIP' : ' bought'}</b>
            </div>
          ))}
          <div className="kv" data-hold="balance"><span>Groww balance{s.split.learn > 0 ? `, incl. ${inr(Math.min(balance, s.split.learn))} for stocks` : ''}</span><b>{inr(balance)}</b></div>
        </div>
      </div>
      <div className="keep-note" style={{ marginTop: 12 }}>
        <div><b><Dot k="keep" /> Keep · {inr(s.split.keep)} a month</b><br />Stays in your bank as your cushion, so it isn't shown here.</div>
      </div>
      <p className="hint" style={{ marginTop: 16 }}>From month 3, this page checks each part of your money against your plan.</p>
    </Shell>
  )
}

/* "Is your money doing its job?": one view across everything, judged only against the user's own plan. */
export function Portfolio() {
  const { s } = useStore()
  return s.ff ? <PortfolioMonth3 /> : <PortfolioSoFar />
}

function PortfolioMonth3() {
  const { s, d, go, openSheet } = useStore()
  const m = d.m3
  const parkOnTrack = m.park >= m.parkExpected
  const parkGoalTotal = d.parkGoals.reduce((a, g) => a + g.amount, 0)
  const onlyPark = d.parkGoals.length === 1 ? d.parkGoals[0] : null
  // Goal progress counts what has been put in, never market value. Park money taken out on Screen 7 is shared across its goals.
  const parkShare = m.parkExpected ? m.park / m.parkExpected : 1
  const goals = [...d.parkGoals, ...d.growGoals].map(g => {
    const park = bucketOf(g) === 'park'
    const put = Math.min(g.amount, Math.round(MONTHS_IN * monthlyFor(g) * (park ? parkShare : 1)))
    return { g, park, put }
  })

  const rows: { k: BucketKey; line: string; amber?: boolean; meter?: number }[] = [
    {
      k: 'keep',
      line: `${inr(m.keep)} of ${inr(d.keepTarget)} · about ${oneDecimal(s.expenses ? m.keep / s.expenses : 0)} of ${CUSHION_MONTHS} months built`,
      meter: d.keepTarget ? (m.keep / d.keepTarget) * 100 : 0,
    },
    {
      k: 'park',
      line: onlyPark
        ? `${onlyPark.name.trim() || 'Goal'} · ${inr(m.park)} of ${inr(onlyPark.amount)} put aside · ${parkOnTrack ? `on schedule for month ${onlyPark.months}` : `${inr(m.parkExpected - m.park)} behind schedule`}`
        : d.parkGoals.length
          ? `${inr(m.park)} put aside for ${d.parkGoals.length} goals · ${parkOnTrack ? 'on schedule' : `${inr(m.parkExpected - m.park)} behind schedule`}`
          : `${inr(m.park)} kept steady for goals within 3 years`,
      meter: parkGoalTotal ? (m.park / parkGoalTotal) * 100 : 0,
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
          {ASSETS.map(a => <div key={a.key}><span><i style={{ background: a.color }} />{a.label}</span><b>{inr(m[a.key])}</b></div>)}
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

      {goals.length > 0 && (
        <section className="sec">
          <h2 className="sec-title">Your goals</h2>
          <p className="hint" style={{ marginTop: 4 }}>Progress counts what you've put in, not market value.</p>
          <div className="status-list">
            {goals.map(({ g, park, put }) => (
              <div key={g.id} className="status-row" data-goal={g.id}>
                <BucketIcon k={park ? 'park' : 'grow'} neutral />
                <div className="status-main">
                  <b>{g.name.trim() || 'Goal'}</b>
                  <p>{inr(put)} of {inr(g.amount)} put aside · month {MONTHS_IN} of {g.months}</p>
                  <Meter pct={g.amount ? (put / g.amount) * 100 : 0} color="var(--ink-2)" />
                  <p className="goal-where">
                    {park
                      ? 'In Park, kept steady until you need it.'
                      : `In Grow until month ${g.months - MOVE_BEFORE_MONTHS}, then we'll remind you to move it to Park.`}
                  </p>
                  {!park && <button className="link-inline" onClick={() => go('goalNear')}>See that reminder →</button>}
                </div>
              </div>
            ))}
          </div>
          {goals.every(x => x.park) && (
            <p className="hint" style={{ marginTop: 8 }}>
              Goals 3+ years away sit in Grow, and we remind you to move them to Park a year before.{' '}
              <button className="link-inline" onClick={() => go('goalNear')}>See an example →</button>
            </p>
          )}
        </section>
      )}

      <OtherPurchases extra={s.extra} />

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

/* Anything bought besides the plan's own SIPs, with what it counts toward. */
function OtherPurchases({ extra }: { extra: State['extra'] }) {
  if (!extra.length) return null
  return (
    <section className="card sec" id="otherPurchases">
      <h2 className="sec-title">Other purchases</h2>
      <div className="facts">
        {extra.map(x => (
          <div key={x.id}>
            <span>{PRODUCTS[x.product].name} · {PRODUCTS[x.product].sip ? 'monthly SIP' : 'one-time buy'}</span>
            <b>{inr(x.amt)} · {x.toward === 'outside' ? 'outside your plan' : `counts toward ${BUCKET_NAME[x.toward]}`}</b>
          </div>
        ))}
      </div>
      <p className="sec-note">Each one counts where you chose when you bought it.</p>
    </section>
  )
}
