#!/usr/bin/env node

/**
 * CV & Publications Sync Tool
 * 
 * Bridges flipphillips.com (src/data/publications.bib) with Flip's paper CV
 * repository at ~/GitHub/fpcv.
 * 
 * Usage:
 *   node scripts/sync-cv.js           # Syncs publications.bib to fpcv
 *   node scripts/sync-cv.js --diff    # Shows diffs between publications.bib and cv.tex
 *   node scripts/sync-cv.js --latex   # Prints formatted LaTeX entries for cv.tex
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePublicationsFromBib } from '../src/data/bibtex.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const localBibPath = path.join(rootDir, 'src', 'data', 'publications.bib');
const fpcvDir = path.join(process.env.HOME || '', 'GitHub', 'fpcv');
const targetBibPath = path.join(fpcvDir, 'publications.bib');
const targetMeBibPath = path.join(fpcvDir, 'me.bib');
const targetCvTexPath = path.join(fpcvDir, 'cv.tex');

const args = process.argv.slice(2);
const isDiff = args.includes('--diff');
const isLatex = args.includes('--latex');
const isYear = args.find((a) => /^\d{4}$/.test(a));

function formatAuthorLatex(author) {
  if (author === 'F Phillips' || author === 'Flip Phillips') return '\\me';
  const parts = author.split(' ');
  return parts.join('~');
}

function formatAuthorsLatex(authors) {
  const formatted = authors.map(formatAuthorLatex);
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} \\& ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(', ')}, \\& ${formatted[formatted.length - 1]}`;
}

function formatEntryLatex(p) {
  const lines = [];
  lines.push(`${p.title},`);
  lines.push(`by ${formatAuthorsLatex(p.authors)}.`);
  let venueLine = `\\emph{${p.venue}}`;
  if (p.volume && p.issue) {
    venueLine += `,\nvol.\\ ${p.volume}, num.\\ ${p.issue}.`;
  } else if (p.volume) {
    venueLine += `,\nvol.\\ ${p.volume}.`;
  } else {
    venueLine += `.`;
  }
  if (p.pages) {
    venueLine = venueLine.replace(/\\.$/, '') + `, pp.\\ ${p.pages.replace(/–/g, '--')}.`;
  }
  lines.push(venueLine);
  if (p.doi) {
    lines.push(`\\doi{${p.doi}}`);
  }
  return lines.join('\n');
}

async function main() {
  if (!fs.existsSync(localBibPath)) {
    console.error(`❌ Could not find local BibTeX file at: ${localBibPath}`);
    process.exit(1);
  }

  const bibContent = fs.readFileSync(localBibPath, 'utf-8');
  const pubs = parsePublicationsFromBib(bibContent);

  if (isLatex) {
    console.log(`\n📄 Formatted LaTeX for Flip's CV (cv.tex format):\n`);
    const targetPubs = isYear ? pubs.filter((p) => p.year === parseInt(isYear, 10)) : pubs;

    let currentYear = 0;
    for (const p of targetPubs) {
      if (p.year !== currentYear) {
        currentYear = p.year;
        console.log(`\\yearsheader{${currentYear}}`);
      }
      console.log(formatEntryLatex(p));
      console.log('');
    }
    return;
  }

  if (!fs.existsSync(fpcvDir)) {
    console.warn(`⚠️  fpcv repo not found at ${fpcvDir}.`);
    console.log(`   Make sure the fpcv repo is cloned at ~/GitHub/fpcv.`);
    return;
  }

  if (isDiff) {
    console.log(`\n🔍 Comparing publications.bib against ${targetCvTexPath}...\n`);
    if (!fs.existsSync(targetCvTexPath)) {
      console.error(`❌ cv.tex not found at ${targetCvTexPath}`);
      return;
    }

    const cvTex = fs.readFileSync(targetCvTexPath, 'utf-8');
    const missingInCv = [];

    for (const p of pubs) {
      const titleSnippet = p.title.slice(0, 25).toLowerCase();
      const doiSnippet = p.doi ? p.doi.toLowerCase() : null;
      const inCv =
        cvTex.toLowerCase().includes(titleSnippet) ||
        (doiSnippet && cvTex.toLowerCase().includes(doiSnippet));
      if (!inCv) {
        missingInCv.push(p);
      }
    }

    if (missingInCv.length === 0) {
      console.log(`✅ All ${pubs.length} publications in publications.bib are represented in cv.tex!`);
    } else {
      console.log(`⚠️  Found ${missingInCv.length} publications in publications.bib not in cv.tex:`);
      for (const m of missingInCv) {
        console.log(`   • [${m.year}] ${m.title} (${m.id})`);
      }
      console.log(`\nTip: Run \`npm run cv:latex\` to get formatted LaTeX snippets to paste into cv.tex.`);
    }
    return;
  }

  // Default: sync publications.bib to ~/GitHub/fpcv/publications.bib
  console.log(`\n🔄 Syncing publications.bib with ~/GitHub/fpcv...`);
  fs.writeFileSync(targetBibPath, bibContent, 'utf-8');
  console.log(`✅ Copied src/data/publications.bib -> ${targetBibPath} (${pubs.length} entries)`);

  // Also check if me.bib exists and offer info
  if (fs.existsSync(targetMeBibPath)) {
    console.log(`ℹ️  fpcv/me.bib exists (contains older Papers app exports).`);
    console.log(`   publications.bib is now up to date with 1986–2026 bibliography.`);
  }

  console.log(`\n🎉 Synchronized successfully!`);
}

main().catch((err) => {
  console.error('❌ Error during sync:', err);
  process.exit(1);
});

