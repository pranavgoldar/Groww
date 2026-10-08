import { useStore, type State } from '../state/store'
import { inr } from '../lib/format'
import { Dot, Icon, Meter, Msg, Shell, AmountField, BUCKET_NAME } from '../components/ui'

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

/* Screen 4: match each bucket's monthly money to categories, before any product. */
export function Categories() {
  const { s, d, set, go, say } = useStore()
  const tab = s.tab
  const goal = s.goalName.trim() || 'goal'

  const explore = (id: string) => {
    if (id !== 'largecap') { say('Only Large-cap index funds opens in this prototype.'); return }
    set(prev => ({ orderAmt: Math.max(0, prev.split.grow - prev.invested) || prev.orderAmt }))
    go('order')
  }

  let panel
  if (tab === 'grow' || tab === 'park') {
    const total = s.split[tab]
    const toPlace = tab === 'grow' ? d.available : total
    const placed = total - toPlace
    panel = (
      <>
        <div className="place">
          <div className="place-row" id="toPlace"><b>{inr(toPlace)}</b> a month in {BUCKET_NAME[tab]} to place</div>
          <Meter pct={total ? (placed / total) * 100 : 0} color={`var(--${tab})`} />
          {placed > 0 && <p className="tiny" style={{ marginTop: 6 }}>{inr(placed)} a month already goes into your SIP</p>}
          {tab === 'park' && d.goalMonthly > 0 && (
            <p className="tiny" style={{ marginTop: 6 }}>For your {goal.toLowerCase()} · {inr(s.goalAmt)} in {s.goalMonths} months</p>
          )}
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
        <p className="cat-what">Shares of single companies. Use only your Learn money here.</p>
        <Meter pct={l ? 100 : 0} color="var(--learn)" />
        <p className="hint" style={{ margin: '8px 0 12px' }}>
          {l ? `${inr(l)} of ${inr(l)} Learn money left this month` : 'Your plan has no Learn money. You can add some on the plan screen.'}
        </p>
        <button className="link-inline" data-cat="stocks" onClick={() => explore('stocks')}>Explore stocks →</button>
      </div>
    )
  }

  return (
    <Shell title="Place your money" footer={<button className="btn-primary" onClick={() => go('salary')}>Done for now</button>}>
      <h1 className="h2">Match money to when you'll need it</h1>
      <p className="lead">These are categories, not picks, in no particular order.</p>
      <div className="keep-note">
        <div><b><Dot k="keep" /> Keep · {inr(s.split.keep)} a month</b><br />Keep stays in your bank. Nothing to buy here.</div>
      </div>
      <div className="tabs" role="tablist" aria-label="Bucket">
        {(['grow', 'park', 'learn'] as Tab[]).map(k => (
          <button key={k} className="tab" role="tab" aria-selected={tab === k} onClick={() => set({ tab: k })}>
            <i style={{ background: `var(--${k})` }} />{BUCKET_NAME[k]}
          </button>
        ))}
      </div>
      <div role="tabpanel">{panel}</div>
      <p className="tiny center foot-note">Categories only. We don't recommend a specific fund or stock.</p>
    </Shell>
  )
}

export function orderCheck(n: number, avail: number): { ok: boolean; msg: string } {
  if (!n) return { ok: false, msg: 'Enter an amount.' }
  if (n < 100) return { ok: false, msg: 'The minimum for this sample fund is ₹100.' }
  if (avail <= 0) return { ok: false, msg: "There's no Grow money left to place each month. You can change your plan first." }
  if (n > avail) return { ok: false, msg: `That's more than the ${inr(avail)} a month in Grow to place. Invest less, or change your plan first.` }
  return { ok: true, msg: n < avail ? `${inr(avail - n)} a month will stay in Grow to place.` : 'All your Grow money goes into this SIP each month.' }
}

/* Mock order screen between Screen 4 and Screen 5. */
export function Order() {
  const { s, d, set, go } = useStore()
  const v = orderCheck(s.orderAmt, d.available)
  return (
    <Shell title="Invest" footer={<button className="btn-primary" id="orderGo" disabled={!v.ok} onClick={() => go('commit')}>Continue</button>}>
      <div className="fund-head">
        <span className="fund-av">LC</span>
        <div>
          <div className="fund-name">Large-cap index fund (sample)</div>
          <p className="tiny">Index fund · Large-cap · Sample for this prototype</p>
        </div>
      </div>
      <span className="tag"><i className="b-dot" /><span>From your Grow money · {inr(d.available)} a month to place</span></span>
      <label className="amt-label" htmlFor="orderInput">Monthly SIP amount</label>
      <AmountField id="orderInput" value={s.orderAmt} onChange={n => set({ orderAmt: n })} describedBy="orderMsg" />
      <Msg id="orderMsg">{v.msg}</Msg>
      <div className="kv-list">
        <div className="kv"><span>Order type</span><b>Monthly SIP</b></div>
        <div className="kv"><span>Date</span><b>Every salary day</b></div>
        <div className="kv"><span>Minimum</span><b>₹100</b></div>
      </div>
    </Shell>
  )
}
