import { useState } from 'react'
import { useStore, type State } from '../state/store'
import { inr } from '../lib/format'
import { Chips, Dot, Icon, Meter, Msg, Shell, AmountField, BUCKET_NAME } from '../components/ui'
import { MOVE_BEFORE_MONTHS, goalLine, monthlyFor } from '../lib/plan'
import { autopayShort } from '../lib/pay'
import { AUTO_WHY, PRODUCTS, type ProductId, type Toward } from '../lib/products'

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

  // Each category opens a sample product, counted toward its bucket by default.
  const explore = (id: string) => {
    if (id === 'fd') {
      say("Fixed deposits open in Groww's FD section. It isn't part of this prototype.")
      return
    }
    const pid = id as ProductId
    const b = PRODUCTS[pid].bucket
    set(prev => ({
      orderId: pid,
      orderToward: b,
      orderAmt: d.left[b] || (pid === 'largecap' ? prev.orderAmt : pid === 'liquid' ? prev.split.park : 500),
    }))
    go('order')
  }
  const placed = { grow: s.split.grow > 0 && d.left.grow === 0, park: s.split.park > 0 && d.left.park === 0, learn: s.split.learn > 0 && d.left.learn === 0 }

  let panel
  if (tab === 'grow' || tab === 'park') {
    const total = s.split[tab]
    const toPlace = d.left[tab]
    const inSip = total - toPlace
    panel = (
      <>
        <div className="place">
          <div className="place-row" id="toPlace"><b>{inr(toPlace)}</b> a month in {BUCKET_NAME[tab]} to place</div>
          <Meter pct={total ? (inSip / total) * 100 : 0} color={`var(--${tab})`} />
          {inSip > 0 && (
            <p className="tiny" style={{ marginTop: 6 }}>
              {inr(inSip)} a month already placed
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
    const leftL = d.left.learn
    panel = (
      <div className="card cat" style={{ marginTop: 16 }}>
        <div className="cat-name">Stocks</div>
        <p className="cat-what">Shares of single companies, picked by you. Use only the money you set aside for stocks.</p>
        <Meter pct={l ? ((l - leftL) / l) * 100 : 0} color="var(--learn)" />
        <p className="hint" style={{ margin: '8px 0 12px' }}>
          {l ? `${inr(leftL)} of ${inr(l)} left this month for stocks` : 'Your plan has nothing set aside for stocks. You can add some on the plan screen.'}
        </p>
        <button className="link-inline" data-cat="stocks" onClick={() => explore('stock')}>Explore stocks →</button>
      </div>
    )
  }

  return (
    <Shell summary title="Place your money" footer={<button className="btn-primary" onClick={() => go('payMode')}>Done for now</button>}>
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

/** Checks an amount against what's left in a bucket. Going over the plan never blocks a purchase; it only says so. */
export function orderCheck(n: number, left: number, bucket = 'Grow', monthly = true): { ok: boolean; msg: string } {
  if (!n) return { ok: false, msg: 'Enter an amount.' }
  if (n < 100) return { ok: false, msg: 'The minimum for this sample is ₹100.' }
  const per = monthly ? ' a month' : ''
  if (left <= 0) return { ok: true, msg: `Your ${bucket} money is already placed. This adds ${inr(n)}${per} on top, and Portfolio will show it next to your plan.` }
  if (n > left) return { ok: true, msg: `This is ${inr(n - left)}${per} more than the ${inr(left)}${per} left in ${bucket}. It still goes through, and Portfolio will show it next to your plan.` }
  return { ok: true, msg: n < left ? `${inr(left - n)}${per} will stay in ${bucket} to place.` : `All your ${bucket} money goes into this ${monthly ? 'SIP each month' : 'buy'}.` }
}

const TOWARD_OPTIONS: [Toward, string][] = [['grow', 'Grow'], ['park', 'Park'], ['learn', BUCKET_NAME.learn], ['outside', 'Outside my plan']]

/* Mock order screen for any sample fund or stock. Each purchase counts toward a bucket, set by type and changeable in one tap.
   The plan's own index-fund SIP goes on to the commit card; everything else is placed here. */
export function Order() {
  const { s, d, set, go, back, say } = useStore()
  const [changing, setChanging] = useState(false)
  const p = PRODUCTS[s.orderId]
  const toward = s.orderToward
  const n = s.orderAmt
  const name = toward === 'outside' ? '' : BUCKET_NAME[toward]
  const left = toward === 'outside' ? 0 : d.left[toward]
  const v = toward === 'outside'
    ? { ok: n >= 100, msg: n >= 100 ? "This won't count toward your plan. Your plan stays as it is, and Portfolio lists it separately." : !n ? 'Enter an amount.' : 'The minimum for this sample is ₹100.' }
    : orderCheck(n, left, name, p.sip)
  const planGrow = s.orderId === 'largecap' && toward === 'grow'
  const planPark = s.orderId === 'liquid' && toward === 'park'
  const where = toward === 'outside' ? 'outside your plan' : `counted toward ${name}`

  const place = () => {
    if (planPark) {
      set(prev => ({ parkInvested: prev.parkInvested + prev.orderAmt }))
      say(`Liquid fund SIP set up: ${inr(n)} a month${d.parkLabel ? `, for ${d.parkLabel}` : ''}.`)
    } else {
      set(prev => ({ extra: [...prev.extra, { id: Date.now(), product: prev.orderId, amt: prev.orderAmt, toward: prev.orderToward }] }))
      say(p.sip
        ? `${p.short[0].toUpperCase()}${p.short.slice(1)} SIP set up: ${inr(n)} a month, ${where}.`
        : `Bought ${inr(n)} of ${p.name}, ${where}. This is a prototype, so nothing was bought.`)
    }
    back()
  }
  const cta = planGrow ? 'Continue' : p.sip ? `Start SIP ${inr(n)} a month` : `Buy ${inr(n)}`

  return (
    <Shell title="Invest" footer={
      <button className="btn-primary" id="orderGo" disabled={!v.ok} onClick={planGrow ? () => go('commit') : place}>{cta}</button>
    }>
      <div className="fund-head">
        <span className="fund-av">{p.av}</span>
        <div>
          <div className="fund-name">{p.name}</div>
          <p className="tiny">{p.kind}</p>
        </div>
      </div>

      <div className="counts" id="countsToward">
        <div className="counts-row">
          <span className="counts-label">Counts toward</span>
          <b>{toward === 'outside' ? 'Outside my plan' : <><Dot k={toward} /> {name}</>}</b>
          <button className="link-inline" aria-expanded={changing} onClick={() => setChanging(c => !c)}>{changing ? 'Done' : 'Change'}</button>
        </div>
        {changing && (
          <Chips options={TOWARD_OPTIONS} value={toward} label="Counts toward" onChange={t => set({ orderToward: t })} />
        )}
        <p className="tiny">
          {toward === p.bucket ? AUTO_WHY[p.bucket] : `Set by you. ${AUTO_WHY[p.bucket]}`}
          {toward !== 'outside' && ` ${inr(left)}${p.sip ? ' a month' : ''} left in ${name}.`}
        </p>
      </div>

      <label className="amt-label" htmlFor="orderInput">{p.sip ? 'Monthly SIP amount' : 'Amount to invest'}</label>
      <AmountField id="orderInput" value={n} onChange={x => set({ orderAmt: x })} describedBy="orderMsg" />
      <Msg id="orderMsg">{v.msg}</Msg>
      <div className="kv-list">
        <div className="kv"><span>Order type</span><b>{p.sip ? 'Monthly SIP' : 'One-time buy'}</b></div>
        {p.sip
          ? <div className="kv"><span>Paying each month</span><b>{s.pay === 'autopay' ? `Autopay, ${autopayShort(s.payDay, s.payHour)}` : 'You confirm it (autopay is optional)'}</b></div>
          : <div className="kv"><span>Date</span><b>Today</b></div>}
        <div className="kv"><span>Minimum</span><b>₹100</b></div>
      </div>
      {p.bucket === 'park' && (
        <p className="hint" style={{ marginTop: 14 }}>
          {s.orderId === 'liquid' ? 'Liquid funds lend money for up to 91 days at a time' : 'Short-duration funds lend money for a few years at a time'}, so prices move less than shares. They can still dip; they're not a bank deposit.
        </p>
      )}
    </Shell>
  )
}
