import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { MinusIcon, PlusIcon, TrashIcon } from './icons';

type QuantityControlProps = {
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  /** Visual size. `sm` fits inside cart rows, `md` is the default for menu cards. */
  size?: 'sm' | 'md';
  /** Show a trash icon instead of "−" when quantity is 1 (used in the cart). */
  trashAtOne?: boolean;
  /** Accessible name of the product, used to label the controls. */
  label?: string;
  className?: string;
};

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

/**
 * "+" button that morphs into a [−] n [+] stepper once the item is in the cart.
 * Shared by menu cards, the cart drawer and the desktop cart sidebar so the
 * behaviour is identical everywhere.
 */
function QuantityControl({
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  size = 'md',
  trashAtOne = false,
  label,
  className = '',
}: QuantityControlProps) {
  const { t } = useLocale();
  const btn = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 16 : 18;
  const suffix = label ? ` – ${label}` : '';

  if (quantity <= 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        aria-label={`${t('cart.add')}${suffix}`}
        className={`${size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'} inline-flex items-center justify-center rounded-full bg-primary-600 text-white shadow-primary-glow transition-all duration-200 hover:bg-primary-700 active:scale-90 ${focusRing} ${className}`}
      >
        <PlusIcon size={size === 'sm' ? 18 : 22} />
      </button>
    );
  }

  const showTrash = trashAtOne && quantity === 1;

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full bg-primary-50 ring-1 ring-primary-200/70 p-0.5 text-primary-800 animate-pop ${className}`}
      role="group"
      aria-label={`${t('cart.quantity')}${suffix}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label={`${showTrash ? t('cart.remove') : t('cart.decrease')}${suffix}`}
        className={`${btn} inline-flex items-center justify-center rounded-full text-primary-700 transition-colors hover:bg-primary-100 active:scale-90 ${focusRing}`}
      >
        {showTrash ? <TrashIcon size={iconSize} /> : <MinusIcon size={iconSize} />}
      </button>
      <span
        key={quantity}
        className={`${size === 'sm' ? 'min-w-[1.5rem] text-sm' : 'min-w-[1.75rem] text-base'} text-center font-bold tabular-nums animate-pop`}
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={`${t('cart.increase')}${suffix}`}
        className={`${btn} inline-flex items-center justify-center rounded-full bg-primary-600 text-white shadow-sm transition-colors hover:bg-primary-700 active:scale-90 ${focusRing}`}
      >
        <PlusIcon size={iconSize} />
      </button>
    </div>
  );
}

export default memo(QuantityControl);
