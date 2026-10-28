#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'node:readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pubsFile = path.join(rootDir, 'src', 'data', 'publications.ts');
const pubsAssetDir = path.join(rootDir, 'public', 'pubs');

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
    console.log(`   📋 Copied file into: public/pubs/${filename}`);
    return `${defaultPrefix}/${filename}`;
  }

  if (cleanPath.startsWith('/')) return cleanPath;
  return `${defaultPrefix}/${cleanPath.replace(/^public\//, '').replace(/^(pubs|images)\//, '')}`;
}

function formatAuthor(a) {
  if (typeof a === 'string') return a.trim();
  if (a.family && a.given) {
    const initials = a.given
      .replace(/[\.\-\s]+/g, ' ')
      .trim()
      .split(' ')
      .map((w) => (w[0] ? w[0].toUpperCase() : ''))
      .join('');
    return `${initials} ${a.family}`;
  }
  return a.family || a.name || a.literal || 'Unknown';
}

async function fetchFromDoi(rawDoi) {
  const cleanDoi = rawDoi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '').trim();
  console.log(`\n🔍 Fetching metadata for DOI: ${cleanDoi}...`);

  // Try CSL-JSON directly from doi.org
  try {
    const res = await fetch(`https://doi.org/${cleanDoi}`, {
      headers: {
        Accept: 'application/vnd.citationstyles.csl+json',
        'User-Agent': 'AstroSiteManager/1.0 (mailto:flip.phillips@rit.edu)',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const authors = (data.author || []).map(formatAuthor);
      const year =
        data.issued?.['date-parts']?.[0]?.[0] ||
        data.created?.['date-parts']?.[0]?.[0] ||
        new Date().getFullYear();

      let type = 'journal';
      let typeLabel = 'Journal Article';
      if (data.type === 'paper-conference' || data.type === 'proceedings-article') {
        type = 'conference';
        typeLabel = 'Conference Proceeding';
      } else if (data.type === 'book' || data.type === 'chapter') {
        type = 'book';
        typeLabel = 'Book / Chapter';
      } else if (data.type === 'report') {
        type = 'techreport';
        typeLabel = 'Technical Report';
      }

      return {
        title: (data.title || '').replace(/<[^>]+>/g, '').trim(),
        authors: authors.length > 0 ? authors : ['F Phillips'],
        year: Number(year),
        venue: data['container-title'] || data.publisher || '',
        volume: data.volume ? String(data.volume) : undefined,
        issue: data.issue ? String(data.issue) : undefined,
        pages: data.page ? String(data.page) : undefined,
        doi: cleanDoi,
        type,
        typeLabel,
      };
    }
  } catch (err) {
    // continue to fallback
  }

  // Fallback: Crossref API directly
  try {
    const res = await fetch(`https://api.crossref.org/works/${cleanDoi}`, {
      headers: {
        'User-Agent': 'AstroSiteManager/1.0 (mailto:flip.phillips@rit.edu)',
      },
    });

    if (res.ok) {
      const json = await res.json();
      const item = json.message;
      const authors = (item.author || []).map(formatAuthor);
      const year =
        item.published?.['date-parts']?.[0]?.[0] ||
        item.created?.['date-parts']?.[0]?.[0] ||
        new Date().getFullYear();

      let type = 'journal';
      let typeLabel = 'Journal Article';
      if (item.type === 'proceedings-article') {
        type = 'conference';
        typeLabel = 'Conference Proceeding';
      } else if (item.type === 'book' || item.type === 'book-chapter') {
        type = 'book';
        typeLabel = 'Book / Chapter';
      }

      return {
        title: (item.title?.[0] || '').replace(/<[^>]+>/g, '').trim(),
        authors: authors.length > 0 ? authors : ['F Phillips'],
        year: Number(year),
        venue: item['container-title']?.[0] || item.publisher || '',
        volume: item.volume ? String(item.volume) : undefined,
        issue: item.issue ? String(item.issue) : undefined,
        pages: item.page ? String(item.page) : undefined,
        doi: cleanDoi,
        type,
        typeLabel,
      };
    }
  } catch (err) {
    // ignore
  }

  throw new Error(`Could not resolve DOI: ${cleanDoi}`);
}

function insertPublication(fileContent, pub) {
  if (fileContent.includes(`id: "${pub.id}"`) || fileContent.includes(`id: '${pub.id}'`)) {
    throw new Error(`A publication with ID "${pub.id}" already exists in publications.ts!`);
  }

  const lines = [
    `  {`,
    `    id: ${JSON.stringify(pub.id)},`,
    `    year: ${pub.year},`,
    `    title: ${JSON.stringify(pub.title)},`,
    `    authors: ${JSON.stringify(pub.authors)},`,
    `    venue: ${JSON.stringify(pub.venue)},`,
  ];
  if (pub.volume) lines.push(`    volume: ${JSON.stringify(pub.volume)},`);
  if (pub.issue) lines.push(`    issue: ${JSON.stringify(pub.issue)},`);
  if (pub.pages) lines.push(`    pages: ${JSON.stringify(pub.pages)},`);
  if (pub.doi) lines.push(`    doi: ${JSON.stringify(pub.doi)},`);
  if (pub.url) lines.push(`    url: ${JSON.stringify(pub.url)},`);
  lines.push(`    type: ${JSON.stringify(pub.type)},`);
  lines.push(`    typeLabel: ${JSON.stringify(pub.typeLabel)},`);
  if (pub.highlight) lines.push(`    highlight: true,`);
  if (pub.pdf) lines.push(`    pdf: ${JSON.stringify(pub.pdf)},`);
  if (pub.image) lines.push(`    image: ${JSON.stringify(pub.image)},`);

  // Strip trailing comma from last property
  const lastProp = lines.length - 1;
  lines[lastProp] = lines[lastProp].replace(/,$/, '');
  lines.push(`  },`);

  const pubBlock = lines.join('\n');

  // Find target year header comment: `// <pub.year>`
  const yearHeaderRegex = new RegExp(`(//\\s*${pub.year}\\b)`);
  if (yearHeaderRegex.test(fileContent)) {
    return fileContent.replace(yearHeaderRegex, `$1\n${pubBlock}`);
  }

  // If year not found, find where to insert chronologically (descending)
  const yearMatches = [...fileContent.matchAll(/\/\/\s*(\d{4})\b/g)];
  for (const ym of yearMatches) {
    const existingYear = parseInt(ym[1], 10);
    if (pub.year > existingYear) {
      const idx = ym.index;
      const before = fileContent.slice(0, idx);
      const after = fileContent.slice(idx);
      return `${before}// ${pub.year}\n${pubBlock}\n\n  ${after.trimStart()}`;
    }
  }

  // Older than existing years: insert at end of publications array
  const lastBracket = fileContent.lastIndexOf('];');
  if (lastBracket !== -1) {
    const before = fileContent.slice(0, lastBracket).trimEnd();
    return `${before}\n\n  // ${pub.year}\n${pubBlock}\n];\n`;
  }

  throw new Error('Could not find insertion position in publications.ts');
}

async function main() {
  console.log('\n📚 New Publication Scaffolder for flipphillips.com\n');
  const prompter = new Prompter();

  let pubData = null;
  let doiArg = process.argv.slice(2).find((a) => a.includes('/') || a.startsWith('10.'));

  if (!doiArg) {
    const input = await prompter.ask('Enter DOI (or press Enter for manual entry): ');
    if (input) {
      doiArg = input;
    }
  }

  if (doiArg) {
    try {
      pubData = await fetchFromDoi(doiArg);
      console.log('✅ Found:');
      console.log(`   Title:   ${pubData.title}`);
      console.log(`   Authors: ${pubData.authors.join(', ')}`);
      console.log(`   Venue:   ${pubData.venue} (${pubData.year})`);
    } catch (err) {
      console.warn(`⚠️  ${err.message}. Falling back to manual entry.`);
    }
  }

  if (!pubData) {
    const title = await prompter.ask('Title: ');
    if (!title) {
      console.error('❌ Title is required.');
      prompter.close();
      process.exit(1);
    }
    const authorsRaw = await prompter.ask('Authors (comma-separated, e.g. "F Phillips, DL Long"): ');
    const authors = authorsRaw.split(',').map((a) => a.trim()).filter(Boolean);
    const yearStr = await prompter.ask('Year (e.g. 2026): ');
    const year = parseInt(yearStr, 10) || new Date().getFullYear();
    const venue = await prompter.ask('Venue / Journal / Conference: ');
    const typeStr = await prompter.ask('Type [journal/conference/book/preprint] (default: journal): ');
    const type = ['journal', 'conference', 'book', 'preprint', 'techreport', 'magazine'].includes(typeStr)
      ? typeStr
      : 'journal';
    const typeLabel =
      type === 'conference'
        ? 'Conference Proceeding'
        : type === 'book'
        ? 'Book / Chapter'
        : 'Journal Article';
    const doi = await prompter.ask('DOI (optional): ');

    pubData = {
      title,
      authors: authors.length > 0 ? authors : ['F Phillips'],
      year,
      venue,
      type,
      typeLabel,
      doi: doi || undefined,
    };
  }

  // Generate a clean ID (first 4 words of title + year)
  const titleWords = slugify(pubData.title).split('-').slice(0, 4).join('-');
  const idDefault = `${titleWords}-${pubData.year}`;
  const idInput = await prompter.ask(`ID [${idDefault}]: `);
  pubData.id = idInput || idDefault;

  // Highlight option
  const highlightAns = await prompter.ask('Highlight on homepage / Selected Works? (y/N): ');
  pubData.highlight = highlightAns.toLowerCase().startsWith('y');

  // PDF option (supports drag-and-drop file copying!)
  const pdfInput = await prompter.ask(
    'PDF file (drag & drop from Finder, filename in public/pubs/, or Enter to skip): '
  );
  const pdf = handleAssetInput(pdfInput, pubsAssetDir, '/pubs');
  if (pdf) {
    pubData.pdf = pdf;
  }

  // Thumbnail option (supports drag-and-drop file copying!)
  const imgInput = await prompter.ask(
    'Thumbnail image (drag & drop from Finder, filename in public/pubs/, or Enter to skip): '
  );
  const image = handleAssetInput(imgInput, pubsAssetDir, '/pubs');
  if (image) {
    pubData.image = image;
  }

  prompter.close();

  // Read and update publications.ts
  const currentContent = fs.readFileSync(pubsFile, 'utf-8');
  const updatedContent = insertPublication(currentContent, pubData);

  fs.writeFileSync(pubsFile, updatedContent, 'utf-8');

  console.log(`\n🎉 Successfully added "${pubData.title}" to src/data/publications.ts!`);
  if (pubData.pdf) {
    console.log(`📄 PDF linked: ${pubData.pdf}`);
  }
  if (pubData.image) {
    console.log(`🖼️  Thumbnail linked: ${pubData.image}`);
  }
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
