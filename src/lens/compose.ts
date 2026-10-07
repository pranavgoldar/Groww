import { getGlossaryEntry, type GlossaryEntry } from '../data/glossary'
import { getIndex } from '../data/indices'
import { getStock, STOCKS } from '../data/stocks'
import type { ExplainLevel, Explained, SeededAnswer, SeededIntent, Stock } from '../data/types'
import { abs1, changeFromPct, inr, pct, roseFell, upDown } from '../lib/format'
import { classifyMovement } from '../lib/movement'
import { parseQuestion, type ParsedQuestion } from './intents'
import { detectGuardrail, normalise } from './safety'
import type { AnswerBlock, GuardrailKind, LensAnswer, LensIntent, LensRequest, SourceRef } from './types'

/**
 * Deterministic answer composer — the "mock LLM".
 *
 * Every answer is assembled ONLY from the selected stock's seeded records (price data, events,
 * drivers, risks, ratios). Nothing is generated beyond those records, which is the same grounding
 * contract a production RAG system should honour.
 */

const SEBI_NOTE = 'For advice based on your personal situation, consider a SEBI-registered investment adviser.'

const REEXPLAINABLE: LensIntent[] = [
  'why_moving',
  'what_changed',
  'sector_context',
  'risks',
  'management',
  'earnings',
  'valuation',
  'past_move',
  'outlook',
  'about',
]

interface Ctx {
  stock: Stock
  pageStock: Stock
  level: ExplainLevel
  parsed: ParsedQuestion
  req: LensRequest
}

const pick = (e: Explained, level: ExplainLevel) => (level === 'simple' ? e.simple : e.standard)

const EVIDENCE_LABEL = { strong: 'Strong evidence', moderate: 'Moderate evidence', limited: 'Limited evidence' } as const

function priceFact(s: Stock): string {
  return `${s.shortName} is at ${inr(s.price)}, ${upDown(s.dailyChange)} ${abs1(s.dailyChange)} today.`
}

function contextFact(s: Stock): string {
  return `${s.sectorIndex} ${pct(s.sectorChange)} · Nifty 50 ${pct(s.marketChange)} today.`
}

function source(s: Stock, key: string): SourceRef | undefined {
  const event = s.recentEvents.find((e) => e.id === key)
  if (event) return { id: event.id, label: `${event.date} · ${event.title}`, kind: 'event', stockId: s.id }
  switch (key) {
    case 'price':
      return { id: `${s.id}:price`, label: 'Price data', kind: 'price' }
    case 'index':
      return { id: `${s.id}:index`, label: `${s.sectorIndex} & Nifty 50 data`, kind: 'index' }
    case 'volume':
      return { id: `${s.id}:volume`, label: 'Trading volume', kind: 'volume' }
    case 'stats':
      return { id: `${s.id}:stats`, label: 'Key ratios', kind: 'stats' }
    default:
      return undefined
  }
}

function sources(s: Stock, keys: string[]): SourceRef[] {
  const seen = new Set<string>()
  return keys
    .map((k) => source(s, k))
    .filter((x): x is SourceRef => !!x && !seen.has(x.id) && !!seen.add(x.id))
}

/** Suggest follow-ups that aren't the question just answered or ones already asked. */
function followUps(ctx: Ctx, candidates: string[], current: LensIntent): string[] {
  const asked = new Set(
    ctx.req.history.filter((m) => m.role === 'user' && m.text).map((m) => m.text!.trim().toLowerCase()),
  )
  asked.add(ctx.req.question.trim().toLowerCase())
  const out: string[] = []
  for (const c of candidates) {
    if (asked.has(c.toLowerCase()) || out.includes(c)) continue
    if (parseQuestion(c).intent === current && current !== 'glossary') continue
    out.push(c)
    if (out.length === 3) break
  }
  return out
}

function base(ctx: Ctx, intent: LensIntent): Pick<LensAnswer, 'intent' | 'stockId' | 'note'> {
  return {
    intent,
    stockId: ctx.stock.id,
    note: ctx.stock.id !== ctx.pageStock.id ? `Answering about ${ctx.stock.name}` : undefined,
  }
}

