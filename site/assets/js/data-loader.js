// data-loader.js — Inline data import (no fetch/CORS issues)
import { NEWS_DATA } from './data.js';
import { todayBeijingDate, yesterdayBeijingDate, formatDate } from './utils.js';

// ─── Dynamically build dashboard data from all sections ───
let _latestCache = null;

export async function loadLatest() {
  if (_latestCache) return _latestCache;

  const today = todayBeijingDate();
  const sections = {};
  const sectionIds = ['core-businesses', 'competitors', 'growth-areas', 'ip-legal', 'macro-environment', 'stakeholders'];

  for (const id of sectionIds) {
    const data = NEWS_DATA[id];
    if (!data) continue;

    const articles = data.articles || [];
    const todayArticles = articles.filter(a => (a.publishedAt || '').split('T')[0] === today);

    sections[id] = {
      title: data.sectionTitle || id,
      articleCount: articles.length,
      todayCount: todayArticles.length,
      topHeadline: articles.length > 0 ? articles[0].title : 'No articles',
    };
  }

  _latestCache = {
    date: today,
    sections,
  };
  return _latestCache;
}

// Load a specific section's JSON
export async function loadSection(sectionId) {
  return NEWS_DATA[sectionId] || null;
}

// Load sources registry — dynamically built from actual articles
export async function loadSources() {
  const sources = {};
  const sectionIds = ['core-businesses', 'competitors', 'growth-areas', 'ip-legal', 'macro-environment', 'stakeholders'];

  for (const id of sectionIds) {
    const data = NEWS_DATA[id];
    if (!data || !data.articles) continue;
    for (const a of data.articles) {
      if (!sources[a.sourceId]) {
        sources[a.sourceId] = {
          id: a.sourceId,
          name: a.source,
          group: a.sourceGroup || 'other',
          groupLabel: (a.sourceGroup || 'other').charAt(0).toUpperCase() + (a.sourceGroup || 'other').slice(1),
        };
      }
    }
  }

  return Object.values(sources);
}

// Load an archive day
export async function loadArchive(dateStr) {
  const key = `archive-${dateStr}`;
  return NEWS_DATA[key] || null;
}

// Load past N days of articles for a specific section (excludes today)
// Returns array of { date, articles[] } sorted newest-first
export async function loadSectionHistory(sectionId, days = 14) {
  const result = [];
  const today = todayBeijingDate();

  for (let i = 1; i <= days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const bj = new Date(d.getTime() + 8 * 60 * 60 * 1000);
    const dateStr = bj.toISOString().slice(0, 10);

    // Skip today (already shown in the main section)
    if (dateStr === today) continue;

    const archive = await loadArchive(dateStr);
    if (!archive || !archive.sections || !archive.sections[sectionId]) continue;

    const sectionData = archive.sections[sectionId];
    const articles = (sectionData.articles || []);
    if (articles.length === 0) continue;

    result.push({ date: dateStr, articles });
  }

  return result;
}

// Build date options for filter: today, yesterday, last 7 days (from archives)
export function getDateOptions() {
  const options = [
    { value: todayBeijingDate(), label: 'Today' },
    { value: yesterdayBeijingDate(), label: 'Yesterday' }
  ];
  // Add last 7 days
  for (let i = 2; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const bj = new Date(d.getTime() + 8 * 60 * 60 * 1000);
    const dateStr = bj.toISOString().slice(0, 10);
    options.push({
      value: dateStr,
      label: formatDate(dateStr)
    });
  }
  return options;
}

// Get source name from id
let sourcesMap = null;
export async function getSourceName(sourceId) {
  if (!sourcesMap) {
    const sources = await loadSources();
    sourcesMap = {};
    for (const s of sources) {
      sourcesMap[s.id] = s;
    }
  }
  return sourcesMap[sourceId]?.name || sourceId;
}
