// Fetch RSS feeds from native RSS sources using rss-parser

import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'QualcommNewsMonitor/1.0 (RSS aggregator; news-monitor@example.com)',
    'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml'
  }
});

export async function fetchNativeRss(feed) {
  try {
    const parsed = await parser.parseURL(feed.url);
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
    console.log(`  [${feed.name}] RSS: ${items.length} items`);
    return items;
  } catch (err) {
    console.warn(`  [${feed.name}] RSS fetch failed: ${err.message}`);
    return [];
  }
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
