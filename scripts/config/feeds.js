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
    googleQuery: 'Qualcomm site:reuters.com',
    publisherDomains: ['reuters.com']
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    group: 'finance',
    strategy: 'rss',
    url: 'https://feeds.bloomberg.com/technology/news.rss',
    publisherDomains: ['bloomberg.com']
  },
  {
    id: 'wsj',
    name: 'Wall Street Journal',
    group: 'finance',
    strategy: 'google-news',
    googleQuery: 'Qualcomm site:wsj.com',
    publisherDomains: ['wsj.com']
  },
  {
    id: 'ft',
    name: 'Financial Times',
    group: 'finance',
    strategy: 'rss',
    url: 'https://www.ft.com/rss/home',
    publisherDomains: ['ft.com']
  },
  {
    id: 'cnbc',
    name: 'CNBC',
    group: 'finance',
    strategy: 'rss',
    url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    publisherDomains: ['cnbc.com']
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    group: 'finance',
    strategy: 'rss',
    url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=QCOM&region=US&lang=en-US',
    publisherDomains: ['finance.yahoo.com', 'yahoo.com']
  },

  // --- Technology ---
  {
    id: 'the-information',
    name: 'The Information',
    group: 'tech',
    strategy: 'google-news',
    googleQuery: 'Qualcomm site:theinformation.com',
    publisherDomains: ['theinformation.com']
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    group: 'tech',
    strategy: 'rss',
    url: 'https://techcrunch.com/feed/',
    publisherDomains: ['techcrunch.com']
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    group: 'tech',
    strategy: 'rss',
    url: 'https://www.theverge.com/rss/index.xml',
    publisherDomains: ['theverge.com']
  },
  {
    id: 'venturebeat',
    name: 'VentureBeat',
    group: 'tech',
    strategy: 'rss',
    url: 'https://venturebeat.com/feed/',
    publisherDomains: ['venturebeat.com']
  },

  // --- Semiconductor ---
  {
    id: 'eetimes',
    name: 'EE Times',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://www.eetimes.com/feed/',
    publisherDomains: ['eetimes.com']
  },
  {
    id: 'semiconductor-engineering',
    name: 'Semiconductor Engineering',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://semiengineering.com/feed/',
    publisherDomains: ['semiengineering.com']
  },
  {
    id: 'semiconductor-digest',
    name: 'Semiconductor Digest',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://www.semiconductordigest.com/feed/',
    publisherDomains: ['semiconductordigest.com']
  },
  {
    id: 'silicon-semiconductor',
    name: 'Silicon Semiconductor',
    group: 'semiconductor',
    strategy: 'rss',
    url: 'https://www.siliconsemiconductor.net/rss.xml',
    publisherDomains: ['siliconsemiconductor.net']
  },

  // --- IP / Legal ---
  {
    id: 'iam',
    name: 'IAM',
    group: 'ip',
    strategy: 'rss',
    url: 'https://www.iam-media.com/rss',
    publisherDomains: ['iam-media.com']
  },
  {
    id: 'ipwatchdog',
    name: 'IPWatchdog',
    group: 'ip',
    strategy: 'rss',
    url: 'https://ipwatchdog.com/feed/',
    publisherDomains: ['ipwatchdog.com']
  },
  {
    id: 'patently-o',
    name: 'Patently-O',
    group: 'ip',
    strategy: 'rss',
    url: 'https://patentlyo.com/feed',
    publisherDomains: ['patentlyo.com']
  },
  {
    id: 'law360-ip',
    name: 'Law360 IP',
    group: 'ip',
    strategy: 'google-news',
    googleQuery: 'Qualcomm patent site:law360.com',
    publisherDomains: ['law360.com']
  },
  {
    id: 'ip-fray',
    name: 'IP Fray',
    group: 'ip',
    strategy: 'rss',
    url: 'https://ipfray.com/feed/',
    publisherDomains: ['ipfray.com']
  },

  // --- Telecom / Industry ---
  {
    id: 'light-reading',
    name: 'Light Reading',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.lightreading.com/rss.xml',
    publisherDomains: ['lightreading.com']
  },
  {
    id: 'rcr-wireless',
    name: 'RCR Wireless News',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.rcrwireless.com/feed',
    publisherDomains: ['rcrwireless.com']
  },
  {
    id: 'mobile-world-live',
    name: 'Mobile World Live',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.mobileworldlive.com/feed',
    publisherDomains: ['mobileworldlive.com']
  },
  {
    id: 'fierce-wireless',
    name: 'Fierce Wireless',
    group: 'telecom',
    strategy: 'rss',
    url: 'https://www.fiercewireless.com/rss.xml',
    publisherDomains: ['fiercewireless.com']
  }
];

