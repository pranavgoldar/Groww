import type { FC } from 'react'
import { useStore, type SheetKind } from '../state/store'
import { inr } from '../lib/format'
import { fallPct } from '../lib/plan'

function Sell() {
  const { s, d, closeSheet, say } = useStore()
  const value = s.ff ? d.m3.indexNow : s.invested || d.sip
  return (
    <>
      <h2 className="sheet-title" id="sheetTitle">Sell Large-cap index fund (sample)</h2>
      <p className="hint" style={{ marginTop: 0 }}>From your Grow money</p>
      <div className="kv-list" style={{ marginTop: 14 }}>
        <div className="kv"><span>Current value</span><b>{inr(value)}</b></div>
        <div className="kv"><span>Selling</span><b>All units</b></div>
      </div>
      <p className="tiny" style={{ marginTop: 8 }}>Money from the sale goes to your Groww balance.</p>
      <div className="sheet-actions">
        <button className="btn-dark" onClick={() => { closeSheet(); say('Sell order placed. This is a prototype, so nothing was sold.') }}>
          Sell {inr(value)}
        </button>
        <button className="link block" onClick={closeSheet}>Cancel</button>
      </div>
    </>
  )
}

function GR1({ question }: { question: string }) {
  const { closeSheet } = useStore()
  return (
    <>
      <h2 className="sheet-title" id="sheetTitle">GR 1</h2>
      <div className="bubble">{question}</div>
      <div className="gr1-ph">
        <b>GR 1 would open here</b><br />with your plan and holdings already in context. It isn't part of this prototype.
      </div>
      <div className="sheet-actions"><button className="btn-secondary" onClick={closeSheet}>Close</button></div>
    </>
  )
}

const MONTH_OPTIONS: [string, string][] = [
  ['Bonus or extra money', "You'd choose where the extra goes, across the same four buckets. Not built in this prototype."],
  ['Less money this month', "You'd choose which buckets get less this month. Not built in this prototype."],
  ['My income stopped', "Your plan would pause, and you'd see how long Keep can cover your expenses. Not built in this prototype."],
]

function MonthDifferent() {
  const { closeSheet, say } = useStore()
  return (
    <>
      <h2 className="sheet-title" id="sheetTitle">This month is different</h2>
      <p className="hint" style={{ marginTop: 0 }}>Change just this month. Your plan stays as it is.</p>
      <div className="sheet-options">
        {MONTH_OPTIONS.map(([label, note]) => (
          <button key={label} className="sheet-option" onClick={() => { closeSheet(); say(note) }}>{label}</button>
        ))}
      </div>
      <div className="sheet-actions"><button className="link block" onClick={closeSheet}>Cancel</button></div>
    </>
  )
}

export const SHEETS: Record<SheetKind, FC> = {
  sell: Sell,
  gr1: function GR1Fall() {
    const { d } = useStore()
    return <GR1 question={`Why did my index fund fall ${fallPct(d.m3.indexPut)}% in 3 weeks?`} />
  },
  gr1Portfolio: () => <GR1 question="How is my money doing against my plan?" />,
  month: MonthDifferent,
}
