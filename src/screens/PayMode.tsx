import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { autopayWhen } from '../lib/pay'
import { Shell } from '../components/ui'
import { PaySettings } from '../components/PaySettings'

/* Asked once, after the first money is placed: confirm each month, or autopay. Nothing is automatic unless chosen. */
export function PayMode() {
  const { s, d, go, say } = useStore()
  const auto = s.pay === 'autopay'
  const next = () => {
    if (auto) say(`Autopay set for ${autopayWhen(s.payDay, s.payHour)}. In the real app, you'd approve it once in your UPI app.`)
    go('salary')
  }
  return (
    <Shell title="Each month" footer={<button className="btn-primary" onClick={next}>{auto ? 'Set up autopay' : 'Continue'}</button>}>
      <p className="eyebrow">Before next month</p>
      <h1 className="h2">How do you want to invest each month?</h1>
      <p className="lead">Your plan puts {inr(d.investable)} into Groww each month. Choose how that happens. You can change it any time in Your money plan.</p>
      <PaySettings />
    </Shell>
  )
}
