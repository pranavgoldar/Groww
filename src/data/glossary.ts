import type { KeyStats } from './types'

export interface GlossaryEntry {
  id: string
  term: string
  /** Phrases that should resolve to this entry (lower-case). The first is the canonical match. */
  aliases: string[]
  definition: string
  /** Optional stock stat that illustrates the term. */
  stat?: keyof Omit<KeyStats, 'sectorPe'>
  /** Set to false for everyday words that shouldn't be underlined in running text. */
  inline?: boolean
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'nim',
    term: 'Net interest margin',
    aliases: ['net interest margin', 'nim'],
    definition:
      'For a bank, the gap between the interest it earns on loans and the interest it pays on deposits, as a share of its loans. A higher margin means more profit from lending.',
  },
  {
    id: 'margin',
    term: 'Margin',
    aliases: ['margins', 'margin'],
    definition:
      'The share of revenue a company keeps as profit after certain costs. For banks, “margins” usually means net interest margin — how much they earn on loans after paying for deposits.',
  },
  {
    id: 'refining-margin',
    term: 'Refining margin',
    aliases: ['refining margins', 'refining margin'],
    definition:
      'The profit a refiner makes from turning a barrel of crude oil into fuels like petrol and diesel. It can change quickly with oil and fuel prices.',
  },
  {
    id: 'pe',
    term: 'P/E ratio',
    aliases: ['p/e ratio', 'price-to-earnings', 'price to earnings', 'p/e', 'pe ratio'],
    definition:
      'Share price divided by yearly earnings per share. It shows how many rupees investors pay for each ₹1 of yearly profit. A higher P/E often means investors expect more growth — or that the stock is pricier.',
    stat: 'pe',
  },
  {
    id: 'pb',
    term: 'P/B ratio',
    aliases: ['p/b ratio', 'price-to-book', 'price to book', 'p/b'],
    definition:
      'Share price compared with the company’s book value (what it owns minus what it owes) per share. Often used for banks.',
    stat: 'pb',
  },
  {
    id: 'valuation',
    term: 'Valuation',
    aliases: ['valuation'],
    definition:
      'How expensive a stock is relative to what the company earns or owns — usually judged with ratios like P/E. A “high” valuation means investors are paying more per rupee of profit.',
  },
  {
    id: 'market-cap',
    term: 'Market cap',
    aliases: ['market capitalisation', 'market capitalization', 'market cap'],
    definition: 'The total value of all a company’s shares: share price × number of shares.',
    stat: 'marketCap',
  },
  {
    id: 'dividend-yield',
    term: 'Dividend yield',
    aliases: ['dividend yield'],
    definition: 'The yearly dividend paid per share, as a percentage of the share price.',
    stat: 'dividendYield',
  },
  {
    id: 'roe',
    term: 'ROE',
    aliases: ['return on equity', 'roe'],
    definition:
      'Return on equity: yearly profit as a percentage of the shareholders’ money in the business. It shows how efficiently that money is used.',
    stat: 'roe',
  },
  {
    id: 'sector-index',
    term: 'Sector index',
    aliases: ['sector index', 'sector indices'],
    definition:
      'An index that tracks the share prices of companies in one industry — like Nifty Bank for banks. Comparing a stock with its sector index shows whether a move is unusual.',
  },
  {
    id: 'nifty-bank',
    term: 'Nifty Bank',
    aliases: ['nifty bank', 'bank nifty'],
    definition: 'An index tracking India’s largest listed banks. If it rises, banks in general are rising.',
  },
  {
    id: 'nifty-50',
    term: 'Nifty 50',
    aliases: ['nifty 50', 'nifty50'],
    definition: 'An index of 50 large Indian companies. It’s commonly used as a snapshot of the overall market.',
  },
  {
    id: 'nifty-auto',
    term: 'Nifty Auto',
    aliases: ['nifty auto'],
    definition: 'An index tracking large listed automobile companies in India.',
  },
  {
    id: 'nifty-it',
    term: 'Nifty IT',
    aliases: ['nifty it'],
    definition: 'An index tracking large listed IT services companies in India.',
  },
  {
    id: 'nifty-energy',
    term: 'Nifty Energy',
    aliases: ['nifty energy'],
    definition: 'An index tracking large listed energy companies in India, such as oil, gas and power companies.',
  },
  {
    id: 'sector',
    inline: false,
    term: 'Sector',
    aliases: ['sector'],
    definition: 'A group of companies in the same industry, like banks or carmakers. They’re often affected by the same news.',
  },
  {
    id: 'volume',
    term: 'Trading volume',
    aliases: ['trading volume', 'volume'],
    definition:
      'The number of shares bought and sold in a period. High volume means a lot of activity — but it doesn’t tell you whether news is good or bad.',
  },
  {
    id: 'results',
    inline: false,
    term: 'Quarterly results',
    aliases: ['quarterly results', 'q2 results', 'earnings', 'results'],
    definition:
      'Every three months, listed companies report their revenue, costs and profit. These reports are often called results or earnings.',
  },
  {
    id: 'sentiment',
    term: 'Sentiment',
    aliases: ['sentiment'],
    definition:
      'The general mood of investors — optimistic or worried. Sentiment can move prices even when nothing about the business has changed.',
  },
  {
    id: 'deposits',
    inline: false,
    term: 'Deposits',
    aliases: ['deposits'],
    definition: 'Money customers keep in a bank. Banks lend this money out and earn interest on the loans.',
  },
  {
    id: 'asset-quality',
    term: 'Asset quality',
    aliases: ['asset quality', 'bad loans'],
    definition:
      'For a bank, how likely borrowers are to repay their loans. Worse asset quality means more loans that may not be repaid.',
  },
  {
    id: 'analyst-call',
    term: 'Analyst call',
    aliases: ['analyst call', 'earnings call'],
    definition:
      'A call where company management discusses results or plans and answers questions from analysts and investors.',
  },
  {
    id: 'provisional',
    inline: false,
    term: 'Provisional figures',
    aliases: ['provisional figures', 'provisional'],
    definition: 'Early numbers a company shares before final results. They can be revised later.',
  },
  {
    id: 'guidance',
    term: 'Guidance',
    aliases: ['revenue guidance', 'guidance'],
    definition: 'A company’s own forecast of how it expects to perform. It’s an expectation, not a guarantee.',
  },
  {
    id: 'input-costs',
    term: 'Input costs',
    aliases: ['input costs', 'input cost'],
    definition: 'What a company pays for raw materials — like steel for carmakers or crude oil for refiners.',
  },
  {
    id: 'tariffs',
    term: 'Tariffs (telecom)',
    aliases: ['mobile tariffs', 'tariffs', 'tariff'],
    definition: 'For telecom companies, the prices customers pay for mobile plans.',
  },
  {
    id: 'exports',
    inline: false,
    term: 'Exports',
    aliases: ['exports'],
    definition: 'Products sold to customers in other countries.',
  },
  {
    id: 'outperform',
    term: 'Outperform',
    aliases: ['outperforming', 'outperformed', 'outperform'],
    definition: 'To do better than a comparison — like a stock rising more than its sector index.',
  },
  {
    id: '52w',
    term: '52-week range',
    aliases: ['52-week range', '52-week high', '52-week low', '52w'],
    definition: 'The lowest and highest prices a stock traded at over the past year.',
  },
  {
    id: 'volatility',
    term: 'Volatility',
    aliases: ['volatile', 'volatility'],
    definition: 'How much and how quickly a price swings up and down. More volatile = bigger swings.',
  },
]

/** All aliases, longest first — used for answering "what is X?" questions. */
export const GLOSSARY_ALIASES: Array<{ alias: string; entry: GlossaryEntry }> = GLOSSARY.flatMap((entry) =>
  entry.aliases.map((alias) => ({ alias, entry })),
).sort((a, b) => b.alias.length - a.alias.length)

/** Aliases that get underlined (tap-to-define) inside running text. */
export const INLINE_GLOSSARY_ALIASES = GLOSSARY_ALIASES.filter((a) => a.entry.inline !== false)

export function findGlossaryEntry(query: string): GlossaryEntry | undefined {
  const q = query.toLowerCase()
  return GLOSSARY_ALIASES.find(({ alias }) => new RegExp(`(^|[^a-z0-9])${escapeRegExp(alias)}([^a-z0-9]|$)`).test(q))?.entry
}

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY.find((g) => g.id === id)
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
}
