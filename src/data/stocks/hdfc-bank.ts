import type { Stock } from '../types'

export const hdfcBank: Stock = {
  id: 'hdfc-bank',
  name: 'HDFC Bank',
  shortName: 'HDFC Bank',
  ticker: 'HDFCBANK',
  exchange: 'NSE',
  sector: 'Banking',
  sectorIndex: 'Nifty Bank',
  price: 1842.0,
  dailyChange: 2.4,
  weeklyChange: 3.1,
  monthlyChange: -1.2,
  sectorChange: 1.1,
  sectorWeeklyChange: 2.0,
  marketChange: 0.4,
  marketWeeklyChange: 1.2,
  volumeVsAvg: 1.6,
  about:
    'HDFC Bank is one of India’s largest private-sector banks. It earns most of its income from lending to individuals and businesses, funded largely by customer deposits. It merged with its parent, HDFC Ltd, in 2023.',
  stats: { marketCap: '₹14.1L Cr', pe: 19.8, pb: 2.6, dividendYield: 1.1, roe: 14.5, sectorPe: 17.5 },
  chartAnchors: {
    '1D': [1798.83, 1806, 1801, 1814, 1829, 1825, 1838, 1846, 1842],
    '1W': [1786.61, 1779.2, 1801.5, 1798.83, 1842],
    '1M': [1864.37, 1871, 1848, 1812, 1776, 1752, 1768, 1786.61, 1842],
    '1Y': [1678, 1646, 1612, 1668, 1724, 1790, 1862, 1951, 1904, 1853, 1786, 1842],
  },
  lensSummary: {
    standard:
      'HDFC Bank rose more than the banking sector today. Recent comments on margins and a sector-wide rise appear to be the main factors.',
    simple:
      'HDFC Bank went up more than other banks today. Better news about its profits and a good day for banks overall seem to explain most of it.',
  },
  lensPrompt: 'Why is it moving?',
  whyMoving: {
    headline: 'Three factors stand out.',
    drivers: [
      {
        id: 'margins',
        title: 'Margin outlook improved',
        text: {
          standard:
            'Management’s comments on margins (Oct 6), after stable Q2 margins, appear to have improved sentiment around the stock.',
          simple:
            'The bank said the profit it makes on loans may stop shrinking. Investors seemed to take that as good news.',
        },
        evidence: 'moderate',
        basis: 'Analyst call (Oct 6) and Q2 results (Oct 3)',
        eventIds: ['hdfc-mgmt', 'hdfc-q2'],
      },
      {
        id: 'sector',
        title: 'Banking stocks rose too',
        text: {
          standard:
            'The broader banking sector also traded higher today — Nifty Bank rose 1.1%. Part of HDFC Bank’s move may reflect that.',
          simple:
            'Most bank stocks went up today, not just HDFC Bank. So part of this rise is about banks in general.',
        },
        evidence: 'strong',
        basis: 'Nifty Bank index data (today)',
      },
      {
        id: 'volume',
        title: 'More trading than usual',
        text: {
          standard:
            'Trading volume was about 1.6× its 20-day average. That points to heightened investor attention, but volume alone doesn’t explain direction.',
          simple:
            'Many more shares were bought and sold than on a normal day. That shows people were paying attention — but not why.',
        },
        evidence: 'limited',
        basis: 'Trading volume data (today)',
      },
    ],
    uncertainty: {
      standard:
        'Short-term price moves usually have several causes at once. These factors coincided with today’s move — they don’t prove what caused it.',
      simple:
        'No one can say for sure why a stock moved on one day. These are likely reasons, not proven ones.',
    },
  },
  recentEvents: [
    {
      id: 'hdfc-mgmt',
      date: 'Oct 6',
      daysAgo: 1,
      type: 'management',
      title: 'Management comments on margins',
      summary: 'On an analyst call after market hours, management said margin pressure may ease gradually.',
      whatHappened:
        'Speaking to analysts after market hours, management said pressure on margins could ease gradually as higher-cost borrowings inherited from the 2023 merger mature and are replaced by deposits.',
      whyItMatters: {
        standard:
          'Margins have been a key investor concern since the merger. Commentary suggesting the pressure may ease appears to have been read positively.',
        simple:
          'Investors have worried the bank earns less on each loan since its merger. Hearing that this may improve seems to have reassured them.',
      },
      unclear:
        'This is management’s expectation, not a result. Whether margins actually improve will only show up in future quarterly results.',
      sourceType: 'Analyst call transcript (illustrative)',
    },
    {
      id: 'hdfc-sector-up',
      date: 'Oct 5',
      daysAgo: 2,
      type: 'sector',
      title: 'Banking stocks move higher',
      summary: 'Nifty Bank rose as several large lenders reported steady quarterly business updates.',
      whatHappened:
        'The Nifty Bank index closed higher after several large private lenders published quarterly business updates showing steady loan and deposit growth.',
      whyItMatters: {
        standard:
          'When the whole sector moves, individual bank stocks often move with it — regardless of company-specific news.',
        simple: 'When most banks do well on the same day, each bank’s stock tends to rise with the group.',
      },
      unclear: 'Sector-wide moods can shift quickly and don’t always reflect lasting changes in the business.',
      sourceType: 'Index data (illustrative)',
    },
    {
      id: 'hdfc-q2',
      date: 'Oct 3',
      daysAgo: 4,
      type: 'results',
      title: 'Q2 results announced',
      summary: 'Profit broadly in line with expectations; margins stable versus last quarter.',
      whatHappened:
        'HDFC Bank reported results for the July–September quarter. Net profit grew broadly in line with analyst expectations, and net interest margin was reported as stable compared with the previous quarter. The stock rose 1.3% on the next trading day (Oct 5).',
      whyItMatters: {
        standard:
          'Stable margins eased a concern that had weighed on the stock in September. Results are the most direct evidence of how the business is doing.',
        simple:
          'Every three months the bank reports how much it earned. This report was roughly what people expected, which calmed some worries.',
      },
      unclear:
        'One quarter of stable margins doesn’t confirm a trend. The market’s reaction to results can also fade.',
      sourceType: 'Quarterly results filing (illustrative)',
    },
    {
      id: 'hdfc-update',
      date: 'Oct 1',
      daysAgo: 6,
      type: 'company',
      title: 'Quarterly business update',
      summary: 'Provisional figures showed deposits growing faster than loans.',
      whatHappened:
        'The bank published provisional figures for loans and deposits at the end of the quarter. Deposits grew faster than loans compared with a year earlier.',
      whyItMatters: {
        standard:
          'Since the merger, investors have watched whether deposits keep pace with loans. Faster deposit growth can reduce reliance on costlier borrowing.',
        simple:
          'Banks lend out the money people deposit. More deposits means the bank can lend without borrowing expensive money.',
      },
      unclear: 'These are provisional numbers and can be revised in the final results.',
      sourceType: 'Exchange filing (illustrative)',
    },
    {
      id: 'hdfc-sept',
      date: 'Sep 22',
      daysAgo: 15,
      type: 'sector',
      title: 'Banking stocks fall on margin worries',
      summary: 'The banking index fell over the week amid concerns about margin pressure across lenders.',
      whatHappened:
        'Nifty Bank declined over the week as investors grew concerned that lenders’ margins could narrow. HDFC Bank fell alongside other large banks.',
      whyItMatters: {
        standard:
          'This helps explain the stock’s September decline — and why stable Q2 margins drew attention in October.',
        simple: 'This is part of why the stock fell last month before rising again this week.',
      },
      unclear: 'Concerns about future margins are expectations, which can change as new results come in.',
      sourceType: 'Index data (illustrative)',
    },
    {
      id: 'hdfc-market',
      date: 'Sep 16',
      daysAgo: 21,
      type: 'market',
      title: 'Broader market weakness',
      summary: 'Nifty 50 fell over several sessions; large financial stocks were among the decliners.',
      whatHappened:
        'The broader market declined over several sessions in mid-September. Large financial stocks, including HDFC Bank, were among the decliners.',
      whyItMatters: {
        standard: 'Market-wide declines can pull down individual stocks even without company news.',
        simple: 'When the whole market falls, most stocks fall with it — even if nothing changed at the company.',
      },
      unclear: 'Market-wide moves usually reflect many factors at once and rarely have a single cause.',
      sourceType: 'Index data (illustrative)',
    },
  ],
  risks: [
    {
      id: 'valuation',
      title: 'Valuation remains a consideration',
      detail: {
        standard:
          'At about 19.8× earnings, the stock trades above the sector average of ~17.5×. Whether that’s justified depends on future growth, which isn’t known.',
        simple:
          'Compared with what it earns, this stock costs a bit more than an average bank stock. That only makes sense if profits grow well — which no one can promise.',
      },
      scope: 'Company',
    },
    {
      id: 'trend',
      title: 'One quarter isn’t a trend',
      detail: {
        standard:
          'Margins were stable for one quarter. They could come under pressure again if deposit costs rise or loan growth slows.',
        simple: 'One good report doesn’t mean the next one will be good too.',
      },
      scope: 'Company',
    },
    {
      id: 'sector',
      title: 'Part of the move is sector-wide',
      detail: {
        standard:
          'Some of today’s rise likely reflects banking-sector sentiment, which can shift quickly and isn’t specific to HDFC Bank.',
        simple: 'Some of today’s rise happened because banks in general went up. That mood can change fast.',
      },
      scope: 'Sector',
    },
    {
      id: 'reversal',
      title: 'Short-term moves can reverse',
      detail: {
        standard:
          'Recent performance doesn’t guarantee future returns. The stock fell 3.6% in September before this week’s rebound.',
        simple: 'Going up this week doesn’t mean it will keep going up. It fell last month before rising again.',
      },
      scope: 'General',
    },
  ],
  facts: [
    'HDFC Bank is at ₹1,842, up 2.4% today.',
    'Nifty Bank is up 1.1% and Nifty 50 is up 0.4% today.',
    'Q2 results were announced on Oct 3; margins were reported stable versus the previous quarter.',
    'The stock is up 3.1% over the past week and down 1.2% over the past month.',
    'Trading volume today is about 1.6× its 20-day average.',
  ],
  interpretations: [
    'Today’s rise appears linked to improved sentiment around margins after management’s comments.',
    'Because the stock rose more than the banking index, part of the move may be specific to HDFC Bank.',
  ],
  uncertainties: [
    'The exact cause of a single day’s movement can’t be established.',
    'Whether margins keep improving will only be clear over the coming quarters.',
  ],
  watchpoints: [
    'Whether margins hold steady in the next quarterly results',
    'Deposit growth compared with loan growth',
    'How the banking sector performs overall',
    'Changes in interest rates, which affect what banks earn on loans',
  ],
  pastMove: {
    period: 'September',
    change: -3.6,
    facts: ['HDFC Bank fell 3.6% in September.', 'Nifty Bank fell about 2.8% over the same period.'],
    interpretation:
      'The decline coincided with weaker banking-sector sentiment and concerns about margin pressure across lenders (see Sep 22).',
    uncertainty: 'These factors shouldn’t be treated as proof of a single cause for the price movement.',
  },
  peerIds: ['icici-bank'],
  suggestedQuestions: [
    'Why did this stock move today?',
    'Explain this like I’m new to investing.',
    'What changed in the last 7 days?',
    'Is this movement company-specific?',
    'What did management say?',
    'What are the biggest risks?',
  ],
  mockChatResponses: {
    management: {
      lead: 'Management said pressure on margins may ease gradually.',
      facts: [
        'On an analyst call on Oct 6, management said margin pressure could ease as higher-cost borrowings from the 2023 merger mature.',
        'Q2 results (Oct 3) reported margins stable versus the previous quarter.',
      ],
      interpretations: [
        'Investors appear to have read the comments as a sign that the worst of the margin pressure may be behind the bank.',
      ],
      uncertainties: ['Management commentary describes expectations, not outcomes. Future results may differ.'],
      plain:
        'The bank’s leaders said the money it makes from loans may slowly improve. That’s their expectation — not a promise.',
      sources: ['hdfc-mgmt', 'hdfc-q2'],
      followUps: ['What is net interest margin?', 'What are the biggest risks?', 'Is this movement company-specific?'],
    },
    earnings: {
      lead: 'Q2 results were broadly in line with expectations, with stable margins.',
      facts: [
        'Results for the July–September quarter were announced on Oct 3.',
        'Net profit grew broadly in line with analyst expectations.',
        'Net interest margin was reported stable versus the previous quarter.',
        'The stock rose 1.3% on the next trading day (Oct 5).',
      ],
      interpretations: ['Stable margins eased a concern that had weighed on the stock in September.'],
      uncertainties: ['One quarter of stable margins doesn’t confirm a trend.'],
      plain:
        'Every three months, the bank reports what it earned. This time the numbers were about what people expected, and its profit on loans didn’t shrink.',
      sources: ['hdfc-q2'],
      followUps: ['What did management say?', 'Is the valuation high?', 'What are the biggest risks?'],
    },
    beginner: {
      lead: 'Here’s HDFC Bank’s day in plain words.',
      facts: ['HDFC Bank’s share price went up 2.4% today — each share costs about ₹43 more than yesterday.'],
      interpretations: [
        'The bank recently said it may earn a bit more on its loans in future. Investors seemed to like that.',
        'Most bank stocks went up today too, so part of the rise is about banks in general.',
      ],
      uncertainties: ['No one can know for sure why a price moved on one day, or what it will do next.'],
      sources: ['hdfc-mgmt', 'price', 'index'],
      followUps: ['What is a margin?', 'Why compare with other banks?', 'What are the biggest risks?'],
    },
    valuation: {
      lead: 'At about 19.8× earnings, HDFC Bank is priced above the banking-sector average (~17.5×).',
      facts: ['P/E: about 19.8 (demo data).', 'Sector average P/E: about 17.5.', 'Price-to-book: about 2.6.'],
      interpretations: ['A higher P/E usually means investors expect stronger or steadier future growth.'],
      uncertainties: ['Whether a valuation is “high” depends on growth that hasn’t happened yet.'],
      plain:
        'P/E tells you how many rupees investors pay for every ₹1 the company earns in a year. Here it’s about ₹19.8 — a bit more than for an average bank.',
      sources: ['stats'],
      followUps: ['What is P/E?', 'What are the biggest risks?', 'What changed in the last 7 days?'],
    },
    about: {
      lead: 'HDFC Bank is one of India’s largest private-sector banks.',
      facts: [
        'It earns most of its income from lending to individuals and businesses.',
        'Its lending is funded largely by customer deposits.',
        'It merged with its parent company, HDFC Ltd, in 2023.',
      ],
      plain: 'It’s a bank: it takes deposits from customers and lends that money out, earning interest on the loans.',
      sources: ['stats'],
      followUps: ['Why did this stock move today?', 'What is net interest margin?', 'What are the biggest risks?'],
    },
  },
}
