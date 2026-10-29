#!/usr/bin/env node
/**
 * scripts/nudge-search.js
 *
 * Automated search engine nudge for flipphillips.com:
 * 1. Collects all canonical URLs from dist/sitemap.xml (or src/content/posts fallback).
 * 2. Verifies whether the IndexNow key file & sitemap.xml are live on https://flipphillips.com.
 * 3. Pushes all site URLs in a single batch to IndexNow (Bing, DuckDuckGo, Yandex, Seznam, Naver).
 * 4. Prints status and a direct link for Google Search Console sitemap verification.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const HOST = 'flipphillips.com';
const SITE_URL = `https://${HOST}`;
const INDEXNOW_KEY = 'f7c9e2a4b8d14380921f5e6c3a4b8d12';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

function getUrls() {
  const sitemapPath = path.join(ROOT, 'dist', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf-8');
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    if (matches.length > 0) return matches;
  }

  // Fallback: build URL list from static routes + src/content/posts
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/about`,
    `${SITE_URL}/publications`,
    `${SITE_URL}/folklore`,
    `${SITE_URL}/software`,
    `${SITE_URL}/pubs/Flip%20Phillips%20External%20CV.pdf`,
  ];

  const postsDir = path.join(ROOT, 'src', 'content', 'posts');
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, '');
      urls.push(`${SITE_URL}/folklore/${slug}`);
    }
  }
  return urls;
}

async function main() {
  console.log('\n🚀 Flip Phillips SEO & Knowledge Graph Nudge');
  console.log('────────────────────────────────────────────────────────');

  const urlList = getUrls();
  console.log(`📄 Found ${urlList.length} canonical URLs to announce.`);

  // 1. Check if key file is live on production yet
  let keyLive = false;
  try {
    const keyRes = await fetch(KEY_LOCATION, { method: 'GET' });
    if (keyRes.ok) {
      const text = (await keyRes.text()).trim();
      keyLive = text === INDEXNOW_KEY;
    }
  } catch (err) {
    // ignore network error here, handled below
  }

  if (!keyLive) {
    console.log(`\n⚠️  Note: ${KEY_LOCATION} is not live on production yet.`);
    console.log(`   Make sure you commit & push (so Cloudflare Pages deploys the new build),`);
    console.log(`   then run 'npm run seo:nudge' again so IndexNow can verify ownership!`);
  } else {
    console.log(`✅ Verified live IndexNow key at ${KEY_LOCATION}`);
  }

  // 2. Submit batch to IndexNow (Bing, DuckDuckGo, Yandex, Seznam, Naver)
  console.log(`\n📡 Submitting ${urlList.length} URLs to IndexNow (api.indexnow.org)...`);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ IndexNow accepted all ${urlList.length} URLs! (HTTP ${res.status})`);
      console.log(`   Bing, DuckDuckGo, Yandex, and partner engines have been notified to crawl.`);
    } else {
      const body = await res.text();
      console.log(`ℹ️  IndexNow returned HTTP ${res.status}: ${body || res.statusText}`);
      if (!keyLive) {
        console.log(`   (This is expected until the new commit is deployed to https://${HOST})`);
      }
    }
  } catch (err) {
    console.error(`❌ Could not reach api.indexnow.org: ${err.message}`);
  }

  // 3. Check live Sitemap & Google Search Console instructions
  console.log('\n🔍 Google Search Console & Knowledge Graph Status:');
  try {
    const smRes = await fetch(SITEMAP_URL, { method: 'HEAD' });
    if (smRes.ok) {
      console.log(`✅ Live sitemap verified at ${SITEMAP_URL}`);
    } else {
      console.log(`⏳ ${SITEMAP_URL} returned HTTP ${smRes.status} (will be 200 once deployed).`);
    }
  } catch {
    // ignore
  }

  console.log(`   • Google discovers ${SITEMAP_URL} automatically via /robots.txt.`);
  console.log(`   • For an instant first-time crawl in Google Search Console, open:`);
  console.log(`     https://search.google.com/search-console/sitemaps?resource_id=sc-domain:${HOST}`);
  console.log(`     and enter: sitemap.xml\n`);
}

main();

