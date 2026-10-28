#!/usr/bin/env node

/**
 * Image Optimization Script for flipphillips.com
 * 
 * Scans public/images for oversized photos (camera/phone exports) and safely
 * compresses and resizes them down to crisp 2048px retina web-masters.
 * Preserves original filenames so no markdown links break.
 *
 * Usage:
 *   node scripts/optimize-images.js [--dry-run] [--max-dim=2048] [--quality=85]
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

function getArgValue(prefix, defaultVal) {
  const arg = args.find(a => a.startsWith(prefix));
  if (!arg) return defaultVal;
  return arg.split('=')[1] || defaultVal;
}

const MAX_DIM = parseInt(getArgValue('--max-dim', '2048'), 10);
const QUALITY = parseInt(getArgValue('--quality', '85'), 10);
const TARGET_DIR = path.resolve('public/images');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function scanDirectory(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(await scanDirectory(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function optimizeImage(filePath) {
  const stat = fs.statSync(filePath);
  const origSize = stat.size;
  const ext = path.extname(filePath).toLowerCase();
  const relPath = path.relative(process.cwd(), filePath);

  try {
    const meta = await sharp(filePath).metadata();
    const needsResize = (meta.width && meta.width > MAX_DIM) || (meta.height && meta.height > MAX_DIM);
    const isHeavy = origSize > 400 * 1024; // > 400KB

    if (!needsResize && !isHeavy) {
      return { status: 'skipped', origSize, newSize: origSize, relPath };
    }

    let pipeline = sharp(filePath).rotate().resize({
      width: MAX_DIM,
      height: MAX_DIM,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 8 });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: QUALITY });
    }

    const outputBuffer = await pipeline.toBuffer();
    const newSize = outputBuffer.length;

    // Only apply if we actually saved space
    if (newSize < origSize) {
      if (!isDryRun) {
        const tmpPath = `${filePath}.tmp-${Date.now()}`;
        fs.writeFileSync(tmpPath, outputBuffer);
        fs.renameSync(tmpPath, filePath);
      }
      return {
        status: 'optimized',
        origSize,
        newSize,
        relPath,
        origDim: `${meta.width}x${meta.height}`,
        savedBytes: origSize - newSize,
      };
    } else {
      return { status: 'kept', origSize, newSize: origSize, relPath };
    }
  } catch (err) {
    return { status: 'error', error: err.message, origSize, newSize: origSize, relPath };
  }
}

async function main() {
  console.log(`\n🖼️  Image Optimizer for flipphillips.com`);
  console.log(`----------------------------------------`);
  console.log(`Target:    ${TARGET_DIR}`);
  console.log(`Max Dim:   ${MAX_DIM}px`);
  console.log(`Quality:   ${QUALITY}%`);
  console.log(`Mode:      ${isDryRun ? '🔍 DRY RUN (no files modified)' : '⚡ LIVE (optimizing in place)'}`);
  console.log(`----------------------------------------\n`);

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Target directory ${TARGET_DIR} does not exist!`);
    process.exit(1);
  }

  const files = await scanDirectory(TARGET_DIR);
  console.log(`Found ${files.length} image files to inspect.\n`);

  let totalOrigBytes = 0;
  let totalNewBytes = 0;
  let optimizedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await optimizeImage(file);
    totalOrigBytes += result.origSize;
    totalNewBytes += result.newSize;

    if (result.status === 'optimized') {
      optimizedCount++;
      const pct = (((result.origSize - result.newSize) / result.origSize) * 100).toFixed(1);
      console.log(
        `[${optimizedCount}] ${result.relPath} (${result.origDim})\n     ${formatBytes(result.origSize)} -> ${formatBytes(result.newSize)} (-${pct}%)`
      );
    } else if (result.status === 'skipped' || result.status === 'kept') {
      skippedCount++;
    } else if (result.status === 'error') {
      console.warn(`⚠️ Error on ${result.relPath}: ${result.error}`);
    }
  }

  const savedBytes = totalOrigBytes - totalNewBytes;
  const overallPct = totalOrigBytes > 0 ? ((savedBytes / totalOrigBytes) * 100).toFixed(1) : 0;

  console.log(`\n========================================`);
  console.log(`Summary:`);
  console.log(`  Total images inspected: ${files.length}`);
  console.log(`  Optimized:              ${optimizedCount}`);
  console.log(`  Already optimal:        ${skippedCount}`);
  console.log(`  Total size before:      ${formatBytes(totalOrigBytes)}`);
  console.log(`  Total size after:       ${formatBytes(totalNewBytes)}`);
  console.log(`  Total space saved:      ${formatBytes(savedBytes)} (-${overallPct}%)`);
  if (isDryRun) {
    console.log(`\n💡 To execute these optimizations, run: npm run images:optimize`);
  } else {
    console.log(`\n✅ Optimization complete!`);
  }
  console.log(`========================================\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