function fromSeed(ctx: Ctx, intent: LensIntent, seed: SeededAnswer, defaults: string[]): LensAnswer {
  const blocks: AnswerBlock[] = []
  if (seed.facts?.length) blocks.push({ kind: 'fact', items: seed.facts.map((text) => ({ text })) })
  if (seed.interpretations?.length)
    blocks.push({ kind: 'interpretation', items: seed.interpretations.map((text) => ({ text })) })
  if (seed.uncertainties?.length)
    blocks.push({ kind: 'uncertainty', items: seed.uncertainties.map((text) => ({ text })) })
  return {
    ...base(ctx, intent),
    lead: seed.lead,
    plain: ctx.level === 'simple' ? seed.plain : undefined,
    blocks,
    sources: sources(ctx.stock, seed.sources ?? []),
    followUps: followUps(ctx, seed.followUps ?? defaults, intent),
  }
}

function seeded(ctx: Ctx, intent: SeededIntent): SeededAnswer | undefined {
  return ctx.stock.mockChatResponses[intent]
}

// ---------------------------------------------------------------------------------------------
// Intent composers
// ---------------------------------------------------------------------------------------------

function whyMoving(ctx: Ctx): LensAnswer {
  const { stock: s, level, parsed } = ctx
  const w = s.whyMoving
  const actual = s.dailyChange >= 0 ? 'up' : 'down'
  const headline = w.headline.replace(/ today\.$/, '.')
  const premiseWrong = parsed.assumedDirection && parsed.assumedDirection !== actual && Math.abs(s.dailyChange) >= 0.1
  const lead = premiseWrong
    ? `Quick correction: ${s.shortName} is ${actual} ${abs1(s.dailyChange)} today, not ${parsed.assumedDirection}. ${headline}`
    : `${s.shortName} is ${actual} ${abs1(s.dailyChange)} today. ${headline}`
  const eventKeys = w.drivers.flatMap((d) => d.eventIds ?? [])
  return {
    ...base(ctx, 'why_moving'),
    lead,
    plain: level === 'simple' ? s.lensSummary.simple : undefined,
    blocks: [
      { kind: 'fact', items: [{ text: priceFact(s) }, { text: contextFact(s) }] },
      {
        kind: 'interpretation',
        title: 'Possible drivers',
        items: w.drivers.map((d) => ({
          title: d.title,
          text: pick(d.text, level),
          meta: `${EVIDENCE_LABEL[d.evidence]} · ${d.basis}`,
        })),
      },
      { kind: 'uncertainty', items: [{ text: pick(w.uncertainty, level) }] },
    ],
    sources: sources(s, [...eventKeys, 'price', 'index', ...(w.drivers.some((d) => d.id === 'volume') ? ['volume'] : [])]),
    followUps: followUps(
      ctx,
      ['What changed in the last 7 days?', 'Is this movement company-specific?', 'What are the biggest risks?', 'Explain this like I’m new to investing.'],
      'why_moving',
    ),
  }
}

function whatChanged(ctx: Ctx): LensAnswer {
  const { stock: s, level, parsed } = ctx
  const days = parsed.period === 'month' ? 30 : 7
  const events = s.recentEvents.filter((e) => e.daysAgo <= days)
  const linkedId = s.whyMoving.drivers.find((d) => d.eventIds?.length)?.eventIds?.[0]
  const linked = s.recentEvents.find((e) => e.id === linkedId && e.daysAgo <= days)
  const blocks: AnswerBlock[] = [
    {
      kind: 'fact',
      title: days === 7 ? 'Last 7 days' : 'Past month',
      items: events.map((e) => ({ title: `${e.date} · ${e.title}`, text: e.summary })),
    },
  ]
  if (linked) {
    blocks.push({
      kind: 'interpretation',
      items: [{ text: `Most connected to the recent move: ${linked.title} (${linked.date}). ${pick(linked.whyItMatters, level)}` }],
    })
  }
  blocks.push({
    kind: 'uncertainty',
    items: [{ text: 'This covers the major events in this prototype’s data. It isn’t a complete news feed.' }],
  })
  return {
    ...base(ctx, 'what_changed'),
    lead: events.length
      ? `${events.length} notable ${events.length === 1 ? 'event' : 'events'} in the ${days === 7 ? 'last 7 days' : 'past month'}, newest first.`
      : `No notable events for ${s.shortName} in the ${days === 7 ? 'last 7 days' : 'past month'} in this prototype’s data.`,
    blocks,
    sources: sources(s, events.map((e) => e.id)),
    followUps: followUps(
      ctx,
      [
        s.mockChatResponses.management ? 'What did management say?' : 'Why did this stock move today?',
        'Is this movement company-specific?',
        'What are the biggest risks?',
        'What changed in the last month?',
      ],
      'what_changed',
    ),
  }
}

