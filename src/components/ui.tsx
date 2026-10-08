import type { ReactNode } from 'react'
import { useStore } from '../state/store'
import { groupIN, inr, inrRange, parseAmount } from '../lib/format'
import { KEYS, badRange, sumSplit, type BucketKey, type Split } from '../lib/plan'

/* ---------- icons ---------- */
function Svg({ size = 20, sw = 1.9, children }: { size?: number; sw?: number; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
  )
}
export const Icon = {
  back: () => <Svg size={24} sw={2.2}><path d="M15 5l-7 7 7 7" /></Svg>,
  check: ({ size = 18 }: { size?: number }) => <Svg size={size} sw={2.6}><path d="M5 12.5l4.2 4.2L19 7" /></Svg>,
  info: () => <Svg size={18}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.6v.2" /></Svg>,
  bank: () => <Svg><path d="M3 9.5L12 4l9 5.5" /><path d="M5.5 10.5v7M10 10.5v7M14 10.5v7M18.5 10.5v7" /><path d="M3.5 20h17" /></Svg>,
  clock: ({ size = 20 }: { size?: number }) => <Svg size={size}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>,
  sprout: () => <Svg><path d="M12 20v-8" /><path d="M12 12c0-4.4 3-7 8-7 0 4.4-3 7-8 7z" /><path d="M12 14.5C12 11 9.6 9 5 9c0 3.5 2.4 5.5 7 5.5z" /></Svg>,
  book: () => <Svg><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z" /><path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19v3H7.5" /></Svg>,
  sliders: () => <Svg><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></Svg>,
  history: () => <Svg size={18}><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3.5 4.5v4h4" /><path d="M12 8v4l2.8 1.7" /></Svg>,
  chevDown: () => <Svg size={14} sw={2.4}><path d="M6 9l6 6 6-6" /></Svg>,
  search: () => <Svg size={18}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></Svg>,
  close: () => <Svg size={18} sw={2.2}><path d="M6 6l12 12M18 6L6 18" /></Svg>,
  bell: () => <Svg size={22} sw={1.8}><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.8h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></Svg>,
  aperture: () => <Svg size={22} sw={1.7}><circle cx="12" cy="12" r="9.5" /><path d="M14.3 8l5.4 9.4M9.7 8h10.8M7.4 12l5.4-9.4M9.7 16L4.3 6.6M14.3 16H3.5M16.6 12l-5.4 9.4" /></Svg>,
  chevRight: () => <Svg size={18} sw={2.2}><path d="M9 6l6 6-6 6" /></Svg>,
  gear: () => <Svg sw={1.8}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Svg>,
  chart: () => <Svg><path d="M4 19.5h16" /><path d="M4 15l5-5 4 3.5L20 6" /><path d="M15.5 6H20v4.5" /></Svg>,
  receipt: () => <Svg><path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.4z" /><path d="M9 8h6M9 12h6M9 16h3" /></Svg>,
  headset: () => <Svg><path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" /><rect x="3.5" y="13.5" width="4" height="6" rx="1.5" /><rect x="16.5" y="13.5" width="4" height="6" rx="1.5" /><path d="M18.5 19.5c0 1.2-1.5 2-4 2" /></Svg>,
  doc: () => <Svg><path d="M6 3h8.5L19 7.5V21H6z" /><path d="M14 3v5h5" /><path d="M9 12.5h6M9 16h6" /></Svg>,
  scale: () => <Svg size={18}><path d="M12 4v16M5 20h14" /><path d="M5 8h14" /><path d="M5 8l-2.5 6a2.5 2.5 0 0 0 5 0z" /><path d="M19 8l-2.5 6a2.5 2.5 0 0 0 5 0z" /></Svg>,
}

const BUCKET_ICON: Record<BucketKey, () => ReactNode> = { keep: Icon.bank, park: () => <Icon.clock />, grow: Icon.sprout, learn: Icon.book }
export const BUCKET_NAME: Record<BucketKey, string> = { keep: 'Keep', park: 'Park', grow: 'Grow', learn: 'Invest in stocks' }

