// Fetch RSS feeds from native RSS sources using rss-parser
// Each request is wrapped in a hard timeout to avoid hangs in CI

import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml'
  }
});

const REQUEST_TIMEOUT_MS = 10000;

export async function fetchNativeRss(feed) {
  console.log(`  [${feed.name}] RSS: fetching ${feed.url}`);
  try {
    const parsed = await withTimeout(parser.parseURL(feed.url), REQUEST_TIMEOUT_MS, `RSS fetch for ${feed.name}`);
    const items = (parsed.items || []).map(item => ({
      title: item.title?.trim() || '',
      url: item.link?.trim() || '',
      description: cleanHtml(item.contentSnippet || item.content || item.description || ''),
      source: feed.name,
      sourceId: feed.id,
      sourceGroup: feed.group,
      publishedAt: item.isoDate || item.pubDate ? new Date(item.isoDate || item.pubDate).toISOString() : null,
      fetchedAt: new Date().toISOString(),
      fetchStrategy: 'rss'
    }));
    console.log(`  [${feed.name}] RSS: ${items.length} items fetched`);
    return items;
  } catch (err) {
    console.warn(`  [${feed.name}] RSS fetch failed: ${err.message}`);
    return [];
  }
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${label} timed out after ${ms}ms`));
      }, ms);
      // Clean up timer if promise resolves first to avoid dangling timers
      promise.then(() => clearTimeout(timer)).catch(() => clearTimeout(timer));
    })
  ]);
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')       // strip tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fetch all native RSS feeds with concurrency control
export async function fetchAllNativeRss(feeds) {
  const rssFeeds = feeds.filter(f => f.strategy === 'rss');
  const results = [];

  // Process in batches of 5 to avoid overwhelming sources
  const BATCH_SIZE = 5;
  for (let i = 0; i < rssFeeds.length; i += BATCH_SIZE) {
    const batch = rssFeeds.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(batch.map(f => fetchNativeRss(f)));
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      }
    }
  }

  return results;
}