function sectorContext(ctx: Ctx): LensAnswer {
  const { stock: s, level, parsed } = ctx
  const period = parsed.period === 'week' ? 'week' : 'today'
  const v = classifyMovement(s, period)
  const pick3 = (today: number, week: number) => pct(period === 'today' ? today : week)
  const peers = s.peerIds.map((id) => getStock(id)).filter((p): p is Stock => !!p)
  return {
    ...base(ctx, 'sector_context'),
    lead: `${v.label}.`,
    plain:
      level === 'simple'
        ? `If similar companies all move together, the reason is probably something affecting the whole industry. ${v.simple}`
        : undefined,
    blocks: [
      {
        kind: 'fact',
        title: period === 'today' ? 'Today' : 'Past week',
        items: [
          { text: `${s.shortName}: ${pick3(s.dailyChange, s.weeklyChange)}` },
          { text: `${s.sectorIndex} (sector): ${pick3(s.sectorChange, s.sectorWeeklyChange)}` },
          { text: `Nifty 50 (market): ${pick3(s.marketChange, s.marketWeeklyChange)}` },
          ...(period === 'today' ? peers.map((p) => ({ text: `${p.shortName} (peer): ${pct(p.dailyChange)}` })) : []),
        ],
      },
      { kind: 'interpretation', items: [{ text: level === 'simple' ? v.simple : v.explanation }] },
      {
        kind: 'uncertainty',
        items: [{ text: 'Comparing with an index shows whether a move is unusual — not what caused it.' }],
      },
    ],
    sources: sources(s, ['price', 'index']),
    followUps: followUps(
      ctx,
      ['Why did this stock move today?', 'What are the biggest risks?', 'What is a sector index?', 'How did it do this week vs the sector?'],
      'sector_context',
    ),
  }
}

function risks(ctx: Ctx): LensAnswer {
  const { stock: s, level } = ctx
  const moved = s.dailyChange >= 0.5 ? 'rose' : s.dailyChange <= -0.5 ? 'fell' : 'moved'
  return {
    ...base(ctx, 'risks'),
    lead: `${s.risks.length} things worth weighing — not just the reasons it ${moved}.`,
    blocks: [
      {
        kind: 'risk',
        items: s.risks.map((r) => ({ title: r.title, text: pick(r.detail, level), meta: r.scope })),
      },
      {
        kind: 'uncertainty',
        items: [{ text: 'These are considerations, not predictions. Today’s price move doesn’t tell you about them.' }],
      },
    ],
    sources: sources(s, ['stats', 'index']),
    followUps: followUps(ctx, ['Is the valuation high?', 'What could matter from here?', 'What changed in the last 7 days?'], 'risks'),
  }
}

function pastMove(ctx: Ctx): LensAnswer {
  const { stock: s, parsed } = ctx
  const pm = s.pastMove
  if (!pm) return notCovered(ctx, `This prototype doesn’t have a breakdown of that period for ${s.shortName}.`)
  const actual = pm.change >= 0 ? 'up' : 'down'
  const lead =
    parsed.assumedDirection && parsed.assumedDirection !== actual
      ? `In this prototype’s data, ${s.shortName} actually ${roseFell(pm.change)} ${abs1(pm.change)} in ${pm.period}.`
      : `${s.shortName} ${roseFell(pm.change)} ${abs1(pm.change)} in ${pm.period}.`
  const older = s.recentEvents.filter((e) => e.daysAgo > 7).map((e) => e.id)
  return {
    ...base(ctx, 'past_move'),
    lead,
    blocks: [
      { kind: 'fact', items: pm.facts.map((text) => ({ text })) },
      { kind: 'interpretation', items: [{ text: pm.interpretation }] },
      { kind: 'uncertainty', items: [{ text: pm.uncertainty }] },
    ],
    sources: sources(s, [...older, 'index']),
    followUps: followUps(ctx, ['Why did this stock move today?', 'What changed in the last 7 days?', 'What are the biggest risks?'], 'past_move'),
  }
}

function outlook(ctx: Ctx): LensAnswer {
  const s = ctx.stock
  return {
    ...base(ctx, 'outlook'),
    lead: 'A few things could matter from here — none of them are predictions.',
    blocks: [
      { kind: 'list', title: 'Worth keeping an eye on', items: s.watchpoints.map((text) => ({ text })) },
      {
        kind: 'uncertainty',
        items: [{ text: 'How these play out — and how the market reacts — can’t be known in advance.' }],
      },
    ],
    sources: sources(s, s.recentEvents.filter((e) => e.daysAgo <= 7).map((e) => e.id)),
    followUps: followUps(ctx, ['What are the biggest risks?', 'What changed in the last 7 days?', 'Why did this stock move today?'], 'outlook'),
  }
}

