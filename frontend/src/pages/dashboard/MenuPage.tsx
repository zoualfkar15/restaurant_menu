import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '@/services/api';
import { useLocale } from '@/lib/locale';
import AppImage from '@/components/AppImage';
import { primaryButtonClass } from '@/components/SiteForm';

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

  if (loading) return <p className="font-semibold text-menu-ink-muted">{t('dashboard.loading')}</p>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-menu-ink">{t('dashboard.menu')}</h1>
        <Link to="/dashboard/menu/categories/new" className={primaryButtonClass}>{t('menu.addCategory')}</Link>
      </div>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-[22px] bg-menu-surface-elevated p-4 shadow-menu-sm ring-1 ring-menu-border sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              {cat.image && (
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-menu-surface-muted ring-1 ring-menu-border">
                  <AppImage src={cat.image} alt="" className="h-full w-full object-cover" width={48} height={48} />
                </div>
              )}
              <h2 className="flex-1 font-extrabold text-menu-ink">{localize(cat.name, cat.nameAr)}</h2>
              <div className="flex gap-3">
                <Link to={`/dashboard/menu/categories/${cat.id}`} className="text-sm font-bold text-primary-700 hover:text-primary-800">{t('menu.edit')}</Link>
                <Link to={`/dashboard/menu/products/new?categoryId=${cat.id}`} className="text-sm font-bold text-primary-700 hover:text-primary-800">{t('menu.addProduct')}</Link>
              </div>
            </div>
            <ul className="space-y-1">
              {(cat.products || []).map((p) => (
                <li key={p.id} className="flex items-center justify-between border-b border-menu-border py-2.5 last:border-0">
                  <span className={!p.isAvailable ? 'text-menu-ink-muted' : 'font-medium text-menu-ink'}>{localize(p.name, p.nameAr)}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-menu-ink-muted">{formatPrice(Number(p.price))}</span>
                    <Link to={`/dashboard/menu/products/${p.id}`} className="text-sm font-bold text-primary-700 hover:text-primary-800">{t('menu.edit')}</Link>
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
