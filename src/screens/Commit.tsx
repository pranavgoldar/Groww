import { useStore, type Commit as CommitId } from '../state/store'
import { inr, inrRange } from '../lib/format'
import { badRange } from '../lib/plan'
import { DISCLAIMER, Icon, Msg, RangeScale, Shell } from '../components/ui'
import { orderCheck } from './Categories'

export const COMMIT: [CommitId, string][] = [
  ['wait', 'Wait it out — this is 3+ year money'],
  ['recheck', 'Re-check why I bought it'],
  ['revisit', "It would mean I need the money — I'll revisit my plan"],
]
export const commitLabel = (c: CommitId | null) => COMMIT.find(x => x[0] === c)?.[1] ?? null

const APPETITE_VERB = { hold: 'hold calmly', worry: 'worry but hold', sell: 'sell' } as const
const PER = 10000 // the commit card talks per ₹10,000 put in, like the appetite question

/* Screen 5: record calm-state intent before the first purchase. */
export function Commit() {
  const { s, d, set, back, replaceTail, say } = useStore()
  const a = s.orderAmt
  const [lo, hi] = badRange(PER)
  const v = orderCheck(a, d.available)
  const ok = v.ok && !!s.commit
  // Back to placing money, on the next bucket that still has money to place.
  const confirm = () => {
    if (!ok) return
    const next = d.left.park > 0 ? 'park' : d.left.learn > 0 ? 'learn' : 'grow'
    set(prev => ({ invested: prev.invested + prev.orderAmt, ff: false, tab: next }))
    say(`Index fund SIP set up: ${inr(a)} a month. If it falls, we'll show you what you decided here.`)
    replaceTail(['commit', 'order', 'categories'], ['categories'])
  }
  return (
    <Shell title="Before you invest" footer={<>
      {!s.commit && <p className="ftr-hint">Pick one answer to continue.</p>}
      <button className="btn-primary" disabled={!ok} onClick={confirm}>Confirm &amp; invest {inr(a)} a month</button>
    </>}>
      <span className="tag"><i className="b-dot" />From your Grow money · 3+ years</span>
      <p className="s5-fund">Large-cap index fund (sample) · <b>{inr(a)}</b> a month</p>
      <div className="card">
        <p className="claim">
          Large-cap index funds have had bad years. On every {inr(PER)} you put in, a bad year has looked like <b>{inrRange(lo, hi)}</b> at its lowest.
        </p>
        <RangeScale amount={PER} />
        <p className="rs-key">The light band runs from what you put in down to a bad year's low.</p>
        <p className="tiny">{DISCLAIMER}</p>
      </div>
      <div className="callback">
        <Icon.history />
        <p>
          When you planned, you said that if ₹10,000 you invested became ₹8,000, you would <b>{APPETITE_VERB[s.appetite]}</b>.
          {' '}A bad year has looked like that, so it helps to decide now, while things are calm.
        </p>
      </div>
      <section className="q">
        <h2 className="q-label" id="q5">If it falls like this, what will you do?</h2>
        <div className="radios" role="radiogroup" aria-labelledby="q5">
          {COMMIT.map(([id, label]) => (
            <button key={id} className="radio" role="radio" aria-checked={s.commit === id} onClick={() => set({ commit: id })}>
              <span className="radio-dot" /><span>{label}</span>
            </button>
          ))}
        </div>
        <p className="hint">We'll show you this answer if it ever drops. You can still sell any time, whatever you pick here.</p>
      </section>
      {!v.ok && (
        <Msg>{v.msg} <button className="link-inline" onClick={back}>Change amount</button></Msg>
      )}
    </Shell>
  )
}