function management(ctx: Ctx): LensAnswer {
  const s = ctx.stock
  const seed = seeded(ctx, 'management')
  const defaults = ['What changed in the last 7 days?', 'What are the biggest risks?', 'Why did this stock move today?']
  if (seed) return fromSeed(ctx, 'management', seed, defaults)
  const event = s.recentEvents.find((e) => e.type === 'management')
  if (event) return eventAnswer(ctx, 'management', event.id, defaults)
  return notCovered(
    ctx,
    `This prototype doesn’t include recent management commentary for ${s.shortName}, so I won’t guess what was said.`,
    defaults,
  )
}

function earnings(ctx: Ctx): LensAnswer {
  const s = ctx.stock
  const defaults = ['What changed in the last 7 days?', 'Is the valuation high?', 'What are the biggest risks?']
  const seed = seeded(ctx, 'earnings')
  if (seed) return fromSeed(ctx, 'earnings', seed, defaults)
  const results = s.recentEvents.find((e) => e.type === 'results')
  if (results) return eventAnswer(ctx, 'earnings', results.id, defaults)
  const scheduled = s.recentEvents.find((e) => /results date/i.test(e.title))
  if (scheduled) {
    return {
      ...base(ctx, 'earnings'),
      lead: `${s.shortName} hasn’t reported results in the period covered here.`,
      blocks: [
        { kind: 'fact', items: [{ text: scheduled.summary }] },
        { kind: 'uncertainty', items: [{ text: scheduled.unclear }] },
      ],
      sources: sources(s, [scheduled.id]),
      followUps: followUps(ctx, ['What could matter from here?', ...defaults], 'earnings'),
    }
  }
  return notCovered(ctx, `This prototype doesn’t include recent results for ${s.shortName}.`, defaults)
}

function valuation(ctx: Ctx): LensAnswer {
  const s = ctx.stock
  const defaults = ['What is P/E?', 'What are the biggest risks?', 'What changed in the last 7 days?']
  const seed = seeded(ctx, 'valuation')
  if (seed) return fromSeed(ctx, 'valuation', seed, defaults)
  const { pe, sectorPe, pb } = s.stats
  const rel = pe > sectorPe * 1.05 ? 'above' : pe < sectorPe * 0.95 ? 'below' : 'close to'
  return {
    ...base(ctx, 'valuation'),
    lead: `At about ${pe}× earnings, ${s.shortName} is priced ${rel} the ${s.sector.toLowerCase()} average (~${sectorPe}×).`,
    plain:
      ctx.level === 'simple'
        ? `P/E tells you how many rupees investors pay for each ₹1 the company earns in a year. For ${s.shortName}, that’s about ₹${pe}.`
        : undefined,
    blocks: [
      {
        kind: 'fact',
        items: [{ text: `P/E: about ${pe} (demo data).` }, { text: `Sector average P/E: about ${sectorPe}.` }, { text: `Price-to-book: about ${pb}.` }],
      },
      {
        kind: 'interpretation',
        items: [
          {
            text:
              rel === 'below'
                ? 'A lower P/E can reflect lower growth expectations, higher perceived risk, or a relatively cheaper stock — the ratio alone doesn’t say which.'
                : 'A higher P/E usually means investors expect stronger or steadier growth — or that the stock is relatively pricey.',
          },
        ],
      },
      { kind: 'uncertainty', items: [{ text: 'Whether a valuation is “high” depends on future growth, which isn’t known.' }] },
    ],
    sources: sources(s, ['stats']),
    followUps: followUps(ctx, defaults, 'valuation'),
  }
}

function about(ctx: Ctx): LensAnswer {
  const s = ctx.stock
  const defaults = ['Why did this stock move today?', 'What are the biggest risks?', 'What changed in the last 7 days?']
  const seed = seeded(ctx, 'about')
  if (seed) return fromSeed(ctx, 'about', seed, defaults)
  return {
    ...base(ctx, 'about'),
    lead: s.about,
    blocks: [],
    sources: sources(s, ['stats']),
    followUps: followUps(ctx, defaults, 'about'),
  }
}

