import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMenu, trackMenuView } from '@/services/api';
import { LocaleProvider, useLocale } from '@/lib/locale';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { MenuPageSkeleton } from '@/components/Skeleton';
import ProductCard from '@/components/menu/ProductCard';
import CartDrawer from '@/components/menu/CartDrawer';
import CartFab from '@/components/menu/CartFab';
import AppImage from '@/components/AppImage';

type Product = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  description: string | null;
  descriptionAr?: string | null;
  price: string | number;
  image: string | null;
  isPopular: boolean;
};

type Category = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  image?: string | null;
  products: Product[];
};

type Restaurant = {
  slug: string;
  name: string;
  nameAr?: string | null;
  defaultLocale?: string | null;
  localesEnabled?: string[] | null;
  currency?: string | null;
  categories: Category[];
};

function MenuContent({ restaurant }: { restaurant: Restaurant }) {
  const { locale, setLocale, enabledLocales, localize, t } = useLocale();
  const categories = restaurant.categories || [];
  const [activeSection, setActiveSection] = useState<string>(categories[0]?.slug ?? '');
  const scrollingToRef = useRef<string | null>(null);
  const isRtl = locale === 'ar';
  const HEADER_OFFSET = 140;

  useDocumentTitle(`${t('public.menu')} | ${localize(restaurant.name, restaurant.nameAr)}`);

  useEffect(() => {
    if (categories.length === 0) return;
    const updateActive = () => {
      if (scrollingToRef.current) {
        setActiveSection(scrollingToRef.current);
        const targetEl = document.getElementById(scrollingToRef.current);
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          if (rect.top <= HEADER_OFFSET && rect.bottom >= HEADER_OFFSET) scrollingToRef.current = null;
        }
        return;
      }
      const triggerY = HEADER_OFFSET;
      let bestSlug = categories[0]?.slug ?? '';
      for (let i = 0; i < categories.length; i++) {
        const el = document.getElementById(categories[i].slug);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= triggerY) { bestSlug = categories[i].slug; break; }
        if (rect.bottom < triggerY) bestSlug = categories[i].slug;
      }
      setActiveSection(bestSlug);
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [categories]);

  const scrollToCategory = (slug: string) => {
    setActiveSection(slug);
    scrollingToRef.current = slug;
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { scrollingToRef.current = null; }, 2500);
  };

  return (
    <div className="min-h-screen pb-28 menu-bg text-menu-ink" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-20 bg-menu-surface-elevated/98 backdrop-blur-xl border-b border-menu-border shadow-menu-sm">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <Link to={`/restaurant/${restaurant.slug}`} className="text-sm font-medium text-menu-ink-muted hover:text-menu-accent transition-colors">
              <span aria-hidden>{isRtl ? '→' : '←'}</span> {localize(restaurant.name, restaurant.nameAr)}
            </Link>
            {enabledLocales.length > 1 && (
              <div className="flex gap-0.5 rounded-full bg-menu-surface-muted p-1 ring-1 ring-menu-border">
                {enabledLocales.map((l) => (
                  <button key={l} type="button" onClick={() => setLocale(l)} className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${locale === l ? 'bg-menu-surface-elevated text-menu-ink shadow-menu-sm ring-1 ring-menu-border' : 'text-menu-ink-muted hover:text-menu-ink'}`}>
                    {l === 'ar' ? 'ع' : 'En'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-menu-ink mt-3 tracking-tight">{t('public.menu')}</h1>
          <div className="mt-3 h-px w-12 rounded-full bg-brand-500" />
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pt-3 pb-3 mt-1 no-scrollbar scroll-smooth" aria-label={t('public.categories')}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => scrollToCategory(cat.slug)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border-2 ${activeSection === cat.slug ? 'bg-brand-500 text-white border-brand-600 shadow-menu-glow' : 'bg-menu-surface-muted text-menu-ink-secondary border-menu-border hover:bg-menu-border hover:text-menu-ink'}`}
            >
              {localize(cat.name, cat.nameAr)}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {categories.map((cat) => (
          <section key={cat.id} id={cat.slug} className="scroll-mt-44 first:pt-0 pt-12">
            <div className="flex items-center gap-4 mb-6">
              {cat.image && (
                <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-menu-md ring-2 ring-white">
                  <AppImage src={cat.image} alt="" className="w-full h-full object-cover" width={64} height={64} />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-menu-ink tracking-tight">{localize(cat.name, cat.nameAr)}</h2>
                {cat.products.length > 0 && (
                  <p className="text-sm text-menu-ink-muted mt-0.5">{cat.products.length} {t('public.items')}</p>
                )}
              </div>
            </div>
            <ul className="space-y-4">
              {cat.products.map((p, i) => (
                <ProductCard key={p.id} product={p} restaurantSlug={restaurant.slug} index={i} />
              ))}
            </ul>
          </section>
        ))}
      </main>

      <CartFab />
      <CartDrawer />
    </div>
  );
}

export default function MenuPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    trackMenuView(slug);
    getMenu(slug)
      .then((data) => {
        if (!data) setNotFound(true);
        else setRestaurant(data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <MenuPageSkeleton />;
  if (notFound || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center menu-bg">
        <p className="text-menu-ink-muted">Menu not found</p>
      </div>
    );
  }

  const defaultLocale = (restaurant.defaultLocale === 'en' || restaurant.defaultLocale === 'ar' ? restaurant.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales = Array.isArray(restaurant.localesEnabled) && restaurant.localesEnabled.length > 0
    ? (restaurant.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
    : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = restaurant.currency === 'TRY' ? 'TRY' : restaurant.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <MenuContent restaurant={restaurant} />
    </LocaleProvider>
  );
}
