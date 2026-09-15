import { memo } from 'react';
import AppImage from '@/components/AppImage';
import { useLocale } from '@/lib/locale';
import { useCart } from '@/hooks/useCart';
import QuantityControl from './QuantityControl';
import { PlateIcon } from './icons';

type CartItemsListProps = {
  restaurantSlug: string;
  dense?: boolean;
};

/** Cart line items — shared by the mobile drawer and the desktop sidebar. */
function CartItemsList({ restaurantSlug, dense = false }: CartItemsListProps) {
  const { t, formatPrice, localize } = useLocale();
  const { items, increaseQuantity, decreaseQuantity, removeItem } = useCart(restaurantSlug);

  return (
    <ul className="divide-y divide-menu-border">
      {items.map((item) => {
        const name = localize(item.name, item.nameAr);
        const lineTotal = Math.round(item.price * item.quantity * 100) / 100;
        return (
          <li key={item.id} className={`flex items-center gap-3 ${dense ? 'py-2.5' : 'py-3'}`}>
            <div className={`${dense ? 'h-12 w-12' : 'h-14 w-14'} shrink-0 overflow-hidden rounded-xl bg-menu-surface-muted ring-1 ring-menu-border/70`}>
              {item.image ? (
                <AppImage src={item.image} alt={name} className="h-full w-full object-cover" width={56} height={56} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary-300">
                  <PlateIcon size={24} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-[15px] font-bold leading-snug text-menu-ink line-clamp-2">
                <bdi>{name}</bdi>
              </p>
              <p className="mt-0.5 text-xs text-menu-ink-muted">
                {formatPrice(item.price)} <span className="opacity-70">{t('cart.each')}</span>
              </p>
              {/* At quantity 1 the stepper already shows a trash button, so avoid a duplicate control. */}
              {item.quantity > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="mt-1 -ms-1 rounded px-1 py-0.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  aria-label={`${t('cart.remove')} – ${name}`}
                >
                  {t('cart.remove')}
                </button>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-[15px] font-extrabold tabular-nums text-menu-ink">{formatPrice(lineTotal)}</span>
              <QuantityControl
                size="sm"
                trashAtOne
                quantity={item.quantity}
                onAdd={() => increaseQuantity(item.id)}
                onIncrease={() => increaseQuantity(item.id)}
                onDecrease={() => decreaseQuantity(item.id)}
                label={name}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default memo(CartItemsList);
