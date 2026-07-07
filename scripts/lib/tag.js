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
          // Count occurrences (case-insensitive)
          const regex = new RegExp(kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
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
        if (text.includes(kw.toLowerCase())) {
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
        if (text.includes(kw.toLowerCase())) {
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
