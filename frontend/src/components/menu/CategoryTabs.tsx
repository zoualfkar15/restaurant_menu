import { memo, useEffect, useRef, type ReactNode } from 'react';
import { useLocale } from '@/lib/locale';
import type { MenuCategory } from '@/types/menu';
import CategoryPhoto, { categoryPhotoSrc } from './CategoryPhoto';
import { GridIcon, PlateIcon } from './icons';

export const ALL_CATEGORIES = 'all';

type CategoryTabsProps = {
  categories: MenuCategory[];
  active: string;
  onChange: (slug: string) => void;
  className?: string;
};

function AllThumb({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center transition-colors duration-200 ${
        active ? 'bg-primary-600 text-white' : 'bg-gradient-to-br from-menu-surface-muted via-white to-primary-50 text-primary-500'
      }`}
    >
      <GridIcon size={26} />
    </span>
  );
}

function CategoryTabs({ categories, active, onChange, className = '' }: CategoryTabsProps) {
  const { t, localize } = useLocale();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  return (
    <div
      ref={listRef}
      className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 pt-0.5 sm:mx-0 sm:px-0 ${className}`}
      role="group"
      aria-label={t('public.categories')}
    >
      <Chip
        slug={ALL_CATEGORIES}
        label={t('public.all')}
        active={active === ALL_CATEGORIES}
        onSelect={onChange}
        photo={<AllThumb active={active === ALL_CATEGORIES} />}
      />
      {categories.map((category) => {
        const label = localize(category.name, category.nameAr);
        return (
          <Chip
            key={category.id}
            slug={category.slug}
            label={label}
            active={active === category.slug}
            onSelect={onChange}
            photo={
              <CategoryPhoto
                src={categoryPhotoSrc(category)}
                alt=""
                className="h-full w-full"
                fallback={<PlateIcon size={22} />}
                loading="eager"
              />
            }
          />
        );
      })}
    </div>
  );
}

function Chip({
  slug,
  label,
  active,
  onSelect,
  photo,
}: {
  slug: string;
  label: string;
  active: boolean;
  onSelect: (slug: string) => void;
  photo: ReactNode;
}) {
  return (
    <button
      type="button"
      data-slug={slug}
      onClick={() => onSelect(slug)}
      aria-pressed={active}
      title={label}
      className="group flex w-[4.65rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-2xl px-0.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:w-[5.15rem]"
    >
      <span
        className={`relative h-[3.85rem] w-[3.85rem] overflow-hidden rounded-[1.35rem] transition-all duration-200 sm:h-[4.25rem] sm:w-[4.25rem] ${
          active
            ? 'scale-[1.04] shadow-primary-glow ring-[2.5px] ring-primary-500 ring-offset-2 ring-offset-menu-surface-elevated'
            : 'ring-1 ring-menu-border/80 group-hover:ring-primary-200 group-hover:shadow-menu-sm'
        }`}
      >
        {photo}
        {active && <span className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/35" />}
      </span>
      <span
        className={`max-w-full truncate text-[11px] font-bold leading-tight tracking-wide sm:text-xs ${
          active ? 'text-primary-700' : 'text-menu-ink-secondary group-hover:text-menu-ink'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default memo(CategoryTabs);
