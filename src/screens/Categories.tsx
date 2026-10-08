import { useStore, type State } from '../state/store'
import { inr } from '../lib/format'
import { Dot, Icon, Meter, Msg, Shell, AmountField, BUCKET_NAME } from '../components/ui'
import { MOVE_BEFORE_MONTHS, goalLine, monthlyFor } from '../lib/plan'

type Tab = State['tab']
const CATS: Record<'grow' | 'park', { id: string; name: string; what: string; cta?: string }[]> = {
  grow: [
    { id: 'largecap', name: 'Large-cap index funds', what: "Track an index of India's largest listed companies. No fund manager picking." },
    { id: 'flexicap', name: 'Flexi-cap funds', what: 'A fund manager picks companies of any size, and can change the mix.' },
    { id: 'hybrid', name: 'Hybrid funds', what: 'Hold a mix of shares and bonds in one fund.' },
  ],
  park: [
    { id: 'liquid', name: 'Liquid funds', what: 'Lend money for up to 91 days at a time. Usually easy to withdraw.' },
    { id: 'shortdur', name: 'Short-duration funds', what: 'Lend money to companies and the government for a few years at a time.' },
    { id: 'fd', name: 'Fixed deposits', what: 'A fixed rate for a fixed time, from a bank.', cta: 'Explore FDs →' },
  ],
}
const FIT = { grow: "Fits money you won't need for 3+ years", park: 'Fits money you may need within 3 years' }

/* Screen 7: match each bucket's monthly money to categories, before any product. */
export function Categories() {
  const { s, d, set, go, say } = useStore()
  const tab = s.tab

  const explore = (id: string) => {
    if (id === 'largecap') {
      set(prev => ({ orderFor: 'grow', orderAmt: Math.max(0, prev.split.grow - prev.invested) || prev.orderAmt }))
      go('order')
    } else if (id === 'liquid') {
      set(prev => ({ orderFor: 'park', orderAmt: Math.max(0, prev.split.park - prev.parkInvested) || prev.split.park }))
      go('order')
    } else {
      say('In this prototype, Large-cap index funds and Liquid funds open.')
    }
  }
  const placed = { grow: s.split.grow > 0 && d.available === 0, park: s.split.park > 0 && d.parkAvailable === 0, learn: false }

  let panel
  if (tab === 'grow' || tab === 'park') {
    const total = s.split[tab]
    const toPlace = tab === 'grow' ? d.available : d.parkAvailable
    const inSip = total - toPlace
    panel = (
      <>
        <div className="place">
          <div className="place-row" id="toPlace"><b>{inr(toPlace)}</b> a month in {BUCKET_NAME[tab]} to place</div>
          <Meter pct={total ? (inSip / total) * 100 : 0} color={`var(--${tab})`} />
          {inSip > 0 && (
            <p className="tiny" style={{ marginTop: 6 }}>
              {inr(inSip)} a month already goes into your {tab === 'grow' ? 'index fund' : 'liquid fund'} SIP
            </p>
          )}
          {tab === 'park' && d.parkGoals.map(g => (
            <p className="tiny" key={g.id} style={{ marginTop: 6 }}>For {goalLine(g, inr)} · {inr(monthlyFor(g))} a month</p>
          ))}
          {tab === 'grow' && d.growGoals.map(g => (
            <p className="tiny" key={g.id} style={{ marginTop: 6 }}>
              Includes {goalLine(g, inr)} · moves to Park {MOVE_BEFORE_MONTHS} months before
            </p>
          ))}
        </div>
        {CATS[tab].map(c => (
          <div className="card cat" key={c.id}>
            <div className="cat-name">{c.name}</div>
            <p className="cat-what">{c.what}</p>
            <p className="cat-fit"><Icon.clock size={15} />{FIT[tab]}</p>
            <button className="link-inline" data-cat={c.id} onClick={() => explore(c.id)}>{c.cta ?? 'Explore funds →'}</button>
          </div>
        ))}
      </>
    )
  } else {
    const l = s.split.learn
    panel = (
      <div className="card cat" style={{ marginTop: 16 }}>
        <div className="cat-name">Stocks</div>
        <p className="cat-what">Shares of single companies, picked by you. Use only the money you set aside for stocks.</p>
        <Meter pct={l ? 100 : 0} color="var(--learn)" />
        <p className="hint" style={{ margin: '8px 0 12px' }}>
          {l ? `${inr(l)} of ${inr(l)} left this month for stocks` : 'Your plan has nothing set aside for stocks. You can add some on the plan screen.'}
        </p>
        <button className="link-inline" data-cat="stocks" onClick={() => explore('stocks')}>Explore stocks →</button>
      </div>
    )
  }

  return (
    <Shell title="Place your money" footer={<button className="btn-primary" onClick={() => go('salary')}>Done for now</button>}>
      {s.added > 0 && (
        <div className="success" role="status" style={{ margin: '4px 0 18px' }}>
          <span className="success-ic"><Icon.check /></span>
          <div><b>{inr(s.added)} added to your Groww balance</b><span className="tiny">Now give each part a place</span></div>
        </div>
      )}
      <h1 className="h2">Match money to when you'll need it</h1>
      <p className="lead">These are categories, not picks, in no particular order.</p>
      <div className="keep-note">
        <div><b><Dot k="keep" /> Keep · {inr(s.split.keep)} a month</b><br />Keep stays in your bank. Nothing to buy here.</div>
      </div>
      <div className="tabs" role="tablist" aria-label="Bucket">
        {(['grow', 'park', 'learn'] as Tab[]).map(k => (
          <button key={k} className="tab" role="tab" aria-selected={tab === k} data-tab={k} onClick={() => set({ tab: k })}>
            {placed[k] ? <span className="tab-ok" aria-label="placed"><Icon.check size={12} /></span> : <i style={{ background: `var(--${k})` }} />}
            {BUCKET_NAME[k]}
          </button>
        ))}
      </div>
      <div role="tabpanel">{panel}</div>
      <p className="tiny center foot-note">Categories only. We don't recommend a specific fund or stock.</p>
    </Shell>
  )
}