// Third-party / syndicated sources that appear in other feeds' RSS.
// When an article URL matches one of these domains, the source is
// overridden to the actual publisher instead of the feed source.
export const EXTRA_SOURCES = {
  'barchart.com': { name: 'Barchart', group: 'finance' },
  'simplywall.st': { name: 'Simply Wall St', group: 'finance' },
  'seekingalpha.com': { name: 'Seeking Alpha', group: 'finance' },
  'fool.com': { name: 'Motley Fool', group: 'finance' },
  'zacks.com': { name: 'Zacks', group: 'finance' },
  'investorplace.com': { name: 'InvestorPlace', group: 'finance' },
  'marketbeat.com': { name: 'MarketBeat', group: 'finance' },
  'barrons.com': { name: "Barron's", group: 'finance' },
  'marketwatch.com': { name: 'MarketWatch', group: 'finance' },
  'benzinga.com': { name: 'Benzinga', group: 'finance' },
  'tipranks.com': { name: 'TipRanks', group: 'finance' }
};

// Build a lookup map by source id
export const FEED_MAP = Object.fromEntries(FEEDS.map(f => [f.id, f]));

// Build sources.json data
export function buildSourcesRegistry() {
  const feeds = FEEDS.map(f => ({
    id: f.id,
    name: f.name,
    group: f.group,
    groupLabel: FEED_GROUPS[f.group].label,
    hasRss: f.strategy === 'rss'
  }));

  // Include syndicated sources so the frontend can show them
  for (const [domain, info] of Object.entries(EXTRA_SOURCES)) {
    feeds.push({
      id: `syndicated:${domain}`,
      name: info.name,
      group: info.group,
      groupLabel: FEED_GROUPS[info.group]?.label || info.group,
      hasRss: false
    });
  }

  return feeds;
}

// ---- Source resolution from article URL ----

let _domainToFeed = null;

function getDomainToFeedMap() {
  if (_domainToFeed) return _domainToFeed;
  _domainToFeed = {};
  for (const feed of FEEDS) {
    if (!feed.publisherDomains) continue;
    for (const domain of feed.publisherDomains) {
      if (!_domainToFeed[domain]) {
        _domainToFeed[domain] = { id: feed.id, name: feed.name, group: feed.group };
      }
    }
  }
  return _domainToFeed;
}

function extractDomain(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return hostname;
  } catch {
    return null;
  }
}

/**
 * Resolve the true source of an article based on its URL domain.
 *
 * Some RSS feeds (especially Yahoo Finance) syndicate content from
 * third-party publishers. This function checks the article URL's domain
 * against known sources and overrides the feed-assigned source when
 * the article actually comes from a different publisher.
 *
 * Resolution order:
 *   1. EXTRA_SOURCES — syndicated domains without their own feed
 *   2. FEEDS publisherDomains — domains owned by other feeds
 *   3. Falls back to the original feed source
 *
 * @param {string} url - Article URL
 * @param {object} feed - The feed this article was fetched from { id, name, group }
 * @returns {{ source: string, sourceId: string, sourceGroup: string }}
 */
export function resolveArticleSource(url, feed) {
  const domain = extractDomain(url);
  if (!domain) return { source: feed.name, sourceId: feed.id, sourceGroup: feed.group };

  // 1. Check EXTRA_SOURCES (syndicated domains without their own feed)
  if (EXTRA_SOURCES[domain]) {
    const extra = EXTRA_SOURCES[domain];
    return { source: extra.name, sourceId: `syndicated:${domain}`, sourceGroup: extra.group };
  }

  // Also check parent domain (e.g. www.barchart.com → barchart.com)
  const parts = domain.split('.');
  if (parts.length > 2) {
    const parentDomain = parts.slice(-2).join('.');
    if (EXTRA_SOURCES[parentDomain]) {
      const extra = EXTRA_SOURCES[parentDomain];
      return { source: extra.name, sourceId: `syndicated:${parentDomain}`, sourceGroup: extra.group };
    }
  }

  // 2. Check if the article domain belongs to a different feed
  const domainMap = getDomainToFeedMap();
  for (const [feedDomain, feedInfo] of Object.entries(domainMap)) {
    if (domain === feedDomain || domain.endsWith('.' + feedDomain)) {
      if (feedInfo.id !== feed.id) {
        return { source: feedInfo.name, sourceId: feedInfo.id, sourceGroup: feedInfo.group };
      }
      // Same feed — keep original
      break;
    }
  }

  // 3. No match — keep feed source
  return { source: feed.name, sourceId: feed.id, sourceGroup: feed.group };
}
