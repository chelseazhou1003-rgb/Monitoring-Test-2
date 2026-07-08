// Google News RSS fallback for premium sources without public RSS
// Uses news.google.com/rss/search — public, legal aggregation

const GOOGLE_NEWS_TIMEOUT_MS = 8000;

async function fetchGoogleNewsRss(query, hl = 'en', gl = 'US', ceid = 'US:en') {
  const encodedQuery = encodeURIComponent(`${query} when:1d`);
  const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

  try {
    const response = await fetchWithTimeout(url, GOOGLE_NEWS_TIMEOUT_MS, `Google News: ${query}`);

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

async function fetchWithTimeout(url, ms, label) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`${label} timed out after ${ms}ms`);
    }
    throw err;
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

  // Process in batches of 3 to balance speed and rate-limiting
  const BATCH_SIZE = 3;
  const BATCH_DELAY_MS = 800;

  for (let i = 0; i < gnFeeds.length; i += BATCH_SIZE) {
    const batch = gnFeeds.slice(i, i + BATCH_SIZE);
    console.log(`  [Google News] Starting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(gnFeeds.length / BATCH_SIZE)}: ${batch.map(f => f.name).join(', ')}`);

    const batchResults = await Promise.allSettled(
      batch.map(feed => fetchOneGoogleNews(feed))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      }
    }

    // Small delay between batches to avoid rate-limiting
    if (i + BATCH_SIZE < gnFeeds.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`  [Google News] Total fetched: ${results.length} items`);
  return results;
}

async function fetchOneGoogleNews(feed) {
  console.log(`  [${feed.name}] Google News: "${feed.googleQuery}"`);
  const items = await fetchGoogleNewsRss(feed.googleQuery);
  const annotated = items.map(item => {
    item.source = feed.name;
    item.sourceId = feed.id;
    item.sourceGroup = feed.group;
    return item;
  });
  console.log(`  [${feed.name}] Google News: ${annotated.length} items`);
  return annotated;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
