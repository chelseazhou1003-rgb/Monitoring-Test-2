// Clean archive files: remove ONLY Android Headlines, MarketBeat, ServeTheHome
// Keep Fortune, Qualcomm Newsroom, Data Center Dynamics (will be added as feeds)
// Keep 24/7 Wall St, TrendForce (were in original backfill; user didn't ask to remove)
const fs = require('fs');
const path = require('path');

const REMOVE_SOURCE_IDS = new Set([
  'android-headlines',
  'marketbeat',
  'servethehome'
]);

const archiveDir = path.join('site', 'data', 'archive');
const files = fs.readdirSync(archiveDir).filter(f => f.endsWith('.json'));

let totalRemoved = 0;

for (const f of files.sort()) {
  const filePath = path.join(archiveDir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fileRemoved = 0;

  for (const sid of Object.keys(data.sections || {})) {
    const section = data.sections[sid];
    const before = section.articles.length;
    section.articles = section.articles.filter(a => !REMOVE_SOURCE_IDS.has(a.sourceId));
    const after = section.articles.length;
    if (before !== after) {
      console.log(`  [${f}] ${sid}: removed ${before - after} article(s) — ${a => a.sourceId}`);
      section.articles.filter(a => REMOVE_SOURCE_IDS.has(a.sourceId)).forEach(a => {
        console.log(`    -> ${a.source} (${a.sourceId}): ${a.title?.slice(0, 60)}`);
      });
    }
    fileRemoved += before - after;
  }

  // Recalculate totalArticles
  let newTotal = 0;
  for (const sid of Object.keys(data.sections || {})) {
    newTotal += data.sections[sid].articles.length;
  }
  data.totalArticles = newTotal;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  totalRemoved += fileRemoved;
  if (fileRemoved > 0) {
    console.log(`  ${f}: removed ${fileRemoved} article(s), now ${newTotal} total\n`);
  } else {
    console.log(`  ${f}: no changes (${newTotal} total)`);
  }
}

console.log(`\nTotal removed: ${totalRemoved} articles (Android Headlines, MarketBeat, ServeTheHome only)`);
