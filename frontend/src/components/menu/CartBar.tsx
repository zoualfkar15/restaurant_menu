import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { useCart } from '@/hooks/useCart';
import type { MenuRestaurant } from '@/types/menu';
import WhatsAppCheckout from './WhatsAppCheckout';
import { CartIcon } from './icons';

type CartBarProps = {
  restaurant: Pick<MenuRestaurant, 'slug' | 'name' | 'nameAr' | 'whatsapp' | 'phone'>;
};

/**
 * Sticky bottom cart summary for phones & tablets. Hidden on large screens
 * where the persistent sidebar takes over. Renders nothing while the cart is empty.
 */
function CartBar({ restaurant }: CartBarProps) {
  const { t, formatPrice } = useLocale();
  const { isEmpty, totalItems, totalPrice, openCart } = useCart(restaurant.slug);

  if (isEmpty) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <div className="safe-bottom mx-auto w-full max-w-2xl px-3 pb-3 sm:px-4">
        <div className="pointer-events-auto animate-bar-in flex flex-col gap-2 rounded-[22px] bg-white/85 p-2 shadow-menu-top ring-1 ring-menu-border backdrop-blur-xl">
          <button
            type="button"
            onClick={openCart}
            className="flex h-14 w-full items-center justify-between rounded-2xl bg-primary-900 px-4 text-white transition-colors hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            aria-label={`${t('cart.viewCart')} – ${t('cart.summary', { count: String(totalItems) })}`}
          >
            <span className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <CartIcon size={20} />
                <span
                  key={totalItems}
                  className="animate-pop absolute -end-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-menu-accent px-1 text-[11px] font-extrabold text-white ring-2 ring-primary-900"
                >
                  {totalItems}
                </span>
              </span>
              <span className="text-[15px] font-bold">{t('cart.summary', { count: String(totalItems) })}</span>
            </span>
            <span key={totalPrice} className="animate-pop text-lg font-extrabold tabular-nums">
              {formatPrice(totalPrice)}
            </span>
          </button>
          <WhatsAppCheckout restaurant={restaurant} size="md" />
        </div>
      </div>
    </div>
  );
}

export default memo(CartBar);