function beginner(ctx: Ctx): LensAnswer {
  const s = ctx.stock
  const defaults = ['What is a sector index?', 'What changed in the last 7 days?', 'What are the biggest risks?']
  const seed = seeded(ctx, 'beginner')
  if (seed) return fromSeed({ ...ctx, level: 'standard' }, 'beginner', seed, defaults)
  const perShare = changeFromPct(s.price, s.dailyChange)
  return {
    ...base(ctx, 'beginner'),
    lead: `Here’s ${s.shortName}’s day in plain words.`,
    blocks: [
      {
        kind: 'fact',
        items: [
          {
            text: `${s.shortName}’s share price went ${upDown(s.dailyChange)} ${abs1(s.dailyChange)} today — about ${inr(Math.abs(perShare))} per share.`,
          },
        ],
      },
      { kind: 'interpretation', items: s.whyMoving.drivers.map((d) => ({ text: d.text.simple })) },
      { kind: 'uncertainty', items: [{ text: s.whyMoving.uncertainty.simple }] },
    ],
    sources: sources(s, ['price', 'index', ...s.whyMoving.drivers.flatMap((d) => d.eventIds ?? [])]),
    followUps: followUps(ctx, defaults, 'beginner'),
  }
}

function glossary(ctx: Ctx, entry: GlossaryEntry): LensAnswer {
  const s = ctx.stock
  const blocks: AnswerBlock[] = []
  const statText = entry.stat ? statFor(s, entry.stat) : undefined
  if (statText) blocks.push({ kind: 'fact', items: [{ text: statText }] })
  const related = s.recentEvents.find((e) =>
    entry.aliases.some((a) => `${e.title} ${e.whatHappened}`.toLowerCase().includes(a)),
  )
  if (related) {
    blocks.push({
      kind: 'list',
      title: `Where this shows up for ${s.shortName}`,
      items: [{ title: `${related.date} · ${related.title}`, text: related.summary }],
    })
  }
  return {
    ...base(ctx, 'glossary'),
    lead: `${entry.term}: ${entry.definition}`,
    blocks,
    sources: [
      { id: `glossary:${entry.id}`, label: 'Lens glossary', kind: 'glossary' },
      ...(related ? sources(s, [related.id]) : []),
      ...(statText ? sources(s, ['stats']) : []),
    ],
    followUps: followUps(ctx, ['Why did this stock move today?', 'Is this movement company-specific?', 'What are the biggest risks?'], 'glossary'),
  }
}

function statFor(s: Stock, stat: NonNullable<GlossaryEntry['stat']>): string {
  const st = s.stats
  switch (stat) {
    case 'pe':
      return `${s.shortName}’s P/E is about ${st.pe} (sector average ~${st.sectorPe}).`
    case 'pb':
      return `${s.shortName}’s P/B is about ${st.pb}.`
    case 'marketCap':
      return `${s.shortName}’s market cap is about ${st.marketCap}.`
    case 'dividendYield':
      return `${s.shortName}’s dividend yield is about ${st.dividendYield}%.`
    case 'roe':
      return `${s.shortName}’s ROE is about ${st.roe}%.`
  }
}

function compare(ctx: Ctx): LensAnswer {
  const ids = [...new Set([ctx.pageStock.id, ...ctx.parsed.stockIds])]
  const pair = (ctx.parsed.stockIds.length >= 2 ? ctx.parsed.stockIds : ids).slice(0, 2).map((id) => getStock(id)!)
  if (pair.length < 2) return sectorContext({ ...ctx, stock: ctx.pageStock })
  const [a, b] = pair
  const judging = /\b(better|best|which (one|is)|should i)\b/.test(ctx.parsed.normalised)
  const sameSector = a.sector === b.sector
  return {
    intent: 'compare',
    stockId: a.id,
    lead: judging
      ? 'I won’t say which is the better investment, but here’s how they compare on the data in this prototype.'
      : `${a.shortName} ${pct(a.dailyChange)} vs ${b.shortName} ${pct(b.dailyChange)} today.`,
    blocks: [
      {
        kind: 'fact',
        title: 'Side by side',
        items: [
          { title: 'Today', text: `${a.shortName} ${pct(a.dailyChange)} · ${b.shortName} ${pct(b.dailyChange)}` },
          { title: 'Past week', text: `${a.shortName} ${pct(a.weeklyChange)} · ${b.shortName} ${pct(b.weeklyChange)}` },
          { title: 'P/E', text: `${a.shortName} ${a.stats.pe} · ${b.shortName} ${b.stats.pe}` },
          { title: 'Sector', text: sameSector ? `Both ${a.sector}` : `${a.sector} · ${b.sector}` },
        ],
      },
      {
        kind: 'interpretation',
        items: [
          {
            text: sameSector
              ? `Both are ${a.sector.toLowerCase()} stocks, so sector-wide news affects both. Differences between them may reflect company-specific factors.`
              : 'They’re in different sectors and respond to different news, so comparing their daily moves says little about either business.',
          },
        ],
      },
      { kind: 'uncertainty', items: [{ text: 'A few days of price moves say little about long-term performance.' }] },
    ],
    sources: [...sources(a, ['price', 'stats']), ...sources(b, ['price', 'stats'])].map((x) => ({
      ...x,
      label: `${x.id.startsWith(a.id) ? a.shortName : b.shortName} · ${x.label.toLowerCase()}`,
    })),
    followUps: followUps(ctx, [`What are the biggest risks for ${a.shortName}?`, `Why is ${b.shortName} moving?`, 'Is this movement company-specific?'], 'compare'),
  }
}

