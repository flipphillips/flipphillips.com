#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'node:readline';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'src', 'content', 'posts');
const imagesDir = path.join(rootDir, 'public', 'images');

class Prompter {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: process.stdin.isTTY,
    });
    this.iterator = this.rl[Symbol.asyncIterator]();
  }
  async ask(question) {
    process.stdout.write(question);
    const { value, done } = await this.iterator.next();
    if (done) return '';
    return (value || '').trim();
  }
  close() {
    this.rl.close();
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function handleAssetInput(input, targetDir, defaultPrefix) {
  if (!input) return null;
  let cleanPath = input.replace(/^['"]|['"]$/g, '').replace(/\\ /g, ' ').trim();
  if (cleanPath.startsWith('~/')) {
    cleanPath = path.join(process.env.HOME || '', cleanPath.slice(2));
  }

  // If drag-and-dropped real file from Finder
  if (fs.existsSync(cleanPath) && fs.statSync(cleanPath).isFile()) {
    const filename = path.basename(cleanPath);
    const destPath = path.join(targetDir, filename);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(cleanPath, destPath);
    console.log(`   📋 Copied image into: public/images/${filename}`);
    return `${defaultPrefix}/${filename}`;
  }

  if (cleanPath.startsWith('/')) return cleanPath;
  return `${defaultPrefix}/${cleanPath.replace(/^public\//, '').replace(/^(images|pubs)\//, '')}`;
}

async function main() {
  console.log('\n📝 New Post / Folklore Creator for flipphillips.com\n');
  const prompter = new Prompter();

  let title = process.argv.slice(2).join(' ').trim();
  if (!title) {
    title = await prompter.ask('Title: ');
  }

  if (!title) {
    console.error('❌ Title is required.');
    prompter.close();
    process.exit(1);
  }

  const slug = slugify(title);
  if (!slug) {
    console.error('❌ Could not generate valid slug from title.');
    prompter.close();
    process.exit(1);
  }

  const filePath = path.join(postsDir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    console.error(`❌ Post file already exists at: ${filePath}`);
    prompter.close();
    process.exit(1);
  }

  const isFolkloreAns = await prompter.ask('Is this a Folklore story? (Y/n): ');
  const isFolklore = !isFolkloreAns || isFolkloreAns.toLowerCase().startsWith('y');

  const category = isFolklore ? 'Folklore' : 'Dispatches';
  const rawTags = await prompter.ask('Tags (comma-separated, optional): ');
  const tags = rawTags
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : (isFolklore ? ['folklore'] : []);

  const excerpt = await prompter.ask('Short excerpt / summary (optional): ');

  const thumbInput = await prompter.ask(
    'Thumbnail image (drag & drop file, filename in public/images/, or Enter to skip): '
  );
  const featuredImage = handleAssetInput(thumbInput, imagesDir, '/images');

  prompter.close();

  const now = new Date();
  const dateStr = now.toISOString().replace(/\.\d{3}Z$/, '');

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `date: "${dateStr}"`,
    `slug: "${slug}"`,
    `categories: [${JSON.stringify(category)}]`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    `isFolklore: ${isFolklore}`,
  ];

  if (featuredImage) {
    frontmatter.push(`featuredImage: ${JSON.stringify(featuredImage)}`);
  }

  if (excerpt) {
    frontmatter.push(`excerpt: ${JSON.stringify(excerpt)}`);
  }

  frontmatter.push('---');
  frontmatter.push('');
  if (featuredImage) {
    frontmatter.push(`![${title}](${featuredImage})`);
    frontmatter.push('');
  }
  frontmatter.push(`Write your ${isFolklore ? 'folklore story' : 'post'} content here...`);
  frontmatter.push('');

  fs.writeFileSync(filePath, frontmatter.join('\n'), 'utf-8');

  console.log(`\n✅ Created: src/content/posts/${slug}.md`);
  console.log(`🔗 URL will be: /folklore/${slug}`);

  // Try opening in VS Code if available
  try {
    spawn('code', [filePath], { detached: true, stdio: 'ignore' }).unref();
  } catch (e) {
    // ignore
  }
}

main().catch((err) => {
  console.error('Error creating post:', err);
  process.exit(1);
});
