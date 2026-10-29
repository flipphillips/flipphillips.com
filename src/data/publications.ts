import { parsePublicationsFromBib, type Publication } from './bibtex';
import bibRaw from './publications.bib?raw';

export type { Publication };

/**
 * Publications list parsed dynamically from the single source of truth:
 * `src/data/publications.bib`.
 */
export const publications: Publication[] = parsePublicationsFromBib(bibRaw);

