import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AppImage from '@/components/AppImage';
import { useLocale } from '@/lib/locale';
import { useCartActions, useCartItemQuantity } from '@/hooks/useCart';
import type { MenuProduct } from '@/types/menu';
import QuantityControl from './QuantityControl';
import { PlateIcon, StarIcon } from './icons';

type MenuItemCardProps = {
  product: MenuProduct;
  restaurantSlug: string;
  index?: number;
};

function MenuItemCard({ product, restaurantSlug, index = 0 }: MenuItemCardProps) {
  const { formatPrice, localize, t } = useLocale();
  const quantity = useCartItemQuantity(product.id, restaurantSlug);
  const { addItem, increaseQuantity, decreaseQuantity } = useCartActions(restaurantSlug);

  const name = localize(product.name, product.nameAr);
  const description = localize(product.description, product.descriptionAr);
  const price = Number(product.price);

  const handleAdd = useCallback(() => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      nameAr: product.nameAr,
      price,
      image: product.image,
    });
  }, [addItem, product, price]);

  const handleIncrease = useCallback(() => increaseQuantity(product.id), [increaseQuantity, product.id]);
  const handleDecrease = useCallback(() => decreaseQuantity(product.id), [decreaseQuantity, product.id]);

  return (
    <li
      className={`animate-slide-up ${quantity > 0 ? 'is-in-cart' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
    >
      <article
        className={`group menu-card-hover relative flex h-full gap-3 rounded-2xl bg-menu-surface-elevated p-3 shadow-menu-sm ring-1 transition-shadow sm:gap-4 sm:p-4 hover:shadow-menu-md ${
          quantity > 0 ? 'ring-primary-300/80' : 'ring-menu-border hover:ring-menu-border-strong'
        }`}
      >
        {/* Stretched link keeps the whole card clickable without nesting buttons inside an anchor. */}
        <Link
          to={`/restaurant/${restaurantSlug}/product/${product.slug}`}
          className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label={`${t('public.viewDetails')}: ${name}`}
        />

        <div className="pointer-events-none relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-menu-surface-muted ring-1 ring-menu-border/70 xs:h-[88px] xs:w-[88px] sm:h-24 sm:w-24 lg:h-28 lg:w-28">
          {product.image ? (
            <AppImage
              src={product.image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              width={112}
              height={112}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-menu-surface-muted to-primary-50 text-primary-300">
              <PlateIcon size={36} />
            </div>
          )}
        </div>

        <div className="pointer-events-none relative flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
            <h3 className="min-w-0 flex-1 basis-[60%] break-words text-[15px] font-bold leading-snug text-menu-ink line-clamp-2 sm:text-base">
              <bdi>{name}</bdi>
            </h3>
            {product.isPopular && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-menu-accent-soft px-2 py-0.5 text-[11px] font-bold text-menu-accent ring-1 ring-menu-accent/20">
                <StarIcon size={11} />
                {t('public.popular')}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 break-words text-[13px] leading-relaxed text-menu-ink-muted line-clamp-2">
              <bdi>{description}</bdi>
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-2">
            <span className="text-[17px] font-extrabold tabular-nums text-menu-ink">{formatPrice(price)}</span>
            <div className="pointer-events-auto relative z-10 -mb-0.5 -me-0.5">
              <QuantityControl
                quantity={quantity}
                onAdd={handleAdd}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                label={name}
              />
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

export default memo(MenuItemCard);