function indexAnswer(ctx: Ctx): LensAnswer {
  const idx = getIndex(ctx.parsed.indexId)!
  const s = ctx.pageStock
  return {
    intent: 'index',
    stockId: s.id,
    lead: idx.context.fact,
    plain: ctx.level === 'simple' ? idx.description : undefined,
    blocks: [
      { kind: 'fact', items: [{ text: idx.context.fact }, { text: `For context: ${s.shortName} ${pct(s.dailyChange)} today.` }] },
      { kind: 'interpretation', items: [{ text: idx.context.interpretation }] },
      { kind: 'uncertainty', items: [{ text: idx.context.uncertainty }] },
    ],
    sources: [{ id: `index:${idx.id}`, label: `${idx.name} data`, kind: 'index' }],
    followUps: followUps(ctx, ['Is this movement company-specific?', `Why is ${s.shortName} moving?`, 'What are the biggest risks?'], 'index'),
  }
}

function eventAnswer(ctx: Ctx, intent: LensIntent, eventId: string, defaults: string[]): LensAnswer {
  const s = ctx.stock
  const e = s.recentEvents.find((x) => x.id === eventId)!
  return {
    ...base(ctx, intent),
    lead: `${e.title} (${e.date}).`,
    blocks: [
      { kind: 'fact', items: [{ text: e.whatHappened }] },
      { kind: 'interpretation', items: [{ text: pick(e.whyItMatters, ctx.level) }] },
      { kind: 'uncertainty', items: [{ text: e.unclear }] },
    ],
    sources: sources(s, [e.id]),
    followUps: followUps(ctx, defaults, intent),
  }
}

function notCovered(ctx: Ctx, lead: string, defaults?: string[]): LensAnswer {
  return {
    ...base(ctx, 'fallback'),
    lead,
    blocks: [
      {
        kind: 'uncertainty',
        items: [{ text: 'Lens only answers from the information it has. Filling gaps with guesses could mislead you.' }],
      },
    ],
    sources: [],
    followUps: followUps(ctx, defaults ?? ctx.stock.suggestedQuestions, 'fallback'),
  }
}

function fallback(ctx: Ctx): LensAnswer {
  const s = ctx.stock
  return {
    ...base(ctx, 'fallback'),
    lead: 'I don’t have enough information in this prototype to answer that reliably.',
    blocks: [
      {
        kind: 'list',
        title: `I can explain ${s.shortName}’s`,
        items: [
          { text: 'Reasons it’s moving today' },
          { text: 'Recent events and what changed' },
          { text: 'Whether the move is company-specific or sector-wide' },
          { text: 'Risks and counterpoints' },
        ],
      },
    ],
    sources: [],
    followUps: followUps(ctx, s.suggestedQuestions, 'fallback'),
  }
}

function unknownEntity(ctx: Ctx): LensAnswer {
  const name = ctx.parsed.unknownEntity ?? 'that company'
  return {
    intent: 'unknown_entity',
    stockId: ctx.pageStock.id,
    lead: `I don’t have information on ${name} in this prototype, so I won’t guess.`,
    blocks: [
      {
        kind: 'uncertainty',
        items: [{ text: 'Lens only answers from the data it has. Making up details about a company would be misleading.' }],
      },
      {
        kind: 'list',
        title: 'Covered in this prototype',
        items: [{ text: `${STOCKS.map((s) => s.name).join(', ')}, Nifty 50 and Nifty Bank.` }],
      },
    ],
    sources: [],
    followUps: followUps(ctx, ctx.pageStock.suggestedQuestions, 'unknown_entity'),
  }
}

// ---------------------------------------------------------------------------------------------
// Guardrail responses — decision support, never decisions
// ---------------------------------------------------------------------------------------------

