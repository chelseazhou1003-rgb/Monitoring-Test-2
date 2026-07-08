// All RSS sources with their group, URL, and fallback strategy
// Sources without native RSS use Google News site-query fallback

export const FEED_GROUPS = {
  finance: { label: 'Finance / Mainstream', color: 'navy' },
  tech: { label: 'Technology', color: 'teal' },
  semiconductor: { label: 'Semiconductor', color: 'slate' },
  ip: { label: 'IP / Legal', color: 'plum' },
  telecom: { label: 'Telecom / Industry', color: 'olive' }
};

export const FEEDS = [
  // --- Finance / Mainstream ---
  // Note: premium sources without public RSS use Google News site-query fallback.
  // Google News RSS can be blocked from some networks; direct RSS is preferred when available.
  {
    id: 'reuters',
    name: 'Reuters',
    group: 'finance',
    strategy: 'google-news',
    googleQuery: 'Qualcomm site:reuters.com'
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    group: 'finance',
    strategy: 'rss',
    url: 'https://feeds.bloomberg.com/technology/news.rss'
  },
  {
    id: 'wsj',
    name: 'Wall Street Journal',
    group: 'finance',
    strategy: 'google-news',
    googleQuery: 'Qualcomm site:wsj.com'
  },
  {
    id: 'ft',
    name: 'Financial Times',
    group: 'finance',
    strategy: 'rss',
    url: 'https://www.ft.com/rss/home'
  },
  {
    id: 'cnbc',
    name: 'CNBC',
    group: 'finance',
    strategy: 'rss',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html'
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    group: 'finance',
    strategy: 'rss',
    url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=QCOM&region=US&lang=en-US'
  },

  // --- Technology ---
  {
    id: 'the-information',
    name: 'The Information',
    group: 'tech',
    strategy: 'google-news',
    googleQuery: 'Qualcomm site:theinformation.com'
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    group: 'tech',
    strategy: 'rss',
    url: 'https://techcrunch.com/feed/'
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    group: 'tech',
    strategy: 'rss',
    url: 'https://www.theverge.com/rss/index.xml'
  },
  {
    id: 'venturebeat',
    name: 'VentureBeat',
    group: 'tech',
    strategy: 'rss',
    url: 'https://venturebeat.com/feed/'
  },

  // --- Semiconductor ---
  {
    id: 'eetimes',
    name: 'EE Times',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://www.eetimes.com/feed/'
  },
  {
    id: 'semiconductor-engineering',
    name: 'Semiconductor Engineering',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://semiengineering.com/feed/'
  },
  {
    id: 'semiconductor-digest',
    name: 'Semiconductor Digest',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://www.semiconductordigest.com/feed/'
  },
  {
    id: 'silicon-semiconductor',
    name: 'Silicon Semiconductor',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://www.siliconsemiconductor.net/rss.xml'
  },

  // --- IP / Legal ---
  {
    id: 'iam',
    name: 'IAM',
    group: 'ip',
    strategy: 'rss',
    url: 'https://www.iam-media.com/rss'
  },
  {
    id: 'ipwatchdog',
    name: 'IPWatchdog',
    group: 'ip',
    strategy: 'rss',
    url: 'https://ipwatchdog.com/feed/'
  },
  {
    id: 'patently-o',
    name: 'Patently-O',
    group: 'ip',
    strategy: 'rss',
    url: 'https://patentlyo.com/feed'
  },
  {
    id: 'law360-ip',
    name: 'Law360 IP',
    group: 'ip',
    strategy: 'google-news',
    googleQuery: 'Qualcomm patent site:law360.com'
  },
  {
    id: 'ip-fray',
    name: 'IP Fray',
    group: 'ip',
    strategy: 'rss',
    url: 'https://ipfray.com/feed/'
  },

  // --- Telecom / Industry ---
  {
    id: 'light-reading',
    name: 'Light Reading',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.lightreading.com/rss.xml'
  },
  {
    id: 'rcr-wireless',
    name: 'RCR Wireless News',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.rcrwireless.com/feed'
  },
  {
    id: 'mobile-world-live',
    name: 'Mobile World Live',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.mobileworldlive.com/feed'
  },
  {
    id: 'fierce-wireless',
    name: 'Fierce Wireless',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.fiercewireless.com/rss.xml'
  }
];

// Build a lookup map by source id
export const FEED_MAP = Object.fromEntries(FEEDS.map(f => [f.id, f]));

// Build sources.json data
export function buildSourcesRegistry() {
  return FEEDS.map(f => ({
    id: f.id,
    name: f.name,
    group: f.group,
    groupLabel: FEED_GROUPS[f.group].label,
    hasRss: f.strategy === 'rss'
  }));
}
