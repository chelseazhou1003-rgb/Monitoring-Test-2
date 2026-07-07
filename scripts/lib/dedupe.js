// Deduplication: remove duplicate articles by URL normalization and title similarity

export function deduplicateArticles(articles) {
  const seenUrls = new Set();
  const kept = [];

  for (const article of articles) {
    const normalized = normalizeUrl(article.url);
    if (seenUrls.has(normalized)) {
      continue;
    }
    seenUrls.add(normalized);
    kept.push(article);
  }

  // Title similarity dedup (Jaro-Winkler-like check for highly similar titles)
  const deduped = dedupeByTitleSimilarity(kept);

  const removed = articles.length - deduped.length;
  if (removed > 0) {
    console.log(`  Dedupe: removed ${removed} duplicate(s) (kept ${deduped.length})`);
  }

  return deduped;
}

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    // Remove tracking params
    const stripParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'ref', 'source', 'mc_cid', 'mc_eid'];
    for (const p of stripParams) {
      u.searchParams.delete(p);
    }
    // Normalize
    let normalized = u.origin + u.pathname + u.search + (u.hash ? '#' : '');
    // Remove trailing slash on path
    normalized = normalized.replace(/\/$/, '');
    return normalized.toLowerCase();
  } catch {
    return url.toLowerCase().trim();
  }
}

function dedupeByTitleSimilarity(articles) {
  const result = [];
  for (const article of articles) {
    const isDup = result.some(existing =>
      titleSimilarity(article.title, existing.title) > 0.92
    );
    if (!isDup) {
      result.push(article);
    }
  }
  return result;
}

// Simple character-bigram Jaccard similarity (proxy for Jaro-Winkler)
function titleSimilarity(a, b) {
  const sa = a.toLowerCase().replace(/[^a-z0-9]/g, '');
  const sb = b.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (!sa || !sb) return 0;

  const bigramsA = getBigrams(sa);
  const bigramsB = getBigrams(sb);

  const setA = new Set(bigramsA);
  const setB = new Set(bigramsB);

  let intersection = 0;
  for (const bg of setA) {
    if (setB.has(bg)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 1 : intersection / union;
}

function getBigrams(s) {
  const bigrams = [];
  for (let i = 0; i < s.length - 1; i++) {
    bigrams.push(s.slice(i, i + 2));
  }
  return bigrams;
}
