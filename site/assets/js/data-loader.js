// data-loader.js — Fetch JSON data and manage in-memory cache

import { todayBeijingDate, yesterdayBeijingDate, formatDate } from './utils.js';

const cache = {};

// Load latest.json (dashboard data)
export async function loadLatest() {
  if (cache.latest) return cache.latest;
  try {
    const resp = await fetch('data/latest.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cache.latest = await resp.json();
    return cache.latest;
  } catch (err) {
    console.error('Failed to load latest.json:', err);
    return null;
  }
}

// Load a specific section's JSON
export async function loadSection(sectionId) {
  if (cache[sectionId]) return cache[sectionId];
  try {
    const resp = await fetch(`data/${sectionId}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cache[sectionId] = await resp.json();
    return cache[sectionId];
  } catch (err) {
    console.error(`Failed to load ${sectionId}.json:`, err);
    return null;
  }
}

// Load sources registry
export async function loadSources() {
  if (cache.sources) return cache.sources;
  try {
    const resp = await fetch('data/sources.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cache.sources = await resp.json();
    return cache.sources;
  } catch (err) {
    console.error('Failed to load sources.json:', err);
    return [];
  }
}

// Load an archive day
export async function loadArchive(dateStr) {
  const key = `archive-${dateStr}`;
  if (cache[key]) return cache[key];
  try {
    const resp = await fetch(`data/archive/${dateStr}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cache[key] = await resp.json();
    return cache[key];
  } catch (err) {
    console.warn(`No archive for ${dateStr}`);
    return null;
  }
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
