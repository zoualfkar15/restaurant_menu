import { memo } from 'react';
import { Link } from 'react-router-dom';
import AppImage from '@/components/AppImage';
import { useLocale } from '@/lib/locale';
// import { useCartStore } from '@/store/cartStore';

type Product = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  description?: string | null;
  descriptionAr?: string | null;
  price: string | number;
  image: string | null;
  isPopular: boolean;
};

type ProductCardProps = {
  product: Product;
  restaurantSlug: string;
  index: number;
};

function ProductCard({ product, restaurantSlug, index }: ProductCardProps) {
  const { formatPrice, localize, t } = useLocale();
  // const addItem = useCartStore((s) => s.addItem);
  // const setOpen = useCartStore((s) => s.setOpen);

  // const handleAdd = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   addItem(restaurantSlug, {
  //     productId: product.id,
  //     slug: product.slug,
  //     name: product.name,
  //     nameAr: product.nameAr,
  //     price: Number(product.price),
  //     image: product.image,
  //   });
  //   setOpen(true);
  // };

  return (
    <li className="animate-slide-up" style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}>
      <Link
        to={`/restaurant/${restaurantSlug}/product/${product.slug}`}
        className="flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-menu-surface-elevated border border-menu-border shadow-menu-sm hover:shadow-menu-lg hover:border-menu-border-strong menu-card-hover focus:outline-none focus:ring-2 focus:ring-brand-500 group"
      >
        <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-menu-surface-muted ring-1 ring-menu-border group-hover:ring-brand-200 transition-all duration-300">
          {product.image ? (
            <AppImage
              src={product.image}
              alt={localize(product.name, product.nameAr)}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              width={128}
              height={128}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-menu-surface-muted to-brand-50/40">
              <span className="text-5xl opacity-50 select-none" aria-hidden>🍽</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-menu-ink text-base leading-snug">
                  {localize(product.name, product.nameAr)}
                </span>
                {product.isPopular && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/12 text-brand-700 px-2 py-0.5 rounded-full border border-brand-300/40">
                    {t('public.popular')}
                  </span>
                )}
              </div>
              {(product.description || product.descriptionAr) && (
                <p className="text-sm text-menu-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                  {localize(product.description, product.descriptionAr)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 gap-3">
            <span className="text-menu-accent font-bold text-lg tabular-nums">
              {formatPrice(Number(product.price))}
            </span>
            {/* <button
              type="button"
              onClick={handleAdd}
              className="shrink-0 px-4 py-2 rounded-full bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 active:scale-95 transition-all shadow-menu-sm"
            >
              + {t('public.addToCart')}
            </button> */}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default memo(ProductCard);
