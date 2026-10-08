import { useRef } from 'react'
import { useStore } from '../state/store'
import { inr, inrRange } from '../lib/format'
import { KEYS, PLAN_NAMES, commonRanges, rebalance, sumSplit, type BucketKey, type Split } from '../lib/plan'
import { BUCKET_NAME, BucketIcon, Icon, Legend, Shell, StackBar, Toggle } from '../components/ui'

const WHEN_TXT = { week: ' for this week', month: ' for this month', few: ' for the next few months' } as const

function listNames(keys: BucketKey[]) {
  const names = keys.map(k => BUCKET_NAME[k])
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]
}

/* Screen 3: the monthly plan editor. Sliders always add up to the monthly surplus. */
export function MonthlyPlan() {
  const { s, d, set, go } = useStore()
  const total = d.surplus
  const ranges = commonRanges(d.surplus, d.goalMonthly)
  const dragBase = useRef<Split | null>(null)
  const sum = sumSplit(s.split)
  const goal = s.goalName.trim() || 'Goal'

  const meaning: Record<BucketKey, string> = {
    keep: `Your emergency cushion, building toward 3 months of expenses (${inr(d.keepTarget)}). Stays in your bank.`,
    park: d.goalMonthly
      ? `${goal} · ${inr(s.goalAmt)} in ${s.goalMonths} months. Low ups-and-downs options.`
      : 'Money for goals within 3 years. Low ups-and-downs options.',
    grow: 'Money for 3+ years. Will rise and fall along the way.',
    learn: "A small, capped amount to try picking stocks. Mistakes here won't hurt your plan.",
  }
  const why: Record<BucketKey, string> = {
    keep: {
      notyet: `Many people build 3–6 months of expenses before investing much. You don't have this yet, so Keep gets the biggest share until it reaches ${inr(d.keepTarget)}.`,
      partly: `Many people build 3–6 months of expenses before investing much. You have some of this, so Keep tops up the rest, up to ${inr(d.keepTarget)}.`,
      yes: 'Many people build 3–6 months of expenses before investing much. You have this already, so Keep can be smaller.',
    }[s.emergency],
    park: d.goalMonthly
      ? `Your ${goal.toLowerCase()} needs ${inr(s.goalAmt)} in ${s.goalMonths} months, which is ${inr(d.goalMonthly)} a month. Money needed within 3 years usually goes where prices move less.`
      : 'Money needed within 3 years usually goes where prices move less. You have no goal set, so Park can stay empty.',
    grow: {
      hold: "You said you'd hold calmly if ₹10,000 became ₹8,000. Grow is for money you can leave alone for 3+ years, through falls like that.",
      worry: "You said a fall from ₹10,000 to ₹8,000 would worry you, but you'd hold. A middle-sized Grow share leaves room to see how a fall feels.",
      sell: "You said you'd sell if ₹10,000 became ₹8,000. Falls like that happen in Grow, so a smaller share may be easier to stay with.",
    }[s.appetite],
    learn: 'Many first-time investors set aside a small, fixed amount to try picking stocks. Keeping it capped means a mistake teaches you something without denting the rest.',
  }

  const slide = (k: BucketKey, v: number) =>
    set(prev => ({ split: rebalance(dragBase.current ?? prev.split, k, v, total) }))

  const u = s.update
  const save = () => go(u ? 'portfolio' : 'categories')
  const setAuto = (auto: boolean) => set({ auto })

  return (
    <Shell title="Monthly plan" footer={<>
      <Toggle on={s.auto} onChange={setAuto} label="Apply this plan automatically every time my salary comes in" />
      <button className="btn-primary" onClick={save}>Save my monthly plan</button>
    </>}>
      {u && (
        <div className="banner" role="status" id="updateBanner">
          <Icon.check />
          <span>
            Updated: {inr(u.amt)} set aside{u.when ? WHEN_TXT[u.when] : ''}, taken from {listNames(u.from)}.
            {' '}Keep now has {inr(d.m3.keep)} of {inr(d.keepTarget)}.
            {u.from.includes('park') ? ` Park now has ${inr(d.m3.park)} for your ${goal.toLowerCase()}.` : ''}
            {' '}Your monthly plan stays {inr(total)}.
          </span>
        </div>
      )}
      {!u && s.funded > 0 && (
        <div className="success" role="status" style={{ margin: '0 0 16px' }}>
          <span className="success-ic"><Icon.check /></span>
          <div><b>{inr(s.funded)} added to your Groww balance</b><span className="tiny">From your bank account · just now</span></div>
        </div>
      )}
      <h1 className="h2" style={{ margin: '4px 0 12px' }}>Your monthly plan: {inr(total)}</h1>
      <div className="owner"><Icon.sliders /><span>You set these numbers. We've shown common starting ranges.</span></div>
      <div className="card plan-card">
        <div className="plan-top">
          <span className="plan-sub">Started from {PLAN_NAMES[s.plan]}</span>
          <span className={'sum-ok' + (sum === total ? '' : ' off')} id="sumOk">
            {sum === total ? <><Icon.check />Adds up to {inr(sum)}</> : <>Adds up to {inr(sum)} of {inr(total)}</>}
          </span>
        </div>
        <StackBar split={s.split} />
        <Legend split={s.split} />
      </div>

      {KEYS.map(k => {
        const v = s.split[k]
        const [lo, hi] = ranges[k]
        const fixed = lo === hi
        return (
          <div className="card bucket" key={k} data-bucket={k}>
            <div className="b-head">
              <BucketIcon k={k} />
              <span className="b-name" id={`bn-${k}`}>{BUCKET_NAME[k]}</span>
              <span className="b-amt" data-amt={k}>{inr(v)}</span>
            </div>
            <p className="b-mean">{meaning[k]}</p>
            <input type="range" className="rng" min={0} max={total} step={500} value={v} data-k={k}
              aria-labelledby={`bn-${k}`} aria-valuetext={inr(v)}
              style={{ ['--fill' as string]: `var(--${k})`, ['--v' as string]: total ? v / total : 0 }}
              onPointerDown={() => { dragBase.current = s.split }}
              onPointerUp={() => { dragBase.current = null }}
              onKeyDown={() => { dragBase.current = null }}
              onChange={e => slide(k, Number(e.target.value))} />
            <div className="band-wrap" aria-hidden="true">
              <div className={'band' + (fixed ? ' point' : '')}
                style={{ left: `${total ? (lo / total) * 100 : 0}%`, width: `${total ? ((hi - lo) / total) * 100 : 0}%` }} />
            </div>
            <p className="band-label">
              {k === 'park' && fixed && d.goalMonthly
                ? `Your ${goal.toLowerCase()} needs ${inr(lo)} a month`
                : `Common starting range ${inrRange(lo, hi)}`}
            </p>
            <details className="why">
              <summary>Why this range? <Icon.chevDown /></summary>
              <p>{why[k]}</p>
            </details>
          </div>
        )
      })}
    </Shell>
  )
}
