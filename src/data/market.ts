/** Demo "market day" metadata and the home screen's market context. */

export const DEMO_DAY = {
  label: 'Wed, 7 Oct',
  note: 'Demo data · Not real-time',
}

export interface MarketStory {
  id: string
  title: string
  detail: string
  /** Where tapping the story leads. */
  to: string
  linkLabel: string
}

export const MARKET_SUMMARY = 'Markets rose slightly today, led by banks. Auto stocks were weaker.'

export const MARKET_STORIES: MarketStory[] = [
  {
    id: 'banks',
    title: 'Banks led the market higher',
    detail: 'Nifty Bank +1.1% vs Nifty 50 +0.4%',
    to: '/index/nifty-bank',
    linkLabel: 'See banks',
  },
  {
    id: 'autos',
    title: 'Auto stocks were weaker',
    detail: 'Nifty Auto −0.6% · Tata Motors −1.7%',
    to: '/stock/tata-motors/lens',
    linkLabel: 'What changed?',
  },
  {
    id: 'it',
    title: 'IT stocks were flat before results',
    detail: 'Nifty IT +0.3% · Infosys reports Oct 16',
    to: '/stock/infosys/lens',
    linkLabel: 'Context',
  },
]

/** The three stocks featured on Home under "Stocks worth understanding". */
export const FEATURED_STOCK_IDS = ['hdfc-bank', 'tata-motors', 'reliance']
