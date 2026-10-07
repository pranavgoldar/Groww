/**
 * Data model for the Groww Lens prototype.
 *
 * Everything here is illustrative demo data. In production these records would come from
 * market-data feeds, exchange filings and earnings transcripts, and Lens answers would be
 * generated from (and cite) those records.
 */

export type ChartRange = '1D' | '1W' | '1M' | '1Y'

/** How strongly the available information supports a stated factor. */
export type EvidenceStrength = 'strong' | 'moderate' | 'limited'

/** The three kinds of statement Lens always keeps visually separate. */
export type StatementKind = 'fact' | 'interpretation' | 'uncertainty'

export type EventType = 'results' | 'management' | 'sector' | 'regulatory' | 'company' | 'market'

export type RiskScope = 'Company' | 'Sector' | 'General'

/** Copy that has a plain-language variant for first-time investors. */
export interface Explained {
  standard: string
  simple: string
}

export interface MovementDriver {
  id: string
  title: string
  text: Explained
  evidence: EvidenceStrength
  /** What this factor is based on — shown to the user for transparency. */
  basis: string
  /** Timeline events this driver is linked to. */
  eventIds?: string[]
}

export interface WhyMoving {
  /** Short takeaway, e.g. "Three factors stand out." */
  headline: string
  drivers: MovementDriver[]
  /** Explicit statement of what cannot be established. */
  uncertainty: Explained
}

export interface RecentEvent {
  id: string
  /** Display date, e.g. "Oct 6". */
  date: string
  /** Days before the demo "today" — used for ordering and "last 7 days" filters. */
  daysAgo: number
  type: EventType
  title: string
  /** One-line summary shown in the timeline. */
  summary: string
  /** What happened — factual description. */
  whatHappened: string
  /** Why it may matter — interpretation. */
  whyItMatters: Explained
  /** What remains unclear. */
  unclear: string
  /** The kind of source this would come from in production. */
  sourceType: string
}

export interface Risk {
  id: string
  title: string
  detail: Explained
  scope: RiskScope
}

export interface PastMove {
  period: string
  change: number
  facts: string[]
  interpretation: string
  uncertainty: string
}

export interface KeyStats {
  marketCap: string
  pe: number
  pb: number
  dividendYield: number
  roe: number
  /** Sector-average P/E used for light valuation context. */
  sectorPe: number
}

export interface SeededAnswer {
  lead: string
  facts?: string[]
  interpretations?: string[]
  uncertainties?: string[]
  plain?: string
  sources?: string[]
  followUps?: string[]
}

export type SeededIntent = 'management' | 'earnings' | 'beginner' | 'valuation' | 'about'

export interface Stock {
  id: string
  name: string
  shortName: string
  ticker: string
  exchange: 'NSE'
  sector: string
  /** Sector index the stock is compared against. */
  sectorIndex: string
  price: number
  /** Percent change today. */
  dailyChange: number
  weeklyChange: number
  monthlyChange: number
  sectorChange: number
  sectorWeeklyChange: number
  marketChange: number
  marketWeeklyChange: number
  /** Trading volume relative to its 20-day average (e.g. 1.6 = 60% above). */
  volumeVsAvg: number
  about: string
  stats: KeyStats
  /** Anchor points used to generate illustrative chart series. */
  chartAnchors: Record<ChartRange, number[]>
  /** One- or two-sentence summary at the top of Lens. */
  lensSummary: Explained
  /** Short label used on cards, e.g. "Why is it moving?" */
  lensPrompt: string
  whyMoving: WhyMoving
  recentEvents: RecentEvent[]
  risks: Risk[]
  facts: string[]
  interpretations: string[]
  uncertainties: string[]
  /** What could matter from here — used instead of predictions. */
  watchpoints: string[]
  pastMove?: PastMove
  /** Other stocks in the prototype universe from the same sector. */
  peerIds: string[]
  suggestedQuestions: string[]
  mockChatResponses: Partial<Record<SeededIntent, SeededAnswer>>
}

export interface MarketIndex {
  id: string
  name: string
  value: number
  dailyChange: number
  weeklyChange: number
  description: string
  chartAnchors: Record<ChartRange, number[]>
  context: {
    fact: string
    interpretation: string
    uncertainty: string
  }
  /** Stocks in the prototype universe that belong to this index. */
  constituentIds: string[]
}

export interface Holding {
  stockId: string
  quantity: number
  avgPrice: number
}

export type Familiarity = 'new' | 'basics' | 'active'
export type Goal = 'stocks' | 'markets' | 'learn' | 'companies'
export type ExplainLevel = 'simple' | 'standard'
