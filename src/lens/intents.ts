import { INDEX_ALIASES } from '../data/indices'
import { STOCK_ALIASES } from '../data/stocks'
import { escapeRegExp, findGlossaryEntry, type GlossaryEntry } from '../data/glossary'
import { normalise } from './safety'
import type { LensIntent } from './types'

/**
 * Lightweight, explainable query understanding for the mock provider.
 * A production system would replace this with an LLM + retrieval, but the shape of the
 * output (intent + entities + modifiers) is what the answer composer needs either way.
 */

export interface ParsedQuestion {
  normalised: string
  intent: LensIntent
  /** Stocks from the prototype universe mentioned in the question. */
  stockIds: string[]
  indexId?: string
  /** A company we have no data on (e.g. "Zomato"). */
  unknownEntity?: string
  glossary?: GlossaryEntry
  /** "Explain like I'm new" — answer in plain language. */
  wantsSimple: boolean
  /** Refers back to the previous answer ("explain that simply"). */
  refersBack: boolean
  /** User asked about a fall/rise — used to check the premise against the data. */
  assumedDirection?: 'up' | 'down'
  period: 'today' | 'week' | 'month'
}

/** Companies people commonly ask about that are NOT in the prototype's data. */
const UNKNOWN_COMPANIES = [
  'tata consultancy', 'tata steel', 'tata power', 'tata consumer', 'hdfc life', 'hdfc amc', 'icici prudential',
  'icici lombard', 'reliance power', 'reliance infra', 'state bank', 'axis bank', 'kotak', 'yes bank', 'bajaj',
  'maruti', 'mahindra', 'adani', 'hindustan unilever', 'asian paints', 'larsen', 'sun pharma', 'bharti airtel',
  'airtel', 'zomato', 'eternal', 'swiggy', 'paytm', 'nykaa', 'ola electric', 'ongc', 'coal india', 'ntpc', 'wipro',
  'hcl', 'tech mahindra', 'titan', 'itc', 'lic', 'irfc', 'sbi', 'tcs', 'hul', 'l&t', 'tesla', 'apple', 'nvidia',
  'microsoft', 'google', 'alphabet', 'amazon', 'meta', 'netflix',
]

