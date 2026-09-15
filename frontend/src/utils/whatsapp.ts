import type { CartItem } from '@/store/cartStore';

type RestaurantContact = { whatsapp?: string | null; phone?: string | null };

/**
 * wa.me expects an international number with digits only:
 * no "+", spaces, dashes, parentheses or leading "00".
 */
export function normalizeWhatsAppNumber(raw?: string | null): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  return digits.length >= 7 ? digits : null;
}

/**
 * Resolve the WhatsApp number from restaurant configuration.
 * Order: restaurant WhatsApp → restaurant phone → VITE_WHATSAPP_NUMBER env fallback.
 */
export function getRestaurantWhatsApp(restaurant: RestaurantContact | null | undefined): string | null {
  return (
    normalizeWhatsAppNumber(restaurant?.whatsapp) ??
    normalizeWhatsAppNumber(restaurant?.phone) ??
    normalizeWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)
  );
}

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

type MessageOptions = {
  items: CartItem[];
  total: number;
  restaurantName: string;
  formatPrice: (price: number) => string;
  localize: <T>(value: T | null | undefined, valueAr: T | null | undefined) => T;
  t: (key: string, params?: Record<string, string>) => string;
};

/** Build the plain-text order message that is sent to the restaurant on WhatsApp. */
export function buildOrderMessage({ items, total, restaurantName, formatPrice, localize, t }: MessageOptions): string {
  const lines: string[] = [];
  lines.push(t('whatsapp.greeting', { restaurant: restaurantName }).trim());
  lines.push('');
  for (const item of items) {
    const name = localize(item.name, item.nameAr);
    const lineTotal = Math.round(item.price * item.quantity * 100) / 100;
    lines.push(`• ${name} × ${item.quantity} — ${formatPrice(lineTotal)}`);
  }
  lines.push('');
  lines.push('----------------');
  lines.push(`${t('whatsapp.total')}: ${formatPrice(total)}`);
  return lines.join('\n');
}
