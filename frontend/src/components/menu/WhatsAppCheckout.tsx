import { memo, useMemo } from 'react';
import { useLocale } from '@/lib/locale';
import { useCart } from '@/hooks/useCart';
import { buildOrderMessage, buildWhatsAppUrl, getRestaurantWhatsApp } from '@/utils/whatsapp';
import type { MenuRestaurant } from '@/types/menu';
import { WhatsAppIcon } from './icons';

type WhatsAppCheckoutProps = {
  restaurant: Pick<MenuRestaurant, 'slug' | 'name' | 'nameAr' | 'whatsapp' | 'phone'>;
  className?: string;
  /** Called after the WhatsApp link is opened (e.g. to close the cart drawer). */
  onCheckout?: () => void;
  size?: 'md' | 'lg';
};

/**
 * Frontend-only checkout: builds the order text from the current cart and
 * opens WhatsApp via a `wa.me` deep link. No request is made to our backend.
 */
function WhatsAppCheckout({ restaurant, className = '', onCheckout, size = 'lg' }: WhatsAppCheckoutProps) {
  const { t, localize, formatPrice } = useLocale();
  const { items, totalPrice, isEmpty } = useCart(restaurant.slug);

  const number = useMemo(() => getRestaurantWhatsApp(restaurant), [restaurant]);

  const href = useMemo(() => {
    if (!number || isEmpty) return null;
    const message = buildOrderMessage({
      items,
      total: totalPrice,
      restaurantName: localize(restaurant.name, restaurant.nameAr),
      formatPrice,
      localize,
      t,
    });
    return buildWhatsAppUrl(number, message);
  }, [number, isEmpty, items, totalPrice, restaurant.name, restaurant.nameAr, formatPrice, localize, t]);

  const base = `inline-flex w-full items-center justify-center gap-2.5 rounded-2xl font-bold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
    size === 'lg' ? 'h-14 text-base' : 'h-12 text-[15px]'
  } ${className}`;

  if (!number) {
    return (
      <div className="space-y-2">
        <button type="button" disabled aria-disabled className={`${base} cursor-not-allowed bg-menu-ink-muted/40`}>
          <WhatsAppIcon size={22} />
          {t('cart.checkoutWhatsapp')}
        </button>
        <p className="text-center text-xs text-menu-ink-muted">{t('cart.whatsappUnavailable')}</p>
      </div>
    );
  }

  if (!href) {
    return (
      <button type="button" disabled aria-disabled className={`${base} cursor-not-allowed bg-primary-600/40`}>
        <WhatsAppIcon size={22} />
        {t('cart.checkoutWhatsapp')}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onCheckout}
      className={`${base} bg-primary-600 shadow-primary-glow hover:bg-primary-700 active:scale-[0.99]`}
    >
      <WhatsAppIcon size={22} />
      {t('cart.checkoutWhatsapp')}
    </a>
  );
}

export default memo(WhatsAppCheckout);
