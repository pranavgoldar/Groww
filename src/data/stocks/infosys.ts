import type { Stock } from '../types'

export const infosys: Stock = {
  id: 'infosys',
  name: 'Infosys',
  shortName: 'Infosys',
  ticker: 'INFY',
  exchange: 'NSE',
  sector: 'IT Services',
  sectorIndex: 'Nifty IT',
  price: 1512.8,
  dailyChange: 0.2,
  weeklyChange: -1.1,
  monthlyChange: 2.4,
  sectorChange: 0.3,
  sectorWeeklyChange: -0.6,
  marketChange: 0.4,
  marketWeeklyChange: 1.2,
  volumeVsAvg: 0.8,
  about:
    'Infosys is one of India’s largest IT services companies. It earns most of its revenue from clients in North America and Europe, helping them build and run technology systems.',
  stats: { marketCap: '₹6.3L Cr', pe: 22.9, pb: 7.1, dividendYield: 2.8, roe: 29.8, sectorPe: 26.0 },
  chartAnchors: {
    '1D': [1509.78, 1514, 1511.2, 1508.6, 1513.4, 1510.9, 1512.8],
    '1W': [1529.62, 1524.1, 1517.3, 1509.78, 1512.8],
    '1M': [1477.34, 1468.2, 1489.6, 1503, 1521.4, 1534.8, 1529.62, 1512.8],
    '1Y': [1868, 1912, 1824, 1742, 1612, 1548, 1590, 1534, 1486, 1462, 1529.62, 1512.8],
  },
  lensSummary: {
    standard:
      'Infosys barely moved today, roughly in line with IT stocks. There’s no clear company-specific driver — small daily moves like this are often just noise.',
    simple:
      'Infosys hardly moved today, much like other IT companies. Nothing special seems to have happened — small changes like this are normal.',
  },
  lensPrompt: 'What’s the context?',
  whyMoving: {
    headline: 'No clear driver today.',
    drivers: [
      {
        id: 'sector',
        title: 'In line with IT stocks',
        text: {
          standard: 'Nifty IT rose 0.3% and Infosys rose 0.2%. The stock is moving with its sector.',
          simple: 'Other IT company stocks also moved very little today.',
        },
        evidence: 'strong',
        basis: 'Nifty IT index data (today)',
      },
      {
        id: 'results',
        title: 'Results are coming up',
        text: {
          standard:
            'Q2 results are scheduled for Oct 16. Stocks sometimes trade quietly in the days before results, though that’s a pattern, not a rule.',
          simple: 'The company reports its results next week. Sometimes stocks stay quiet before that.',
        },
        evidence: 'limited',
        basis: 'Results date filing (Oct 6)',
        eventIds: ['infy-date'],
      },
    ],
    uncertainty: {
      standard:
        'Small daily moves (under about 0.5%) are common and often don’t have an identifiable cause. Reading too much into them can be misleading.',
      simple: 'Tiny price changes happen every day and usually don’t mean anything on their own.',
    },
  },
  recentEvents: [
    {
      id: 'infy-date',
      date: 'Oct 6',
      daysAgo: 1,
      type: 'company',
      title: 'Results date announced',
      summary: 'The board will consider Q2 results on Oct 16.',
      whatHappened: 'Infosys informed the exchanges that its board will meet on Oct 16 to consider Q2 results.',
      whyItMatters: {
        standard: 'Results — and any update to the company’s revenue guidance — can move the stock significantly.',
        simple: 'When the company reports results next week, the stock may move more than usual.',
      },
      unclear: 'The content of the results, and the market’s reaction, isn’t known in advance.',
      sourceType: 'Exchange filing (illustrative)',
    },
    {
      id: 'infy-spending',
      date: 'Oct 1',
      daysAgo: 6,
      type: 'sector',
      title: 'Cautious client spending commentary',
      summary: 'Several global IT firms described client technology spending as cautious.',
      whatHappened:
        'Several global IT services firms said in recent updates that clients remain cautious about discretionary technology spending.',
      whyItMatters: {
        standard: 'Client budgets drive demand for IT services, so cautious spending can slow revenue growth across the sector.',
        simple: 'If big companies spend less on tech projects, IT firms like Infosys get less work.',
      },
      unclear: 'Commentary from other firms may not reflect Infosys’s own client mix.',
      sourceType: 'Industry commentary (illustrative)',
    },
    {
      id: 'infy-deal',
      date: 'Sep 25',
      daysAgo: 12,
      type: 'company',
      title: 'Multi-year client deal announced',
      summary: 'Infosys announced a multi-year technology deal with a European client.',
      whatHappened: 'Infosys announced a multi-year deal to manage technology operations for a European client.',
      whyItMatters: {
        standard: 'Large deals add to future revenue visibility, which investors track closely in IT services.',
        simple: 'A long contract means more predictable income for the next few years.',
      },
      unclear: 'Deal values and margins are often not fully disclosed.',
      sourceType: 'Company announcement (illustrative)',
    },
    {
      id: 'infy-rupee',
      date: 'Sep 17',
      daysAgo: 20,
      type: 'market',
      title: 'Rupee weakened against the dollar',
      summary: 'The rupee fell against the US dollar over the week.',
      whatHappened: 'The Indian rupee weakened against the US dollar over the week.',
      whyItMatters: {
        standard: 'IT companies earn largely in dollars, so a weaker rupee can raise the rupee value of their revenue.',
        simple: 'Infosys gets paid mostly in dollars. When the rupee is weaker, those dollars are worth more rupees.',
      },
      unclear: 'Companies often hedge currency exposure, which reduces the effect.',
      sourceType: 'Currency data (illustrative)',
    },
  ],
  risks: [
    {
      id: 'spending',
      title: 'Client spending is cautious',
      detail: {
        standard: 'If clients keep delaying technology projects, revenue growth could slow.',
        simple: 'If big clients spend less on tech, Infosys gets less work.',
      },
      scope: 'Sector',
    },
    {
      id: 'results',
      title: 'Results can move the stock sharply',
      detail: {
        standard: 'Q2 results on Oct 16 could cause a larger-than-usual move in either direction.',
        simple: 'When results come out next week, the price could jump or drop.',
      },
      scope: 'Company',
    },
    {
      id: 'currency',
      title: 'Currency swings',
      detail: {
        standard: 'Most revenue is in foreign currencies, so a stronger rupee can reduce reported earnings.',
        simple: 'If the rupee gets stronger, Infosys’s dollar income is worth fewer rupees.',
      },
      scope: 'Company',
    },
    {
      id: 'noise',
      title: 'Counterpoint: quiet days aren’t signals',
      detail: {
        standard: 'A flat day says little about the company either way. Avoid reading meaning into small moves.',
        simple: 'A day with almost no change doesn’t tell you much — good or bad.',
      },
      scope: 'General',
    },
  ],
  facts: [
    'Infosys is at ₹1,512.80, up 0.2% today.',
    'Nifty IT is up 0.3% and Nifty 50 is up 0.4% today.',
    'Q2 results are scheduled for Oct 16.',
    'The stock is down 1.1% over the past week and up 2.4% over the past month.',
  ],
  interpretations: ['The stock appears to be moving with IT stocks generally, with no clear company-specific driver today.'],
  uncertainties: ['Small daily moves often have no identifiable cause.'],
  watchpoints: [
    'Q2 results on Oct 16, including any change to revenue guidance',
    'Client spending trends in the US and Europe',
    'Large deal announcements',
    'The rupee–dollar exchange rate',
  ],
  pastMove: {
    period: 'September',
    change: 3.1,
    facts: ['Infosys rose 3.1% in September.', 'Nifty IT rose about 2.2% over the same period.'],
    interpretation: 'The gain coincided with a weaker rupee and a large deal announcement (Sep 25).',
    uncertainty: 'These factors shouldn’t be treated as proof of a single cause for the price movement.',
  },
  peerIds: [],
  suggestedQuestions: [
    'Why is Infosys barely moving?',
    'What changed in the last 7 days?',
    'Is this movement company-specific?',
    'Explain this like I’m new to investing.',
    'What are the biggest risks?',
    'What could matter from here?',
  ],
  mockChatResponses: {
    about: {
      lead: 'Infosys is one of India’s largest IT services companies.',
      facts: [
        'It helps businesses build and run their technology systems.',
        'Most of its revenue comes from clients in North America and Europe.',
      ],
      plain: 'Big companies around the world pay Infosys to build and look after their software and IT systems.',
      sources: ['stats'],
    },
  },
}