export function BucketIcon({ k, neutral = false, className = 'b-ic' }: { k: BucketKey; neutral?: boolean; className?: string }) {
  const I = BUCKET_ICON[k]
  return <span className={className} style={{ ['--c' as string]: neutral ? 'var(--ink-2)' : `var(--${k})` }}><I /></span>
}
export const Dot = ({ k }: { k: BucketKey }) => <i className="b-dot" style={{ background: `var(--${k})` }} />

/** Groww logo mark (redrawn from the supplied image). */
export function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#5367FF" />
      <path d="M2.01 28.74L16 20l8 3.5 13.96-12.3A20 20 0 0 1 20 40 20 20 0 0 1 2.01 28.74z" fill="#00F3BB" />
    </svg>
  )
}

/* ---------- screen shell ---------- */
/* Phones: app bar on top, main button pinned to the bottom.
   Laptops: page header, then the content beside a sticky card holding the main button (like Groww's order panel). */
export function Shell({ title, brand, right, footer, summary, children }: {
  title?: string; brand?: boolean; right?: ReactNode; footer?: ReactNode; summary?: boolean; children: ReactNode
}) {
  const { back, sheet, openSheet } = useStore()
  const side = !!footer || summary
  return (
    <>
      <header className="hdr">
        <button className="icon-btn back" onClick={back} aria-label="Back"><Icon.back /></button>
        <div className="hdr-title">
          {brand ? <span className="brand"><Mark /><span className="wordmark">groww</span></span> : title}
        </div>
        <div className="hdr-right">
          {right ?? (
            <button className="hdr-avatar" aria-label="Your account" aria-haspopup="dialog" aria-expanded={sheet === 'account'} onClick={() => openSheet('account')}>R</button>
          )}
        </div>
      </header>
      <div className={'page-grid' + (side ? '' : ' no-side')}>
        <div className="body">{children}</div>
        {side && (
          <aside className="page-side">
            {summary && <PlanSummary />}
            {footer && <footer className="ftr">{footer}</footer>}
          </aside>
        )}
      </div>
    </>
  )
}

const SIDE_LABEL: Record<BucketKey, [string, string]> = {
  keep: ['Keep in bank', 'Emergency fund'],
  park: ['Park', 'Goals within 3 years'],
  grow: ['Grow', 'Money for 3+ years'],
  learn: [BUCKET_NAME.learn, 'Picking stocks yourself'],
}

/* The four buckets, one per row, with what each is for. */
export function PlanRows({ split }: { split: Split }) {
  return (
    <div className="side-legend">
      {KEYS.map(k => (
        <div key={k} data-k={k}>
          <i style={{ background: `var(--${k})` }} />
          <span className="sl-name"><b>{SIDE_LABEL[k][0]}</b><small>{SIDE_LABEL[k][1]}</small></span>
          <b className="sl-amt">{inr(split[k])}</b>
        </div>
      ))}
    </div>
  )
}

/* Laptop-only side card: the plan as it stands, updating live while the user answers. */
function PlanSummary() {
  const { s, d } = useStore()
  if (d.surplus <= 0) return null
  return (
    <div className="side-summary" aria-label="Your Money Plan so far">
      <p className="label-sm">YOUR MONEY PLAN</p>
      <div className="row-between"><span className="muted">Free each month</span><b className="side-total">{inr(d.surplus)}</b></div>
      <StackBar split={s.split} />
      <PlanRows split={s.split} />
      <p className="tiny">Invest through Groww: {inr(d.investable)} a month. Keep stays in your bank as your emergency fund.</p>
    </div>
  )
}

/* ---------- inputs ---------- */
export function Chips<T extends string>({ options, value, onChange, label, labelledBy, className = 'chip-row' }: {
  options: [T, string][]; value: T | null; onChange: (v: T) => void; label?: string; labelledBy?: string; className?: string
}) {
  return (
    <div className={className} role="radiogroup" aria-label={label} aria-labelledby={labelledBy}>
      {options.map(([v, l]) => (
        <button key={v} className="chip" role="radio" aria-checked={value === v} onClick={() => onChange(v)}>
          {value === v && <Icon.check size={13} />}{l}
        </button>
      ))}
    </div>
  )
}

