import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '@/services/api';
import { LocaleProvider, useLocale } from '@/lib/locale';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
// import { useCartStore } from '@/store/cartStore';
import AppImage from '@/components/AppImage';
import Spinner from '@/components/Spinner';

type Product = {
  name: string; nameAr?: string | null; slug: string; description?: string | null; descriptionAr?: string | null;
  price: string | number; image: string | null; isPopular?: boolean; ingredients?: string | null;
  calories?: number | null; allergens?: string | null; id?: string;
  restaurant?: { slug: string; name?: string; nameAr?: string | null; defaultLocale?: string | null; localesEnabled?: string[] | null; currency?: string | null } | null;
  category?: { name?: string; nameAr?: string | null } | null;
};

function ProductContent({ product, restaurantSlug }: { product: Product; restaurantSlug: string }) {
  const { formatPrice, localize, t, locale } = useLocale();
  // const addItem = useCartStore((s) => s.addItem);
  // const setOpen = useCartStore((s) => s.setOpen);
  const isRtl = locale === 'ar';
  const restaurant = product.restaurant || { slug: restaurantSlug };

  useDocumentTitle(`${localize(product.name, product.nameAr)} | MenuQR`);

  // const handleAdd = () => {
  //   if (!product.id) return;
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
    <div className="min-h-screen bg-slate-50 page-enter" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 py-3">
        <Link to={`/restaurant/${restaurant.slug}/menu`} className="text-slate-600 text-sm inline-flex items-center gap-1 hover:text-brand-500 transition-colors">
          <span aria-hidden>{isRtl ? '→' : '←'}</span> {t('public.backToMenu')}
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-menu-md animate-fade-in">
          <div className="aspect-[4/3] bg-slate-100 relative">
            {product.image ? (
              <AppImage src={product.image} alt={localize(product.name, product.nameAr)} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl">🍽</div>
            )}
            {product.isPopular && (
              <span className="absolute top-3 right-3 bg-brand-500 text-white text-sm px-3 py-1 rounded-full font-medium">{t('public.popular')}</span>
            )}
          </div>
          <div className="p-6">
            {product.category && <p className="text-sm text-slate-500 mb-1">{localize(product.category.name, product.category.nameAr)}</p>}
            <h1 className="text-2xl font-bold text-slate-900">{localize(product.name, product.nameAr)}</h1>
            <p className="text-2xl text-brand-600 font-bold mt-2 tabular-nums">{formatPrice(Number(product.price))}</p>
            {(product.description || product.descriptionAr) && (
              <p className="text-slate-600 mt-4 leading-relaxed">{localize(product.description, product.descriptionAr)}</p>
            )}
            {product.ingredients && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">{t('public.ingredients')}</h2>
                <p className="text-slate-600 text-sm mt-1">{product.ingredients}</p>
              </div>
            )}
            {product.calories != null && <p className="text-slate-500 text-sm mt-2">{t('public.calories')}: {product.calories} kcal</p>}
            {product.allergens && (
              <div className="mt-2">
                <h2 className="text-sm font-semibold text-slate-700">{t('public.allergens')}</h2>
                <p className="text-slate-600 text-sm">{product.allergens}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* {product.id && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white/95 backdrop-blur border-t border-slate-100">
          <div className="max-w-2xl mx-auto">
            <button type="button" onClick={handleAdd} className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors shadow-menu-glow">
              + {t('public.addToCart')} · {formatPrice(Number(product.price))}
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default function ProductPage() {
  const { slug, productSlug } = useParams<{ slug: string; productSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !productSlug) return;
    getProduct(slug, productSlug).then((data) => setProduct(data)).finally(() => setLoading(false));
  }, [slug, productSlug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="w-8 h-8 text-brand-500" /></div>;
  if (!product || !slug) return <div className="min-h-screen flex items-center justify-center"><p>{'Product not found'}</p></div>;

  const rest = product.restaurant;
  const defaultLocale = (rest?.defaultLocale === 'en' || rest?.defaultLocale === 'ar' ? rest.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales = Array.isArray(rest?.localesEnabled) && rest.localesEnabled.length > 0
    ? (rest.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
    : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = rest?.currency === 'TRY' ? 'TRY' : rest?.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <ProductContent product={product} restaurantSlug={slug} />
    </LocaleProvider>
  );
}
