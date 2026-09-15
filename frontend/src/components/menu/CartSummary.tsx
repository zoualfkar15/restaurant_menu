import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { useCart } from '@/hooks/useCart';
import type { MenuRestaurant } from '@/types/menu';
import WhatsAppCheckout from './WhatsAppCheckout';

type CartSummaryProps = {
  restaurant: Pick<MenuRestaurant, 'slug' | 'name' | 'nameAr' | 'whatsapp' | 'phone'>;
  onCheckout?: () => void;
};

/** Total + WhatsApp checkout + clear — shared by the drawer and the sidebar. */
function CartSummary({ restaurant, onCheckout }: CartSummaryProps) {
  const { t, formatPrice } = useLocale();
  const { totalPrice, totalItems, clearCart } = useCart(restaurant.slug);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-menu-ink-secondary">
          {t('cart.total')} <span className="text-menu-ink-muted">({totalItems} {t('cart.items')})</span>
        </span>
        <span key={totalPrice} className="animate-pop text-2xl font-extrabold tabular-nums text-menu-ink">
          {formatPrice(totalPrice)}
        </span>
      </div>
      <WhatsAppCheckout restaurant={restaurant} onCheckout={onCheckout} />
      <button
        type="button"
        onClick={clearCart}
        className="w-full rounded-lg py-1.5 text-sm font-semibold text-menu-ink-muted transition-colors hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        {t('cart.clear')}
      </button>
    </div>
  );
}

export default memo(CartSummary);
