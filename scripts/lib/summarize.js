// Summary generation: per-article key messages + daily briefing synthesis
// Default: rule-based. When OPENAI_API_KEY is set, uses LLM for richer briefing.

import { SECTION_KEYWORDS } from '../config/keywords.js';
import { SUB_LABELS } from '../config/sections.js';

// Generate 3-5 sentence key messages from article description
export function generateArticleSummaries(articles) {
  for (const article of articles) {
    article.summary = buildArticleSummary(article);
  }
  return articles;
}

function buildArticleSummary(article) {
  const desc = article.description || '';

  if (!desc || desc.length < 10) {
    // Fallback: single-sentence teaser from title + source
    return `${article.title} — reported by ${article.source}.`;
  }

  // Split into sentences
  const sentences = desc
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.length > 20)
    .slice(0, 5);

  if (sentences.length === 0) {
    return `${article.title} — reported by ${article.source}.`;
  }

  return sentences.join(' ');
}

// Generate daily briefing for each section
export function generateDailyBriefings(sectionsData) {
  for (const [sectionId, sectionData] of Object.entries(sectionsData)) {
    const articles = sectionData.articles || [];
    if (articles.length === 0) {
      sectionData.briefing = {
        summary: `No Qualcomm coverage in this section today. Check back tomorrow at 07:00 CST.`,
        keyTakeaways: []
      };
      continue;
    }

    // Group by sub-category
    const bySub = {};
    for (const a of articles) {
      const sub = a.subCategory || 'general';
      if (!bySub[sub]) bySub[sub] = [];
      bySub[sub].push(a);
    }

    // Key takeaways: top article per sub-category
    const keyTakeaways = [];
    for (const [sub, subsArticles] of Object.entries(bySub)) {
      const top = subsArticles[0]; // already sorted by recency
      const label = SUB_LABELS[sub] || sub;
      keyTakeaways.push({
        text: `${label}: ${top.summary?.slice(0, 200) || top.title}`,
        articleIds: [top.id],
        subCategory: sub
      });
    }

    // Summary: overview of the day's dominant themes
    const topSubs = Object.entries(bySub)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);

    const themeParts = topSubs.map(([sub, subsArticles]) => {
      const label = SUB_LABELS[sub] || sub;
      return `${label} (${subsArticles.length} article${subsArticles.length > 1 ? 's' : ''})`;
    });

    const summary = articles.length === 1
      ? `One article today covering ${articles[0].subLabel || articles[0].subCategory}. ${articles[0].summary?.slice(0, 150)}`
      : `Today's Qualcomm coverage in this section spans ${themeParts.join(', ')}. A total of ${articles.length} article${articles.length > 1 ? 's' : ''} were aggregated from monitored sources.`;

    sectionsData[sectionId].briefing = {
      summary,
      keyTakeaways
    };
  }

  return sectionsData;
}

// LLM-enhanced briefing (if OPENAI_API_KEY is available)
export async function enhanceBriefingWithLLM(sectionId, sectionTitle, articles, briefing) {
  if (!process.env.OPENAI_API_KEY) return briefing;

  try {
    const articleTexts = articles.slice(0, 10).map(a =>
      `- [${a.source}] ${a.title}: ${a.summary?.slice(0, 200)}`
    ).join('\n');

    const prompt = `You are a Qualcomm news analyst. Given today's articles in the "${sectionTitle}" section, write a 3-4 sentence executive summary and 3-5 key takeaways. Each takeaway must reference specific article titles.

Articles:
${articleTexts || 'No articles today.'}

Respond in JSON format:
{
  "summary": "3-4 sentence overview...",
  "keyTakeaways": [
    { "text": "takeaway mentioning article title...", "articleIds": [], "subCategory": "" }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    // Merge LLM outputs back, preserving articleIds from original if possible
    const mergedTakeaways = (parsed.keyTakeaways || []).map(kt => ({
      text: kt.text,
      articleIds: kt.articleIds || [],
      subCategory: kt.subCategory || ''
    }));

    console.log(`  [LLM] Enhanced briefing for ${sectionId}`);
    return {
      summary: parsed.summary || briefing.summary,
      keyTakeaways: mergedTakeaways.length > 0 ? mergedTakeaways : briefing.keyTakeaways
    };
  } catch (err) {
    console.warn(`  [LLM] Enhancement failed for ${sectionId}: ${err.message}`);
    return briefing;
  }
}
