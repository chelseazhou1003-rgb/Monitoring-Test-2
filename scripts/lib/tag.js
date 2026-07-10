// Article tagging: assign section, sub-category, and competitor tags

import { SECTION_KEYWORDS, COMPETITOR_KEYWORDS, COMPETITOR_CONDITIONS, STAKEHOLDER_KEYWORDS } from '../config/keywords.js';
import { SUB_LABELS } from '../config/sections.js';

export function tagArticles(articles) {
  for (const article of articles) {
    const text = `${article.title} ${article.description}`.toLowerCase();

    // --- Section + sub-category tagging ---
    let bestSection = null;
    let bestSub = null;
    let bestScore = 0;

    for (const [sectionId, sectionData] of Object.entries(SECTION_KEYWORDS)) {
      // Geopolitical bypass articles (no Qualcomm mention) can only be tagged into Macro
      if (article.geopoliticalBypass && sectionId !== 'macro-environment') continue;

      for (const [subId, keywords] of Object.entries(sectionData.subs)) {
        // For competitor subs with co-occurrence conditions (e.g. apple, huawei),
        // skip scoring entirely unless the article also contains IP/patent/SEP terms
        if (sectionId === 'competitors' && COMPETITOR_CONDITIONS[subId]) {
          const hasCondition = COMPETITOR_CONDITIONS[subId].some(condKw => {
            const condLower = condKw.toLowerCase();
            const condEscaped = condLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`\\b${condEscaped}\\b`, 'i').test(text);
          });
          if (!hasCondition) continue;
        }

        let score = 0;
        for (const kw of keywords) {
          const kwLower = kw.toLowerCase();
          // Escape special regex characters
          const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Always use word-boundary matching to avoid false positives:
          // e.g. "AR" matching "bROArder", "Intel" matching "intelligence"
          const pattern = `\\b${escaped}\\b`;
          const regex = new RegExp(pattern, 'gi');
          const matches = text.match(regex);
          if (matches) score += matches.length;
        }
        if (score > bestScore) {
          bestScore = score;
          bestSection = sectionId;
          bestSub = subId;
        }
      }
    }

    // Geopolitical bypass articles default to Macro / Geopolitics if no sub matched
    if (article.geopoliticalBypass && !bestSection) {
      bestSection = 'macro-environment';
      bestSub = 'geopolitics-export-controls';
    }

    article.section = bestSection || 'core-businesses';
    article.subCategory = bestSub || 'semiconductors';
    article.subLabel = SUB_LABELS[article.subCategory] || article.subCategory;

    // --- Competitor cross-tagging ---
    const competitors = [];
    for (const [compId, keywords] of Object.entries(COMPETITOR_KEYWORDS)) {
      let matched = false;
      for (const kw of keywords) {
        // Always use word-boundary matching to prevent false positives
        // (e.g. "M1" matching "ARM1", "Intel" matching "intelligence")
        const kwLower = kw.toLowerCase();
        const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = `\\b${escaped}\\b`;
        if (new RegExp(pattern, 'i').test(text)) {
          matched = true;
          break;
        }
      }

      // For competitors with co-occurrence conditions (e.g. apple, huawei),
      // require the article to also contain at least one IP/patent/SEP term
      if (matched && COMPETITOR_CONDITIONS[compId]) {
        const hasCondition = COMPETITOR_CONDITIONS[compId].some(condKw => {
          const condLower = condKw.toLowerCase();
          const condEscaped = condLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return new RegExp(`\\b${condEscaped}\\b`, 'i').test(text);
        });
        if (!hasCondition) {
          matched = false;
        }
      }

      if (matched && !competitors.includes(compId)) {
        competitors.push(compId);
      }
    }
    article.competitors = competitors;

    // --- Stakeholder cross-tagging ---
    const stakeholders = [];
    for (const [stakeId, keywords] of Object.entries(STAKEHOLDER_KEYWORDS)) {
      for (const kw of keywords) {
        // Always use word-boundary matching to prevent false positives
        // (e.g. "SEMI" matching "semiconductor", "SIA" matching "ASIA")
        const kwLower = kw.toLowerCase();
        const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = `\\b${escaped}\\b`;
        if (new RegExp(pattern, 'i').test(text)) {
          if (!stakeholders.includes(stakeId)) {
            stakeholders.push(stakeId);
          }
          break;
        }
      }
    }
    article.stakeholders = stakeholders;
  }

  // Log section distribution
  const counts = {};
  for (const a of articles) {
    counts[a.section] = (counts[a.section] || 0) + 1;
  }
  console.log('  Tag section distribution:', counts);

  return articles;
}
