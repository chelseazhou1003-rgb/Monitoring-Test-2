#!/usr/bin/env node

// Build orchestrator: fetch all RSS feeds, filter, tag, dedupe, summarize, write JSON
// Run: node scripts/build.js

import { FEEDS, buildSourcesRegistry } from './config/feeds.js';
import { SECTIONS } from './config/sections.js';
import { fetchAllNativeRss } from './lib/fetch-feeds.js';
import { fetchAllGoogleNews } from './lib/google-news.js';
import { filterQualcommRelevant } from './lib/filter.js';
import { tagArticles } from './lib/tag.js';
import { deduplicateArticles } from './lib/dedupe.js';
import { generateArticleSummaries, generateDailyBriefings } from './lib/summarize.js';
import { todayDate, isoNow, writeAllData } from './lib/io.js';

async function main() {
  console.log('=== Qualcomm News Monitor — Daily Build ===');
  console.log(`Started: ${isoNow()}`);
  console.log(`Beijing date: ${todayDate()}`);
  console.log('');

  // Step 1: Fetch all sources
  console.log('--- Step 1: Fetching RSS feeds ---');
  const nativeItems = await fetchAllNativeRss(FEEDS);
  const googleItems = await fetchAllGoogleNews(FEEDS);
  const allItems = [...nativeItems, ...googleItems];
  console.log(`  Total fetched: ${allItems.length} (${nativeItems.length} native RSS + ${googleItems.length} Google News)`);

  // Step 2: Filter for Qualcomm relevance
  console.log('\n--- Step 2: Filtering for Qualcomm relevance ---');
  let relevant = filterQualcommRelevant(allItems);

  // Step 3: Deduplicate
  console.log('\n--- Step 3: Deduplicating ---');
  let articles = deduplicateArticles(relevant);

  // Step 4: Tag with sections, sub-categories, competitors, stakeholders
  console.log('\n--- Step 4: Tagging articles ---');
  articles = tagArticles(articles);

  // Step 5: Generate per-article summaries
  console.log('\n--- Step 5: Generating article summaries ---');
  articles = generateArticleSummaries(articles);

  // Step 6: Sort by published date (newest first), assign IDs
  articles.sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });
  articles.forEach((a, i) => { a.id = `a${i + 1}`; });

  // Step 7: Group by section
  console.log('\n--- Step 6: Grouping by section ---');
  const sectionsData = {};
  for (const section of SECTIONS) {
    const sectionArticles = articles.filter(a => a.section === section.id);
    sectionsData[section.id] = {
      generatedAt: isoNow(),
      date: todayDate(),
      section: section.id,
      sectionTitle: section.title,
      briefing: null, // Will be filled by generateDailyBriefings
      articles: sectionArticles
    };
  }

  // Also include competitor-tagged articles in the competitors section
  const competitorArticles = articles.filter(a =>
    a.competitors && a.competitors.length > 0
  );
  // Merge into competitors section (avoid duplicates)
  const existingIds = new Set(sectionsData.competitors.articles.map(a => a.id));
  const newCompetitorArticles = competitorArticles.filter(a => !existingIds.has(a.id));
  sectionsData.competitors.articles = [
    ...sectionsData.competitors.articles,
    ...newCompetitorArticles
  ];
  sectionsData.competitors.articles.sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });

  // Step 8: Generate daily briefings
  console.log('\n--- Step 7: Generating daily briefings ---');
  generateDailyBriefings(sectionsData);
  console.log('  Briefings generated for all sections');

  // Step 9: Write all data files
  console.log('\n--- Step 8: Writing data files ---');
  const sourcesRegistry = buildSourcesRegistry();
  const result = writeAllData(todayDate(), sectionsData, sourcesRegistry);

  // Summary
  console.log('\n=== Build Complete ===');
  console.log(`Date: ${todayDate()}`);
  console.log(`Total articles: ${result.totalArticles}`);
  for (const [id, info] of Object.entries(result.latest.sections)) {
    console.log(`  ${info.title}: ${info.articleCount} articles`);
  }
  console.log(`Finished: ${isoNow()}`);
  // Force exit to prevent any lingering network sockets/timers from keeping the process alive in CI
  process.exit(0);
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
