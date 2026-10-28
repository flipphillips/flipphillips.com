import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    modified: z.string().optional(),
    slug: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    isFolklore: z.boolean().default(false),
    isPublication: z.boolean().default(false),
    featuredImage: z.string().optional(),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    publication: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    slug: z.string().optional(),
  }),
});

export const collections = { posts, pages };
