import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { BrandMark } from '@/components/SiteHeader';
import { ArrowBackIcon, CheckIcon } from '@/components/menu/icons';

const HIGHLIGHT_KEYS = ['features.qrMenu', 'features.whatsapp', 'features.upToDate', 'features.multilingual'];

/**
 * Login / sign‑up shell. Phones: dark‑green brand band with the form card overlapping it (menu‑page pattern).
 * Desktop: split layout with the brand panel on the inline‑start side and the form centred on the other.
 */
export default function AuthLayout({ title, subtitle, children, footer }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  const { t, locale } = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="menu-bg font-menu min-h-screen text-menu-ink antialiased page-enter lg:grid lg:grid-cols-2">
      <aside className="hero-fallback relative overflow-hidden rounded-b-[32px] px-5 pb-20 pt-5 text-white sm:px-8 lg:flex lg:flex-col lg:justify-between lg:rounded-none lg:rounded-e-[40px] lg:px-14 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <BrandMark tone="light" />
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white/15 px-3.5 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowBackIcon size={16} rtl={isRtl} />
            {t('common.backHome')}
          </Link>
        </div>

        <div className="mt-8 lg:mt-0 lg:max-w-md">
          <h2 className="text-balance text-2xl font-extrabold leading-tight drop-shadow-md sm:text-3xl lg:text-4xl">{t('home.hero.title')}</h2>
          <p className="text-balance mt-3 text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">{t('home.hero.subtitle')}</p>
          <ul className="mt-6 hidden space-y-3 lg:block">
            {HIGHLIGHT_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-3 text-[15px] font-semibold text-white/90">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <CheckIcon size={14} />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 hidden text-sm text-white/60 lg:block">{t('footer.rights')}</p>
      </aside>

      <main className="relative z-10 mx-3 -mt-12 pb-10 sm:mx-auto sm:w-full sm:max-w-md lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center lg:justify-center lg:px-12 lg:py-12">
        <div className="w-full rounded-[28px] bg-menu-surface-elevated p-6 shadow-menu-lg ring-1 ring-menu-border/80 sm:p-8 lg:max-w-md lg:rounded-[32px]">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-menu-ink-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 border-t border-menu-border pt-5 text-center text-sm text-menu-ink-secondary">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
