import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { CartIcon } from './icons';

type EmptyCartProps = {
  onBrowse?: () => void;
  compact?: boolean;
};

function EmptyCart({ onBrowse, compact = false }: EmptyCartProps) {
  const { t } = useLocale();

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'py-8' : 'py-12'}`}>
      <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-8 ring-primary-50/60">
        <CartIcon size={34} />
        <span className="absolute -end-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-extrabold text-menu-ink-muted shadow-menu-sm ring-1 ring-menu-border">
          0
        </span>
      </div>
      <h3 className="text-lg font-extrabold text-menu-ink">{t('cart.empty')}</h3>
      <p className="mt-1 max-w-[240px] text-sm leading-relaxed text-menu-ink-muted">{t('cart.emptyHint')}</p>
      {onBrowse && (
        <button
          type="button"
          onClick={onBrowse}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary-600 px-5 text-sm font-bold text-white shadow-primary-glow transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {t('cart.browseMenu')}
        </button>
      )}
    </div>
  );
}

export default memo(EmptyCart);
