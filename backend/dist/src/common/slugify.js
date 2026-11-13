"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
function slugify(text, fallbackPrefix = 'item') {
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
//# sourceMappingURL=slugify.js.map