const RULES: Array<{ intent: LensIntent; pattern: RegExp; weight: number }> = [
  {
    intent: 'past_move',
    pattern: /\b(last|past|previous) (month|30 days|few weeks)\b|\bin (september|august|sept)\b|\blast month\b/,
    weight: 4,
  },
  {
    intent: 'outlook',
    pattern:
      /going forward|from here|what('s| is)? next|to watch|keep an eye|(research|understand|look into|learn|check) next|look out for|what could (matter|affect|influence|change|move|drive)|what might (matter|affect|change)|ahead|upcoming/,
    weight: 3,
  },
  {
    intent: 'sector_context',
    pattern:
      /company[- ]specific|specific to|\bsectors?\b|industry|whole market|market[- ]wide|overall market|broader market|other (banks|stocks|companies|automakers|carmakers|it companies)|\bbanks\b|banking (stocks|sector)|(auto|it|energy|bank) stocks|\bpeers?\b|compared? (to|with)|relative to|outperform|underperform|benchmark|\bindex\b|\bnifty\b|why compare/,
    weight: 3,
  },
  {
    intent: 'management',
    pattern:
      /management|\bceo\b|\bmd\b|leadership|commentary|guidance|(analyst|earnings|investor|conference) call|what did (they|the company|the bank|it|management) say|\bsaid\b/,
    weight: 3,
  },
  {
    intent: 'valuation',
    pattern: /valuation|valued|\bp\/?e\b|price[- ]to[- ]earnings|expensive|cheap|overvalued|undervalued|pricey|multiple|overpriced/,
    weight: 3,
  },
  {
    intent: 'risks',
    pattern:
      /\brisks?\b|risky|downside|counter ?points?|bear(ish)? case|worr(y|ies|ied)|concerns?|go wrong|missing|caution|careful|red flags?|negatives?|other side|what could hurt/,
    weight: 3,
  },
  {
    intent: 'earnings',
    pattern: /earnings|results?\b|quarter(ly)?|\bq[1-4]\b|profit|revenue|income|\bnumbers\b/,
    weight: 2.5,
  },
  {
    intent: 'what_changed',
    pattern:
      /what('s| has|) changed|\bchanged\b|recent(ly)?|lately|last (7|seven) days|this week|past week|\bnews\b|happen(ed|ing)|\bevents?\b|timeline|updates?\b|announce/,
    weight: 2.5,
  },
  {
    intent: 'about',
    pattern: /what does .+ do|about (the )?(company|business|bank)|business model|what kind of company|tell me about|who (is|are) (hdfc|icici|reliance|tata|infosys)/,
    weight: 2,
  },
  {
    intent: 'why_moving',
    pattern:
      /\bwhy\b|moving|movement|moved|\bmove\b|\bup\b|\bdown\b|\bris(e|ing|en)\b|\bfall(ing|en)?\b|\bfell\b|\bdrop(ped|ping)?\b|\bjump(ed|ing)?\b|rall(y|ied)|surg(e|ed|ing)|\bgain(ed|ing|s)?\b|declin(e|ed|ing)|\bslip(ped)?\b|\btoday\b|how('s| is) .+ doing|overview|summar(y|ise|ize)|what('s| is) going on|driving|explain/,
    weight: 1,
  },
]

const SIMPLE =
  /new to investing|like i'?m (new|a beginner|five|5|completely new|totally new|a kid)|like (a |to a )?beginner|\beli5\b|\bsimpl(e|er|y)\b|plain (english|words|language)|no jargon|without (the )?jargon|basic terms|dumb (it )?down|don'?t understand|confus(ed|ing)|layman|easy (words|way)|i'?m new|first[- ]time/

const REFERS_BACK = /\b(that|this|it|above|the last (one|answer))\b/

const DOWN_WORDS = /\b(fall|falling|fell|fallen|drop|dropped|dropping|down|decline|declined|declining|slip|slipped|crash|crashed|lose|losing|lost)\b/
const UP_WORDS = /\b(rise|rising|rose|risen|up|jump|jumped|rally|rallied|surge|surged|gain|gained|gaining|climb|climbed)\b/

function containsPhrase(text: string, phrase: string): boolean {
  return new RegExp(`(^|[^a-z0-9&])${escapeRegExp(phrase)}([^a-z0-9&]|$)`).test(text)
}

function findStocks(q: string): string[] {
  const found: string[] = []
  let rest = q
  // Remove unknown multi-word names first so "tata steel" isn't read as Tata Motors.
  for (const name of UNKNOWN_COMPANIES) if (containsPhrase(rest, name)) rest = rest.replaceAll(name, ' ')
  for (const [id, aliases] of Object.entries(STOCK_ALIASES)) {
    if (aliases.some((a) => containsPhrase(rest, a))) found.push(id)
  }
  return found
}

function findUnknown(q: string): string | undefined {
  const hit = UNKNOWN_COMPANIES.find((name) => containsPhrase(q, name))
  if (!hit) return undefined
  return hit.length <= 4 ? hit.toUpperCase() : hit.replace(/\b\w/g, (c) => c.toUpperCase())
}

function findIndex(q: string): string | undefined {
  // Check specific indices (Nifty Bank) before broad ones (Nifty / "the market").
  for (const id of ['nifty-bank', 'nifty-50']) {
    if (INDEX_ALIASES[id].some((a) => containsPhrase(q, a))) return id
  }
  return undefined
}

/** "What is P/E?" / "What does NIM mean?" / "Define valuation" */
function findDefinitionRequest(q: string): GlossaryEntry | undefined {
  const m =
    q.match(/^(?:what|wat)(?: is|'s| are| does| do)(?: an?)? (.+?)(?: mean| means| stand for)?\??$/) ??
    q.match(/^(?:define|meaning of|explain the term|what do you mean by) (.+?)\??$/)
  if (!m) return undefined
  const term = m[1].trim()
  if (/^the\b/.test(term)) return undefined // "what is the valuation" is about this stock, not a definition
  const entry = findGlossaryEntry(term)
  // Only treat as a definition when the term is (nearly) the whole subject.
  if (entry && entry.aliases.some((a) => term.replace(/[?.!]/g, '').trim().length <= a.length + 8)) return entry
  return undefined
}

export function parseQuestion(question: string): ParsedQuestion {
  const q = normalise(question)
  const stockIds = findStocks(q)
  const indexId = findIndex(q)
  const unknownEntity = findUnknown(q)
  const wantsSimple = SIMPLE.test(q)
  const period: ParsedQuestion['period'] = /\b(month|30 days|september|sept)\b/.test(q)
    ? 'month'
    : /\b(week|7 days|seven days|few days)\b/.test(q)
      ? 'week'
      : 'today'
  const assumedDirection: ParsedQuestion['assumedDirection'] = DOWN_WORDS.test(q) ? 'down' : UP_WORDS.test(q) ? 'up' : undefined
  const base = { normalised: q, stockIds, indexId, unknownEntity, wantsSimple, period, assumedDirection }

  if (/^(hi+|hello|hey|hiya|yo|namaste|good (morning|afternoon|evening))\b[\s!.]*$/.test(q)) {
    return { ...base, intent: 'greeting', refersBack: false }
  }
  if (/^(thanks|thank you|thx|ty|ok|okay|cool|got it|great|nice|makes sense|understood)\b[\s!.]*$/.test(q)) {
    return { ...base, intent: 'thanks', refersBack: false }
  }
  if (unknownEntity && stockIds.length === 0) {
    return { ...base, intent: 'unknown_entity', refersBack: false }
  }

  const glossary = findDefinitionRequest(q)
  if (glossary) return { ...base, intent: 'glossary', glossary, refersBack: false }

  const scores = new Map<LensIntent, number>()
  for (const rule of RULES) if (rule.pattern.test(q)) scores.set(rule.intent, (scores.get(rule.intent) ?? 0) + rule.weight)

  if (unknownEntity) return { ...base, intent: 'unknown_entity', refersBack: false }

  if (stockIds.length >= 2 || /\b(vs\.?|versus|compare|comparison|better than|which is better)\b/.test(q)) {
    return { ...base, intent: 'compare', refersBack: false }
  }

  // Questions about "the market" or an index (without a specific stock) get index context.
  if (indexId && stockIds.length === 0 && !/company[- ]specific|specific to|this stock|\bit\b|outperform|compared?/.test(q)) {
    const definitional = /^(what is|what's|what are)\b/.test(q) && !/\b(doing|moving|up|down|today)\b/.test(q)
    if (!definitional) return { ...base, intent: 'index', refersBack: false }
  }

  let best: LensIntent | undefined
  let bestScore = 0
  for (const [intent, score] of scores) {
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }

  const refersBack = REFERS_BACK.test(q) && q.split(' ').length <= 9

  if (wantsSimple && (!best || best === 'why_moving')) {
    return { ...base, intent: 'beginner', refersBack }
  }
  if (!best) {
    // A bare stock name ("Reliance?") reads as "what's going on with it?"
    return { ...base, intent: stockIds.length ? 'why_moving' : 'fallback', refersBack }
  }
  return { ...base, intent: best, refersBack }
}
