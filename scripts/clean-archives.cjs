// Clean archive files: remove articles from sources not in the configured 23 feeds
const fs = require('fs');
const path = require('path');

const VALID_SOURCE_IDS = new Set([
  'reuters', 'bloomberg', 'wsj', 'ft', 'cnbc', 'yahoo-finance',
  'the-information', 'techcrunch', 'the-verge', 'venturebeat',
  'eetimes', 'semiconductor-engineering', 'semiconductor-digest', 'silicon-semiconductor',
  'iam', 'ipwatchdog', 'patently-o', 'law360-ip', 'ip-fray',
  'light-reading', 'rcr-wireless', 'mobile-world-live', 'fierce-wireless'
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
    section.articles = section.articles.filter(a => VALID_SOURCE_IDS.has(a.sourceId));
    const after = section.articles.length;
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
    console.log(`  ${f}: removed ${fileRemoved} article(s), now ${newTotal} total`);
  } else {
    console.log(`  ${f}: no changes (${newTotal} total)`);
  }
}

console.log(`\nTotal removed: ${totalRemoved} articles from invalid sources`);
