/**
 * 从 data.js 提取各 section 数据，写回 site/data/ 的 JSON 文件
 * 用于将手动编排的完整数据同步到 build pipeline 的数据目录
 * Run: node scripts/sync-data-from-js.cjs
 */

const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();
const dataJsFile = path.join(baseDir, 'site', 'assets', 'js', 'data.js');
const dataDir = path.join(baseDir, 'site', 'data');

// Read data.js and extract the JSON portion
const jsContent = fs.readFileSync(dataJsFile, 'utf8');

// Extract the JSON object between "export const NEWS_DATA = " and ";"
const match = jsContent.match(/export const NEWS_DATA = ([\s\S]*?);\s*export default/);
if (!match) {
  console.error('Could not parse data.js');
  process.exit(1);
}

const dataJson = match[1];
const data = JSON.parse(dataJson);
console.log('Parsed data.js successfully');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write each section as a JSON file
const sectionKeys = [
  'competitors', 'core-businesses', 'growth-areas', 'ip-legal',
  'macro-environment', 'stakeholders'
];

for (const key of sectionKeys) {
  if (data[key]) {
    const filePath = path.join(dataDir, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data[key], null, 2));
    const articleCount = data[key].articles?.length || 0;
    console.log(`  ${key}.json: ${articleCount} articles`);
  }
}

// Write sources.json
if (data.sources) {
  const filePath = path.join(dataDir, 'sources.json');
  fs.writeFileSync(filePath, JSON.stringify(data.sources, null, 2));
  console.log(`  sources.json: ${data.sources.length} sources`);
}

// Write latest.json
if (data.latest) {
  const filePath = path.join(dataDir, 'latest.json');
  fs.writeFileSync(filePath, JSON.stringify(data.latest, null, 2));
  console.log(`  latest.json: ${data.latest.totalArticles} total articles`);
}

console.log(`\nDone! Synced ${sectionKeys.length} sections + sources + latest to site/data/.`);
