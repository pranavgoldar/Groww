import type { ExplainLevel, Familiarity } from '../data/types'

/**
 * Contract between the Ask Lens UI and whatever produces answers.
 * The prototype uses a deterministic mock; a real LLM/RAG backend only needs to return the same shape.
 */

export type GuardrailKind =
  | 'advice' // should I buy / sell / hold
  | 'stock-picking' // which stock should I buy
  | 'prediction' // will it go up tomorrow
  | 'target-price' // what's the target price
  | 'guarantee' // guaranteed / safe returns
  | 'out-of-scope' // crypto, F&O, tips

export type LensIntent =
  | 'why_moving'
  | 'what_changed'
  | 'sector_context'
  | 'risks'
  | 'management'
  | 'earnings'
  | 'valuation'
  | 'about'
  | 'past_move'
  | 'outlook'
  | 'beginner'
  | 'glossary'
  | 'compare'
  | 'index'
  | 'greeting'
  | 'thanks'
  | 'unknown_entity'
  | 'search'
  | 'fallback'
  | 'guardrail'

export type BlockKind = 'fact' | 'interpretation' | 'uncertainty' | 'risk' | 'list'

export interface BlockItem {
  text: string
  title?: string
  meta?: string
}

export interface AnswerBlock {
  kind: BlockKind
  title?: string
  items: BlockItem[]
}

export interface SourceRef {
  id: string
  label: string
  kind: 'event' | 'price' | 'index' | 'volume' | 'stats' | 'glossary'
  /** Stock the source belongs to (for linking to the timeline). */
  stockId?: string
}

export interface LensAnswer {
  intent: LensIntent
  guardrail?: GuardrailKind
  /** The stock this answer is about (may differ from the page's stock if the user asked about another). */
  stockId?: string
  /** One-sentence direct answer. */
  lead: string
  /** Plain-language version for first-time investors. */
  plain?: string
  blocks: AnswerBlock[]
  sources: SourceRef[]
  followUps: string[]
  /** Small context note shown above the answer, e.g. "Answering about Reliance". */
  note?: string
  /** Small print shown under the answer. */
  footnote?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'lens'
  text?: string
  answer?: LensAnswer
}

export interface LensRequest {
  question: string
  /** The stock whose Lens the user is in. */
  stockId: string
  level: ExplainLevel
  familiarity: Familiarity
  history: ChatMessage[]
}

export interface LensProvider {
  readonly name: string
  ask(request: LensRequest): Promise<LensAnswer>
}
