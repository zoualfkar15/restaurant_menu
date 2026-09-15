import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { useCart } from '@/hooks/useCart';
import type { MenuRestaurant } from '@/types/menu';
import CartItemsList from './CartItemsList';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import { CartIcon } from './icons';

type CartSidebarProps = {
  restaurant: Pick<MenuRestaurant, 'slug' | 'name' | 'nameAr' | 'whatsapp' | 'phone'>;
  className?: string;
};

/** Desktop cart: sticky panel next to the menu grid. */
function CartSidebar({ restaurant, className = '' }: CartSidebarProps) {
  const { t } = useLocale();
  const { isEmpty, totalItems } = useCart(restaurant.slug);

  return (
    <aside className={`sticky top-6 ${className}`} aria-label={t('cart.title')}>
      <div className="flex max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-[24px] bg-white shadow-menu-md ring-1 ring-menu-border">
        <div className="flex items-center justify-between border-b border-menu-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              <CartIcon size={20} />
            </span>
            <h2 className="text-lg font-extrabold text-menu-ink">{t('cart.title')}</h2>
          </div>
          {!isEmpty && (
            <span key={totalItems} className="animate-pop rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-extrabold text-white">
              {totalItems}
            </span>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {isEmpty ? <EmptyCart compact /> : <CartItemsList restaurantSlug={restaurant.slug} dense />}
        </div>

        {!isEmpty && (
          <div className="border-t border-menu-border bg-menu-surface px-5 py-4">
            <CartSummary restaurant={restaurant} />
          </div>
        )}
      </div>
    </aside>
  );
}

export default memo(CartSidebar);
