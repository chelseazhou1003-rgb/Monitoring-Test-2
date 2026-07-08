/**
 * Fetch Yahoo Finance QCOM RSS feed and output article candidates.
 * Run: node scripts/fetch-yahoo.cjs
 */

const fs = require('fs');
const path = require('path');

const RSS_URL = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=QCOM&region=US&lang=en-US';

const QUALCOMM_KEYWORDS = [
  'Qualcomm', 'QCOM', 'Cristiano Amon', 'Snapdragon', 'Snapdragon X', 'X Elite', 'X Plus',
  'Adreno', 'Hexagon', 'FastConnect', 'Snapdragon Ride', 'Digital Chassis', 'RF360', '高通'
];

function normalizeDate(pubDate) {
  if (!pubDate) return null;
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function isQualcommRelevant(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();
  return QUALCOMM_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
}

async function fetchYahooFeed() {
  try {
    const res = await fetch(RSS_URL);
    const xml = await res.text();

    // Very simple RSS parser using regex (no external deps)
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = (itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '').replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim();
      const link = (itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '').replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim();
      const description = (itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '').replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim();
      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';

      if (!title || !link) continue;

      // Keep articles even if description is truncated — title match is enough
      if (isQualcommRelevant(title, description)) {
        items.push({
          title,
          url: link.replace(/\?\.tsrc=rss$/, '').replace(/\?tsrc=rss$/, ''),
          description: description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
          publishedAt: normalizeDate(pubDate),
          sourceId: 'yahoo-finance',
          source: 'Yahoo Finance'
        });
      }
    }

    console.log(`Fetched ${items.length} Qualcomm-relevant articles from Yahoo Finance\n`);
    return items;
  } catch (err) {
    console.error('Failed to fetch Yahoo Finance feed:', err.message);
    return [];
  }
}

fetchYahooFeed().then(items => {
  const outPath = path.join(__dirname, '..', 'site', 'data', 'yahoo-finance-raw.json');
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`Written raw candidates to ${outPath}`);
  items.forEach((a, i) => {
    console.log(`\n${i + 1}. ${a.title}`);
    console.log(`   ${a.url}`);
    console.log(`   ${a.publishedAt} | ${a.description.substring(0, 120)}...`);
  });
});
