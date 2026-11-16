#!/usr/bin/env node

/**
 * CV & Publications Sync Tool (Bidirectional)
 * 
 * Bridges flipphillips.com (src/data/publications.bib) with Flip's paper CV
 * repository at ~/GitHub/fpcv (publications.bib and cv.tex).
 * 
 * Usage:
 *   node scripts/sync-cv.js           # Bidirectional sync (merges new/edited entries between website & fpcv)
 *   node scripts/sync-cv.js --pull    # Pulls fpcv/publications.bib -> website (preserves website metadata)
 *   node scripts/sync-cv.js --push    # Pushes website publications.bib -> fpcv
 *   node scripts/sync-cv.js --diff    # Shows diffs (website vs fpcv bib, plus bib vs cv.tex)
 *   node scripts/sync-cv.js --latex   # Prints formatted LaTeX entries for cv.tex
 *   node scripts/sync-cv.js --latex 2026 # Prints formatted LaTeX entries for a given year
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseBibTeX,
  serializeBibTeX,
  parsePublicationsFromBib,
  cleanBibString,
} from '../src/data/bibtex.ts';

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
const isPull = args.includes('--pull');
const isPush = args.includes('--push');
const isYear = args.find((a) => /^\d{4}$/.test(a));

// Website-specific metadata fields to preserve during merges
const WEB_FIELDS = new Set(['pdf', 'image', 'post', 'highlight', 'type', 'typelabel']);

function sortEntriesByYearDesc(entries) {
  return [...entries].sort((a, b) => {
    const yearA = parseInt(a.fields.year, 10) || 0;
    const yearB = parseInt(b.fields.year, 10) || 0;
    if (yearB !== yearA) return yearB - yearA;
    return a.citeKey.localeCompare(b.citeKey);
  });
}

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

function mergeEntries(localEntries, fpcvEntries, mode = 'bidirectional') {
  const localMap = new Map(localEntries.map((e) => [e.citeKey, e]));
  const fpcvMap = new Map(fpcvEntries.map((e) => [e.citeKey, e]));

  const mergedMap = new Map();
  const addedToFpcv = [];
  const addedToLocal = [];
  const updatedFields = [];

  const allKeys = new Set([...localMap.keys(), ...fpcvMap.keys()]);

  for (const key of allKeys) {
    const loc = localMap.get(key);
    const fpc = fpcvMap.get(key);

    if (loc && !fpc) {
      // In website only
      mergedMap.set(key, { ...loc, fields: { ...loc.fields } });
      addedToFpcv.push(key);
    } else if (!loc && fpc) {
      // In fpcv only
      mergedMap.set(key, { ...fpc, fields: { ...fpc.fields } });
      addedToLocal.push(key);
    } else {
      // In both — merge fields
      const mergedFields = { ...loc.fields };
      const changes = [];

      for (const [fName, fVal] of Object.entries(fpc.fields)) {
        if (!fVal) continue;
        const locVal = loc.fields[fName];

        if (WEB_FIELDS.has(fName)) {
          // Web field: keep local unless local is empty
          if (!locVal) {
            mergedFields[fName] = fVal;
            changes.push(`${fName} (from fpcv)`);
          }
        } else {
          // Bibliographic field:
          if (!locVal) {
            mergedFields[fName] = fVal;
            changes.push(`${fName} (new from fpcv)`);
          } else if (locVal !== fVal) {
            if (mode === 'pull') {
              mergedFields[fName] = fVal;
              changes.push(`${fName}: "${locVal}" -> "${fVal}"`);
            } else if (mode === 'push') {
              // keep localVal
            } else {
              // Bidirectional: CV edits take priority for standard citation fields
              mergedFields[fName] = fVal;
              changes.push(`${fName}: "${locVal}" -> "${fVal}"`);
            }
          }
        }
      }

      if (changes.length > 0) {
        updatedFields.push({ key, changes });
      }

      mergedMap.set(key, {
        entryType: fpc.entryType || loc.entryType,
        citeKey: key,
        fields: mergedFields,
      });
    }
  }

  const mergedEntries = sortEntriesByYearDesc(Array.from(mergedMap.values()));
  return {
    mergedEntries,
    addedToFpcv,
    addedToLocal,
    updatedFields,
  };
}

async function main() {
  if (!fs.existsSync(localBibPath)) {
    console.error(`❌ Could not find local BibTeX file at: ${localBibPath}`);
    process.exit(1);
  }

  const localContent = fs.readFileSync(localBibPath, 'utf-8');
  const localEntries = parseBibTeX(localContent);
  const pubs = parsePublicationsFromBib(localContent);

  // LaTeX format mode
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

  const fpcvExists = fs.existsSync(targetBibPath);
  const fpcvContent = fpcvExists ? fs.readFileSync(targetBibPath, 'utf-8') : '';
  const fpcvEntries = fpcvExists ? parseBibTeX(fpcvContent) : [];

  // Diff inspection mode
  if (isDiff) {
    console.log(`\n🔍 Comparing website publications.bib with ~/GitHub/fpcv...\n`);

    const localKeys = new Set(localEntries.map((e) => e.citeKey));
    const fpcvKeys = new Set(fpcvEntries.map((e) => e.citeKey));

    const inLocalOnly = [...localKeys].filter((k) => !fpcvKeys.has(k));
    const inFpcvOnly = [...fpcvKeys].filter((k) => !localKeys.has(k));

    console.log(`📊 Bibliography Comparison:`);
    console.log(`   • Website (src/data/publications.bib): ${localEntries.length} entries`);
    console.log(`   • Paper CV (fpcv/publications.bib):    ${fpcvEntries.length} entries`);

    if (inLocalOnly.length > 0) {
      console.log(`\n   ➕ In Website only (${inLocalOnly.length}):`);
      for (const k of inLocalOnly) console.log(`      • ${k}`);
    }
    if (inFpcvOnly.length > 0) {
      console.log(`\n   ➕ In fpcv only (${inFpcvOnly.length}):`);
      for (const k of inFpcvOnly) console.log(`      • ${k}`);
    }

    // Compare fields for common keys
    const fpcvMap = new Map(fpcvEntries.map((e) => [e.citeKey, e]));
    let fieldDiffCount = 0;
    for (const loc of localEntries) {
      const fpc = fpcvMap.get(loc.citeKey);
      if (!fpc) continue;
      const allFieldKeys = new Set([...Object.keys(loc.fields), ...Object.keys(fpc.fields)]);
      for (const fk of allFieldKeys) {
        if (loc.fields[fk] !== fpc.fields[fk]) {
          if (fieldDiffCount === 0) console.log(`\n   ⚡ Field differences:`);
          console.log(`      • [${loc.citeKey}] ${fk}: site="${loc.fields[fk] || '(none)'}" vs fpcv="${fpc.fields[fk] || '(none)'}"`);
          fieldDiffCount++;
        }
      }
    }

    if (inLocalOnly.length === 0 && inFpcvOnly.length === 0 && fieldDiffCount === 0) {
      console.log(`\n   ✅ Both .bib files are in 100% perfect sync!`);
    }

    // Compare against cv.tex
    console.log(`\n📄 Checking cv.tex representation...`);
    if (fs.existsSync(targetCvTexPath)) {
      const cvTex = fs.readFileSync(targetCvTexPath, 'utf-8');
      const normCv = cvTex
        .toLowerCase()
        .replace(/\\[a-zA-Z]+/g, ' ')
        .replace(/[{}]/g, '')
        .replace(/[—–-]/g, ' ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ');

      function isInCv(p) {
        if (p.doi && cvTex.toLowerCase().includes(p.doi.toLowerCase())) return true;
        if (p.url && cvTex.includes(p.url)) return true;

        const normTitle = p.title
          .toLowerCase()
          .replace(/[—–-]/g, ' ')
          .replace(/[^a-z0-9\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (normCv.includes(normTitle)) return true;

        const titleSnippet = normTitle.slice(0, 25).trim();
        if (titleSnippet.length >= 10 && normCv.includes(titleSnippet)) return true;

        const words = normTitle.split(' ').filter((w) => w.length > 3);
        if (words.length > 0) {
          const matched = words.filter((w) => normCv.includes(w)).length;
          if (matched / words.length >= 0.65) return true;
        }
        return false;
      }

      const missingInCv = pubs.filter((p) => !isInCv(p));

      if (missingInCv.length === 0) {
        console.log(`   ✅ All ${pubs.length} publications are represented in cv.tex!`);
      } else {
        console.log(`   ⚠️ Found ${missingInCv.length} publications in publications.bib not in cv.tex:`);
        for (const m of missingInCv) {
          console.log(`      • [${m.year}] ${m.title} (${m.id})`);
        }
        console.log(`\n   Tip: Run \`npm run cv:latex\` to get formatted LaTeX snippets to paste into cv.tex.`);
      }
    }
    return;
  }

  // Push mode (Website -> fpcv)
  if (isPush) {
    console.log(`\n🚀 Pushing publications.bib from website -> ~/GitHub/fpcv...`);
    const sortedLocal = sortEntriesByYearDesc(localEntries);
    const serialized = serializeBibTeX(sortedLocal);
    fs.writeFileSync(targetBibPath, serialized, 'utf-8');
    console.log(`✅ Pushed ${sortedLocal.length} entries to ${targetBibPath}`);
    return;
  }

  // Pull mode (fpcv -> Website)
  if (isPull) {
    console.log(`\n📥 Pulling publications.bib from ~/GitHub/fpcv -> website...`);
    if (!fpcvExists) {
      console.error(`❌ Target file not found: ${targetBibPath}`);
      return;
    }
    const { mergedEntries, addedToLocal, updatedFields } = mergeEntries(localEntries, fpcvEntries, 'pull');
    const serialized = serializeBibTeX(mergedEntries);
    fs.writeFileSync(localBibPath, serialized, 'utf-8');

    console.log(`✅ Pulled into src/data/publications.bib (${mergedEntries.length} total entries)`);
    if (addedToLocal.length > 0) {
      console.log(`   ➕ Added ${addedToLocal.length} new entries from fpcv: ${addedToLocal.join(', ')}`);
    }
    if (updatedFields.length > 0) {
      console.log(`   ✏️  Updated fields on ${updatedFields.length} entries.`);
    }
    return;
  }

  // Default mode: Bidirectional Sync
  console.log(`\n🔄 Running bidirectional sync between website and ~/GitHub/fpcv...`);
  const { mergedEntries, addedToFpcv, addedToLocal, updatedFields } = mergeEntries(
    localEntries,
    fpcvEntries,
    'bidirectional'
  );

  const serialized = serializeBibTeX(mergedEntries);

  // Write to both files
  fs.writeFileSync(localBibPath, serialized, 'utf-8');
  fs.writeFileSync(targetBibPath, serialized, 'utf-8');

  console.log(`✅ Bidirectional sync complete! (${mergedEntries.length} total entries in sync)`);

  if (addedToFpcv.length > 0) {
    console.log(`   ➕ Pushed to fpcv (${addedToFpcv.length}): ${addedToFpcv.join(', ')}`);
  }
  if (addedToLocal.length > 0) {
    console.log(`   ➕ Pulled to website (${addedToLocal.length}): ${addedToLocal.join(', ')}`);
  }
  if (updatedFields.length > 0) {
    console.log(`   ✏️  Synchronized field updates across ${updatedFields.length} entries.`);
    for (const u of updatedFields.slice(0, 5)) {
      console.log(`      • [${u.key}] ${u.changes.join('; ')}`);
    }
    if (updatedFields.length > 5) {
      console.log(`      • ...and ${updatedFields.length - 5} more`);
    }
  }
  if (addedToFpcv.length === 0 && addedToLocal.length === 0 && updatedFields.length === 0) {
    console.log(`   ✨ Everything was already in perfect sync.`);
  }

  console.log(`\n🎉 Both src/data/publications.bib and fpcv/publications.bib are up to date!`);
}

main().catch((err) => {
  console.error('❌ Error during sync:', err);
  process.exit(1);
});
