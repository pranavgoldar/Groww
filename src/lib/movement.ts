import type { Stock } from '../data/types'
import { pct } from './format'

export type MovementKind = 'company' | 'mixed' | 'sector' | 'market' | 'quiet'

export interface MovementVerdict {
  kind: MovementKind
  label: string
  explanation: string
  simple: string
}

export type Period = 'today' | 'week'

/**
 * Classifies whether a move looks company-specific, sector-wide or market-wide by comparing
 * the stock with its sector index and the Nifty 50. Deterministic and explainable on purpose.
 */
export function classifyMovement(stock: Stock, period: Period = 'today'): MovementVerdict {
  const s = period === 'today' ? stock.dailyChange : stock.weeklyChange
  const sec = period === 'today' ? stock.sectorChange : stock.sectorWeeklyChange
  const mkt = period === 'today' ? stock.marketChange : stock.marketWeeklyChange
  const name = stock.shortName
  const idx = stock.sectorIndex
  const when = period === 'today' ? 'today' : 'this week'
  const verb = s >= 0 ? 'rose' : 'fell'

  if (Math.abs(s) < 0.5) {
    return {
      kind: 'quiet',
      label: 'Little movement',
      explanation: `${name} barely moved ${when} (${pct(s)}), roughly in line with ${idx} (${pct(sec)}). Small moves like this usually aren’t meaningful on their own.`,
      simple: `${name} hardly moved, much like similar companies. Tiny changes like this are normal.`,
    }
  }

  const sameDirection = Math.sign(s) === Math.sign(sec)
  const ratio = sameDirection ? Math.abs(sec) / Math.abs(s) : 0
  const marketNote =
    Math.sign(mkt) !== Math.sign(s) ? ` The overall market moved the other way (Nifty 50 ${pct(mkt)}).` : ''

  if (sameDirection && ratio >= 0.75 && Math.abs(mkt) / Math.abs(s) >= 0.75) {
    return {
      kind: 'market',
      label: 'Market-wide',
      explanation: `${name}, ${idx} and the Nifty 50 all moved by similar amounts ${when}. The move looks market-wide rather than specific to ${name}.`,
      simple: `Most stocks moved the same way ${when}, so this probably isn’t about ${name} itself.`,
    }
  }

  if (sameDirection && ratio >= 0.75) {
    return {
      kind: 'sector',
      label: 'Mostly sector-wide',
      explanation: `${name} moved roughly in line with ${idx} (${pct(sec)}) ${when}. Most of the move appears sector-wide rather than specific to ${name}.`,
      simple: `Similar companies moved by about the same amount, so the reason is probably something affecting the whole industry.`,
    }
  }

  if (sameDirection && ratio >= 0.3) {
    return {
      kind: 'mixed',
      label: 'Partly sector-wide, partly company-specific',
      explanation: `${name} ${verb} more than ${idx} (${pct(sec)}) ${when}. Part of the move looks sector-wide; the rest may be specific to ${name}.${marketNote}`,
      simple: `Similar companies moved the same way, but ${name} moved further. So part of this is about the industry, and part may be about ${name} itself.`,
    }
  }

  return {
    kind: 'company',
    label: 'Mostly company-specific',
    explanation: `${name} ${verb} ${pct(s)} ${when}, while ${idx} moved ${pct(sec)}. That suggests the move is mostly about ${name} itself, not its sector.${marketNote}`,
    simple: `Similar companies barely moved, so this is probably about ${name} itself rather than the whole industry.`,
  }
}
