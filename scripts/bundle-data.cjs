/**
 * 合并所有 JSON 数据到一个 data.js 模块，供 data-loader.js 直接 import
 * 避免线上环境 fetch JSON 的跨域/路径问题
 */

const fs = require('fs');
const path = require('path');

// Use cwd since __dirname may not resolve correctly on all environments
const baseDir = process.cwd();
const dataDir = path.join(baseDir, 'site', 'data');
const outFile = path.join(baseDir, 'site', 'assets', 'js', 'data.js');

const data = {};

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
for (const f of files) {
  const key = f.replace('.json', '');
  const content = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  data[key] = content;
}

const js = `// Auto-generated data bundle — do not edit manually
// Generated at: ${new Date().toISOString()}

export const NEWS_DATA = ${JSON.stringify(data, null, 2)};

export default NEWS_DATA;
`;

fs.writeFileSync(outFile, js);
console.log(`Data bundled: ${files.length} files → ${outFile}`);
console.log('Sections:', files.join(', '));
