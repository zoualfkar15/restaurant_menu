import { memo } from 'react';
import { useLocale } from '@/lib/locale';
import { useCartStore } from '@/store/cartStore';
import AppImage from '@/components/AppImage';

function CartDrawer() {
  const { t, formatPrice, localize } = useLocale();
  const { items, isOpen, setOpen, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCartStore();

  if (!isOpen) return null;

  const count = itemCount();
  const total = subtotal();

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setOpen(false)} />
      <aside className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-menu-lg max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-menu-border">
          <div>
            <h2 className="text-lg font-bold text-menu-ink">{t('cart.title')}</h2>
            {count > 0 && (
              <p className="text-sm text-menu-ink-muted">{count} {t('cart.items')}</p>
            )}
          </div>
          <button type="button" onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-menu-surface-muted flex items-center justify-center text-menu-ink-muted hover:bg-menu-border transition-colors" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-center text-menu-ink-muted py-12">{t('cart.empty')}</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-menu-surface-muted shrink-0">
                    {item.image ? (
                      <AppImage src={item.image} alt={localize(item.name, item.nameAr)} className="w-full h-full object-cover" width={64} height={64} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">🍽</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-menu-ink truncate">{localize(item.name, item.nameAr)}</p>
                    <p className="text-sm text-menu-accent font-semibold">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded-full border border-menu-border text-menu-ink font-medium hover:bg-menu-surface-muted">−</button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded-full border border-menu-border text-menu-ink font-medium hover:bg-menu-surface-muted">+</button>
                      <button type="button" onClick={() => removeItem(item.productId)} className="text-xs text-red-500 ms-auto hover:underline">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-menu-border bg-menu-surface-muted/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-menu-ink-secondary">{t('cart.total')}</span>
              <span className="text-xl font-bold text-menu-ink tabular-nums">{formatPrice(total)}</span>
            </div>
            <button type="button" className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors shadow-menu-glow">
              {t('cart.checkout')}
            </button>
            <button type="button" onClick={clearCart} className="w-full text-sm text-menu-ink-muted hover:text-menu-ink py-1">
              {t('cart.clear')}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default memo(CartDrawer);