export function orderCheck(n: number, avail: number, bucket = 'Grow'): { ok: boolean; msg: string } {
  if (!n) return { ok: false, msg: 'Enter an amount.' }
  if (n < 100) return { ok: false, msg: 'The minimum for this sample fund is ₹100.' }
  if (avail <= 0) return { ok: false, msg: `There's no ${bucket} money left to place each month. You can change your plan first.` }
  if (n > avail) return { ok: false, msg: `That's more than the ${inr(avail)} a month in ${bucket} to place. Invest less, or change your plan first.` }
  return { ok: true, msg: n < avail ? `${inr(avail - n)} a month will stay in ${bucket} to place.` : `All your ${bucket} money goes into this SIP each month.` }
}

const FUNDS = {
  grow: { av: 'LC', name: 'Large-cap index fund (sample)', kind: 'Index fund · Large-cap · Sample for this prototype' },
  park: { av: 'LQ', name: 'Liquid fund (sample)', kind: 'Debt fund · Liquid · Sample for this prototype' },
}

/* Mock order screen. Grow orders go on to the commit card; Park's liquid-fund SIP starts here. */
export function Order() {
  const { s, d, set, go, back, say } = useStore()
  const park = s.orderFor === 'park'
  const avail = park ? d.parkAvailable : d.available
  const v = orderCheck(s.orderAmt, avail, park ? 'Park' : 'Grow')
  const fund = FUNDS[s.orderFor]
  const startPark = () => {
    set(prev => ({ parkInvested: prev.parkInvested + prev.orderAmt }))
    say(`Liquid fund SIP set up: ${inr(s.orderAmt)} every salary day${d.parkLabel ? `, for ${d.parkLabel}` : ''}.`)
    back()
  }
  return (
    <Shell title="Invest" footer={park
      ? <button className="btn-primary" id="orderGo" disabled={!v.ok} onClick={startPark}>Start SIP {inr(s.orderAmt)} a month</button>
      : <button className="btn-primary" id="orderGo" disabled={!v.ok} onClick={() => go('commit')}>Continue</button>}>
      <div className="fund-head">
        <span className="fund-av">{fund.av}</span>
        <div>
          <div className="fund-name">{fund.name}</div>
          <p className="tiny">{fund.kind}</p>
        </div>
      </div>
      <span className={'tag' + (park ? ' park' : '')}><i className="b-dot" /><span>From your {park ? 'Park' : 'Grow'} money · {inr(avail)} a month to place</span></span>
      <label className="amt-label" htmlFor="orderInput">Monthly SIP amount</label>
      <AmountField id="orderInput" value={s.orderAmt} onChange={n => set({ orderAmt: n })} describedBy="orderMsg" />
      <Msg id="orderMsg">{v.msg}</Msg>
      <div className="kv-list">
        <div className="kv"><span>Order type</span><b>Monthly SIP</b></div>
        <div className="kv"><span>Date</span><b>Every salary day</b></div>
        <div className="kv"><span>Minimum</span><b>₹100</b></div>
      </div>
      {park && (
        <p className="hint" style={{ marginTop: 14 }}>
          Liquid funds lend money for up to 91 days at a time, so prices move little. They can still dip slightly; they're not a bank deposit.
        </p>
      )}
    </Shell>
  )
}
