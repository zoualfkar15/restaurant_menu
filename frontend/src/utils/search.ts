/**
 * Normalise text for forgiving client-side search:
 * lower-case, strip Arabic diacritics and unify common letter variants
 * (أ/إ/آ → ا, ة → ه, ى → ي, ؤ → و, ئ → ي) so "برجر" and "برغر" style typos still match.
 */
export function normalizeSearchText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toLocaleLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '') // tashkeel + tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىئ]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesQuery(query: string, ...fields: (string | null | undefined)[]): boolean {
  if (!query) return true;
  const terms = query.split(' ').filter(Boolean);
  const haystack = fields.map(normalizeSearchText).join(' ');
  return terms.every((term) => haystack.includes(term));
}
