'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LocaleProvider, useLocale } from '@/lib/locale';

const API = process.env.NEXT_PUBLIC_API_URL || '';

type Restaurant = { slug: string; name?: string; nameAr?: string | null; defaultLocale?: string | null; localesEnabled?: string[] | null; currency?: string | null };
type Category = { name?: string; nameAr?: string | null };
type Product = {
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  price: string | number;
  image: string | null;
  isPopular?: boolean;
  ingredients?: string | null;
  calories?: number | null;
  allergens?: string | null;
  restaurant?: Restaurant | null;
  category?: Category | null;
};

function ProductContent({ product, restaurantSlug }: { product: Product; restaurantSlug: string }) {
  const { formatPrice, localize, t, locale } = useLocale();
  const restaurant = product.restaurant || { slug: restaurantSlug };
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-slate-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 text-start">
        <Link href={`/restaurant/${restaurant.slug}/menu`} className="text-slate-600 text-sm inline-flex items-center gap-1">
          <span aria-hidden>{isRtl ? '→' : '←'}</span> {t('public.backToMenu')}
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="aspect-[4/3] bg-slate-100 relative">
            {product.image ? (
              <Image
                src={product.image.startsWith('http') ? product.image : `${API}${product.image}`}
                alt={localize(product.name, product.nameAr)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl">🍽</div>
            )}
            {product.isPopular && (
              <span className="absolute top-3 right-3 bg-brand-500 text-white text-sm px-3 py-1 rounded-full">{t('public.popular')}</span>
            )}
          </div>
          <div className="p-6">
            {product.category && (
              <p className="text-sm text-slate-500 mb-1">{localize(product.category.name, product.category.nameAr)}</p>
            )}
            <h1 className="text-2xl font-bold text-slate-900">{localize(product.name, product.nameAr)}</h1>
            <p className="text-xl text-brand-600 font-semibold mt-2">{formatPrice(Number(product.price))}</p>
            {(product.description || product.descriptionAr) && (
              <p className="text-slate-600 mt-4">{localize(product.description, product.descriptionAr)}</p>
            )}
            {product.ingredients && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">{t('public.ingredients')}</h2>
                <p className="text-slate-600 text-sm mt-1">{product.ingredients}</p>
              </div>
            )}
            {product.calories != null && (
              <p className="text-slate-500 text-sm mt-2">{t('public.calories')}: {product.calories} kcal</p>
            )}
            {product.allergens && (
              <div className="mt-2">
                <h2 className="text-sm font-semibold text-slate-700">{t('public.allergens')}</h2>
                <p className="text-slate-600 text-sm">{product.allergens}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductClient({ product, restaurantSlug }: { product: Product; restaurantSlug: string }) {
  const rest = product.restaurant;
  const defaultLocale = (rest?.defaultLocale === 'en' || rest?.defaultLocale === 'ar' ? rest.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales = Array.isArray(rest?.localesEnabled) && rest.localesEnabled.length > 0
    ? (rest.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
    : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = rest?.currency === 'TRY' ? 'TRY' : rest?.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <ProductContent product={product} restaurantSlug={restaurantSlug} />
    </LocaleProvider>
  );
}
