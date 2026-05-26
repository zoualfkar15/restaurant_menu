import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '@/services/api';
import { useLocale } from '@/lib/locale';
import AppImage from '@/components/AppImage';

type Category = { id: string; name: string; nameAr?: string | null; slug: string; sortOrder: number; image?: string | null; products: Product[] };
type Product = { id: string; name: string; nameAr?: string | null; slug: string; price: string; isAvailable: boolean; categoryId: string };
type RestaurantCurrency = 'USD' | 'TRY' | 'SYP';

function formatPriceWithCurrency(price: number, currency: RestaurantCurrency, locale: string): string {
  if (currency === 'TRY') return `₺${price.toFixed(2)}`;
  if (currency === 'SYP') return locale === 'ar' ? `ل.س ${price.toFixed(2)}` : `£S ${price.toFixed(2)}`;
  return `$${price.toFixed(2)}`;
}

export default function DashboardMenuPage() {
  const { t, localize, locale } = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState<RestaurantCurrency>('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/admin/restaurant').then((r) => r.ok ? r.json() : null).then((data) => {
      if (data?.currency === 'TRY' || data?.currency === 'SYP') setCurrency(data.currency);
      else setCurrency('USD');
    }).catch(() => {});
  }, []);

  useEffect(() => {
    authFetch('/admin/categories').then((r) => r.ok ? r.json() : []).then(setCategories).finally(() => setLoading(false));
  }, []);

  const formatPrice = useCallback((price: number) => formatPriceWithCurrency(price, currency, locale), [currency, locale]);

  if (loading) return <div className="p-4">{t('dashboard.loading')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard.menu')}</h1>
        <Link to="/dashboard/menu/categories/new" className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600">{t('menu.addCategory')}</Link>
      </div>
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3 gap-3">
              {cat.image && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <AppImage src={cat.image} alt="" className="w-full h-full object-cover" width={48} height={48} />
                </div>
              )}
              <h2 className="font-semibold flex-1">{localize(cat.name, cat.nameAr)}</h2>
              <div className="flex gap-2">
                <Link to={`/dashboard/menu/categories/${cat.id}`} className="text-sm text-brand-500 hover:underline">{t('menu.edit')}</Link>
                <Link to={`/dashboard/menu/products/new?categoryId=${cat.id}`} className="text-sm text-brand-500 hover:underline">{t('menu.addProduct')}</Link>
              </div>
            </div>
            <ul className="space-y-2">
              {(cat.products || []).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className={!p.isAvailable ? 'text-slate-400' : ''}>{localize(p.name, p.nameAr)}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-slate-500">{formatPrice(Number(p.price))}</span>
                    <Link to={`/dashboard/menu/products/${p.id}`} className="text-sm text-brand-500 hover:underline">{t('menu.edit')}</Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
