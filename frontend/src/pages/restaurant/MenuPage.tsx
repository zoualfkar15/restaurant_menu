import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMenu } from '@/services/api';
import { LocaleProvider, useLocale } from '@/lib/locale';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCart } from '@/hooks/useCart';
import { MenuPageSkeleton } from '@/components/Skeleton';
import RestaurantHero from '@/components/menu/RestaurantHero';
import SearchBar from '@/components/menu/SearchBar';
import CategoryTabs, { ALL_CATEGORIES } from '@/components/menu/CategoryTabs';
import MenuGrid, { type MenuSection } from '@/components/menu/MenuGrid';
import CartSidebar from '@/components/menu/CartSidebar';
import CartBar from '@/components/menu/CartBar';
import CartDrawer from '@/components/menu/CartDrawer';
import CartToast from '@/components/menu/CartToast';
import InfoSheet from '@/components/menu/InfoSheet';
import { matchesQuery, normalizeSearchText } from '@/utils/search';
import type { MenuRestaurant } from '@/types/menu';

function MenuContent({ restaurant }: { restaurant: MenuRestaurant }) {
  const { locale, localize, t } = useLocale();
  const { openCart, totalItems } = useCart(restaurant.slug);
  const categories = restaurant.categories ?? [];
  const isRtl = locale === 'ar';

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [infoOpen, setInfoOpen] = useState(false);

  useDocumentTitle(`${t('public.menu')} | ${localize(restaurant.name, restaurant.nameAr)}`);

  // If the active category disappears (e.g. menu refetch), fall back to "All".
  useEffect(() => {
    if (activeCategory !== ALL_CATEGORIES && !categories.some((c) => c.slug === activeCategory)) {
      setActiveCategory(ALL_CATEGORIES);
    }
  }, [categories, activeCategory]);

  const normalizedQuery = normalizeSearchText(query);
  const sections = useMemo<MenuSection[]>(() => {
    const base = activeCategory === ALL_CATEGORIES ? categories : categories.filter((c) => c.slug === activeCategory);
    return base.map((category) => ({
      category,
      products: normalizedQuery
        ? category.products.filter((p) => matchesQuery(normalizedQuery, p.name, p.nameAr, p.description, p.descriptionAr))
        : category.products,
    }));
  }, [categories, activeCategory, normalizedQuery]);

  const resetFilters = useCallback(() => {
    setQuery('');
    setActiveCategory(ALL_CATEGORIES);
  }, []);
  const openInfo = useCallback(() => setInfoOpen(true), []);
  const closeInfo = useCallback(() => setInfoOpen(false), []);

  const hasBottomBar = totalItems > 0;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`menu-bg font-menu min-h-screen overflow-x-clip text-menu-ink antialiased page-enter ${hasBottomBar ? 'pb-44 lg:pb-12' : 'pb-10 lg:pb-12'}`}
    >
      <RestaurantHero restaurant={restaurant} onOpenInfo={openInfo} onOpenCart={openCart} />

      <div className="relative z-10 mx-3 -mt-7 sm:mx-4 lg:mx-auto lg:-mt-10 lg:max-w-[1400px] lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
          <main className="rounded-[28px] bg-menu-surface-elevated px-4 pb-6 pt-4 shadow-menu-lg ring-1 ring-menu-border/80 sm:px-6 sm:pt-5 lg:rounded-[32px] lg:px-8 lg:pb-10 lg:pt-6">
            <div className="sticky top-0 z-20 -mx-4 rounded-t-[28px] bg-menu-surface-elevated px-4 pb-3 pt-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:rounded-t-[32px] lg:px-8">
              <SearchBar value={query} onChange={setQuery} />
              <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} className="mt-3" />
            </div>

            <div className="mt-4 lg:mt-6">
              <MenuGrid
                sections={sections}
                restaurantSlug={restaurant.slug}
                showHeadings={activeCategory === ALL_CATEGORIES}
                onReset={resetFilters}
              />
            </div>
          </main>

          <CartSidebar restaurant={restaurant} className="hidden lg:block" />
        </div>
      </div>

      <CartBar restaurant={restaurant} />
      <CartDrawer restaurant={restaurant} />
      <CartToast hasBottomBar={hasBottomBar} />
      <InfoSheet open={infoOpen} onClose={closeInfo} restaurant={restaurant} />
    </div>
  );
}

export default function MenuPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<MenuRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getMenu(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) setNotFound(true);
        else setRestaurant(data as MenuRestaurant);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <MenuPageSkeleton />;
  if (notFound || !restaurant) {
    return (
      <div className="menu-bg font-menu flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-menu-ink-muted">
          <span className="block text-lg font-bold text-menu-ink">القائمة غير موجودة</span>
          <span className="block text-sm">Menu not found</span>
        </p>
      </div>
    );
  }

  const defaultLocale = (restaurant.defaultLocale === 'en' || restaurant.defaultLocale === 'ar' ? restaurant.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales =
    Array.isArray(restaurant.localesEnabled) && restaurant.localesEnabled.length > 0
      ? (restaurant.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
      : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = restaurant.currency === 'TRY' ? 'TRY' : restaurant.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <MenuContent restaurant={restaurant} />
    </LocaleProvider>
  );
}
