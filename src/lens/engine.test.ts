import { describe, expect, it } from 'vitest'
import { composeAnswer } from './compose'
import { parseQuestion } from './intents'
import { detectGuardrail, enforcePolicy, violatesPolicy } from './safety'
import type { ChatMessage, LensAnswer, LensRequest } from './types'

function ask(question: string, stockId = 'hdfc-bank', extra: Partial<LensRequest> = {}): LensAnswer {
  return composeAnswer({ question, stockId, level: 'standard', familiarity: 'basics', history: [], ...extra })
}

function text(a: LensAnswer): string {
  return [a.lead, a.plain ?? '', ...a.blocks.flatMap((b) => b.items.map((i) => `${i.title ?? ''} ${i.text}`))].join(' ')
}

describe('advice avoidance', () => {
  it.each([
    'Should I buy HDFC Bank?',
    'Should I buy this?',
    'Is it a good time to sell?',
    'Is HDFC Bank a good investment?',
    'buy or sell?',
    'Should I hold?',
  ])('declines to give a buy/sell call: %s', (q) => {
    const a = ask(q)
    expect(a.guardrail).toBe('advice')
    expect(a.lead).toMatch(/won’t tell you whether to buy or sell/)
    expect(a.footnote).toMatch(/SEBI-registered/)
  })

  it.each(['Which stock should I buy?', 'Best stocks to buy now', 'Recommend me a stock', 'any multibagger?'])(
    'does not pick stocks: %s',
    (q) => expect(ask(q).guardrail).toBe('stock-picking'),
  )
})

describe('uncertainty handling — no predictions, targets or guarantees', () => {
  it.each(['Will it go up tomorrow?', 'Will it rise tomorrow?', 'Where will the price be next week?', 'Predict the price'])(
    'refuses to predict: %s',
    (q) => {
      const a = ask(q)
      expect(a.guardrail).toBe('prediction')
      expect(a.lead).toMatch(/can’t be predicted reliably/)
    },
  )

  it.each(['What is the target price?', 'Will it reach 2000?', 'What is its fair value?'])('no price targets: %s', (q) =>
    expect(ask(q).guardrail).toBe('target-price'),
  )

  it.each(['Are returns guaranteed?', 'Is this a safe investment?', 'Can I double my money?'])('no guarantees: %s', (q) => {
    const a = ask(q)
    expect(a.guardrail).toBe('guarantee')
    expect(a.lead).toMatch(/can be guaranteed/)
  })

  it('keeps crypto / F&O out of scope', () => {
    expect(ask('What about bitcoin?').guardrail).toBe('out-of-scope')
    expect(ask('Give me F&O tips').guardrail).toBe('out-of-scope')
  })
})

describe('grounding — answers come from the stock’s own data', () => {
  it('explains why HDFC Bank is moving with fact / interpretation / uncertainty', () => {
    const a = ask('Why is HDFC Bank moving?')
    expect(a.intent).toBe('why_moving')
    expect(a.lead).toContain('up 2.4% today')
    const kinds = a.blocks.map((b) => b.kind)
    expect(kinds).toEqual(['fact', 'interpretation', 'uncertainty'])
    expect(a.sources.some((s) => s.kind === 'event')).toBe(true)
  })

  it('answers what changed with the last-7-day timeline only', () => {
    const a = ask('What changed in the last 7 days?')
    expect(a.intent).toBe('what_changed')
    const timeline = a.blocks.find((b) => b.kind === 'fact')!
    expect(timeline.items).toHaveLength(4)
    expect(text(a)).not.toContain('Sep 22')
  })

  it('classifies HDFC Bank’s move as partly sector-wide', () => {
    const a = ask('Is this movement company-specific?')
    expect(a.intent).toBe('sector_context')
    expect(a.lead).toBe('Partly sector-wide, partly company-specific.')
  })

  it('classifies ICICI Bank as mostly sector-wide and Infosys as quiet', () => {
    expect(ask('Is this company-specific?', 'icici-bank').lead).toBe('Mostly sector-wide.')
    expect(ask('Is this company-specific?', 'infosys').lead).toBe('Little movement.')
  })

  it('always lists risks', () => {
    const a = ask('What are the biggest risks?')
    expect(a.intent).toBe('risks')
    expect(a.blocks.find((b) => b.kind === 'risk')!.items.length).toBeGreaterThanOrEqual(3)
  })

  it('handles the last-month question with hedged causality', () => {
    const a = ask('Why did HDFC Bank fall last month?')
    expect(a.intent).toBe('past_move')
    expect(a.lead).toContain('fell 3.6% in September')
    expect(text(a)).toMatch(/shouldn’t be treated as proof of a single cause/)
  })

  it('corrects a false premise instead of inventing a reason', () => {
    expect(ask('Why is HDFC Bank falling today?').lead).toMatch(/Quick correction: HDFC Bank is up/)
    expect(ask('Why did Reliance fall last month?', 'reliance').lead).toMatch(/actually rose/)
  })

  it('does not invent management commentary it does not have', () => {
    const a = ask('What did management say?', 'icici-bank')
    expect(a.intent).toBe('fallback')
    expect(a.lead).toMatch(/doesn’t include recent management commentary/)
  })

  it('refuses to guess about companies outside the prototype', () => {
    const a = ask('Why is Zomato up today?')
    expect(a.intent).toBe('unknown_entity')
    expect(a.lead).toMatch(/don’t have information on Zomato/)
  })

  it('does not confuse Tata Steel with Tata Motors', () => {
    expect(ask('How is Tata Steel doing?', 'tata-motors').intent).toBe('unknown_entity')
  })

  it('switches context when another prototype stock is named', () => {
    const a = ask('Why is Reliance moving?')
    expect(a.stockId).toBe('reliance')
    expect(a.note).toMatch(/Reliance Industries/)
  })

  it('falls back honestly on unrelated questions', () => {
    expect(ask('What is the capital of France?').intent).toBe('fallback')
  })
})

