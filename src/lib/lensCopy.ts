import type { EventType, Stock } from '../data/types'
import { abs1, pct } from './format'

/** "HDFC Bank is up 2.4% today, more than Nifty Bank (+1.1%)." */
export function moveFact(s: Stock): string {
  const dir = s.dailyChange >= 0 ? 'up' : 'down'
  const diff = Math.abs(s.dailyChange) - Math.abs(s.sectorChange)
  const same = Math.sign(s.dailyChange) === Math.sign(s.sectorChange)
  let rel: string
  if (!same) rel = `while ${s.sectorIndex} is ${pct(s.sectorChange)}`
  else if (Math.abs(diff) < 0.3) rel = `in line with ${s.sectorIndex} (${pct(s.sectorChange)})`
  else if (diff > 0) rel = `more than ${s.sectorIndex} (${pct(s.sectorChange)})`
  else rel = `less than ${s.sectorIndex} (${pct(s.sectorChange)})`
  return `${s.shortName} is ${dir} ${abs1(s.dailyChange)} today, ${rel}.`
}

/** "Why is HDFC Bank up 2.4% today?" */
export function lensQuestion(s: Stock): string {
  if (Math.abs(s.dailyChange) < 0.5) return `What’s happening with ${s.shortName} today?`
  return `Why is ${s.shortName} ${s.dailyChange >= 0 ? 'up' : 'down'} ${abs1(s.dailyChange)} today?`
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  results: 'Results',
  management: 'Management',
  sector: 'Sector',
  regulatory: 'Regulatory',
  company: 'Company',
  market: 'Market',
}
