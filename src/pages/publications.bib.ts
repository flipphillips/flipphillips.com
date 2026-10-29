import type { APIRoute } from 'astro';
import bibRaw from '../data/publications.bib?raw';

export const GET: APIRoute = async () => {
  return new Response(bibRaw, {
    headers: {
      'Content-Type': 'application/x-bibtex; charset=utf-8',
    },
  });
};
