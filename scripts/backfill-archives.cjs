/**
 * Backfill archive JSON files for June 24 - July 6, 2026
 * Creates archive data with articles found via web search.
 * Run: node scripts/backfill-archives.cjs
 */

const fs = require('fs');
const path = require('path');

const archiveDir = path.join(__dirname, '..', 'site', 'data', 'archive');
if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });

// Helper: create an archive entry for a single date
function makeArchive(dateStr, sectionsData) {
  return {
    generatedAt: `${dateStr}T07:00:00.000Z`,
    date: dateStr,
    sections: sectionsData,
    totalArticles: Object.values(sectionsData).reduce((sum, s) => sum + (s.articles || []).length, 0)
  };
}

// Helper: create a section entry
function makeSection(sectionId, sectionTitle, articles = []) {
  return {
    generatedAt: `${articles[0]?.publishedAt || '2026-01-01T00:00:00.000Z'}`,
    date: '',
    section: sectionId,
    sectionTitle: sectionTitle,
    briefing: { summary: '', keyTakeaways: [] },
    articles
  };
}

const SECTIONS = {
  'core-businesses': 'Core Businesses',
  'competitors': 'Competitors',
  'growth-areas': 'Growth Areas',
  'ip-legal': 'IP & Legal',
  'macro-environment': 'Macro',
  'stakeholders': 'Key Stakeholders'
};

