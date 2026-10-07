import type { Stock } from '../types'

export const iciciBank: Stock = {
  id: 'icici-bank',
  name: 'ICICI Bank',
  shortName: 'ICICI Bank',
  ticker: 'ICICIBANK',
  exchange: 'NSE',
  sector: 'Banking',
  sectorIndex: 'Nifty Bank',
  price: 1384.5,
  dailyChange: 1.3,
  weeklyChange: 2.4,
  monthlyChange: 1.8,
  sectorChange: 1.1,
  sectorWeeklyChange: 2.0,
  marketChange: 0.4,
  marketWeeklyChange: 1.2,
  volumeVsAvg: 1.1,
  about:
    'ICICI Bank is one of India’s largest private-sector banks, offering loans, deposits, cards and other financial services to individuals and businesses.',
  stats: { marketCap: '₹9.9L Cr', pe: 19.1, pb: 3.1, dividendYield: 0.8, roe: 17.2, sectorPe: 17.5 },
  chartAnchors: {
    '1D': [1366.72, 1372, 1369, 1378, 1383, 1380, 1388, 1384.5],
    '1W': [1352.05, 1349.6, 1361.8, 1366.72, 1384.5],
    '1M': [1360.02, 1371, 1362, 1338, 1322, 1331, 1352.05, 1384.5],
    '1Y': [1180, 1214, 1248, 1236, 1290, 1332, 1376, 1418, 1392, 1355, 1342, 1384.5],
  },
  lensSummary: {
    standard:
      'ICICI Bank moved roughly in line with the banking sector today. Most of the move appears sector-wide rather than specific to the bank.',
    simple:
      'ICICI Bank went up about as much as other banks today. That suggests the rise is mostly about banks in general.',
  },
  lensPrompt: 'Is this sector-wide?',
  whyMoving: {
    headline: 'Mostly moving with the banking sector.',
    drivers: [
      {
        id: 'sector',
        title: 'Banking stocks rose',
        text: {
          standard:
            'Nifty Bank rose 1.1% and ICICI Bank rose 1.3% — close to the sector. Most of the move appears sector-wide.',
          simple: 'Bank stocks went up together today. ICICI Bank rose about as much as the group.',
        },
        evidence: 'strong',
        basis: 'Nifty Bank index data (today)',
      },
      {
        id: 'update',
        title: 'Steady business update',
        text: {
          standard:
            'Its quarterly business update (Oct 3) showed steady loan and deposit growth, which may have supported sentiment this week.',
          simple: 'The bank recently shared early numbers showing its loans and deposits kept growing steadily.',
        },
        evidence: 'moderate',
        basis: 'Quarterly business update (Oct 3)',
        eventIds: ['icici-update'],
      },
    ],
    uncertainty: {
      standard:
        'When a stock moves roughly in line with its sector, company-specific news may have played only a small role. The exact cause can’t be established.',
      simple: 'When a stock moves just like its group, it’s hard to say anything special happened at the company.',
    },
  },
  recentEvents: [
    {
      id: 'icici-sector-up',
      date: 'Oct 5',
      daysAgo: 2,
      type: 'sector',
      title: 'Banking stocks move higher',
      summary: 'Nifty Bank rose as several large lenders reported steady quarterly business updates.',
      whatHappened:
        'The Nifty Bank index closed higher after several large private lenders published quarterly business updates showing steady loan and deposit growth.',
      whyItMatters: {
        standard: 'Sector-wide strength tends to lift individual bank stocks, including ICICI Bank.',
        simple: 'When most banks do well on the same day, each bank’s stock tends to rise with the group.',
      },
      unclear: 'Sector-wide moods can shift quickly and don’t always reflect lasting changes in the business.',
      sourceType: 'Index data (illustrative)',
    },
    {
      id: 'icici-update',
      date: 'Oct 3',
      daysAgo: 4,
      type: 'company',
      title: 'Quarterly business update',
      summary: 'Provisional figures showed steady growth in loans and deposits.',
      whatHappened:
        'ICICI Bank published provisional end-of-quarter figures showing loans and deposits growing at a steady pace compared with a year earlier.',
      whyItMatters: {
        standard: 'Steady growth suggests the core business is on track ahead of full quarterly results.',
        simple: 'Early numbers suggest the bank’s main business is growing as usual.',
      },
      unclear: 'Provisional numbers can be revised. Profitability will only be clear in the full results.',
      sourceType: 'Exchange filing (illustrative)',
    },
    {
      id: 'icici-date',
      date: 'Sep 29',
      daysAgo: 8,
      type: 'company',
      title: 'Results date announced',
      summary: 'The bank said its board will consider Q2 results on Oct 18.',
      whatHappened: 'ICICI Bank informed the exchanges that its board will meet on Oct 18 to consider Q2 results.',
      whyItMatters: {
        standard: 'Results can cause larger-than-usual price moves in either direction.',
        simple: 'Stocks sometimes move a lot when companies report results.',
      },
      unclear: 'The content of the results — and how the market reacts — isn’t known in advance.',
      sourceType: 'Exchange filing (illustrative)',
    },
    {
      id: 'icici-sept',
      date: 'Sep 22',
      daysAgo: 15,
      type: 'sector',
      title: 'Banking stocks fall on margin worries',
      summary: 'The banking index fell over the week amid concerns about margin pressure across lenders.',
      whatHappened:
        'Nifty Bank declined over the week as investors grew concerned that lenders’ margins could narrow. ICICI Bank fell with the sector.',
      whyItMatters: {
        standard: 'Shows how sector-wide concerns can move individual bank stocks.',
        simple: 'When people worry about all banks, each bank’s stock tends to fall.',
      },
      unclear: 'Concerns about future margins are expectations, which can change as new results come in.',
      sourceType: 'Index data (illustrative)',
    },
  ],
  risks: [
    {
      id: 'sector',
      title: 'Moves closely with the sector',
      detail: {
        standard:
          'Most of today’s rise appears sector-wide. If banking sentiment turns, the stock may fall with it regardless of company performance.',
        simple: 'This stock tends to move with other banks — up or down.',
      },
      scope: 'Sector',
    },
    {
      id: 'valuation',
      title: 'Valuation is above the sector average',
      detail: {
        standard:
          'At about 19.1× earnings vs a sector average of ~17.5×, expectations are already somewhat higher than for a typical bank.',
        simple: 'Compared with what it earns, this stock costs a bit more than an average bank stock.',
      },
      scope: 'Company',
    },
    {
      id: 'asset-quality',
      title: 'Asset quality can change',
      detail: {
        standard: 'If more borrowers struggle to repay, bad loans can rise and profits can fall.',
        simple: 'If people can’t repay their loans, the bank loses money.',
      },
      scope: 'Company',
    },
    {
      id: 'reversal',
      title: 'Past performance isn’t a guarantee',
      detail: {
        standard: 'Recent gains don’t guarantee future returns. Short-term moves can reverse quickly.',
        simple: 'Going up recently doesn’t mean it will keep going up.',
      },
      scope: 'General',
    },
  ],
  facts: [
    'ICICI Bank is at ₹1,384.50, up 1.3% today.',
    'Nifty Bank is up 1.1% and Nifty 50 is up 0.4% today.',
    'A quarterly business update on Oct 3 showed steady loan and deposit growth.',
    'Q2 results are scheduled for Oct 18.',
  ],
  interpretations: ['Because the stock moved close to the banking index, most of today’s move appears sector-wide.'],
  uncertainties: ['The exact cause of a single day’s movement can’t be established.'],
  watchpoints: [
    'Q2 results on Oct 18 — especially margins and bad-loan trends',
    'How the banking sector performs overall',
    'Changes in interest rates',
  ],
  pastMove: {
    period: 'September',
    change: -2.3,
    facts: ['ICICI Bank fell 2.3% in September.', 'Nifty Bank fell about 2.8% over the same period.'],
    interpretation: 'The decline was close to the sector’s, suggesting it was mostly driven by banking-sector sentiment.',
    uncertainty: 'These factors shouldn’t be treated as proof of a single cause for the price movement.',
  },
  peerIds: ['hdfc-bank'],
  suggestedQuestions: [
    'Why did this stock move today?',
    'Is this movement company-specific?',
    'What changed in the last 7 days?',
    'Explain this like I’m new to investing.',
    'What are the biggest risks?',
    'Compare with HDFC Bank',
  ],
  mockChatResponses: {
    about: {
      lead: 'ICICI Bank is one of India’s largest private-sector banks.',
      facts: ['It offers loans, deposits, cards and other financial services to individuals and businesses.'],
      plain: 'It’s a bank: it takes deposits and lends money out, earning interest on the loans.',
      sources: ['stats'],
    },
  },
}
