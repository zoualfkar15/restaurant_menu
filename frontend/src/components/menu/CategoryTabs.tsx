import { memo, useEffect, useRef } from 'react';
import { useLocale } from '@/lib/locale';
import type { MenuCategory } from '@/types/menu';

export const ALL_CATEGORIES = 'all';

type CategoryTabsProps = {
  categories: MenuCategory[];
  active: string;
  onChange: (slug: string) => void;
  className?: string;
};

function CategoryTabs({ categories, active, onChange, className = '' }: CategoryTabsProps) {
  const { t, localize } = useLocale();
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active pill visible inside the horizontal scroller.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  const pills = [{ id: ALL_CATEGORIES, slug: ALL_CATEGORIES, label: t('public.all') }].concat(
    categories.map((c) => ({ id: c.id, slug: c.slug, label: localize(c.name, c.nameAr) })),
  );

  return (
    <div
      ref={listRef}
      className={`no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 pt-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 ${className}`}
      role="group"
      aria-label={t('public.categories')}
    >
      {pills.map((pill) => {
        const isActive = active === pill.slug;
        return (
          <button
            key={pill.id}
            type="button"
            data-slug={pill.slug}
            onClick={() => onChange(pill.slug)}
            aria-pressed={isActive}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-primary-600 text-white shadow-primary-glow'
                : 'bg-menu-surface-muted text-menu-ink-secondary ring-1 ring-menu-border hover:bg-menu-border hover:text-menu-ink'
            }`}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}

export default memo(CategoryTabs);