export function AmountField({ id, value, onChange, describedBy, size = 'lg', label }: {
  id: string; value: number; onChange: (n: number) => void; describedBy?: string; size?: 'lg' | 'sm'; label?: string
}) {
  return (
    <div className={`amt-field${size === 'sm' ? ' sm' : ''}`}>
      <span>₹</span>
      <input id={id} inputMode="numeric" autoComplete="off" placeholder="0" aria-describedby={describedBy} aria-label={label}
        value={value ? groupIN(value) : ''} onChange={e => onChange(parseAmount(e.target.value))} />
    </div>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button className="toggle-row" role="switch" aria-checked={on} onClick={() => onChange(!on)}>
      <span className="toggle-txt">{label}</span>
      <span className="switch" aria-hidden="true"><span /></span>
    </button>
  )
}

/* ---------- plan bar ---------- */
export function StackBar({ split, label }: { split: Split; label?: string }) {
  const t = sumSplit(split) || 1
  const aria = label ?? KEYS.map(k => `${BUCKET_NAME[k]} ${inr(split[k])}`).join(', ')
  return (
    <div className="stack" role="img" aria-label={aria}>
      {KEYS.filter(k => split[k] > 0).map(k => (
        <span key={k} style={{ flex: `${split[k]} 1 0px`, background: `var(--${k})` }}
          title={`${BUCKET_NAME[k]} ${inr(split[k])} (${Math.round((split[k] / t) * 100)}%)`} />
      ))}
    </div>
  )
}
export function Legend({ split }: { split: Split }) {
  return (
    <div className="legend">
      {KEYS.map(k => (
        <div key={k}><span><i style={{ background: `var(--${k})` }} />{BUCKET_NAME[k]}</span><b>{inr(split[k])}</b></div>
      ))}
    </div>
  )
}

export function Meter({ pct, color }: { pct: number; color: string }) {
  return <div className="meter" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} /></div>
}

/* ---------- range scale (Screens 5 and 6) ---------- */
export function RangeScale({ amount, value }: { amount: number; value?: number }) {
  const [lo, hi] = badRange(amount)
  const min = amount * 0.6
  const max = amount * 1.06
  const pos = (v: number) => ((v - min) / (max - min)) * 100
  const marker = value != null
  return (
    <div className={'rs' + (marker ? ' has-marker' : '')} role="img"
      aria-label={`Bad-year low ${inrRange(lo, hi)}, invested ${inr(amount)}${marker ? `, now ${inr(value)}` : ''}`}>
      <div className="rs-track">
        <div className="rs-light" style={{ left: `${pos(lo)}%`, width: `${pos(amount) - pos(lo)}%` }} />
        <div className="rs-dark" style={{ left: `${pos(lo)}%`, width: `${pos(hi) - pos(lo)}%` }} />
        <div className="rs-tick" style={{ left: `${pos(amount)}%` }} />
        {marker && (
          <div className="rs-marker" style={{ left: `${pos(value)}%` }}>
            <span className="rs-pin">You are here · {inr(value)}</span>
          </div>
        )}
      </div>
      <div className="rs-lab" style={{ left: `${pos((lo + hi) / 2)}%` }}><b>{inrRange(lo, hi)}</b><span>bad-year low</span></div>
      <div className="rs-lab" style={{ left: `${pos(amount)}%` }}><b>{inr(amount)}</b><span>invested</span></div>
    </div>
  )
}

export const DISCLAIMER = 'Illustrative historical range. Source: placeholder pending compliance review. Past performance does not indicate future results.'

export function Msg({ id, children }: { id?: string; children?: ReactNode }) {
  return <p className="amt-msg" id={id}>{children ? <><Icon.info /><span>{children}</span></> : null}</p>
}
