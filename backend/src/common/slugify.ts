/** URL slug from English or Arabic names. Falls back when the name has no letters/digits. */
export function slugify(text: string, fallbackPrefix = 'item'): string {
  const slug = text
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || `${fallbackPrefix}-${Date.now().toString(36)}`;
}