function guardrail(ctx: Ctx, kind: GuardrailKind): LensAnswer {
  const s = ctx.stock
  const level = ctx.level
  const common = { ...base(ctx, 'guardrail' as const), guardrail: kind }
  const keyEventId = s.whyMoving.drivers.find((d) => d.eventIds?.length)?.eventIds?.[0] ?? s.recentEvents[0]?.id
  const keyEvent = s.recentEvents.find((e) => e.id === keyEventId)

  switch (kind) {
    case 'advice':
      return {
        ...common,
        lead: `I can help you understand ${s.shortName}, but I won’t tell you whether to buy or sell it.`,
        plain:
          level === 'simple'
            ? 'Whether to invest is your decision. A good start is understanding what’s happening with the company and what could go wrong.'
            : undefined,
        blocks: [
          {
            kind: 'list',
            title: 'Factors investors often weigh',
            items: [
              ...(keyEvent ? [{ title: 'Recent developments', text: `${keyEvent.title} (${keyEvent.date}): ${keyEvent.summary}` }] : []),
              { title: 'Valuation', text: `P/E of about ${s.stats.pe}× vs a sector average of ~${s.stats.sectorPe}×.` },
              {
                title: 'Sector conditions',
                text: `${s.sectorIndex} is ${pct(s.sectorChange)} today and ${pct(s.sectorWeeklyChange)} over the past week.`,
              },
              { title: 'Key risk', text: `${s.risks[0].title}. ${pick(s.risks[0].detail, level)}` },
              { title: 'Your own situation', text: 'Your goals, time horizon, and how much of a loss you could handle.' },
            ],
          },
          { kind: 'uncertainty', items: [{ text: 'No one can reliably know how a stock will perform.' }] },
        ],
        sources: sources(s, [...(keyEvent ? [keyEvent.id] : []), 'stats', 'index']),
        followUps: followUps(ctx, ['What are the biggest risks?', 'Is the valuation high?', 'What changed in the last 7 days?'], 'guardrail'),
        footnote: SEBI_NOTE,
      }
    case 'prediction':
      return {
        ...common,
        lead: `Short-term price movements can’t be predicted reliably. Instead, here’s what’s affecting ${s.shortName} now and what could matter from here.`,
        blocks: [
          { kind: 'fact', items: [{ text: priceFact(s) }] },
          { kind: 'list', title: 'What could matter from here', items: s.watchpoints.map((text) => ({ text })) },
          { kind: 'uncertainty', items: [{ text: 'Even well-understood factors can affect a stock in unexpected ways.' }] },
        ],
        sources: sources(s, ['price']),
        followUps: followUps(ctx, ['Why did this stock move today?', 'What are the biggest risks?', 'What changed in the last 7 days?'], 'guardrail'),
      }
    case 'target-price':
      return {
        ...common,
        lead: 'I don’t provide price targets — they’re estimates that often turn out wrong, and Lens doesn’t make forecasts.',
        blocks: [
          {
            kind: 'fact',
            title: 'Valuation context instead',
            items: [
              { text: `Current price: ${inr(s.price)} (demo data).` },
              { text: `P/E: about ${s.stats.pe}× vs a sector average of ~${s.stats.sectorPe}×.` },
            ],
          },
          {
            kind: 'uncertainty',
            items: [{ text: 'A stock’s future price depends on things no one knows yet — like future earnings and market mood.' }],
          },
        ],
        sources: sources(s, ['price', 'stats']),
        followUps: followUps(ctx, ['Is the valuation high?', 'What could matter from here?', 'What are the biggest risks?'], 'guardrail'),
      }
    case 'guarantee':
      return {
        ...common,
        lead: `No investment return can be guaranteed — including for ${s.shortName}.`,
        plain: level === 'simple' ? 'Stock prices go up and down. You can get back less than you put in.' : undefined,
        blocks: [
          {
            kind: 'fact',
            items: [
              {
                text: `Even recently, ${s.shortName} has moved ${pct(s.weeklyChange)} over the past week and ${pct(s.monthlyChange)} over the past month.`,
              },
            ],
          },
          { kind: 'risk', items: s.risks.slice(0, 3).map((r) => ({ title: r.title, text: pick(r.detail, level), meta: r.scope })) },
          { kind: 'uncertainty', items: [{ text: 'Stocks can lose value, sometimes quickly.' }] },
        ],
        sources: sources(s, ['price', 'stats']),
        followUps: followUps(ctx, ['What are the biggest risks?', 'What could matter from here?', 'Explain this like I’m new to investing.'], 'guardrail'),
      }
    case 'stock-picking':
      return {
        ...common,
        lead: 'I won’t pick stocks for you — but I can help you understand any stock in this prototype.',
        blocks: [
          {
            kind: 'list',
            title: 'Stocks you can explore with Lens',
            items: STOCKS.map((x) => ({ title: x.name, text: x.sector })),
          },
        ],
        sources: [],
        followUps: followUps(ctx, [`Why is ${s.shortName} moving?`, 'What are the biggest risks?', 'Explain this like I’m new to investing.'], 'guardrail'),
        footnote: SEBI_NOTE,
      }
    case 'out-of-scope':
      return {
        ...common,
        lead: 'Lens doesn’t cover crypto, derivatives (F&O) or trading tips.',
        blocks: [
          {
            kind: 'list',
            items: [{ text: 'It’s built to help you understand the stocks you’re looking at: why they’re moving, what changed, and what the risks are.' }],
          },
        ],
        sources: [],
        followUps: followUps(ctx, s.suggestedQuestions, 'guardrail'),
      }
  }
}

