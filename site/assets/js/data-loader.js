// data-loader.js — Inline data import (no fetch/CORS issues)
import { NEWS_DATA } from './data.js';
import { todayBeijingDate, yesterdayBeijingDate, formatDate } from './utils.js';

// Load latest.json (dashboard data)
export async function loadLatest() {
  return NEWS_DATA.latest || null;
}

// Load a specific section's JSON
export async function loadSection(sectionId) {
  return NEWS_DATA[sectionId] || null;
}

// Load sources registry
export async function loadSources() {
  return NEWS_DATA.sources || [];
}

// Load an archive day
export async function loadArchive(dateStr) {
  const key = `archive-${dateStr}`;
  return NEWS_DATA[key] || null;
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
