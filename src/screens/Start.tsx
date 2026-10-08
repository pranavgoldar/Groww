import { useStore } from '../state/store'
import { Icon, Shell } from '../components/ui'

const JOBS: [BucketKey, string][] = [
  ['keep', 'Your emergency cushion'],
  ['park', 'Kept safe for goals in the next 3 years'],
  ['grow', 'For 3+ years from now'],
  ['learn', 'A small amount to pick stocks yourself'],
]

/* Screen 1: shown when someone taps Add money for the first time. Plan first, then add money. */
export function Start() {
  const { go } = useStore()
  return (
    <Shell brand footer={<>
      <button className="btn-primary" onClick={() => go('basics')}>Work out my amount</button>
      <button className="link block" onClick={() => go('explore')}>Skip, I'll add money on my own</button>
    </>}>
      <p className="eyebrow" style={{ marginTop: 8 }}>Before you add money</p>
      <h1 className="h1">Let's work out how much you can invest</h1>
      <p className="lead">2 minutes. We'll look at your salary and expenses, then show what you could put in each month.</p>
      <ol className="steps">
        {STEPS.map(([t, sub], i) => (
          <li className="step" key={t}>
            <span className="step-n">{i + 1}</span>
            <div><b>{t}</b><span className="job-desc">{sub}</span></div>
          </li>
        ))}
      </ol>
      <p className="note"><Icon.info /><span>We ask about your money, not what kind of investor you are.</span></p>
    </Shell>
  )
}

/* Placeholder for Groww's existing explore screen. */
export function Explore() {
  const { go } = useStore()
  return (
    <Shell title="Explore" footer={<button className="btn-primary" onClick={() => go('basics')}>Plan my money</button>}>
      <div className="search"><Icon.search /><span>Search stocks and funds</span></div>
      <div className="ph-chips"><span>Stocks</span><span>Mutual funds</span><span>ETFs</span><span>FDs</span></div>
      <div className="card soft"><p className="ph-note">Groww's usual explore screen would be here. It isn't part of this prototype.</p></div>
      <div style={{ marginTop: 8 }}>
        {[0, 1, 2, 3].map(i => <div className="sk-row" key={i}><span className="sk-av" /><span className="sk-lines"><i /><i /></span></div>)}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <b style={{ fontSize: 15 }}>Not sure how much to invest?</b>
        <p className="hint" style={{ marginTop: 4 }}>Plan it first, from your salary and goals. It takes 2 minutes.</p>
      </div>
    </Shell>
  )
}
