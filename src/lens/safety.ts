import type { GuardrailKind, LensAnswer } from './types'

/**
 * Centralised safety layer for Ask Lens.
 *
 * 1. `detectGuardrail` runs on every question BEFORE any answer is composed. Requests for
 *    buy/sell calls, stock picks, predictions, price targets or guaranteed returns never reach
 *    the normal answer path — they get a decision-support response instead.
 * 2. `enforcePolicy` runs on every answer AFTER it is produced (by the mock today, by an LLM
 *    later) and blocks language that would amount to advice, predictions or guarantees.
 */

const RULES: Array<{ kind: GuardrailKind; patterns: RegExp[] }> = [
  {
    kind: 'out-of-scope',
    patterns: [
      /\b(crypto|bitcoin|btc|ethereum|eth|dogecoin|nft)\b/,
      /\b(f&o|f and o|futures|derivatives?|option chain|call options?|put options?|options trading|intraday tips?|margin trading|leverage)\b/,
    ],
  },
  {
    kind: 'guarantee',
    patterns: [
      /\bguarantee(d|s)?\b/,
      /\bassured\b/,
      /\bsure[- ]?shot\b/,
      /\brisk[- ]?free\b/,
      /\bsafe (bet|investment|returns?|stock)\b/,
      /\bcan'?t (lose|go wrong)\b/,
      /\bno risk\b/,
      /\bdouble (my|your|the)? ?money\b/,
      /\bhow much (money )?(will|would|can|could) i (make|earn|get|gain)\b/,
      /\bfixed returns?\b/,
    ],
  },
  {
    kind: 'target-price',
    patterns: [
      /\b(price target|target price|price objective)s?\b/,
      /\bwhat('s| is) (the|its|a) target\b/,
      /\bhow (high|low|far) (can|will|could|would) (it|this|the stock|the price|.+) (go|fall|rise|reach)\b/,
      /\b(fair|intrinsic|true) (value|price)\b/,
      /\b(reach|hit|touch|cross) (₹|rs\.?|inr)? ?\d/,
    ],
  },
  {
    kind: 'prediction',
    patterns: [
      /\b(will|would|going to|gonna)\b.*\b(go up|go down|rise|fall|rally|crash|recover|rebound|bounce|increase|decrease|drop|climb|grow|keep (rising|falling|going))\b/,
      /\btomorrow\b/,
      /\bnext (week|month|year|few days|session)\b/,
      /\bin (a|one|\d+) (day|days|week|weeks|month|months|year|years)\b.*\b(price|worth|be at|trade)\b/,
      /\b(predict|prediction|forecast|projection)s?\b/,
      /\bfuture price\b/,
      /\bwhere (will|is) (it|the stock|the price|.+) (go|head|be)\b/,
      /\bis (it|this|the stock) going to\b/,
    ],
  },
  {
    kind: 'stock-picking',
    patterns: [
      /\bwhich (stock|share|company|one)s? (should|to|do|would|can) (i|we|you)?\b/,
      /\bwhat (stock|share)s? (should|to|do) i\b/,
      /\bbest (stock|share|investment|pick)s?\b/,
      /\btop (pick|stock|share)s?\b/,
      /\b(recommend|suggest) (me )?(a |some |any |good )?(stock|share|investment)s?\b/,
      /\bmulti-?baggers?\b/,
      /\b(stock|share|trading) tips?\b/,
      /\bwhat should i (buy|invest in)\b/,
      /\bwhich is (a )?better (investment|buy|stock)\b/,
    ],
  },
  {
    kind: 'advice',
    patterns: [
      /\bshould (i|we|one) (buy|sell|hold|invest|exit|book|add|get|keep|average|enter|accumulate|dump)\b/,
      /\b(buy|sell)\b/,
      /\bgood (time|idea|moment) to (buy|sell|invest|enter|exit)\b/,
      /\bworth (buying|investing|it)\b/,
      /\bis (it|this|.+) a (good|bad|great|smart) (buy|investment|stock|pick)\b/,
      /\binvest in (it|this|.+) (now|today)\b/,
      /\b(add|put) (it|this) (to|in) my portfolio\b/,
      /\bbook (profit|profits|loss)\b/,
    ],
  },
]

export function detectGuardrail(question: string): GuardrailKind | null {
  const q = normalise(question)
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(q))) return rule.kind
  }
  return null
}

export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Phrases that must never appear in a Lens answer, whatever produced it. */
const BANNED_OUTPUT: RegExp[] = [
  /\byou should (buy|sell|invest|hold|exit)\b/i,
  /\bi (recommend|suggest) (buying|selling|investing|holding)\b/i,
  /\b(strong|good) (buy|sell)\b/i,
  /\bguaranteed (returns?|profit|gains?)\b/i,
  /\bwill (definitely|certainly|surely) (rise|fall|go up|go down)\b/i,
  /\btarget (price )?(of|is) ₹?\d/i,
  /\bwill (reach|hit) ₹?\d/i,
]

function answerText(answer: LensAnswer): string {
  return [
    answer.lead,
    answer.plain ?? '',
    ...answer.blocks.flatMap((b) => b.items.flatMap((i) => [i.title ?? '', i.text])),
  ].join(' \n ')
}

export function violatesPolicy(answer: LensAnswer): boolean {
  const text = answerText(answer)
  return BANNED_OUTPUT.some((p) => p.test(text))
}

/** Replaces any answer that slips past the input guardrails with a safe, honest response. */
export function enforcePolicy(answer: LensAnswer): LensAnswer {
  if (!violatesPolicy(answer)) return answer
  return {
    intent: 'guardrail',
    guardrail: 'advice',
    stockId: answer.stockId,
    lead: 'I can’t give that kind of answer, but I can help you understand the factors involved.',
    blocks: [
      {
        kind: 'uncertainty',
        items: [{ text: 'Lens explains what’s happening and what the risks are. It doesn’t recommend investments or predict prices.' }],
      },
    ],
    sources: [],
    followUps: ['Why is it moving today?', 'What are the biggest risks?', 'What changed in the last 7 days?'],
  }
}