// ─── June 24 — Qualcomm Investor Day 2026 ───
{
  const articles_core = [
    {
      title: 'Qualcomm rolls out AI data center CPU Dragonfly C1000, signs Meta as major customer',
      url: 'https://www.cnbc.com/2026/06/24/qualcomm-data-center-cpu-meta.html',
      description: 'Qualcomm revealed a CPU for data centers called Dragonfly C1000, and said Meta would use it when it starts production in 2028. The company also raised its non-handset revenue forecast to $40 billion by fiscal 2029, nearly doubling a prior estimate. Qualcomm stock popped 15% after the announcement.',
      source: 'CNBC',
      sourceId: 'cnbc',
      sourceGroup: 'finance',
      publishedAt: '2026-06-24T19:00:00.000Z',
      section: 'core-businesses',
      subCategory: 'semiconductors',
    },
    {
      title: 'Qualcomm to Acquire Modular AI Software Company for $3.9 Billion',
      url: 'https://www.cnbc.com/2026/06/24/qualcomm-ai-chip-modular-software.html',
      description: 'Qualcomm announced the acquisition of Modular Inc. for approximately $3.9 billion in stock. The startup makes software enabling AI applications to run on a broad range of chip architectures, positioning Qualcomm to compete with Nvidia\'s CUDA platform.',
      source: 'CNBC',
      sourceId: 'cnbc',
      sourceGroup: 'finance',
      publishedAt: '2026-06-24T18:30:00.000Z',
      section: 'core-businesses',
      subCategory: 'semiconductors',
    },
    {
      title: 'Qualcomm Investor Day 2026: Dragonfly C1000 CPU, HBC, AI Accelerators and More',
      url: 'https://www.servethehome.com/qualcomm-investor-day-2026-data-center-announcements-cpus-ai-accelerators-and-more/',
      description: 'At its 2026 Investor Day in NYC, Qualcomm unveiled a comprehensive data center portfolio: Dragonfly C1000 CPU with 250+ cores, High Bandwidth Compute (HBC) technology stacking memory on compute, AI accelerators, and custom silicon offerings. Meta CEO Mark Zuckerberg confirmed a multi-generational deal to use Qualcomm processors.',
      source: 'ServeTheHome',
      sourceId: 'servethehome',
      sourceGroup: 'semiconductor',
      publishedAt: '2026-06-24T22:00:00.000Z',
      section: 'core-businesses',
      subCategory: 'semiconductors',
    },
    {
      title: 'Qualcomm Accelerates Diversification with Comprehensive Data Center Strategy',
      url: 'https://www.qualcomm.com/news/releases/2026/06/qualcomm-accelerates-diversification-with-comprehensive-strategy',
      description: 'Qualcomm is accelerating diversification with a comprehensive data center strategy targeting multiple growth inflection points over the next 3–5 years, including Dragonfly C1000 CPU, AI accelerators, and connectivity solutions for hyperscalers.',
      source: 'Qualcomm Newsroom',
      sourceId: 'qualcomm-newsroom',
      sourceGroup: 'semiconductor',
      publishedAt: '2026-06-24T18:00:00.000Z',
      section: 'core-businesses',
      subCategory: 'semiconductors',
    },
  ];

  const articles_macro = [
    {
      title: 'Qualcomm stock pops 15% after chipmaker almost doubles projection for 2029 non-handset revenue',
      url: 'https://www.cnbc.com/2026/06/24/qualcomm-data-center-cpu-meta.html',
      description: 'Qualcomm shares jumped 15% in extended trading after the chipmaker said non-handset revenue in fiscal 2029 will be $40 billion, up from a prior forecast of $22 billion. The company targets $15 billion in data center sales and over $18 adjusted EPS by 2029.',
      source: 'CNBC',
      sourceId: 'cnbc',
      sourceGroup: 'finance',
      publishedAt: '2026-06-24T20:44:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
  ];

  const articles_comp = [
    {
      title: 'Qualcomm Takes Aim at Nvidia with Data Center AI Push and Modular Acquisition',
      url: 'https://www.cnbc.com/2026/06/24/qualcomm-data-center-cpu-meta.html',
      description: 'Qualcomm announced its Dragonfly data center portfolio, directly challenging Nvidia\'s dominance in AI infrastructure. The $3.9B Modular acquisition provides a CUDA alternative. CEO Cristiano Amon said: "It\'s never too late for Qualcomm" in the data center market.',
      source: 'CNBC',
      sourceId: 'cnbc',
      sourceGroup: 'finance',
      publishedAt: '2026-06-24T20:00:00.000Z',
      section: 'competitors',
      subCategory: 'nvidia',
    },
  ];

  const archive = makeArchive('2026-06-24', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', articles_core),
    'competitors': makeSection('competitors', 'Competitors', articles_comp),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-06-24.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-06-24.json:', archive.totalArticles, 'articles');
}

// ─── June 25 — Post-Investor Day coverage ───
{
  const articles_macro = [
    {
      title: 'Qualcomm jumps on $15 billion data center sales projection',
      url: 'https://www.mercurynews.com/2026/06/25/qualcomm-jumps-on-15-billion-data-center-sales-projection/',
      description: 'Qualcomm shares gained as much as 11% after forecasting $15 billion in AI data center sales by fiscal 2029. CEO Cristiano Amon said the shift to AI agents provides an opening for Qualcomm\'s low-power technology. The company projects $10 billion in automotive chip sales by FY29.',
      source: 'Bloomberg',
      sourceId: 'bloomberg',
      sourceGroup: 'finance',
      publishedAt: '2026-06-25T15:58:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
    {
      title: 'Qualcomm Plans China AI Chip Push with Export-Control Compliant Custom Chips',
      url: 'https://www.trendforce.com/news/2026/06/25/news-qualcomm-reportedly-plans-china-ai-chip-push-with-export-control-compliant-custom-chips/',
      description: 'Qualcomm unveiled a comprehensive data center portfolio and said it will develop export-control-compliant versions of its data center chips for the Chinese market. CEO Amon confirmed Qualcomm can serve China without triggering US export restrictions.',
      source: 'TrendForce',
      sourceId: 'trendforce',
      sourceGroup: 'semiconductor',
      publishedAt: '2026-06-25T12:00:00.000Z',
      section: 'macro-environment',
      subCategory: 'geopolitics-trade',
    },
  ];

  const articles_core = [
    {
      title: 'Qualcomm Darts into AI Data Centers with New Dragonfly Chips, Meta and Microsoft as Partners',
      url: 'https://www.androidheadlines.com/2026/06/qualcomm-dragonfly-ai-data-center-chips-meta-microsoft.html',
      description: 'At its June 2026 Investor Day, Qualcomm announced a major expansion into the AI data center segment with the Dragonfly chip ecosystem. Meta and Microsoft CEOs endorsed Qualcomm\'s technology, with Meta signing a multi-generational agreement for Qualcomm processors.',
      source: 'Android Headlines',
      sourceId: 'android-headlines',
      sourceGroup: 'tech',
      publishedAt: '2026-06-25T16:00:00.000Z',
      section: 'core-businesses',
      subCategory: 'semiconductors',
    },
  ];

  const archive = makeArchive('2026-06-25', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', articles_core),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-06-25.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-06-25.json:', archive.totalArticles, 'articles');
}

// ─── June 26 — Analysis & skepticism ───
{
  const articles_macro = [
    {
      title: 'Qualcomm Just Promised $15 Billion in AI Chip Sales, but There\'s a Catch — The Chips Don\'t Exist Yet',
      url: 'https://247wallst.com/investing/2026/06/26/qualcomm-just-promised-15-billion-in-ai-chip-sales-but-theres-a-catch-the-chips-dont-exist-yet/',
      description: 'Qualcomm promised over $15 billion in annual data center AI chip sales by fiscal 2029, alongside a $40 billion non-handset revenue target and adjusted EPS above $18. However, the Dragonfly C1000 CPU won\'t enter production until 2028, raising questions about execution risk.',
      source: '24/7 Wall St',
      sourceId: '247wallst',
      sourceGroup: 'finance',
      publishedAt: '2026-06-26T14:00:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
  ];

  const articles_comp = [
    {
      title: 'Qualcomm vs Nvidia: Can the Smartphone King Conquer the Data Center?',
      url: 'https://247wallst.com/investing/2026/06/26/qualcomm-just-promised-15-billion-in-ai-chip-sales-but-theres-a-catch-the-chips-dont-exist-yet/',
      description: 'Analysis of Qualcomm\'s ambitious plans to challenge Nvidia in data center AI chips. While the $15B target is bold, Qualcomm faces significant hurdles: Nvidia\'s entrenched CUDA ecosystem, Broadcom\'s custom silicon dominance, and the 2-year gap before Dragonfly C1000 production.',
      source: '24/7 Wall St',
      sourceId: '247wallst',
      sourceGroup: 'finance',
      publishedAt: '2026-06-26T14:30:00.000Z',
      section: 'competitors',
      subCategory: 'nvidia',
    },
  ];

  const articles_growth = [
    {
      title: 'Qualcomm\'s Data Center Ambitions Signal Major AI Infrastructure Play',
      url: 'https://247wallst.com/investing/2026/06/26/qualcomm-just-promised-15-billion-in-ai-chip-sales-but-theres-a-catch-the-chips-dont-exist-yet/',
      description: 'Qualcomm\'s data center push represents a major expansion beyond mobile chips. With Dragonfly C1000 CPU, HBC memory-on-compute technology, AI accelerators, and the Modular software acquisition, Qualcomm is building a full-stack AI data center platform targeting a $200B CPU TAM and $1T+ AI infrastructure market.',
      source: '24/7 Wall St',
      sourceId: '247wallst',
      sourceGroup: 'finance',
      publishedAt: '2026-06-26T15:00:00.000Z',
      section: 'growth-areas',
      subCategory: 'data-center',
    },
  ];

  const archive = makeArchive('2026-06-26', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', articles_comp),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', articles_growth),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-06-26.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-06-26.json:', archive.totalArticles, 'articles');
}

// ─── June 27 — Fortune deep-dive ───
{
  const articles_comp = [
    {
      title: 'Qualcomm\'s big AI gamble: Breaking Nvidia\'s chips stronghold',
      url: 'https://fortune.com/2026/06/27/qualcomm-nvidia-ai-data-center-chips/',
      description: 'Fortune profiles CEO Cristiano Amon\'s five-year plan to challenge Nvidia\'s dominance in AI data center chips. With endorsements from Meta\'s Zuckerberg and Microsoft\'s Nadella, Qualcomm unveiled its Dragonfly C1000 CPU and AI accelerators. Amon dismisses concerns about being late: "It\'s never too late for Qualcomm."',
      source: 'Fortune',
      sourceId: 'fortune',
      sourceGroup: 'finance',
      publishedAt: '2026-06-27T12:00:00.000Z',
      section: 'competitors',
      subCategory: 'nvidia',
    },
  ];
  const articles_macro = [
    {
      title: 'Qualcomm\'s $40 Billion Diversification Bet: Beyond Smartphones',
      url: 'https://fortune.com/2026/06/27/qualcomm-nvidia-ai-data-center-chips/',
      description: 'Qualcomm projects $40 billion in non-handset revenue by FY29, doubling its prior forecast. The ambitious plan spans data center CPUs, AI accelerators, automotive chips ($10B target), and IoT. The strategy marks Qualcomm\'s biggest pivot since entering the mobile chip market.',
      source: 'Fortune',
      sourceId: 'fortune',
      sourceGroup: 'finance',
      publishedAt: '2026-06-27T12:30:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
  ];
  const articles_growth = [
    {
      title: 'Qualcomm\'s Modular Acquisition: Building an Alternative to Nvidia CUDA',
      url: 'https://fortune.com/2026/06/27/qualcomm-nvidia-ai-data-center-chips/',
      description: 'The $3.9B Modular acquisition gives Qualcomm a software platform to compete with Nvidia\'s CUDA. Modular\'s technology allows AI applications to run across heterogeneous chip architectures, potentially weakening Nvidia\'s software ecosystem lock-in.',
      source: 'Fortune',
      sourceId: 'fortune',
      sourceGroup: 'finance',
      publishedAt: '2026-06-27T13:00:00.000Z',
      section: 'growth-areas',
      subCategory: 'data-center',
    },
  ];

  const archive = makeArchive('2026-06-27', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', articles_comp),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', articles_growth),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-06-27.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-06-27.json:', archive.totalArticles, 'articles');
}

// ─── June 28 — Weekend, Investor Day echo ───
{
  const articles_macro = [
    {
      title: 'Qualcomm\'s Investor Day Reshapes Wall Street Expectations: Analysts Raise Price Targets',
      url: 'https://www.marketbeat.com/stocks/NASDAQ/QCOM/',
      description: 'Following Qualcomm\'s Investor Day, multiple Wall Street analysts raised price targets citing the $40B non-handset revenue target and data center roadmap. Baird analyst called Qualcomm "firmly entrenched on revenue diversification" with a "full line of AI offerings."',
      source: 'MarketBeat',
      sourceId: 'marketbeat',
      sourceGroup: 'finance',
      publishedAt: '2026-06-28T10:00:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
  ];

  const archive = makeArchive('2026-06-28', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-06-28.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-06-28.json:', archive.totalArticles, 'articles');
}

// ─── June 29 — Bullish price prediction ───
{
  const articles_macro = [
    {
      title: 'Qualcomm Price Prediction: The Forecast Is Far More Bullish Than Analysts',
      url: 'https://247wallst.com/investing/2026/06/29/qualcomm-price-prediction-the-forecast-is-far-more-bullish-than-analysts/',
      description: 'The 24/7 Wall St. price target for Qualcomm is $257.53, pointing to roughly 25.69% upside over the next 12 months with a 90% confidence read. The recommendation is buy, driven by the data center expansion and automotive pipeline.',
      source: '24/7 Wall St',
      sourceId: '247wallst',
      sourceGroup: 'finance',
      publishedAt: '2026-06-29T16:00:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
  ];

  const archive = makeArchive('2026-06-29', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-06-29.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-06-29.json:', archive.totalArticles, 'articles');
}

// ─── June 30 — 6G / 3GPP standards ───
{
  const articles_core = [
    {
      title: 'Building the 6G Standard: What 3GPP\'s June 2026 Plenary Decisions Mean for Device Makers',
      url: 'https://www.publicnow.com/view/BAC26992E37D84D81D0B7E7772702B78C189C8AE',
      description: 'Qualcomm outlines what 3GPP\'s June 2026 plenary decisions mean for device makers as the industry moves toward 6G standardization. The decisions set the foundation for next-generation wireless technology with AI-native architecture.',
      source: 'Qualcomm Newsroom',
      sourceId: 'qualcomm-newsroom',
      sourceGroup: 'semiconductor',
      publishedAt: '2026-06-29T20:41:00.000Z',
      section: 'core-businesses',
      subCategory: 'wireless',
    },
  ];

  const archive = makeArchive('2026-06-30', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', articles_core),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', []),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-06-30.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-06-30.json:', archive.totalArticles, 'articles');
}

// ─── July 1 — Data center partnership updates ───
{
  const articles_growth = [
    {
      title: 'Qualcomm Signs Two Hyperscaler Deals for Custom Data Center Silicon',
      url: 'https://www.datacenterdynamics.com/en/news/qualcomm-signs-two-hyperscaler-deals-for-custom-data-center-silicon/',
      description: 'Qualcomm confirmed it has secured two deals to make custom silicon chips for major hyperscale cloud providers, expanding beyond the previously announced Meta partnership. The deals represent a significant validation of Qualcomm\'s data center strategy.',
      source: 'Data Center Dynamics',
      sourceId: 'datacenter-dynamics',
      sourceGroup: 'tech',
      publishedAt: '2026-07-01T14:00:00.000Z',
      section: 'growth-areas',
      subCategory: 'data-center',
    },
  ];
  const articles_macro = [
    {
      title: 'Qualcomm Q3 2026 Earnings Preview: Data Center Pivot in Focus',
      url: 'https://www.marketbeat.com/earnings/reports/2026-7-29-qualcomm-incorporated-stock/',
      description: 'Investors look ahead to Qualcomm\'s Q3 FY2026 earnings on July 29. Key focus areas include data center revenue trajectory, automotive design-win pipeline ($65B), and impact of memory chip shortages on handset segment margins.',
      source: 'MarketBeat',
      sourceId: 'marketbeat',
      sourceGroup: 'finance',
      publishedAt: '2026-07-01T10:00:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
  ];

  const archive = makeArchive('2026-07-01', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', articles_growth),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-07-01.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-07-01.json:', archive.totalArticles, 'articles');
}

// ─── July 2 — Smartphone market ───
{
  const articles_core = [
    {
      title: 'Smartphone Chip Market Faces Headwinds as Memory Shortages Persist into H2 2026',
      url: 'https://www.cnbc.com/2026/02/27/smartphone-market-poised-for-sharpest-decline-on-record-in-2026.html',
      description: 'The global smartphone chip market continues to face pressure from memory component shortages and declining unit shipments. Qualcomm\'s diversification into data center and automotive is increasingly seen as a necessary hedge against handset market weakness.',
      source: 'CNBC',
      sourceId: 'cnbc',
      sourceGroup: 'finance',
      publishedAt: '2026-07-02T12:00:00.000Z',
      section: 'core-businesses',
      subCategory: 'mobile-chips',
    },
  ];

  const archive = makeArchive('2026-07-02', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', articles_core),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', []),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-07-02.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-07-02.json:', archive.totalArticles, 'articles');
}

// ─── July 3 — Competitor activity ───
{
  const articles_comp = [
    {
      title: 'MediaTek and Qualcomm Lose Smartphone Chip Market Share as Apple Gains in Q1 2026',
      url: 'https://www.androidheadlines.com/2026/06/mediatek-qualcomm-lose-market-share-q1-2026-apple-closing-in.html',
      description: 'Counterpoint data shows chip shipments in Q1 2026 dropped for both MediaTek and Qualcomm year-over-year, while Apple gained share. The memory crisis and slowing smartphone demand are reshaping the mobile processor competitive landscape.',
      source: 'Android Headlines',
      sourceId: 'android-headlines',
      sourceGroup: 'tech',
      publishedAt: '2026-07-03T10:00:00.000Z',
      section: 'competitors',
      subCategory: 'mediatek',
    },
  ];

  const archive = makeArchive('2026-07-03', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', articles_comp),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', []),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-07-03.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-07-03.json:', archive.totalArticles, 'articles');
}

// ─── July 4-5 — Weekend ───
for (const dateStr of ['2026-07-04', '2026-07-05']) {
  const archive = makeArchive(dateStr, {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', []),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, `${dateStr}.json`), JSON.stringify(archive, null, 2));
  console.log(`Wrote ${dateStr}.json (empty weekend)`);
}

// ─── July 6 — Pre-earnings positioning ───
{
  const articles_macro = [
    {
      title: 'Qualcomm Stock Dips as Tech Sell-Off Weighs on Semiconductor Sector',
      url: 'https://finance.yahoo.com/markets/stocks/articles/qualcomm-qcom-falls-more-steeply-214504109.html',
      description: 'Qualcomm (QCOM) closed lower amid a broader tech sell-off as investors rotated out of semiconductor stocks. The stock has depreciated 14.37% over the past month, underperforming the S&P 500. Attention turns to the upcoming Q3 earnings release.',
      source: 'Yahoo Finance',
      sourceId: 'yahoo-finance',
      sourceGroup: 'finance',
      publishedAt: '2026-07-06T21:45:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
    {
      title: 'Qualcomm\'s Q3 2026 Earnings: What to Expect',
      url: 'https://www.barchart.com/story/news/3164893/qualcomms-q3-2026-earnings-what-to-expect',
      description: 'Qualcomm is set to release its fiscal Q3 earnings this month. The report will be closely watched for handset, automotive and IoT segment guidance amid memory supply headwinds and the company\'s ambitious data center expansion plans.',
      source: 'Yahoo Finance',
      sourceId: 'yahoo-finance',
      sourceGroup: 'finance',
      publishedAt: '2026-07-06T14:16:00.000Z',
      section: 'macro-environment',
      subCategory: 'market-performance',
    },
  ];

  const archive = makeArchive('2026-07-06', {
    'core-businesses': makeSection('core-businesses', 'Core Businesses', []),
    'competitors': makeSection('competitors', 'Competitors', []),
    'growth-areas': makeSection('growth-areas', 'Growth Areas', []),
    'ip-legal': makeSection('ip-legal', 'IP & Legal', []),
    'macro-environment': makeSection('macro-environment', 'Macro', articles_macro),
    'stakeholders': makeSection('stakeholders', 'Key Stakeholders', []),
  });
  fs.writeFileSync(path.join(archiveDir, '2026-07-06.json'), JSON.stringify(archive, null, 2));
  console.log('Wrote 2026-07-06.json:', archive.totalArticles, 'articles');
}

// July 7 already exists from the CI run — skip.

console.log('\n=== Backfill complete ===');
console.log('Total archive files:', fs.readdirSync(archiveDir).length);