describe('beginner comprehension', () => {
  it('gives a plain-language overview', () => {
    const a = ask('Explain this like I’m new to investing.')
    expect(a.intent).toBe('beginner')
    expect(text(a)).toMatch(/plain words/)
  })

  it('re-explains the previous answer simply', () => {
    const prev = ask('What are the biggest risks?')
    const history: ChatMessage[] = [
      { id: '1', role: 'user', text: 'What are the biggest risks?' },
      { id: '2', role: 'lens', answer: prev },
    ]
    const a = ask('Explain that simply', 'hdfc-bank', { history })
    expect(a.intent).toBe('risks')
    expect(a.note).toMatch(/Simpler version/)
  })

  it('defines jargon on request', () => {
    const a = ask('What is P/E?')
    expect(a.intent).toBe('glossary')
    expect(text(a)).toMatch(/19.8/)
    expect(ask('What does NIM mean?').intent).toBe('glossary')
  })

  it('uses plain variants when the explanation level is simple', () => {
    const a = ask('Why did this stock move today?', 'hdfc-bank', { level: 'simple' })
    expect(a.plain).toBeTruthy()
  })
})

describe('intent routing for suggested questions', () => {
  it.each([
    ['Why did this stock move today?', 'why_moving'],
    ['What changed in the last 7 days?', 'what_changed'],
    ['Is this movement company-specific?', 'sector_context'],
    ['What did management say?', 'management'],
    ['What are the biggest risks?', 'risks'],
    ['What could matter from here?', 'outlook'],
    ['Is the valuation high?', 'valuation'],
    ['What does Reliance do?', 'about'],
    ['Compare with HDFC Bank', 'compare'],
    ['How is the market doing today?', 'index'],
  ])('%s → %s', (q, intent) => expect(parseQuestion(q).intent).toBe(intent))
})

describe('output policy', () => {
  it('detects banned phrasing from any provider', () => {
    const bad: LensAnswer = { intent: 'why_moving', lead: 'You should buy this stock now.', blocks: [], sources: [], followUps: [] }
    expect(violatesPolicy(bad)).toBe(true)
    expect(enforcePolicy(bad).intent).toBe('guardrail')
  })

  it('never produces banned phrasing for the evaluation questions', () => {
    const questions = [
      'Why is HDFC Bank moving?',
      'What changed recently?',
      'Is this company-specific?',
      'What are the risks?',
      'Should I buy this?',
      'Will it rise tomorrow?',
      'Explain this to me like I’m new.',
    ]
    for (const stock of ['hdfc-bank', 'reliance', 'tata-motors', 'infosys', 'icici-bank'])
      for (const q of questions) expect(violatesPolicy(ask(q, stock))).toBe(false)
  })

  it('does not flag ordinary questions as advice', () => {
    expect(detectGuardrail('Will margins hold steady?')).toBeNull()
    expect(detectGuardrail('What changed in the last 7 days?')).toBeNull()
    expect(detectGuardrail('Why are people buying banking stocks?')).toBeNull()
  })
})
