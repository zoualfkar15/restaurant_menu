import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '@/services/api';
import { LocaleProvider, useLocale } from '@/lib/locale';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCart } from '@/hooks/useCart';
import AppImage from '@/components/AppImage';
import Spinner from '@/components/Spinner';
import QuantityControl from '@/components/menu/QuantityControl';
import CartDrawer from '@/components/menu/CartDrawer';
import CartToast from '@/components/menu/CartToast';
import { ArrowBackIcon, CartIcon, PlateIcon, PlusIcon, StarIcon } from '@/components/menu/icons';
import type { MenuRestaurant } from '@/types/menu';

type Product = {
  id?: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  description?: string | null;
  descriptionAr?: string | null;
  price: string | number;
  image: string | null;
  isPopular?: boolean;
  ingredients?: string | null;
  calories?: number | null;
  allergens?: string | null;
  restaurant?: Partial<Omit<MenuRestaurant, 'categories'>> | null;
  category?: { name?: string; nameAr?: string | null } | null;
};

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

function ProductContent({ product, restaurantSlug }: { product: Product; restaurantSlug: string }) {
  const { formatPrice, localize, t, locale } = useLocale();
  const { addItem, increaseQuantity, decreaseQuantity, getQuantity, totalItems, openCart } = useCart(restaurantSlug);
  const isRtl = locale === 'ar';
  const restaurant = {
    slug: restaurantSlug,
    name: product.restaurant?.name ?? '',
    nameAr: product.restaurant?.nameAr,
    whatsapp: product.restaurant?.whatsapp,
    phone: product.restaurant?.phone,
  };

  const name = localize(product.name, product.nameAr);
  const description = localize(product.description, product.descriptionAr);
  const price = Number(product.price);
  const quantity = product.id ? getQuantity(product.id) : 0;

  useDocumentTitle(`${name} | ${localize(restaurant.name, restaurant.nameAr) || 'MenuQR'}`);

  const handleAdd = useCallback(() => {
    if (!product.id) return;
    addItem({ id: product.id, slug: product.slug, name: product.name, nameAr: product.nameAr, price, image: product.image });
  }, [addItem, product, price]);

  return (
    <div className="menu-bg font-menu min-h-screen pb-32 text-menu-ink antialiased page-enter" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-20 border-b border-menu-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-3 sm:px-4">
          <Link
            to={`/restaurant/${restaurantSlug}/menu`}
            className={`tap-target inline-flex items-center gap-1.5 rounded-full px-3 text-sm font-bold text-menu-ink-secondary transition-colors hover:bg-menu-surface-muted hover:text-menu-ink ${focusRing}`}
          >
            <ArrowBackIcon size={20} rtl={isRtl} />
            {t('public.backToMenuLink')}
          </Link>
          <button
            type="button"
            onClick={openCart}
            className={`tap-target relative inline-flex items-center justify-center rounded-full text-menu-ink-secondary transition-colors hover:bg-menu-surface-muted hover:text-menu-ink ${focusRing}`}
            aria-label={`${t('cart.viewCart')}${totalItems > 0 ? ` (${totalItems})` : ''}`}
          >
            <CartIcon size={22} />
            {totalItems > 0 && (
              <span
                key={totalItems}
                className="animate-pop absolute -end-0.5 top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-menu-accent px-1 text-[11px] font-extrabold text-white ring-2 ring-white"
                aria-hidden
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 pt-4 sm:px-4 sm:pt-6">
        <article className="overflow-hidden rounded-[28px] bg-white shadow-menu-lg ring-1 ring-menu-border/80 animate-fade-in md:grid md:grid-cols-2">
          <div className="relative aspect-[4/3] bg-menu-surface-muted md:aspect-auto md:min-h-[360px]">
            {product.image ? (
              <AppImage src={product.image} alt={name} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-menu-surface-muted to-primary-50 text-primary-300">
                <PlateIcon size={72} />
              </div>
            )}
            {product.isPopular && (
              <span className="absolute start-4 top-4 inline-flex items-center gap-1 rounded-full bg-menu-accent px-3 py-1 text-xs font-extrabold text-white shadow-menu-md">
                <StarIcon size={12} />
                {t('public.popular')}
              </span>
            )}
          </div>

          <div className="p-5 sm:p-6 md:flex md:flex-col">
            {product.category && (
              <p className="text-xs font-bold uppercase tracking-wide text-primary-700">{localize(product.category.name, product.category.nameAr)}</p>
            )}
            <h1 className="mt-1 text-balance break-words text-2xl font-extrabold leading-tight text-menu-ink sm:text-3xl">
              <bdi>{name}</bdi>
            </h1>
            <p className="mt-2 text-2xl font-extrabold tabular-nums text-menu-ink">{formatPrice(price)}</p>
            {description && (
              <p className="mt-4 leading-relaxed text-menu-ink-secondary">
                <bdi>{description}</bdi>
              </p>
            )}

            {(product.ingredients || product.calories != null || product.allergens) && (
              <dl className="mt-5 space-y-3 border-t border-menu-border pt-5 text-sm">
                {product.ingredients && (
                  <div>
                    <dt className="font-bold text-menu-ink">{t('public.ingredients')}</dt>
                    <dd className="mt-0.5 text-menu-ink-secondary">{product.ingredients}</dd>
                  </div>
                )}
                {product.calories != null && (
                  <div className="flex items-center gap-2">
                    <dt className="font-bold text-menu-ink">{t('public.calories')}:</dt>
                    <dd className="text-menu-ink-secondary">{product.calories} kcal</dd>
                  </div>
                )}
                {product.allergens && (
                  <div>
                    <dt className="font-bold text-menu-ink">{t('public.allergens')}</dt>
                    <dd className="mt-0.5 text-menu-ink-secondary">{product.allergens}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </article>
      </main>

      {product.id && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
          <div className="safe-bottom mx-auto w-full max-w-3xl px-3 pb-3 sm:px-4">
            <div className="pointer-events-auto animate-bar-in flex items-center gap-3 rounded-[22px] bg-white/85 p-2 shadow-menu-top ring-1 ring-menu-border backdrop-blur-xl">
              {quantity > 0 ? (
                <>
                  <QuantityControl
                    quantity={quantity}
                    onAdd={handleAdd}
                    onIncrease={() => increaseQuantity(product.id!)}
                    onDecrease={() => decreaseQuantity(product.id!)}
                    label={name}
                  />
                  <button
                    type="button"
                    onClick={openCart}
                    className={`flex h-12 flex-1 items-center justify-between rounded-2xl bg-primary-900 px-4 text-white transition-colors hover:bg-primary-800 ${focusRing}`}
                  >
                    <span className="text-[15px] font-bold">{t('cart.viewCart')}</span>
                    <span className="text-base font-extrabold tabular-nums">{formatPrice(Math.round(price * quantity * 100) / 100)}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex h-12 w-full items-center justify-between rounded-2xl bg-primary-600 px-4 text-white shadow-primary-glow transition-all hover:bg-primary-700 active:scale-[0.99] ${focusRing}`}
                >
                  <span className="inline-flex items-center gap-2 text-[15px] font-bold">
                    <PlusIcon size={20} />
                    {t('cart.add')}
                  </span>
                  <span className="text-base font-extrabold tabular-nums">{formatPrice(price)}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <CartDrawer restaurant={restaurant} />
      <CartToast hasBottomBar />
    </div>
  );
}

export default function ProductPage() {
  const { slug, productSlug } = useParams<{ slug: string; productSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !productSlug) return;
    let cancelled = false;
    setLoading(true);
    getProduct(slug, productSlug)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, productSlug]);

  if (loading) {
    return (
      <div className="menu-bg flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-primary-600" />
      </div>
    );
  }
  if (!product || !slug) {
    return (
      <div className="menu-bg font-menu flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-menu-ink-muted">
          <span className="block text-lg font-bold text-menu-ink">المنتج غير موجود</span>
          <span className="block text-sm">Product not found</span>
        </p>
      </div>
    );
  }

  const rest = product.restaurant;
  const defaultLocale = (rest?.defaultLocale === 'en' || rest?.defaultLocale === 'ar' ? rest.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales =
    Array.isArray(rest?.localesEnabled) && rest.localesEnabled.length > 0
      ? (rest.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
      : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = rest?.currency === 'TRY' ? 'TRY' : rest?.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <ProductContent product={product} restaurantSlug={slug} />
    </LocaleProvider>
  );
}
