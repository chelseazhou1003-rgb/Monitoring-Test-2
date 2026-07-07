// Qualcomm-relevance filter: only keep articles mentioning Qualcomm-related keywords

import { QUALCOMM_KEYWORDS, CONDITIONAL_KEYWORDS } from '../config/keywords.js';

export function filterQualcommRelevant(articles) {
  const filtered = [];
  const rejected = [];

  for (const article of articles) {
    const text = `${article.title} ${article.description}`.toLowerCase();

    // Check primary keywords
    const hasPrimary = QUALCOMM_KEYWORDS.some(kw =>
      text.includes(kw.toLowerCase())
    );

    // If no primary keyword, check conditional keywords (need co-occurrence)
    if (!hasPrimary) {
      // Check if text has both a conditional keyword AND any Qualcomm brand term
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
