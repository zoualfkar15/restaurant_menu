import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { CloseIcon, SearchIcon } from './icons';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function SearchBar({ value, onChange, className = '' }: SearchBarProps) {
  const { t } = useLocale();

  return (
    <div className={`relative ${className}`} role="search">
      <label htmlFor="menu-search" className="sr-only">
        {t('public.search')}
      </label>
      <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-menu-ink-muted">
        <SearchIcon size={20} />
      </span>
      <input
        id="menu-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('public.searchPlaceholder')}
        className="h-12 w-full rounded-2xl border border-menu-border bg-menu-surface-muted ps-12 pe-12 text-[15px] text-menu-ink placeholder:text-menu-ink-muted transition-colors focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('public.clearSearch')}
          className="absolute inset-y-0 end-2 my-auto flex h-9 w-9 items-center justify-center rounded-full text-menu-ink-muted transition-colors hover:bg-menu-border hover:text-menu-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  );
}

export default memo(SearchBar);
