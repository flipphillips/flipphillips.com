import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeVideo } from './src/plugins/rehype-video.js';
import { rehypeWolfram } from './src/plugins/rehype-wolfram.js';

export default defineConfig({
  site: 'https://flipphillips.com',
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
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeVideo, rehypeWolfram],
    }),
  },
});
