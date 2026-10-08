import { useStore } from '../state/store'
import { inr, inrRange } from '../lib/format'
import { MARKET_FALL_PCT, badRange, fallPct } from '../lib/plan'
import { DISCLAIMER, Dot, Icon, RangeScale, Shell } from '../components/ui'
import { commitLabel } from './Commit'
import { ordinal } from '../lib/pay'

const REFLECT = [
  'Has your need for this money changed?',
  'Has your reason for buying changed, or just the price?',
  'Are you deciding while upset?',
]

function Decided() {
  const { s } = useStore()
  const c = commitLabel(s.commit)
  return (
    <>
      <div className="row-between"><h2 className="sec-title">What you decided</h2><span className="tiny">Before you invested</span></div>
      <div className="decided-pills"><span className="pill"><Dot k="grow" />Grow money</span><span className="pill">Needed in 3+ years</span></div>
      <p className="said" id="said">{c ? <>You said: <b>{c}.</b></> : "You didn't pick an answer before investing."}</p>
    </>
  )
}

/* Screen 6: the first fall, read against the user's own plan. Selling stays one tap away. */
export function CheckIn() {
  const { s, d, set, go, openSheet, say } = useStore()
  const a = d.m3.indexPut
  const v = d.m3.indexNow
  const pct = fallPct(a)
  const [lo, hi] = badRange(10000)
  const toggle = (i: number) =>
    set(prev => ({ reflect: prev.reflect.includes(i) ? prev.reflect.filter(x => x !== i) : [...prev.reflect, i] }))
  return (
    <Shell title="Your index fund" right={<button className="hdr-sell" onClick={() => openSheet('sell')}>Sell</button>} footer={<>
      <button className="btn-primary" onClick={() => go('noted')}>Stick with my plan</button>
      <button className="btn-secondary" onClick={() => go('need')}>My need for this money changed</button>
    </>}>
      <div className="card">
        <div className="hold-top"><span className="fund-av sm">LC</span><span className="tiny">Large-cap index fund (sample) · Grow · month 3</span></div>
        <h1 className="h1 hold-h">Your {inr(a)} is now {inr(v)}</h1>
        <p className="hold-chg"><span className="loss" id="lossFig">{inr(v - a)} (−{pct}%)</span> <span className="muted">over 3 weeks</span></p>
        <div className="two">
          <button className="btn-secondary" onClick={() => openSheet('sell')}>Sell</button>
          <button className="btn-secondary" onClick={() => say("Buy more would open Groww's usual order screen. It isn't part of this prototype.")}>Buy more</button>
        </div>
      </div>

      <section className="sec">
        <h2 className="sec-title">Over 3 weeks</h2>
        <div className="cmp" role="img" aria-label={`Your fund down ${pct}%, overall market down ${MARKET_FALL_PCT}%`}>
          <div className="cmp-row"><span className="cmp-name">Your fund</span><div className="cmp-track"><div className="cmp-bar" style={{ width: `${pct * 10}%`, background: '#5E6A75' }} /></div><span className="cmp-val">−{pct}%</span></div>
          <div className="cmp-row"><span className="cmp-name">Overall market</span><div className="cmp-track"><div className="cmp-bar" style={{ width: `${MARKET_FALL_PCT * 10}%`, background: '#B3BCC4' }} /></div><span className="cmp-val">−{MARKET_FALL_PCT}%</span></div>
        </div>
        <p className="sec-note">Most of this move is the market, not just your fund.</p>
      </section>

      <section className="card sec"><Decided /></section>

      <section className="card">
        <h2 className="sec-title">The range you saw before investing</h2>
        <p className="rs-key" style={{ marginTop: 6 }}>Same bad-year range as before ({inrRange(lo, hi)} on every ₹10,000), on the {inr(a)} you've put in.</p>
        <RangeScale amount={a} value={v} />
        <p className="rs-cap">You are here — inside the range you saw before investing.</p>
        <p className="tiny">{DISCLAIMER}</p>
      </section>

      <section className="sec">
        <h2 className="sec-title">Before you decide</h2>
        <p className="hint" style={{ marginTop: 4 }}>Tap any that apply. There are no right answers.</p>
        <div className="checks">
          {REFLECT.map((q, i) => {
            const on = s.reflect.includes(i)
            return (
              <button key={i} className="check" role="checkbox" aria-checked={on} onClick={() => toggle(i)}>
                <span className="check-box">{on && <Icon.check size={13} />}</span><span>{q}</span>
              </button>
            )
          })}
        </div>
      </section>

      <button className="link block" style={{ marginTop: 16 }} onClick={() => openSheet('gr1')}>Ask GR 1 why it fell</button>
    </Shell>
  )
}

/* Calm confirmation after "Stick with my plan". */
export function Noted() {
  const { s, d, go } = useStore()
  return (
    <Shell title="" footer={<button className="btn-primary" onClick={() => go('portfolio')}>Go to portfolio</button>}>
      <div className="done">
        <span className="done-ic neutral"><Icon.check size={30} /></span>
        <h1 className="h2">Noted. Your plan is unchanged.</h1>
        <p className="lead">Your {inr(d.m3.indexNow)} stays in Grow, for 3+ years. Your {inr(d.sip)} a month keeps going in {s.pay === 'autopay' ? `by autopay on the ${ordinal(s.payDay)}` : 'each month when you confirm it'}.</p>
      </div>
      <div className="card"><Decided /></div>
      <p className="tiny center" style={{ marginTop: 16 }}>You can still sell any time.</p>
    </Shell>
  )
}
