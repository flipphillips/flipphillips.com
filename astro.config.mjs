import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  redirects: {
    '/blog': '/folklore',
    '/blog/[slug]': '/folklore/[slug]',
    '/bloggery': '/folklore',
    '/bloggery/[slug]': '/folklore/[slug]',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
