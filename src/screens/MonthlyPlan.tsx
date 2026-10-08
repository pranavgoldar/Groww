import { useRef } from 'react'
import { useStore } from '../state/store'
import { inr, inrRange } from '../lib/format'
import { KEYS, PLAN_NAMES, PLAN_ORDER, commonRanges, goalLine, goalsLabel, planSplit, rebalance, sumSplit, type BucketKey, type PlanId, type Split } from '../lib/plan'
import { BUCKET_NAME, BucketIcon, Chips, Icon, Shell, StackBar } from '../components/ui'

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
const WHEN_TXT = { week: ' for this week', month: ' for this month', few: ' for the next few months' } as const

function listNames(keys: BucketKey[]) {
  const names = keys.map(k => BUCKET_NAME[k])
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]
}

const PLAN_OPTIONS: [PlanId, string][] = PLAN_ORDER.map(p => [p, PLAN_NAMES[p]])

/* Step 3, and the plan editor afterwards: what she could invest, from a model plan she picks, fine-tuned with sliders
   that always add up to the monthly surplus. The first time through, it ends by adding the money. */
export function MonthlyPlan() {
  const { s, d, set, go, back, history } = useStore()
  const total = d.surplus
  const ranges = commonRanges(d.surplus, d.goalMonthly)
  const dragBase = useRef<Split | null>(null)
  const sum = sumSplit(s.split)
  const parkFor = d.parkLabel || 'your goals'
  const parkGoalText = d.parkGoals.map(g => goalLine(g, inr)).join('; ')

  const meaning: Record<BucketKey, string> = {
    keep: `Your emergency cushion, building toward 3 months of expenses (${inr(d.keepTarget)}). Stays in your bank.`,
    park: d.goalMonthly
      ? `${parkGoalText}. Kept in low ups-and-downs options, so it's there when you need it.`
      : "Money for goals within 3 years. Kept in low ups-and-downs options, so it's there when you need it.",
    grow: d.growGoalNeed
      ? `Money for 3+ years. Will rise and fall along the way. ${inr(d.growGoalNeed)} a month of it is put aside for ${goalsLabel(d.growGoals)}.`
      : 'Money for 3+ years. Will rise and fall along the way.',
    learn: "A small, capped amount for picking stocks yourself. Mistakes here won't hurt your plan.",
  }
  const why: Record<BucketKey, string> = {
    keep: {
      notyet: `Many people build 3–6 months of expenses before investing much. You don't have this yet, so Keep gets the biggest share until it reaches ${inr(d.keepTarget)}.`,
      partly: `Many people build 3–6 months of expenses before investing much. You have some of this, so Keep tops up the rest, up to ${inr(d.keepTarget)}.`,
      yes: 'Many people build 3–6 months of expenses before investing much. You have this already, so Keep can be smaller.',
    }[s.emergency],
    park: d.goalMonthly
      ? `${cap(parkFor)} need${d.parkGoals.length > 1 ? '' : 's'} ${inr(d.goalMonthly)} a month put aside. That counts only what you put in; we don't count on returns. Money needed within 3 years usually goes where prices move less.`
      : 'Money needed within 3 years usually goes where prices move less. You have no short or medium goal, so Park can stay empty.',
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
  const first = !s.added
  const choose = (p: PlanId) => set(prev => {
    const split = planSplit(p, d.surplus, d.goalMonthly)
    return { plan: p, split, orderAmt: prev.invested ? prev.orderAmt : split.grow }
  })
  const addMoney = () => {
    set({ added: d.investable })
    go('categories')
  }
  // After the first time: back to the page the plan was opened from.
  const save = () => {
    if (u) return go('portfolio')
    const h = history()
    if (['myPlan', 'portfolio'].includes(h[h.length - 2])) back()
    else go('myPlan')
  }

  return (
    <Shell title={first ? 'Money Plan' : 'Monthly plan'} footer={first ? <>
      <p className="ftr-hint">Paid from your bank via UPI. Keep's {inr(s.split.keep)} stays in your bank.</p>
      <button className="btn-primary" onClick={addMoney}>Add {inr(d.investable)} to Groww</button>
    </> : <button className="btn-primary" onClick={save}>Save my monthly plan</button>}>
      {u && (
        <div className="banner" role="status" id="updateBanner">
          <Icon.check />
          <span>
            Updated: {inr(u.amt)} set aside{u.when ? WHEN_TXT[u.when] : ''}, taken from {listNames(u.from)}.
            {' '}Keep now has {inr(d.m3.keep)} of {inr(d.keepTarget)}.
            {u.from.includes('park') ? ` Park now has ${inr(d.m3.park)} for ${parkFor}.` : ''}
            {' '}Your monthly plan stays {inr(total)}.
          </span>
        </div>
      )}
      {first && <p className="eyebrow">Step 2 of 2</p>}
      <h1 className="h1">{first ? "Here's what you could invest" : `Your monthly plan: ${inr(total)}`}</h1>
      <p className="lead"><b id="freeAmt">{inr(total)}</b> free each month: {inr(s.salary)} salary − {inr(s.expenses)} expenses.</p>

      <section className="q" style={{ marginTop: 16 }}>
        <p className="q-label sm" id="planQ">Start from a model plan</p>
        <Chips options={PLAN_OPTIONS} value={s.plan} labelledBy="planQ" className="chip-row seg3" onChange={choose} />
        <p className="hint" style={{ marginTop: 8 }}>
          People with answers like yours often start with <b>{PLAN_NAMES[d.suggested]}</b>. When your safety and comfort answers differ, we start from the more careful one.
        </p>
      </section>

      <div className="card plan-card">
        <div className="plan-top">
          <span className="plan-sub">Invest through Groww: <b id="investAmt">{inr(d.investable)} a month</b></span>
          <span className={'sum-ok' + (sum === total ? '' : ' off')} id="sumOk">
            {sum === total ? <><Icon.check />Adds up to {inr(sum)}</> : <>Adds up to {inr(sum)} of {inr(total)}</>}
          </span>
        </div>
        <StackBar split={s.split} />
        <p className="hint" style={{ marginTop: 10 }}>
          Keep's <b id="keepAmt">{inr(s.split.keep)}</b> stays in your bank as your emergency fund. Goal amounts count only what you put in; we don't count on returns.
        </p>
      </div>
      {d.growGoalNeed > s.split.grow && (
        <p className="amt-msg"><span>Your long-term goals need {inr(d.growGoalNeed)} a month put aside; Grow is {inr(s.split.grow)}. You could move more into Grow, or give a goal more time.</span></p>
      )}
      <div className="owner"><Icon.sliders /><span>You set these numbers. We've shown common starting ranges.</span></div>
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
                ? `${cap(parkFor)} need${d.parkGoals.length > 1 ? '' : 's'} ${inr(lo)} a month put aside`
                : `Common starting range ${inrRange(lo, hi)}`}
            </p>
            <details className="why">
              <summary>Why this range? <Icon.chevDown /></summary>
              <p>{why[k]}</p>
            </details>
          </div>
        )
      })}
      <p className="tiny" style={{ marginTop: 14 }}>
        General model plans for education, not a personal recommendation. You choose and can change any number. [PENDING COMPLIANCE REVIEW]
      </p>
    </Shell>
  )
}
