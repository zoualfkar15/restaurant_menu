import { memo, useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale';
import { useLastAdded } from '@/hooks/useCart';
import { CheckIcon } from './icons';

const TOAST_MS = 1800;

/** Small confirmation shown after an item is added to the cart. */
function CartToast({ hasBottomBar }: { hasBottomBar: boolean }) {
  const { t, localize } = useLocale();
  const lastAdded = useLastAdded();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    // Ignore stale entries (e.g. restored from a previous session).
    if (Date.now() - lastAdded.at > 2000) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [lastAdded]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`pointer-events-none fixed left-1/2 z-40 -translate-x-1/2 ${hasBottomBar ? 'bottom-[9.5rem]' : 'bottom-6'} lg:bottom-8`}
    >
      {visible && lastAdded && (
        <div
          key={lastAdded.at}
          className="animate-toast-in flex items-center gap-2.5 rounded-full bg-menu-ink px-4 py-2.5 text-sm font-semibold text-white shadow-menu-lg"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
            <CheckIcon size={14} />
          </span>
          <span className="max-w-[60vw] truncate">
            {t('cart.added')} · {localize(lastAdded.name, lastAdded.nameAr)}
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(CartToast);
