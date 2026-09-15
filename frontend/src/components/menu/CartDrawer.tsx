import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { useCart } from '@/hooks/useCart';
import type { MenuRestaurant } from '@/types/menu';
import Sheet from './Sheet';
import CartItemsList from './CartItemsList';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';

type CartDrawerProps = {
  restaurant: Pick<MenuRestaurant, 'slug' | 'name' | 'nameAr' | 'whatsapp' | 'phone'>;
  /** Empty-state "browse menu" action; defaults to closing the drawer (we're already on the menu). */
  onBrowse?: () => void;
};

/** Mobile / tablet cart: bottom sheet on phones, side panel on tablets. */
function CartDrawer({ restaurant, onBrowse }: CartDrawerProps) {
  const { t } = useLocale();
  const { isOpen, closeCart, isEmpty, totalItems } = useCart(restaurant.slug);

  return (
    <Sheet
      open={isOpen}
      onClose={closeCart}
      title={t('cart.title')}
      subtitle={isEmpty ? undefined : `${totalItems} ${t('cart.items')}`}
      labelledBy="cart-drawer-title"
      footer={isEmpty ? undefined : <CartSummary restaurant={restaurant} onCheckout={closeCart} />}
    >
      {isEmpty ? <EmptyCart onBrowse={onBrowse ?? closeCart} /> : <CartItemsList restaurantSlug={restaurant.slug} />}
    </Sheet>
  );
}

export default memo(CartDrawer);
