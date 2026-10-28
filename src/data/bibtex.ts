/**
 * BibTeX parser and mapper for flipphillips.com publications.
 *
 * Parses standard BibTeX (.bib) files into strongly typed Publication objects.
 * Supports standard fields (title, author, journal, booktitle, year, volume,
 * number, pages, doi, url) as well as site metadata (pdf, image, highlight).
 */

export interface BibEntry {
  entryType: string;
  citeKey: string;
  fields: Record<string, string>;
}

export interface Publication {
  id: string;
  year: number;
  title: string;
  authors: string[];
  venue: string;
  type: 'journal' | 'conference' | 'book' | 'preprint' | 'techreport' | 'magazine';
  typeLabel: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  pdf?: string;
  image?: string;
  highlight?: boolean;
}

/**
 * Robust zero-dependency BibTeX string parser handling balanced braces,
 * multiline fields, and standard key-value assignments.
 */
export function parseBibTeX(bibContent: string): BibEntry[] {
  const entries: BibEntry[] = [];
  let i = 0;
  const len = bibContent.length;

  while (i < len) {
    const atPos = bibContent.indexOf('@', i);
    if (atPos === -1) break;

    const openBrace = bibContent.indexOf('{', atPos);
    if (openBrace === -1) break;

    const typeStr = bibContent.slice(atPos + 1, openBrace).trim().toLowerCase();
    if (typeStr === 'comment' || typeStr === 'preamble' || typeStr === 'string') {
      i = openBrace + 1;
      continue;
    }

    // Match balanced closing brace for this entry
    let depth = 1;
    let j = openBrace + 1;
    let inQuotes = false;

    while (j < len && depth > 0) {
      const c = bibContent[j];
      if (c === '"' && bibContent[j - 1] !== '\\') {
        inQuotes = !inQuotes;
      } else if (!inQuotes) {
        if (c === '{') depth++;
        else if (c === '}') depth--;
      }
      j++;
    }

    const body = bibContent.slice(openBrace + 1, j - 1);
    i = j;

    const firstComma = body.indexOf(',');
    if (firstComma === -1) continue;

    const citeKey = body.slice(0, firstComma).trim();
    const fieldsText = body.slice(firstComma + 1);

    const fields: Record<string, string> = {};
    let p = 0;
    const flen = fieldsText.length;

    while (p < flen) {
      while (p < flen && (/\s/.test(fieldsText[p]) || fieldsText[p] === ',')) p++;
      if (p >= flen) break;

      const eqPos = fieldsText.indexOf('=', p);
      if (eqPos === -1) break;

      const fieldName = fieldsText.slice(p, eqPos).trim().toLowerCase();
      p = eqPos + 1;

      while (p < flen && /\s/.test(fieldsText[p])) p++;
      if (p >= flen) break;

      let val = '';
      if (fieldsText[p] === '{') {
        let bDepth = 1;
        const vStart = p + 1;
        p++;
        while (p < flen && bDepth > 0) {
          if (fieldsText[p] === '{' && fieldsText[p - 1] !== '\\') bDepth++;
          else if (fieldsText[p] === '}' && fieldsText[p - 1] !== '\\') bDepth--;
          p++;
        }
        val = fieldsText.slice(vStart, p - 1);
      } else if (fieldsText[p] === '"') {
        const vStart = p + 1;
        p++;
        while (p < flen && fieldsText[p] !== '"') {
          if (fieldsText[p] === '\\' && p + 1 < flen) p++;
          p++;
        }
        val = fieldsText.slice(vStart, p);
        p++;
      } else {
        const vStart = p;
        while (p < flen && fieldsText[p] !== ',' && fieldsText[p] !== '\n' && fieldsText[p] !== '}') {
          p++;
        }
        val = fieldsText.slice(vStart, p).trim();
      }

      if (fieldName) {
        fields[fieldName] = val.trim();
      }
    }

    entries.push({ entryType: typeStr, citeKey, fields });
  }

  return entries;
}

export function cleanBibString(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[\r\n]+/g, ' ')
    .replace(/\\&/g, '&')
    .replace(/--/g, '–')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseAuthors(authorStr?: string): string[] {
  if (!authorStr) return [];
  return authorStr
    .split(/\s+and\s+/i)
    .map((a) => {
      let cleaned = cleanBibString(a);
      if (cleaned.includes(',')) {
        const parts = cleaned.split(',').map((p) => p.trim());
        cleaned = `${parts.slice(1).join(' ')} ${parts[0]}`.trim();
      }
      return cleaned;
    })
    .filter(Boolean);
}

export function bibEntryToPublication(entry: BibEntry): Publication {
  const f = entry.fields;
  let type: Publication['type'] = 'journal';
  let typeLabel = 'Journal Article';

  if (f.type && (['journal', 'conference', 'book', 'preprint', 'techreport', 'magazine'] as const).includes(f.type as any)) {
    type = f.type as Publication['type'];
    typeLabel = f.typelabel || (type === 'preprint' ? 'Preprint' : type === 'magazine' ? 'Article' : type);
  } else if (entry.entryType === 'inproceedings' || entry.entryType === 'conference') {
    type = 'conference';
    typeLabel = 'Conference Proceeding';
  } else if (entry.entryType === 'book' || entry.entryType === 'incollection' || entry.entryType === 'inbook') {
    type = 'book';
    typeLabel = entry.entryType === 'incollection' ? 'Book Chapter' : 'Book';
  } else if (entry.entryType === 'techreport') {
    type = 'techreport';
    typeLabel = 'Technical Report';
  } else if (entry.entryType === 'misc') {
    type = 'magazine';
    typeLabel = 'Article';
  }

  if (f.typelabel) {
    typeLabel = f.typelabel;
  }

  const pub: Publication = {
    id: entry.citeKey,
    year: parseInt(f.year, 10) || 0,
    title: cleanBibString(f.title),
    authors: parseAuthors(f.author),
    venue: cleanBibString(f.journal || f.booktitle || f.howpublished || f.institution || f.publisher || f.venue || ''),
    type,
    typeLabel,
  };

  if (f.volume) pub.volume = cleanBibString(f.volume);
  if (f.issue || f.number) pub.issue = cleanBibString(f.issue || f.number);
  if (f.pages) pub.pages = cleanBibString(f.pages);
  if (f.doi) pub.doi = cleanBibString(f.doi);
  if (f.url) pub.url = cleanBibString(f.url);
  if (f.pdf) pub.pdf = cleanBibString(f.pdf);
  if (f.image) pub.image = cleanBibString(f.image);
  if (f.highlight === 'true' || f.highlight === '1') pub.highlight = true;

  return pub;
}

/**
 * Parse a raw BibTeX string into an array of Publication items sorted by year descending.
 */
export function parsePublicationsFromBib(bibContent: string): Publication[] {
  const entries = parseBibTeX(bibContent);
  return entries.map(bibEntryToPublication).sort((a, b) => b.year - a.year);
}
