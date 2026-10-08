import { useStore } from '../state/store'
import { inr } from '../lib/format'
import { ADDED, type BucketKey } from '../lib/plan'
import { BUCKET_NAME, BucketIcon, Icon, Shell } from '../components/ui'

const JOBS: [BucketKey, string][] = [
  ['keep', 'Your emergency cushion'],
  ['park', 'Goals within 3 years'],
  ['grow', 'For 3+ years from now'],
  ['learn', 'To try picking stocks'],
]

/* Screen 1: interrupt the jump straight to browsing at first add-funds. */
export function Start() {
  const { go } = useStore()
  return (
    <Shell brand footer={<>
      <button className="btn-primary" onClick={() => go('basics')}>Plan this money</button>
      <button className="link block" onClick={() => go('explore')}>Skip, I'll explore on my own</button>
    </>}>
      <div className="success" role="status">
        <span className="success-ic"><Icon.check /></span>
        <div><b>{inr(ADDED)} added to your Groww balance</b><span className="tiny">From your bank account · just now</span></div>
      </div>
      <p className="eyebrow" style={{ marginTop: 30 }}>What's this money for?</p>
      <h1 className="h1">Let's give this money a job</h1>
      <p className="lead">2 minutes. It helps you decide how much to invest, and what to do if it ever drops.</p>
      <div className="jobs">
        {JOBS.map(([k, t]) => (
          <div className="job" key={k}>
            <BucketIcon k={k} className="job-ic" />
            <b>{BUCKET_NAME[k]}</b>
            <span className="job-desc">{t}</span>
          </div>
        ))}
      </div>
      <p className="note"><Icon.info /><span>We'll ask what this money is for, not what kind of investor you are.</span></p>
    </Shell>
  )
}

/* Placeholder for Groww's existing explore screen. */
export function Explore() {
  const { go } = useStore()
  return (
    <Shell title="Explore" footer={<button className="btn-primary" onClick={() => go('basics')}>Plan this money</button>}>
      <div className="search"><Icon.search /><span>Search stocks and funds</span></div>
      <div className="ph-chips"><span>Stocks</span><span>Mutual funds</span><span>ETFs</span><span>FDs</span></div>
      <div className="card soft"><p className="ph-note">Groww's usual explore screen would be here. It isn't part of this prototype.</p></div>
      <div style={{ marginTop: 8 }}>
        {[0, 1, 2, 3].map(i => <div className="sk-row" key={i}><span className="sk-av" /><span className="sk-lines"><i /><i /></span></div>)}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <b style={{ fontSize: 15 }}>Your {inr(ADDED)} doesn't have a job yet</b>
        <p className="hint" style={{ marginTop: 4 }}>You can plan it any time. It takes 2 minutes.</p>
      </div>
    </Shell>
  )
}
