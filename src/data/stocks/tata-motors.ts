import type { Stock } from '../types'

export const tataMotors: Stock = {
  id: 'tata-motors',
  name: 'Tata Motors',
  shortName: 'Tata Motors',
  ticker: 'TATAMOTORS',
  exchange: 'NSE',
  sector: 'Automobile',
  sectorIndex: 'Nifty Auto',
  price: 694.25,
  dailyChange: -1.7,
  weeklyChange: -3.4,
  monthlyChange: -5.2,
  sectorChange: -0.6,
  sectorWeeklyChange: -0.9,
  marketChange: 0.4,
  marketWeeklyChange: 1.2,
  volumeVsAvg: 1.4,
  about:
    'Tata Motors makes passenger cars, electric vehicles and commercial vehicles in India, and owns the UK-based luxury carmaker Jaguar Land Rover (JLR), which contributes a large share of its revenue.',
  stats: { marketCap: '₹2.6L Cr', pe: 9.6, pb: 2.1, dividendYield: 0.9, roe: 21.4, sectorPe: 24.0 },
  chartAnchors: {
    '1D': [706.26, 703, 705.5, 699, 696.4, 698.2, 693.1, 694.25],
    '1W': [718.69, 709.4, 704.8, 706.26, 694.25],
    '1M': [732.33, 738.5, 731, 724.2, 727.6, 716, 718.69, 694.25],
    '1Y': [802, 846, 812, 768, 724, 688, 662, 701, 744, 731, 718.69, 694.25],
  },
  lensSummary: {
    standard:
      'Tata Motors fell while the overall market rose. Softer monthly sales and weaker auto stocks may explain part of it, but there was no major company announcement today.',
    simple:
      'Tata Motors went down today even though the overall market went up. Weaker car sales may be part of the reason, but nothing big was announced today.',
  },
  lensPrompt: 'What changed?',
  whyMoving: {
    headline: 'Two factors stand out — but the evidence is limited.',
    drivers: [
      {
        id: 'sales',
        title: 'Softer monthly sales',
        text: {
          standard:
            'Its monthly sales update (Oct 1) showed domestic vehicle sales lower than a year earlier. That appears to have weighed on sentiment through the week.',
          simple: 'The company recently said it sold fewer cars in India than a year ago. Investors seem to be worried about that.',
        },
        evidence: 'moderate',
        basis: 'Monthly sales update (Oct 1)',
        eventIds: ['tm-sales'],
      },
      {
        id: 'sector',
        title: 'Auto stocks were weaker',
        text: {
          standard: 'Nifty Auto fell 0.6% today, so a smaller part of the decline may be sector-wide.',
          simple: 'Other carmaker stocks also dipped a little today, but not as much.',
        },
        evidence: 'strong',
        basis: 'Nifty Auto index data (today)',
      },
    ],
    uncertainty: {
      standard:
        'There was no major company announcement today. The exact cause of the fall is unclear — part of it may simply be continued selling after last week’s sales data.',
      simple: 'Nothing big was announced today, so we can’t be sure why it fell. These are possible reasons only.',
    },
  },
  recentEvents: [
    {
      id: 'tm-steel',
      date: 'Oct 6',
      daysAgo: 1,
      type: 'sector',
      title: 'Steel prices edged higher',
      summary: 'Prices of steel, a key input for carmakers, rose over the past month.',
      whatHappened: 'Domestic steel prices rose modestly over the past month, according to industry price data.',
      whyItMatters: {
        standard: 'Higher input costs can squeeze carmakers’ profit margins if they can’t raise prices.',
        simple: 'Cars are made of steel. If steel costs more, carmakers may earn less on each car.',
      },
      unclear: 'How much this affects Tata Motors depends on contracts and pricing, which aren’t public.',
      sourceType: 'Industry price data (illustrative)',
    },
    {
      id: 'tm-sector',
      date: 'Oct 5',
      daysAgo: 2,
      type: 'sector',
      title: 'Auto stocks mixed after monthly sales data',
      summary: 'September sales updates across automakers showed uneven demand.',
      whatHappened:
        'Automakers’ September sales updates showed mixed results: some segments grew while others slowed compared with a year earlier.',
      whyItMatters: {
        standard: 'Mixed data across the industry suggests demand is uneven, not uniformly weak.',
        simple: 'Some carmakers sold more and some sold less — demand isn’t the same everywhere.',
      },
      unclear: 'Monthly figures can swing with festival timing and new launches.',
      sourceType: 'Industry sales data (illustrative)',
    },
    {
      id: 'tm-sales',
      date: 'Oct 1',
      daysAgo: 6,
      type: 'company',
      title: 'Monthly sales update',
      summary: 'Domestic sales were lower than a year earlier; exports rose.',
      whatHappened:
        'Tata Motors reported September sales. Domestic vehicle sales were lower than in September last year, while exports increased.',
      whyItMatters: {
        standard: 'Domestic sales are a closely watched signal of demand for the company’s India business.',
        simple: 'Selling fewer cars in India can mean less money coming in for the company.',
      },
      unclear: 'One month of softer sales doesn’t establish a trend; festive-season demand may change the picture.',
      sourceType: 'Monthly sales filing (illustrative)',
    },
    {
      id: 'tm-price',
      date: 'Sep 29',
      daysAgo: 8,
      type: 'company',
      title: 'Price increase announced',
      summary: 'The company said it will raise prices on some models to offset input costs.',
      whatHappened: 'Tata Motors said it would raise prices on selected passenger vehicle models from October.',
      whyItMatters: {
        standard: 'Price increases can protect margins but may soften demand.',
        simple: 'Charging more per car can protect profits, but some buyers may wait or choose another brand.',
      },
      unclear: 'The effect on sales volumes won’t be visible for a few months.',
      sourceType: 'Company announcement (illustrative)',
    },
    {
      id: 'tm-global',
      date: 'Sep 18',
      daysAgo: 19,
      type: 'market',
      title: 'Global auto stocks under pressure',
      summary: 'International carmakers fell on concerns about demand in key export markets.',
      whatHappened:
        'Shares of several global carmakers declined over the week amid concerns about consumer demand in Europe and China.',
      whyItMatters: {
        standard: 'JLR sells heavily in these markets, so global demand matters for Tata Motors.',
        simple: 'Tata Motors owns a luxury car brand that sells abroad, so weak demand overseas can hurt it.',
      },
      unclear: 'Global sentiment doesn’t always translate into lower sales for a specific company.',
      sourceType: 'Global market data (illustrative)',
    },
  ],
  risks: [
    {
      id: 'demand',
      title: 'Demand could stay soft',
      detail: {
        standard: 'If domestic sales stay weak for several months, earnings could be affected.',
        simple: 'If fewer people keep buying its cars, the company will earn less.',
      },
      scope: 'Company',
    },
    {
      id: 'global',
      title: 'Exposure to global markets',
      detail: {
        standard:
          'A large share of revenue comes from JLR, which depends on demand in the UK, Europe, China and the US — and on currency movements.',
        simple: 'A big part of its money comes from selling luxury cars abroad, which depends on economies outside India.',
      },
      scope: 'Company',
    },
    {
      id: 'one-month',
      title: 'Counterpoint: don’t over-read one month',
      detail: {
        standard:
          'Monthly sales swing with festivals and model launches. One weak month doesn’t confirm a trend — the decline may overstate the change.',
        simple: 'Car sales go up and down from month to month. One slow month doesn’t mean things are getting worse.',
      },
      scope: 'General',
    },
    {
      id: 'reversal',
      title: 'Short-term moves can reverse',
      detail: {
        standard: 'Recent declines don’t predict future returns either. Short-term moves can reverse quickly.',
        simple: 'Falling this week doesn’t mean it will keep falling.',
      },
      scope: 'General',
    },
  ],
  facts: [
    'Tata Motors is at ₹694.25, down 1.7% today.',
    'Nifty Auto is down 0.6% while Nifty 50 is up 0.4% today.',
    'September sales (Oct 1): domestic sales lower than a year earlier; exports higher.',
    'The stock is down 3.4% over the past week and 5.2% over the past month.',
  ],
  interpretations: [
    'Softer domestic sales appear to have weighed on sentiment.',
    'Because the stock fell more than auto stocks overall, part of the move may be specific to Tata Motors.',
  ],
  uncertainties: [
    'There was no major company announcement today, so the cause of today’s fall is unclear.',
    'One month of sales data doesn’t establish a trend.',
  ],
  watchpoints: [
    'Monthly sales over the festive season',
    'Demand for JLR’s vehicles in export markets',
    'Input costs such as steel',
    'How auto stocks perform overall',
  ],
  pastMove: {
    period: 'September',
    change: -4.0,
    facts: ['Tata Motors fell 4.0% in September.', 'Nifty Auto fell about 1.1% over the same period.'],
    interpretation:
      'The decline coincided with weaker global auto sentiment (Sep 18) and caution ahead of monthly sales data.',
    uncertainty: 'These factors shouldn’t be treated as proof of a single cause for the price movement.',
  },
  peerIds: [],
  suggestedQuestions: [
    'Why is Tata Motors falling today?',
    'What changed in the last 7 days?',
    'Is this movement company-specific?',
    'Explain this like I’m new to investing.',
    'What are the biggest risks?',
    'What could matter from here?',
  ],
  mockChatResponses: {
    beginner: {
      lead: 'Here’s Tata Motors’ day in plain words.',
      facts: ['Tata Motors’ share price fell 1.7% today — each share costs about ₹12 less than yesterday.'],
      interpretations: [
        'The company recently said it sold fewer cars in India than a year ago. Investors seem to be worried about that.',
        'Other carmaker stocks also dipped a little, but the overall market went up.',
      ],
      uncertainties: ['Nothing big was announced today, so no one can say exactly why it fell.'],
      sources: ['tm-sales', 'price', 'index'],
      followUps: ['What is a sector index?', 'What changed in the last 7 days?', 'What are the biggest risks?'],
    },
    about: {
      lead: 'Tata Motors is an Indian carmaker that also owns Jaguar Land Rover (JLR).',
      facts: [
        'It makes passenger cars, electric vehicles and commercial vehicles in India.',
        'JLR, its UK-based luxury unit, contributes a large share of revenue.',
      ],
      plain: 'It makes cars and trucks in India, and owns a luxury car brand that sells around the world.',
      sources: ['stats'],
    },
  },
}
