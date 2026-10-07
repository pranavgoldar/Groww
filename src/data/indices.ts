import type { MarketIndex } from './types'

export const INDICES: MarketIndex[] = [
  {
    id: 'nifty-50',
    name: 'Nifty 50',
    value: 25184.3,
    dailyChange: 0.4,
    weeklyChange: 1.2,
    description: 'An index of 50 large Indian companies, commonly used as a snapshot of the overall market.',
    chartAnchors: {
      '1D': [25083.97, 25120, 25096, 25142, 25171, 25152, 25196, 25184.3],
      '1W': [24885.67, 24862, 25034, 25083.97, 25184.3],
      '1M': [25010, 25124, 24988, 24796, 24712, 24790, 24885.67, 25184.3],
      '1Y': [24180, 23520, 22940, 23810, 24420, 24960, 25480, 25710, 25390, 24980, 24885.67, 25184.3],
    },
    context: {
      fact: 'Nifty 50 rose 0.4% today.',
      interpretation: 'Gains appear to have been led by banking stocks, while auto stocks were weaker.',
      uncertainty: 'An index reflects many companies at once — no single explanation captures its move.',
    },
    constituentIds: ['hdfc-bank', 'reliance', 'icici-bank', 'infosys', 'tata-motors'],
  },
  {
    id: 'nifty-bank',
    name: 'Nifty Bank',
    value: 56420.15,
    dailyChange: 1.1,
    weeklyChange: 2.0,
    description: 'Tracks the share prices of India’s largest listed banks. If it rises, banks in general are rising.',
    chartAnchors: {
      '1D': [55806.28, 55912, 55874, 56108, 56290, 56236, 56478, 56420.15],
      '1W': [55313.87, 55188, 55902, 55806.28, 56420.15],
      '1M': [56120, 56290, 55720, 54980, 54610, 54890, 55313.87, 56420.15],
      '1Y': [51240, 50380, 49620, 51480, 52960, 54210, 55880, 57140, 56420, 55560, 55313.87, 56420.15],
    },
    context: {
      fact: 'Nifty Bank rose 1.1% today, more than the Nifty 50 (+0.4%).',
      interpretation:
        'Large private banks led the gains after steady quarterly updates and results commentary from some lenders.',
      uncertainty: 'Sector-wide moves can reflect broad sentiment, which can shift quickly.',
    },
    constituentIds: ['hdfc-bank', 'icici-bank'],
  },
]

export function getIndex(id: string | undefined): MarketIndex | undefined {
  return INDICES.find((i) => i.id === id)
}

export const INDEX_ALIASES: Record<string, string[]> = {
  'nifty-bank': ['nifty bank', 'bank nifty', 'banknifty', 'banking index'],
  'nifty-50': ['nifty 50', 'nifty50', 'nifty fifty', 'nifty', 'the market', 'overall market', 'stock market', 'broader market', 'whole market'],
}
