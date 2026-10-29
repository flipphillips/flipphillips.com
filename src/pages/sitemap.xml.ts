import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://flipphillips.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');

  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.9', changefreq: 'monthly' },
    { path: '/publications', priority: '0.9', changefreq: 'monthly' },
    { path: '/folklore', priority: '0.9', changefreq: 'weekly' },
    { path: '/software', priority: '0.8', changefreq: 'monthly' },
    { path: '/pubs/Flip%20Phillips%20External%20CV.pdf', priority: '0.7', changefreq: 'monthly' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const staticUrls = staticRoutes.map(
    (r) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${r.path}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  );

  const postUrls = posts
    .sort((a, b) => new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime())
    .map((post) => {
      const slug = post.data.slug || post.id.replace(/\.md$/, '');
      const rawDate = post.data.modified || post.data.date;
      const lastmod = rawDate ? new Date(rawDate).toISOString().split('T')[0] : today;
      return `  <url>
    <loc>${escapeXml(`${SITE_URL}/folklore/${slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

