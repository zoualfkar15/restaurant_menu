import { useEffect, useRef, type ReactNode } from 'react';
import { useLocale } from '@/lib/locale';
import { CloseIcon } from './icons';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * `bottom`      – bottom sheet on every screen size.
   * `responsive`  – bottom sheet on phones, side panel (end edge) from `md` up.
   */
  variant?: 'bottom' | 'responsive';
  labelledBy?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal sheet: backdrop, Escape to close, body scroll lock,
 * focus restore and a light focus trap.
 */
export default function Sheet({ open, onClose, title, subtitle, children, footer, variant = 'responsive', labelledBy }: SheetProps) {
  const { t } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const titleId = labelledBy ?? 'sheet-title';

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (previousFocus.current instanceof HTMLElement) previousFocus.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelPosition =
    variant === 'responsive'
      ? 'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[28px] animate-sheet-in md:inset-x-auto md:inset-y-0 md:end-0 md:max-h-none md:w-[420px] md:rounded-none md:rounded-s-[28px] md:animate-slide-in-end'
      : 'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[28px] animate-sheet-in sm:bottom-6 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-[28px]';

  return (
    <div className="fixed inset-0 z-50 font-menu" role="presentation">
      <div className="absolute inset-0 bg-menu-ink/45 backdrop-blur-[2px] animate-fade-in" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute flex flex-col bg-white shadow-menu-lg ${panelPosition}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-menu-border px-5 pb-3 pt-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-extrabold text-menu-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-menu-ink-muted">{subtitle}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('public.close')}
            className="tap-target -me-2 -mt-1 inline-flex items-center justify-center rounded-full text-menu-ink-muted transition-colors hover:bg-menu-surface-muted hover:text-menu-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {footer && <div className="safe-bottom border-t border-menu-border bg-menu-surface px-5 pt-4 pb-4">{footer}</div>}
      </div>
    </div>
  );
}
