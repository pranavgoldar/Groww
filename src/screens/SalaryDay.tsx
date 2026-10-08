import { useState } from 'react'
import { extraIn, useStore } from '../state/store'
import { inr } from '../lib/format'
import { KEYS, type BucketKey } from '../lib/plan'
import { PRODUCTS, type Placeable } from '../lib/products'
import { REMIND_HOURS_BEFORE, hourText, ordinal } from '../lib/pay'
import { BUCKET_NAME, Icon, Mark, Shell } from '../components/ui'

function Notif({ when, title, body }: { when: string; title: string; body: string }) {
  return (
    <div className="notif-card">
      <span className="notif-ic"><Mark size={26} /></span>
      <span className="notif-txt">
        <span className="notif-top"><span>groww</span><span>{when}</span></span>
        <b>{title}</b>
        <span>{body}</span>
      </span>
    </div>
  )
}

/* Next month. By default nothing moves until Riya confirms (or skips); with autopay she's told a day and a few hours before. */
export function SalaryDay() {
  const { s, d, openSheet, setLock, say } = useStore()
  const auto = s.pay === 'autopay'
  const [status, setStatus] = useState<'due' | 'done' | 'skipped'>(auto ? 'done' : 'due')
  const amt = inr(d.investable)
  const at = hourText(s.payHour)
  // SIPs repeat every month; one-time buys don't.
  const sips = (b: Placeable) => {
    const names = [
      ...(b === 'grow' && s.invested ? ['index fund'] : []),
      ...(b === 'park' && s.parkInvested ? ['liquid fund'] : []),
      ...s.extra.filter(x => x.toward === b && PRODUCTS[x.product].sip).map(x => PRODUCTS[x.product].short),
    ]
    const amt = (b === 'grow' ? s.invested : b === 'park' ? s.parkInvested : 0) + extraIn(s, b, true)
    const list = [...new Set(names)]
    return { amt, label: `${list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}` : list[0] ?? ''} SIP${list.length > 1 ? 's' : ''}` }
  }
  const sipLine = (b: 'grow' | 'park', full: string) => {
    const x = sips(b)
    return x.amt >= s.split[b] && s.split[b] > 0 ? full.replace('{sips}', x.label)
      : x.amt > 0 ? `${inr(x.amt)} to your ${x.label}, the rest waits in ${b === 'grow' ? 'Grow' : 'Park'}`
        : `waits in ${b === 'grow' ? 'Grow' : 'Park'} until you place it`
  }
  const where: Record<BucketKey, string> = {
    keep: 'stays in your bank',
    park: sipLine('park', `{sips}${d.parkLabel ? ` for ${d.parkLabel}` : ''}`),
    grow: sipLine('grow', 'your {sips}'),
    learn: 'your stocks balance',
  }
  const footer = status === 'due'
    ? <>
      <button className="btn-primary" onClick={() => setStatus('done')}>Confirm and pay {amt}</button>
      <button className="link block" onClick={() => setStatus('skipped')}>Skip this month</button>
    </>
    : <button className="btn-primary" onClick={() => setLock(true)}>View my money</button>

  return (
    <Shell title="Next month" footer={footer}>
      {auto ? (
        <>
          <p className="eyebrow">Autopay on the {ordinal(s.payDay)} at {at}</p>
          <div className="notif-stack" aria-label="Notifications">
            <Notif when={`Yesterday, ${at}`} title={`Tomorrow at ${at}: ${amt} autopay for your plan`} body="Want to skip this month? Tap to skip or change it." />
            <Notif when={`Today, ${hourText(s.payHour - REMIND_HOURS_BEFORE)}`} title={`In ${REMIND_HOURS_BEFORE} hours: ${amt} autopay`} body="Last chance to skip this month." />
            <Notif when={`Today, ${at}`} title={`${amt} invested as planned`} body={`${inr(s.split.keep)} stayed in your bank as your emergency fund.`} />
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">Next month · your salary is in</p>
          <Notif when="now" title={`Ready to invest ${amt} as planned?`} body="Nothing leaves your account until you confirm. You can skip this month." />
        </>
      )}

      {status === 'done' && !auto && (
        <div className="success" role="status" style={{ marginTop: 12 }}>
          <span className="success-ic"><Icon.check /></span>
          <div><b>{amt} invested as planned</b><span className="tiny">{inr(s.split.keep)} stayed in your bank as your emergency fund.</span></div>
        </div>
      )}
      {status === 'skipped' && (
        <div className="banner" role="status" style={{ marginTop: 12 }}>
          <Icon.info />
          <span>Skipped this month. Nothing was taken from your account, and your plan stays as it is.</span>
        </div>
      )}

      <ul className={'split-rows card' + (status === 'done' ? '' : ' pending')} aria-label="This month's split">
        {KEYS.map(k => (
          <li key={k} data-row={k}>
            <span className="ok-ic">{status === 'done' || k === 'keep' ? <Icon.check size={14} /> : <Icon.clock size={14} />}</span>
            <span><b>{BUCKET_NAME[k]} {inr(s.split[k])}</b> → {where[k]}</span>
          </li>
        ))}
      </ul>
      {status === 'done' && auto && <p className="no-action">No action needed.</p>}
      {status === 'due' && <button className="link block" style={{ marginTop: 12 }} onClick={() => openSheet('month')}>This month is different</button>}
      {status === 'done' && auto && (
        <button className="link block" onClick={() => say("Next month's autopay is skipped. Nothing will be taken from your account that month.")}>Skip next month's autopay</button>
      )}
      <p className="tiny center" style={{ marginTop: 18 }}>Next, this prototype jumps ahead to month 3.</p>
    </Shell>
  )
}
