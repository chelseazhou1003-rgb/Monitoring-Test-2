// IO utilities: read/write JSON, date helpers, archive management

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'site/data';
const ARCHIVE_DIR = path.join(DATA_DIR, 'archive');
const RETENTION_DAYS = 30;

export function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeJson(filepath, data) {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  Wrote: ${filepath}`);
}

export function readJson(filepath) {
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

export function todayDate() {
  // Returns Beijing date (UTC+8)
  const now = new Date();
  const bj = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return bj.toISOString().slice(0, 10);
}

export function isoNow() {
  return new Date().toISOString();
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Prune archives older than RETENTION_DAYS
export function pruneArchives() {
  ensureDir(ARCHIVE_DIR);
  const files = fs.readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.json'));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  let pruned = 0;
  for (const file of files) {
    const dateStr = file.replace('.json', '');
    if (dateStr < cutoffStr) {
      fs.unlinkSync(path.join(ARCHIVE_DIR, file));
      pruned++;
    }
  }
  if (pruned > 0) {
    console.log(`  Pruned ${pruned} old archive(s) (older than ${RETENTION_DAYS}d)`);
  }
}

// Write all section JSONs + latest.json + archive snapshot + sources.json
export function writeAllData(date, sectionsData, sourcesRegistry) {
  ensureDir(DATA_DIR);
  ensureDir(ARCHIVE_DIR);

  const allArticles = [];

  for (const [sectionId, data] of Object.entries(sectionsData)) {
    const filepath = path.join(DATA_DIR, `${sectionId}.json`);
    writeJson(filepath, data);
    allArticles.push(...(data.articles || []));
  }

  // Latest.json — merged view for dashboard
  const latest = {
    generatedAt: isoNow(),
    date,
    sections: Object.fromEntries(
      Object.entries(sectionsData).map(([id, data]) => [
        id,
        {
          title: data.sectionTitle,
          articleCount: (data.articles || []).length,
          topHeadline: (data.articles || [])[0]?.title || null,
          topHeadlineId: (data.articles || [])[0]?.id || null,
          briefingSummary: data.briefing?.summary || null
        }
      ])
    ),
    totalArticles: allArticles.length
  };
  writeJson(path.join(DATA_DIR, 'latest.json'), latest);

  // Archive snapshot
  const archive = {
    generatedAt: isoNow(),
    date,
    sections: sectionsData,
    totalArticles: allArticles.length
  };
  writeJson(path.join(ARCHIVE_DIR, `${date}.json`), archive);

  // Sources registry
  writeJson(path.join(DATA_DIR, 'sources.json'), sourcesRegistry);

  // Prune old archives
  pruneArchives();

  return { latest, totalArticles: allArticles.length };
}
