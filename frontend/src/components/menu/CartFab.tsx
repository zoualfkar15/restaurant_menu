import { memo } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLocale } from '@/lib/locale';

function CartFab() {
  const { t } = useLocale();
  const count = useCartStore((s) => s.itemCount());
  const setOpen = useCartStore((s) => s.setOpen);

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-3.5 rounded-full bg-brand-500 text-white font-semibold shadow-menu-lg hover:bg-brand-600 active:scale-95 transition-all"
    >
      <span className="bg-white/20 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">{count}</span>
      {t('cart.viewCart')}
    </button>
  );
}

export default memo(CartFab);
