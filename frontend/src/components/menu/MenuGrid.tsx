import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import type { MenuCategory, MenuProduct } from '@/types/menu';
import CategoryPhoto, { categoryPhotoSrc } from './CategoryPhoto';
import MenuItemCard from './MenuItemCard';
import { SearchIcon } from './icons';

export type MenuSection = { category: MenuCategory; products: MenuProduct[] };

type MenuGridProps = {
  sections: MenuSection[];
  restaurantSlug: string;
  /** Show category headings above each group (used for the "All" view). */
  showHeadings: boolean;
  onReset?: () => void;
};

// 1 col on phones, 2 on tablets, back to 1 at `lg` (sidebar eats width), 2 at `xl`, 3 on very wide screens.
const gridClass = 'grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3';

function MenuGrid({ sections, restaurantSlug, showHeadings, onReset }: MenuGridProps) {
  const { t, localize } = useLocale();
  const total = sections.reduce((sum, s) => sum + s.products.length, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center py-14 text-center animate-fade-in">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-menu-surface-muted text-menu-ink-muted">
          <SearchIcon size={28} />
        </span>
        <p className="text-base font-bold text-menu-ink">{t('public.noResults')}</p>
        <p className="mt-1 text-sm text-menu-ink-muted">{t('public.noResultsHint')}</p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary-50 px-4 text-sm font-bold text-primary-700 ring-1 ring-primary-200 transition-colors hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {t('public.showAll')}
          </button>
        )}
      </div>
    );
  }

  let index = 0;

  return (
    <div className="space-y-8">
      {sections.map(({ category, products }) => {
        if (products.length === 0) return null;
        return (
          <section key={category.id} id={`category-${category.slug}`} aria-labelledby={showHeadings ? `heading-${category.slug}` : undefined}>
            {showHeadings && (
              <div className="mb-3 flex items-center gap-3">
                <CategoryPhoto
                  src={categoryPhotoSrc(category)}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-menu-border/80"
                />
                <h2 id={`heading-${category.slug}`} className="text-lg font-extrabold text-menu-ink sm:text-xl">
                  {localize(category.name, category.nameAr)}
                </h2>
                <span className="rounded-full bg-menu-surface-muted px-2.5 py-0.5 text-xs font-bold text-menu-ink-muted">
                  {products.length}
                </span>
              </div>
            )}
            <ul className={gridClass}>
              {products.map((product) => (
                <MenuItemCard key={product.id} product={product} restaurantSlug={restaurantSlug} index={index++} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default memo(MenuGrid);
