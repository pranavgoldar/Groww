import type { Stock } from '../types'

export const reliance: Stock = {
  id: 'reliance',
  name: 'Reliance Industries',
  shortName: 'Reliance',
  ticker: 'RELIANCE',
  exchange: 'NSE',
  sector: 'Energy & Conglomerate',
  sectorIndex: 'Nifty Energy',
  price: 1486.3,
  dailyChange: 1.2,
  weeklyChange: 2.2,
  monthlyChange: 3.4,
  sectorChange: 0.2,
  sectorWeeklyChange: 0.6,
  marketChange: 0.4,
  marketWeeklyChange: 1.2,
  volumeVsAvg: 1.2,
  about:
    'Reliance Industries is a conglomerate with three large businesses: oil-to-chemicals (refining and petrochemicals), telecom and digital services (Jio), and retail.',
  stats: { marketCap: '₹20.1L Cr', pe: 24.6, pb: 2.3, dividendYield: 0.4, roe: 9.1, sectorPe: 15.2 },
  chartAnchors: {
    '1D': [1468.68, 1472, 1470.4, 1478, 1483.5, 1480.2, 1489, 1486.3],
    '1W': [1454.31, 1459.8, 1466.2, 1468.68, 1486.3],
    '1M': [1437.43, 1429, 1441.6, 1452, 1446.3, 1458, 1454.31, 1486.3],
    '1Y': [1342, 1298, 1236, 1188, 1254, 1322, 1408, 1462, 1430, 1411, 1454.31, 1486.3],
  },
  lensSummary: {
    standard:
      'Reliance rose more than energy stocks and the overall market today. Improved refining margins may be one factor, but its mix of businesses makes a single cause hard to isolate.',
    simple:
      'Reliance went up more than similar companies today. Better profits in its oil business may be one reason, but it runs several big businesses, so it’s hard to be sure.',
  },
  lensPrompt: 'What’s driving the move?',
  whyMoving: {
    headline: 'Two possible factors — one stronger than the other.',
    drivers: [
      {
        id: 'refining',
        title: 'Refining margins improved',
        text: {
          standard:
            'Industry refining margins rose over the past week (Oct 6), which may support its oil-to-chemicals business — its largest by revenue.',
          simple:
            'The profit from turning crude oil into petrol and diesel went up recently. That’s Reliance’s biggest business.',
        },
        evidence: 'moderate',
        basis: 'Industry refining margin data (Oct 6)',
        eventIds: ['rel-grm'],
      },
      {
        id: 'telecom',
        title: 'Attention on telecom',
        text: {
          standard:
            'Recent subscriber data (Oct 5) and market commentary about mobile tariffs have drawn attention to Jio. No tariff change has been announced.',
          simple: 'People have been talking about whether mobile plans might get pricier, which could help Jio. Nothing is decided.',
        },
        evidence: 'limited',
        basis: 'Industry subscriber data (Oct 5); market commentary',
        eventIds: ['rel-jio'],
      },
    ],
    uncertainty: {
      standard:
        'Reliance has several large businesses, so its moves often reflect a mix of factors. Isolating one cause is especially hard — and energy stocks overall rose only 0.2%.',
      simple: 'Reliance does many different things, so it’s hard to point to one reason it moved.',
    },
  },
  recentEvents: [
    {
      id: 'rel-grm',
      date: 'Oct 6',
      daysAgo: 1,
      type: 'sector',
      title: 'Refining margins improve',
      summary: 'Benchmark refining margins rose over the past week.',
      whatHappened:
        'Industry benchmark refining margins — the profit refiners make per barrel of crude processed — rose over the past week.',
      whyItMatters: {
        standard: 'Refining is a large part of Reliance’s oil-to-chemicals business, so higher margins can support earnings.',
        simple: 'Reliance makes money turning crude oil into fuels. When that gets more profitable, it can earn more.',
      },
      unclear: 'Refining margins are volatile and can reverse within weeks.',
      sourceType: 'Industry margin data (illustrative)',
    },
    {
      id: 'rel-jio',
      date: 'Oct 5',
      daysAgo: 2,
      type: 'sector',
      title: 'Monthly telecom subscriber data',
      summary: 'Industry data showed Jio added mobile subscribers in August.',
      whatHappened: 'Monthly industry data released by the telecom regulator showed Jio added mobile subscribers in August.',
      whyItMatters: {
        standard: 'Subscriber growth is one signal of Jio’s competitive position.',
        simple: 'More people signing up for Jio is generally good for its telecom business.',
      },
      unclear: 'Subscriber numbers don’t directly show profitability, and data is released with a lag.',
      sourceType: 'Regulator data (illustrative)',
    },
    {
      id: 'rel-crude',
      date: 'Oct 1',
      daysAgo: 6,
      type: 'market',
      title: 'Crude oil prices eased',
      summary: 'Global crude oil prices fell over the week.',
      whatHappened: 'Global benchmark crude oil prices declined over the week.',
      whyItMatters: {
        standard: 'Lower crude prices reduce input costs for refiners, though the effect depends on fuel prices too.',
        simple: 'Crude oil is what Reliance buys to make fuel. When it gets cheaper, costs can go down.',
      },
      unclear: 'The net effect depends on how fuel prices move at the same time.',
      sourceType: 'Commodity price data (illustrative)',
    },
    {
      id: 'rel-energy',
      date: 'Sep 24',
      daysAgo: 13,
      type: 'company',
      title: 'New energy project update',
      summary: 'The company shared progress on its solar manufacturing plans.',
      whatHappened: 'Reliance shared a progress update on its planned solar module and battery manufacturing facilities.',
      whyItMatters: {
        standard: 'New energy is a longer-term growth area investors track, though it contributes little to current earnings.',
        simple: 'Reliance is building a clean-energy business. It doesn’t earn much yet, but people watch its progress.',
      },
      unclear: 'Timelines and returns for large new projects are uncertain.',
      sourceType: 'Company update (illustrative)',
    },
  ],
  risks: [
    {
      id: 'mix',
      title: 'Complex mix of businesses',
      detail: {
        standard: 'Results depend on energy, telecom and retail at once — weakness in one can offset strength in another.',
        simple: 'It runs several big businesses. One doing badly can cancel out another doing well.',
      },
      scope: 'Company',
    },
    {
      id: 'oil',
      title: 'Oil-linked earnings are volatile',
      detail: {
        standard: 'Refining margins swing with global oil and fuel prices, which can change quickly.',
        simple: 'Profits from oil can rise and fall quickly with world oil prices.',
      },
      scope: 'Sector',
    },
    {
      id: 'tariff',
      title: 'Counterpoint: tariff talk isn’t a decision',
      detail: {
        standard: 'Commentary about mobile tariff increases is speculative. No change has been announced.',
        simple: 'People talking about pricier mobile plans doesn’t mean it will happen.',
      },
      scope: 'Company',
    },
    {
      id: 'valuation',
      title: 'Valuation vs energy peers',
      detail: {
        standard:
          'At about 24.6× earnings, it trades well above the energy-sector average (~15.2×), partly reflecting its telecom and retail businesses.',
        simple: 'Compared with what it earns, Reliance costs more than a typical energy company.',
      },
      scope: 'Company',
    },
  ],
  facts: [
    'Reliance is at ₹1,486.30, up 1.2% today.',
    'Nifty Energy is up 0.2% and Nifty 50 is up 0.4% today.',
    'Industry refining margins rose over the past week.',
    'The stock is up 2.2% over the past week and 3.4% over the past month.',
  ],
  interpretations: [
    'Because the stock rose much more than energy stocks overall, the move appears mostly company-specific.',
    'Improved refining margins may be one supporting factor.',
  ],
  uncertainties: [
    'With several large businesses, isolating the cause of a single day’s move is especially hard.',
    'No telecom tariff change has been announced.',
  ],
  watchpoints: [
    'Refining margins and crude oil prices',
    'Any official announcement on mobile tariffs',
    'Growth in its retail business',
    'Its next quarterly results',
  ],
  pastMove: {
    period: 'September',
    change: 1.5,
    facts: ['Reliance rose 1.5% in September.', 'Nifty Energy rose about 0.4% over the same period.'],
    interpretation: 'The gain coincided with easing crude prices and continued attention on its telecom business.',
    uncertainty: 'These factors shouldn’t be treated as proof of a single cause for the price movement.',
  },
  peerIds: [],
  suggestedQuestions: [
    'What’s driving the move today?',
    'Is this movement company-specific?',
    'What changed in the last 7 days?',
    'Explain this like I’m new to investing.',
    'What are the biggest risks?',
    'What does Reliance do?',
  ],
  mockChatResponses: {
    about: {
      lead: 'Reliance Industries is a conglomerate with three large businesses.',
      facts: [
        'Oil-to-chemicals: refining crude oil into fuels and making petrochemicals.',
        'Jio: telecom and digital services.',
        'Reliance Retail: stores and online shopping.',
      ],
      plain: 'It’s like several big companies under one roof: fuel, mobile networks and shops.',
      sources: ['stats'],
    },
  },
}
