import { useStore, type NeedWhen } from '../state/store'
import { inr } from '../lib/format'
import { KEYS, computeDraw, sumSplit } from '../lib/plan'
import { AmountField, BUCKET_NAME, Chips, Dot, Msg, Shell } from '../components/ui'

const WHEN: [NeedWhen, string][] = [['week', 'This week'], ['month', 'This month'], ['few', 'In a few months']]

/* Screen 7: a legitimate exit path, without panic. Order of buckets, not product advice. */
export function NeedChanged() {
  const { s, d, set, go, openSheet } = useStore()
  const balances = d.m3.balances
  const have = sumSplit(balances)
  const n = s.needAmt
  const valid = n > 0 && n <= have
  const draw = valid ? computeDraw(n, balances) : null

  const update = () => {
    if (!draw) return
    set(prev => ({
      drawn: {
        keep: prev.drawn.keep + draw.keep,
        park: prev.drawn.park + draw.park,
        grow: prev.drawn.grow + draw.grow,
        learn: prev.drawn.learn + draw.learn,
      },
      update: { amt: n, when: prev.needWhen, from: KEYS.filter(k => draw[k] > 0) },
      needAmt: 0,
      needWhen: null,
    }))
    go('plan')
  }

  return (
    <Shell title="Your need changed" footer={<>
      <button className="btn-primary" id="needGo" disabled={!valid} onClick={update}>Update my plan</button>
      <button className="btn-secondary" onClick={() => openSheet('sell')}>Sell from Grow</button>
    </>}>
      <h1 className="h2">How much do you need, and by when?</h1>
      <p className="lead">Needs change. That's a fine reason to change a plan.</p>
      <label className="amt-label" htmlFor="needInput">Amount you need</label>
      <AmountField id="needInput" value={n} onChange={v => set({ needAmt: v })} describedBy="needMsg" />
      <Msg id="needMsg">{n > have ? `That's more than the ${inr(have)} across your buckets.` : null}</Msg>
      <Chips options={WHEN} value={s.needWhen} label="By when" className="chip-row tight"
        onChange={v => set(prev => ({ needWhen: prev.needWhen === v ? null : v }))} />

      <div className="card" style={{ marginTop: 22 }} id="needGuide">
        <h2 className="sec-title">Where it usually comes from</h2>
        <p className="guide-text">
          People usually draw from Keep first, then Park, before Grow. Keep has {inr(balances.keep)} and Park has {inr(balances.park)}.
        </p>
        <ol className="draw-list" aria-label="Order to draw from">
          {KEYS.map((k, i) => {
            const take = draw ? draw[k] : 0
            const hl = draw ? take > 0 : k === 'keep' || k === 'park'
            return (
              <li key={k} className={'draw-row' + (hl ? ' hl' : draw ? ' dim' : '')} data-draw={k}>
                <span className="step-num">{i + 1}</span>
                <span className="draw-name"><Dot k={k} />{BUCKET_NAME[k]}</span>
                <span className="draw-amt">{inr(balances[k])}</span>
                {take > 0 && <span className="draw-take">Take {inr(take)} · {inr(balances[k] - take)} left</span>}
              </li>
            )
          })}
        </ol>
        {draw && draw.grow > 0 && (
          <p className="hint">This would also take {inr(draw.grow)} from Grow, which is invested. You can sell it with "Sell from Grow" below.</p>
        )}
        <p className="tiny" style={{ marginTop: 12 }}>This is the usual order to draw from, not advice on any product.</p>
      </div>
    </Shell>
  )
}
