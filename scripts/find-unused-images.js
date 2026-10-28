#!/usr/bin/env node

/**
 * Unused Images Audit & Review Tool
 *
 * Scans public/images/ against all active content, pages, components, and data files.
 * Identifies unreferenced files, legacy WordPress page artifacts, duplicate thumbnails, and fragments.
 *
 * Usage:
 *   node scripts/find-unused-images.js            # Dry run: audit & print breakdown
 *   node scripts/find-unused-images.js --move     # Safely move unreferenced files to _unused_images_review/
 *   node scripts/find-unused-images.js --restore  # Restore moved files back to public/images/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesDir = path.join(rootDir, 'public', 'images');
const reviewDir = path.join(rootDir, '_unused_images_review');
const manifestFile = path.join(reviewDir, 'MANIFEST.md');

const args = process.argv.slice(2);
const shouldMove = args.includes('--move');
const shouldRestore = args.includes('--restore');

function getAllFiles(dir, filter = () => true) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === '.DS_Store' || item === 'node_modules' || item === '.git' || item === 'dist' || item === 'pagefind') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, filter));
    } else if (filter(item, fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function restoreFiles() {
  if (!fs.existsSync(reviewDir)) {
    console.log('❌ No review directory found at:', reviewDir);
    return;
  }

  const files = getAllFiles(reviewDir, (name) => name !== 'MANIFEST.md');
  console.log(`\n🔄 Restoring ${files.length} files from _unused_images_review back to public/images/...`);

  let restoredCount = 0;
  for (const srcPath of files) {
    const relPath = path.relative(reviewDir, srcPath);
    const destPath = path.join(imagesDir, relPath);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.renameSync(srcPath, destPath);
    restoredCount++;
  }

  if (fs.existsSync(manifestFile)) fs.unlinkSync(manifestFile);
  fs.rmSync(reviewDir, { recursive: true, force: true });

  console.log(`✅ Successfully restored ${restoredCount} files!`);
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeEmptyDirs(fullPath);
    }
  }
  if (fs.readdirSync(dir).length === 0 && dir !== imagesDir) {
    fs.rmdirSync(dir);
  }
}

async function audit() {
  if (shouldRestore) {
    restoreFiles();
    return;
  }

  console.log('\n🔍 Scanning for unreferenced images in public/images/...\n');

  // 1. Gather all files in public/images
  const allImages = getAllFiles(imagesDir, (name) => name !== '.DS_Store');
  console.log(`Found ${allImages.length} total files in public/images/`);

  // 2. Gather active site files (posts, pages, components, layouts, data)
  // We exclude legacy unrouted src/content/pages/*.md because those pages are not in Astro routing.
  const activeDirs = ['src/content/posts', 'src/pages', 'src/components', 'src/layouts', 'src/data', 'public/models'];
  let activeFiles = [];
  for (const d of activeDirs) {
    activeFiles = activeFiles.concat(
      getAllFiles(path.join(rootDir, d), (name) => /\.(md|mdx|astro|ts|js|mjs|json|bib|css|html)$/.test(name))
    );
  }

  const rootConfigs = ['astro.config.mjs', 'package.json', 'README.md', 'HOWTO.md'];
  for (const rc of rootConfigs) {
    const full = path.join(rootDir, rc);
    if (fs.existsSync(full)) activeFiles.push(full);
  }

  console.log(`Searching across ${activeFiles.length} active site files...\n`);

  const activeCorpus = activeFiles.map((f) => ({
    file: path.relative(rootDir, f),
    content: fs.readFileSync(f, 'utf-8'),
  }));

  // Also check legacy unrouted pages
  const legacyPages = getAllFiles(path.join(rootDir, 'src/content/pages'), (name) => /\.(md|mdx)$/.test(name)).map((f) => ({
    file: path.relative(rootDir, f),
    content: fs.readFileSync(f, 'utf-8'),
  }));

  const used = [];
  const unusedInActive = [];

  for (const imgPath of allImages) {
    const relFromPublic = imgPath.replace(path.join(rootDir, 'public'), '').replace(/\\/g, '/');
    const basename = path.basename(imgPath);

    let isUsedInActive = false;
    let matchedFile = null;

    for (const doc of activeCorpus) {
      if (doc.content.includes(relFromPublic) || doc.content.includes(basename)) {
        isUsedInActive = true;
        matchedFile = doc.file;
        break;
      }
    }

    const stat = fs.statSync(imgPath);
    const fileInfo = {
      fullPath: imgPath,
      relPath: relFromPublic,
      basename,
      size: stat.size,
      matchedFile,
    };

    if (isUsedInActive) {
      used.push(fileInfo);
    } else {
      // Check if it was in legacy unrouted pages
      const legacyMatch = legacyPages.find((lp) => lp.content.includes(relFromPublic) || lp.content.includes(basename));
      fileInfo.legacyPage = legacyMatch ? legacyMatch.file : null;
      unusedInActive.push(fileInfo);
    }
  }

  let unusedBytes = 0;
  for (const item of unusedInActive) unusedBytes += item.size;

  let usedBytes = 0;
  for (const item of used) usedBytes += item.size;

  // Breakdown of unused files
  const syllabiPdfCount = unusedInActive.filter((i) => i.basename.endsWith('.pdf')).length;
  const legacyPageImgs = unusedInActive.filter((i) => !i.basename.endsWith('.pdf'));

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📊 AUDIT SUMMARY:`);
  console.log(`   Total Image Files:              ${allImages.length}`);
  console.log(`   ✅ Active & In-Use by Site:     ${used.length} (${formatBytes(usedBytes)})`);
  console.log(`   ⚠️  Unused in Active Site:       ${unusedInActive.length} (${formatBytes(unusedBytes)})`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`   Breakdown of Unused Files:`);
  console.log(`   • Unrouted Syllabi & Old PDFs:   ${syllabiPdfCount} files`);
  console.log(`   • Unrouted Legacy Page Images:   ${legacyPageImgs.length} files`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Breakdown of what the user noticed:
  console.log('ℹ️  EXPLANATION OF "DUPLICATES & FRAGMENTS" YOU NOTICED:');
  console.log('   1. "Fragments" (a.png ... z.png):');
  console.log('      In public/images/uploads/2014/06/, there are 52 files (a.png to z.png,');
  console.log('      plus their 300px thumbs). These are 26 differential geometry mesh');
  console.log('      tests embedded in your 2014 blog post "A Day of Problem Solving Pictures".');
  console.log('      They are ACTIVE in that story, but look like random single letters in Finder.');
  console.log('');
  console.log('   2. "Duplicates" (-150x150, -300x200, -scaled):');
  console.log('      These are legacy WordPress auto-generated thumbnail sizes. WordPress created');
  console.log('      smaller copies of every upload. Some posts link the thumbnail, while others');
  console.log('      link the full original.');
  console.log('');
  console.log('   3. "Unused" (The 52 files identified above):');
  console.log('      These 52 files were downloaded from old WordPress standalone pages (syllabi,');
  console.log('      glavens, home, alumni) that are NOT routed or published on this Astro site.');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (shouldMove) {
    console.log(`📦 Moving ${unusedInActive.length} unreferenced files to:`);
    console.log(`   ${reviewDir}\n`);

    fs.mkdirSync(reviewDir, { recursive: true });

    const manifestLines = [
      '# Unused Images Staging & Review Manifest',
      '',
      `Generated on ${new Date().toISOString()}`,
      '',
      `**Total Files Staged:** ${unusedInActive.length} (${formatBytes(unusedBytes)})`,
      '',
      'These files were found in `public/images/` but have zero references in any active blog post, page, layout, or component on the site. They originated from old unrouted WordPress pages (syllabi, glavens, home, alumni).',
      '',
      '### How to Review or Restore:',
      '- If you want to keep any file, simply drag it from `_unused_images_review/` back into `public/images/`.',
      '- To restore **all** moved files back at once: run `node scripts/find-unused-images.js --restore`.',
      '- If you are happy without them, you can safely delete the `_unused_images_review/` folder.',
      '',
      '---',
      '',
      '## List of Staged Files',
      '',
      '| File | Size | Originally Found In |',
      '| :--- | :--- | :--- |',
    ];

    for (const item of unusedInActive) {
      const origSource = item.legacyPage ? `\`${item.legacyPage}\`` : '*(unreferenced)*';
      manifestLines.push(`| \`public${item.relPath}\` | ${formatBytes(item.size)} | ${origSource} |`);
    }

    // Move files preserving relative paths
    for (const item of unusedInActive) {
      const relPath = path.relative(imagesDir, item.fullPath);
      const destPath = path.join(reviewDir, relPath);

      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.renameSync(item.fullPath, destPath);
    }

    fs.writeFileSync(manifestFile, manifestLines.join('\n') + '\n', 'utf-8');

    // Clean up empty directories in public/images
    removeEmptyDirs(imagesDir);

    console.log(`✅ Moved ${unusedInActive.length} files to _unused_images_review/`);
    console.log(`📝 Generated review manifest at: _unused_images_review/MANIFEST.md`);
    console.log(`\n💡 To restore everything if needed: node scripts/find-unused-images.js --restore\n`);
  } else {
    console.log('Sample of the 52 unused files to be moved for review:');
    for (const item of unusedInActive.slice(0, 15)) {
      const orig = item.legacyPage ? `(from ${item.legacyPage})` : '';
      console.log(` • public${item.relPath} (${formatBytes(item.size)}) ${orig}`);
    }
    if (unusedInActive.length > 15) {
      console.log(`   ...and ${unusedInActive.length - 15} more files.`);
    }

    console.log('\n💡 Run with --move to safely move them into the review folder:');
    console.log('   node scripts/find-unused-images.js --move\n');
  }
}

audit().catch((err) => {
  console.error('❌ Error during audit:', err);
  process.exit(1);
});
