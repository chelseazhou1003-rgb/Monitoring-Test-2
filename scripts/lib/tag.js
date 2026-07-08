// Article tagging: assign section, sub-category, and competitor tags

import { SECTION_KEYWORDS, COMPETITOR_KEYWORDS, STAKEHOLDER_KEYWORDS } from '../config/keywords.js';
import { SUB_LABELS } from '../config/sections.js';

export function tagArticles(articles) {
  for (const article of articles) {
    const text = `${article.title} ${article.description}`.toLowerCase();

    // --- Section + sub-category tagging ---
    let bestSection = null;
    let bestSub = null;
    let bestScore = 0;

    for (const [sectionId, sectionData] of Object.entries(SECTION_KEYWORDS)) {
      for (const [subId, keywords] of Object.entries(sectionData.subs)) {
        let score = 0;
        for (const kw of keywords) {
          const kwLower = kw.toLowerCase();
          // Escape special regex characters
          const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Short keywords (<=3 chars) need word-boundary matching to avoid
          // false positives: e.g. "AR" matching "bROArder", "AI" matching "agAIn"
          const pattern = kwLower.length <= 3
            ? `\\b${escaped}\\b`
            : escaped;
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

    article.section = bestSection || 'core-businesses';
    article.subCategory = bestSub || 'semiconductors';
    article.subLabel = SUB_LABELS[article.subCategory] || article.subCategory;

    // --- Competitor cross-tagging ---
    const competitors = [];
    for (const [compId, keywords] of Object.entries(COMPETITOR_KEYWORDS)) {
      for (const kw of keywords) {
        // Use word-boundary matching for short/acronym keywords to prevent
        // false positives (e.g. "M1" matching "ARM1", "SIA" matching "ASIA")
        const kwLower = kw.toLowerCase();
        const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = kwLower.length <= 4
          ? `\\b${escaped}\\b`
          : escaped;
        if (new RegExp(pattern, 'i').test(text)) {
          if (!competitors.includes(compId)) {
            competitors.push(compId);
          }
          break;
        }
      }
    }
    article.competitors = competitors;

    // --- Stakeholder cross-tagging ---
    const stakeholders = [];
    for (const [stakeId, keywords] of Object.entries(STAKEHOLDER_KEYWORDS)) {
      for (const kw of keywords) {
        // Use word-boundary matching for short/acronym keywords to prevent
        // false positives (e.g. "SEMI" matching "semiconductor", "SIA" matching "ASIA")
        const kwLower = kw.toLowerCase();
        const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = kwLower.length <= 4
          ? `\\b${escaped}\\b`
          : escaped;
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
