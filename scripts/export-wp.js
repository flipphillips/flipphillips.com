import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WP_API = 'https://flipphillips.com/wp-json/wp/v2';

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
});
td.use(gfm);

// Custom Turndown rules for WordPress specific quirks
td.addRule('wpBlockquote', {
  filter: 'blockquote',
  replacement: (content) => {
    const lines = content.trim().split('\n').map(l => `> ${l}`).join('\n');
    return `\n\n${lines}\n\n`;
  }
});

td.addRule('wpImages', {
  filter: 'img',
  replacement: (content, node) => {
    const alt = node.getAttribute('alt') || '';
    let src = node.getAttribute('src') || '';
    // If lazy loaded, check data-src
    const dataSrc = node.getAttribute('data-src');
    if (dataSrc && (!src || src.startsWith('data:'))) {
      src = dataSrc;
    }
    // Clean up photon / jetpack query params
    if (src.includes('?')) {
      const cleanSrc = src.split('?')[0];
      // only strip query if it's an image
      if (cleanSrc.match(/\.(jpe?g|png|gif|webp|svg)$/i)) {
        src = cleanSrc;
      }
    }
    return `![${alt}](${src})`;
  }
});

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) {
    if (res.status === 400 || res.status === 404) return null;
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return await res.json();
}

async function fetchAllPages(endpoint) {
  let page = 1;
  const items = [];
  while (true) {
    const url = `${WP_API}/${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`;
    try {
      const data = await fetchJSON(url);
      if (!data || !Array.isArray(data) || data.length === 0) break;
      items.push(...data);
      if (data.length < 100) break;
      page++;
    } catch (e) {
      break;
    }
  }
  return items;
}

function cleanHtml(html) {
  if (!html) return '';
  // remove useless html comments
  let clean = html.replace(/<!--[\s\S]*?-->/g, '');
  // remove empty paragraphs
  clean = clean.replace(/<p>\s*&nbsp;\s*<\/p>/gi, '');
  clean = clean.replace(/<p>\s*<\/p>/gi, '');
  return clean;
}

function decodeHTMLEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '...');
}

async function run() {
  console.log('Fetching taxonomies...');
  const rawCategories = await fetchAllPages('categories');
  const catMap = new Map();
  for (const c of rawCategories) {
    catMap.set(c.id, { name: decodeHTMLEntities(c.name), slug: c.slug });
  }

  const rawTags = await fetchAllPages('tags');
  const tagMap = new Map();
  for (const t of rawTags) {
    tagMap.set(t.id, { name: decodeHTMLEntities(t.name), slug: t.slug });
  }

  console.log(`Loaded ${catMap.size} categories and ${tagMap.size} tags.`);

  console.log('Fetching posts...');
  const posts = await fetchAllPages('posts');
  console.log(`Fetched ${posts.length} posts.`);

  const postsDir = path.join(rootDir, 'src', 'content', 'posts');
  fs.mkdirSync(postsDir, { recursive: true });

  let postCount = 0;
  for (const post of posts) {
    const title = decodeHTMLEntities(post.title?.rendered || 'Untitled');
    const slug = post.slug;
    const date = post.date;
    const modified = post.modified;
    const excerpt = decodeHTMLEntities(td.turndown(cleanHtml(post.excerpt?.rendered || '')).trim());
    
    const categories = (post.categories || [])
      .map(id => catMap.get(id)?.name)
      .filter(Boolean);

    const tags = (post.tags || [])
      .map(id => tagMap.get(id)?.name)
      .filter(Boolean);

    const isFolklore = categories.some(c => c.toLowerCase() === 'folklore') || tags.some(t => t.toLowerCase() === 'folklore');
    const isPublication = categories.some(c => c.toLowerCase().includes('publication')) || tags.some(t => t.toLowerCase().includes('publication'));

    const rawContent = cleanHtml(post.content?.rendered || '');
    let markdownBody = td.turndown(rawContent).trim();

    // YAML Frontmatter
    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `date: ${JSON.stringify(date)}`,
      `modified: ${JSON.stringify(modified)}`,
      `slug: ${JSON.stringify(slug)}`,
      `categories: ${JSON.stringify(categories)}`,
      `tags: ${JSON.stringify(tags)}`,
      `isFolklore: ${isFolklore}`,
      `isPublication: ${isPublication}`,
      excerpt ? `excerpt: ${JSON.stringify(excerpt)}` : null,
      '---',
      '',
      markdownBody,
      ''
    ].filter(l => l !== null).join('\n');

    const filePath = path.join(postsDir, `${slug}.md`);
    fs.writeFileSync(filePath, frontmatter, 'utf-8');
    postCount++;
  }
  console.log(`Exported ${postCount} posts to src/content/posts/.`);

  console.log('Fetching static pages...');
  const pages = await fetchAllPages('pages');
  console.log(`Fetched ${pages.length} pages.`);

  const pagesDir = path.join(rootDir, 'src', 'content', 'pages');
  fs.mkdirSync(pagesDir, { recursive: true });

  let pageCount = 0;
  for (const p of pages) {
    const title = decodeHTMLEntities(p.title?.rendered || 'Untitled');
    const slug = p.slug;
    const date = p.date;
    const rawContent = cleanHtml(p.content?.rendered || '');
    const markdownBody = td.turndown(rawContent).trim();

    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `date: ${JSON.stringify(date)}`,
      `slug: ${JSON.stringify(slug)}`,
      '---',
      '',
      markdownBody,
      ''
    ].join('\n');

    const filePath = path.join(pagesDir, `${slug}.md`);
    fs.writeFileSync(filePath, frontmatter, 'utf-8');
    pageCount++;
  }
  console.log(`Exported ${pageCount} pages to src/content/pages/.`);

  // Summarize Folklore and Publications counts
  const folklorePosts = posts.filter(p => {
    const cats = (p.categories || []).map(id => catMap.get(id)?.name || '');
    const tgs = (p.tags || []).map(id => tagMap.get(id)?.name || '');
    return cats.some(c => c.toLowerCase() === 'folklore') || tgs.some(t => t.toLowerCase() === 'folklore');
  });

  console.log(`Folklore stories identified: ${folklorePosts.length}`);
  for (const f of folklorePosts.slice(0, 8)) {
    console.log(`  - ${decodeHTMLEntities(f.title.rendered)}`);
  }
}

run().catch(console.error);
