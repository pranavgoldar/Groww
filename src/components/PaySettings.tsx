import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { incomeWord } from '../lib/plan'
import { PAY_HOURS, REMIND_HOURS_BEFORE, hourText, ordinal, type PayMode } from '../lib/pay'
import { Icon } from './ui'

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1)

/* Confirm each month (the default), or opt into autopay with a fixed day, time and two reminders. */
export function PaySettings() {
  const { s, d, set } = useStore()
  const amt = inr(d.investable)
  const options: [PayMode, string, string][] = [
    ['manual', "I'll confirm each month", `When your ${incomeWord(s.occupation)} comes in, we'll remind you. Nothing leaves your account until you tap Confirm, and you can skip any month. Good while you're exploring.`],
    ['autopay', 'Autopay on a fixed day', `${amt} goes in on the day and time you pick. We'll notify you a day before and ${REMIND_HOURS_BEFORE} hours before, so you can skip that month.`],
  ]
  const auto = s.pay === 'autopay'
  const at = hourText(s.payHour)
  return (
    <div className="pay">
      <div className="radios" role="radiogroup" aria-label="Each month">
        {options.map(([id, label, sub]) => (
          <button key={id} className="radio pay-opt" role="radio" aria-checked={s.pay === id} data-pay={id} onClick={() => set({ pay: id })}>
            <span className="radio-dot" />
            <span><b>{label}</b><small>{sub}</small></span>
          </button>
        ))}
      </div>
      {auto && (
        <div className="pay-auto" id="autopaySetup">
          <div className="pay-pickers">
            <label>
              <span>Day of the month</span>
              <select id="payDay" value={s.payDay} onChange={e => set({ payDay: Number(e.target.value) })}>
                {DAYS.map(n => <option key={n} value={n}>{ordinal(n)}</option>)}
              </select>
            </label>
            <label>
              <span>Time</span>
              <select id="payHour" value={s.payHour} onChange={e => set({ payHour: Number(e.target.value) })}>
                {PAY_HOURS.map(h => <option key={h} value={h}>{hourText(h)}</option>)}
              </select>
            </label>
          </div>
          <ul className="pay-steps" aria-label="What happens each month">
            <li><Icon.bell /><span><b>The day before, {at}</b>“Tomorrow at {at}: {amt} autopay for your plan.” Skip or change it from here.</span></li>
            <li><Icon.bell /><span><b>The {ordinal(s.payDay)}, {hourText(s.payHour - REMIND_HOURS_BEFORE)}</b>“In {REMIND_HOURS_BEFORE} hours: {amt} autopay.” Last chance to skip this month.</span></li>
            <li><Icon.check size={18} /><span><b>The {ordinal(s.payDay)}, {at}</b>{amt} goes in as planned. Keep stays in your bank.</span></li>
          </ul>
          <p className="tiny">You'd approve autopay once in your UPI app. Turn it off here any time.</p>
        </div>
      )}
    </div>
  )
}
