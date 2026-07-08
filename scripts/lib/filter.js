// Qualcomm-relevance filter: keep articles that mention Qualcomm-related keywords.
// IMPORTANT: Paywalled articles are still included if the title contains "Qualcomm"
// or related keywords. We do NOT require full article text / description.

import { QUALCOMM_KEYWORDS, CONDITIONAL_KEYWORDS } from '../config/keywords.js';

export function filterQualcommRelevant(articles) {
  const filtered = [];
  const rejected = [];

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
        rejected.push(article);
        continue;
      }
    }

    filtered.push(article);
  }

  console.log(`  Filter: ${filtered.length} Qualcomm-relevant / ${rejected.length} rejected (total ${articles.length})`);
  return filtered;
}