// ---------------------------------------------------------------------------------------------

function greeting(ctx: Ctx): LensAnswer {
  return {
    ...base(ctx, 'greeting'),
    lead: `Hi! Ask me anything about ${ctx.stock.shortName} — why it’s moving, what changed recently, or what the risks are.`,
    blocks: [],
    sources: [],
    followUps: followUps(ctx, ctx.stock.suggestedQuestions, 'greeting'),
  }
}

function thanks(ctx: Ctx): LensAnswer {
  return {
    ...base(ctx, 'thanks'),
    lead: 'Glad that helped. Anything else you’d like to understand?',
    blocks: [],
    sources: [],
    followUps: followUps(ctx, ctx.stock.suggestedQuestions, 'thanks'),
  }
}

function composeIntent(ctx: Ctx, intent: LensIntent): LensAnswer {
  switch (intent) {
    case 'why_moving':
      return whyMoving(ctx)
    case 'what_changed':
      return whatChanged(ctx)
    case 'sector_context':
      return sectorContext(ctx)
    case 'risks':
      return risks(ctx)
    case 'past_move':
      return pastMove(ctx)
    case 'outlook':
      return outlook(ctx)
    case 'management':
      return management(ctx)
    case 'earnings':
      return earnings(ctx)
    case 'valuation':
      return valuation(ctx)
    case 'about':
      return about(ctx)
    case 'beginner':
      return beginner(ctx)
    case 'glossary':
      return ctx.parsed.glossary ? glossary(ctx, ctx.parsed.glossary) : fallback(ctx)
    case 'compare':
      return compare(ctx)
    case 'index':
      return indexAnswer(ctx)
    case 'greeting':
      return greeting(ctx)
    case 'thanks':
      return thanks(ctx)
    case 'unknown_entity':
      return unknownEntity(ctx)
    default:
      return fallback(ctx)
  }
}

/** Entry point: question in, grounded structured answer out. Pure and synchronous (easy to test). */
export function composeAnswer(req: LensRequest): LensAnswer {
  const pageStock = getStock(req.stockId) ?? STOCKS[0]
  const parsed = parseQuestion(req.question)
  const mentioned = parsed.stockIds.length === 1 ? getStock(parsed.stockIds[0]) : undefined
  const stock = mentioned ?? pageStock
  const level: ExplainLevel = parsed.wantsSimple ? 'simple' : req.level
  const ctx: Ctx = { stock, pageStock, level, parsed, req }

  // 1. Safety first: advice, predictions, targets and guarantees never reach the normal path.
  const kind = detectGuardrail(req.question)
  if (kind) return guardrail(ctx, kind)

  // 2. A question about a specific timeline event ("Explain: Q2 results announced (Oct 3)").
  const event = stock.recentEvents.find((e) => parsed.normalised.includes(normalise(e.title)))
  if (event) {
    const intent: LensIntent = event.type === 'results' ? 'earnings' : event.type === 'management' ? 'management' : 'what_changed'
    return eventAnswer(ctx, intent, event.id, ['Why did this stock move today?', 'What are the biggest risks?', 'What changed in the last 7 days?'])
  }

  // 3. "Explain that simply" — re-explain the previous answer in plain language.
  if (parsed.intent === 'beginner' && parsed.refersBack) {
    const last = [...req.history].reverse().find((m) => m.role === 'lens' && m.answer)?.answer
    if (last && REEXPLAINABLE.includes(last.intent)) {
      const prevStock = getStock(last.stockId) ?? stock
      const answer = composeIntent({ ...ctx, stock: prevStock, level: 'simple' }, last.intent)
      return { ...answer, note: 'Simpler version of the previous answer' }
    }
  }

  return composeIntent(ctx, parsed.intent)
}

/** Glossary lookups used by the UI (kept here so UI never needs to reach into engine internals). */
export { getGlossaryEntry }
