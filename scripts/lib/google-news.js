// Google News RSS fallback for premium sources without public RSS
// Uses news.google.com/rss/search — public, legal aggregation

async function fetchGoogleNewsRss(query, hl = 'en', gl = 'US', ceid = 'US:en') {
  const encodedQuery = encodeURIComponent(`${query} when:1d`);
  const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'QualcommNewsMonitor/1.0 (RSS aggregator)'
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    return parseGoogleNewsRss(text);
  } catch (err) {
    console.warn(`  Google News fetch failed for "${query}": ${err.message}`);
    return [];
  }
}

function parseGoogleNewsRss(xml) {
  const items = [];
  // Simple regex-based RSS parsing for Google News format
  // No XML parser dependency needed for this simple case
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const description = extractTag(itemXml, 'description');
    const source = extractTag(itemXml, 'source');

    if (title && link) {
      items.push({
        title: decodeHtmlEntities(title).trim(),
        url: extractGoogleRedirectUrl(link) || link,
        description: cleanAndTruncate(decodeHtmlEntities(description || '')),
        source: source || 'Google News',
        sourceId: null, // Will be resolved later
        sourceGroup: null, // Will be resolved later
        publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
        fetchedAt: new Date().toISOString(),
        fetchStrategy: 'google-news',
        googleNewsSource: source
      });
    }
  }

  return items;
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 's');
  const match = xml.match(regex);
  if (!match) return null;
  return match[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
}

function extractGoogleRedirectUrl(link) {
  // Google News links are redirects: extract the real URL
  const urlMatch = link.match(/url=([^&]+)/);
  if (urlMatch) {
    return decodeURIComponent(urlMatch[1]);
  }
  // Could be a direct URL
  if (link.startsWith('http')) return link;
  return null;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;/g, "'");
}

function cleanAndTruncate(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);
}

// Resolve Google News items to their actual source based on the <source> tag or URL domain
export function resolveGoogleNewsSource(item, feeds) {
  const sourceTag = item.googleNewsSource?.toLowerCase() || '';
  const url = item.url?.toLowerCase() || '';

  for (const feed of feeds) {
    const name = feed.name.toLowerCase();
    // Check if source tag or URL domain matches
    if (sourceTag.includes(name) || url.includes(feed.id.replace(/-/g, ''))) {
      item.source = feed.name;
      item.sourceId = feed.id;
      item.sourceGroup = feed.group;
      return item;
    }
  }

  // Domain-based fallback matching
  for (const feed of feeds) {
    if (feed.strategy === 'google-news' && feed.googleQuery) {
      const domain = feed.googleQuery.match(/site:([^\s]+)/)?.[1];
      if (domain && url.includes(domain)) {
        item.source = feed.name;
        item.sourceId = feed.id;
        item.sourceGroup = feed.group;
        return item;
      }
    }
  }

  // Couldn't resolve — keep as is
  return item;
}

// Fetch all Google News fallback feeds
export async function fetchAllGoogleNews(feeds) {
  const gnFeeds = feeds.filter(f => f.strategy === 'google-news');
  const results = [];

  // Sequential to avoid rate-limiting
  for (const feed of gnFeeds) {
    console.log(`  [${feed.name}] Google News: "${feed.googleQuery}"`);
    const items = await fetchGoogleNewsRss(feed.googleQuery);
    // Annotate with expected source info
    const annotated = items.map(item => {
      item.source = feed.name;
      item.sourceId = feed.id;
      item.sourceGroup = feed.group;
      return item;
    });
    console.log(`  [${feed.name}] Google News: ${annotated.length} items`);
    results.push(...annotated);
    // Small delay between requests
    await sleep(1000);
  }

  return results;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
