// Qualcomm-relevance filter: keep articles that mention Qualcomm-related keywords.
// IMPORTANT: Paywalled articles are still included if the title contains "Qualcomm"
// or related keywords. We do NOT require full article text / description.
//
// Date filtering: articles older than MAX_ARTICLE_AGE_DAYS are discarded.
// This prevents direct RSS feeds from including stale articles that the feed
// still serves. Google News already has `when:1d` built into the query, but
// direct RSS feeds return everything in the feed regardless of date.

import { QUALCOMM_KEYWORDS, CONDITIONAL_KEYWORDS, SECTION_KEYWORDS } from '../config/keywords.js';

// Geopolitical keywords: articles matching these pass through even without Qualcomm mention
const GEOPOLITICAL_KEYWORDS = SECTION_KEYWORDS['macro-environment'].subs['geopolitics-export-controls'];

const MAX_ARTICLE_AGE_DAYS = 3;

function isStale(article) {
  if (!article.publishedAt) return false; // Keep if no date (conservative)
  const ageMs = Date.now() - new Date(article.publishedAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays > MAX_ARTICLE_AGE_DAYS;
}

export function filterQualcommRelevant(articles) {
  const keywordFiltered = [];
  const keywordRejected = [];

  for (const article of articles) {
    // Use title alone if description is missing, empty, or only a paywall/subscription notice.
    const desc = article.description || '';
    const isPaywallNotice = /\b(subscrib|subscription|paywall|premium|membership|sign in|log in|register to read)\b/i.test(desc);
    const text = isPaywallNotice
      ? (article.title || '').toLowerCase()
      : `${article.title || ''} ${desc}`.toLowerCase();

    // Check primary keywords
    const hasPrimary = QUALCOMM_KEYWORDS.some(kw =>
      text.includes(kw.toLowerCase())
    );

    // If no primary keyword, check conditional keywords (need co-occurrence)
    if (!hasPrimary) {
      const hasConditional = CONDITIONAL_KEYWORDS.some(kw =>
        text.includes(kw.toLowerCase())
      );
      const hasQualcommBrand = text.includes('qualcomm') ||
        text.includes('snapdragon') ||
        text.includes('骁龙') ||
        text.includes('qcom');

      if (!hasConditional || !hasQualcommBrand) {
        // Exception: geopolitical articles pass through even without Qualcomm mention
        const hasGeopolitical = GEOPOLITICAL_KEYWORDS.some(kw =>
          text.includes(kw.toLowerCase())
        );
        if (!hasGeopolitical) {
          keywordRejected.push(article);
          continue;
        }
      }
    }

    keywordFiltered.push(article);
  }

  // Date filtering: discard articles older than MAX_ARTICLE_AGE_DAYS
  const dateFiltered = [];
  const dateRejected = [];
  for (const article of keywordFiltered) {
    if (isStale(article)) {
      dateRejected.push(article);
    } else {
      dateFiltered.push(article);
    }
  }

  if (dateRejected.length > 0) {
    const aged = dateRejected.map(a => `${Math.round((Date.now() - new Date(a.publishedAt).getTime()) / 86400000)}d: ${(a.title || '').slice(0, 60)}`).join('\n    ');
    console.log(`  Date filter: ${dateRejected.length} articles too old (>${MAX_ARTICLE_AGE_DAYS}d):\n    ${aged}`);
  }

  console.log(`  Filter: ${dateFiltered.length} relevant (${keywordFiltered.length - dateFiltered.length} aged out) / ${keywordRejected.length} irrelevant (total ${articles.length})`);
  return dateFiltered;
}
