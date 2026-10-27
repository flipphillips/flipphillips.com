import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const postsDir = path.join(rootDir, 'src', 'content', 'posts');
const pagesDir = path.join(rootDir, 'src', 'content', 'pages');
const publicDir = path.join(rootDir, 'public');

const allFiles = [
  ...fs.readdirSync(postsDir).map(f => path.join(postsDir, f)),
  ...fs.readdirSync(pagesDir).map(f => path.join(pagesDir, f))
];

// Regex to capture full URL and the path after wp-content/uploads/
const imgRegex = /https?:\/\/[^\s\)\"\']+\/wp-content\/uploads\/([^\s\)\"\']+\.(?:jpe?g|png|gif|webp|svg|pdf))/gi;

const urlMap = new Map(); // cleanUrl -> relativePath

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    let rawUrl = match[0].split('?')[0];
    let relPath = match[1].split('?')[0];
    urlMap.set(rawUrl, relPath);
  }
}

console.log(`Found ${urlMap.size} unique upload assets to download.`);

async function downloadAsset(url, relPath) {
  const targetPath = path.join(publicDir, 'images', 'uploads', relPath);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 0) {
    return true;
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      console.warn(`Failed ${res.status}: ${url}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);
    return true;
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function run() {
  const entries = Array.from(urlMap.entries());
  const concurrency = 12;
  let index = 0;
  let success = 0;

  async function worker() {
    while (index < entries.length) {
      const i = index++;
      const [url, relPath] = entries[i];
      const ok = await downloadAsset(url, relPath);
      if (ok) success++;
      if (index % 50 === 0 || index === entries.length) {
        console.log(`Progress: ${index}/${entries.length} assets processed...`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  console.log(`Downloaded ${success}/${entries.length} assets.`);

  // Now rewrite links in markdown files
  console.log('Rewriting markdown links to local /images/uploads/...');
  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;
    for (const [url, relPath] of urlMap.entries()) {
      if (content.includes(url)) {
        content = content.replaceAll(url, `/images/uploads/${relPath}`);
        changed = true;
      }
      // Also handle when URL had ?ssl=1 or photon queries
      const queryMatch = new RegExp(`https?:\\/\\/[^\\s\\)\\\"\\']+\\/wp-content\\/uploads\\/${relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\?[^\\s\\)\\\"\\']*)?`, 'g');
      if (queryMatch.test(content)) {
        content = content.replace(queryMatch, `/images/uploads/${relPath}`);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(file, content, 'utf-8');
    }
  }
  console.log('All markdown files updated with local paths.');
}

run().catch(console.error);
