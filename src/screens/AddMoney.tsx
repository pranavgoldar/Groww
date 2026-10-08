import { useState } from 'react'
import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { AmountField, BUCKET_NAME, Dot, Msg, Shell } from '../components/ui'

/* Screen 6: money comes in only after it has a plan. The amount is prefilled from the plan. */
export function AddMoney() {
  const { s, d, set, go } = useStore()
  const [amt, setAmt] = useState(s.added || d.investable)
  const inv = d.investable
  const ok = amt >= 100
  const msg = !amt ? 'Enter an amount.'
    : amt < 100 ? 'The minimum is ₹100.'
      : amt === inv ? 'That covers this month for Park, Grow and stocks.'
        : amt < inv ? `Your plan puts ${inr(inv)} into Groww this month. You can add the rest later.`
          : `${inr(amt - inv)} more than your plan. The extra waits in your Groww balance.`
  const add = () => {
    if (!ok) return
    set({ added: amt })
    go('categories')
  }
  return (
    <Shell title="Add money" footer={<button className="btn-primary" disabled={!ok} onClick={add}>Add {inr(amt)}</button>}>
      <p className="eyebrow">This month's plan</p>
      <h1 className="h2">Add money to your plan</h1>
      <label className="amt-label" htmlFor="addInput">Amount to add</label>
      <AmountField id="addInput" value={amt} onChange={setAmt} describedBy="addMsg" />
      <Msg id="addMsg">{msg}</Msg>

      <div className="card" style={{ marginTop: 18 }}>
        <p className="label-sm">WHERE IT GOES THIS MONTH</p>
        <div className="kv"><span><Dot k="park" /> Park{d.parkLabel ? `, for ${d.parkLabel}` : ''}</span><b>{inr(s.split.park)}</b></div>
        <div className="kv"><span><Dot k="grow" /> Grow</span><b>{inr(s.split.grow)}</b></div>
        <div className="kv"><span><Dot k="learn" /> {BUCKET_NAME.learn}</span><b>{inr(s.split.learn)}</b></div>
      </div>
      <div className="keep-note" style={{ marginTop: 12 }}>
        <div><b><Dot k="keep" /> Keep · {inr(s.split.keep)}</b><br />Stays in your bank as your cushion. You don't add it here.</div>
      </div>
      <div className="kv-list">
        <div className="kv"><span>Pay from</span><b>Your bank account, via UPI</b></div>
      </div>
    </Shell>
  )
}
