import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { CloseIcon, MenuIcon, QrIcon } from '@/components/menu/icons';

type NavItem = { to: string; key: string };
const navItems: NavItem[] = [
  { to: '/features', key: 'nav.features' },
  { to: '/pricing', key: 'nav.pricing' },
  { to: '/contact', key: 'nav.contact' },
];

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

/** MenuQR wordmark + QR badge, shared by the header, footer and auth pages. `light` is for dark green backgrounds. */
export function BrandMark({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const light = tone === 'light';
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 rounded-xl font-menu text-lg font-extrabold ${
        light ? 'text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white' : `text-menu-ink ${focusRing}`
      } ${className}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${
          light ? 'bg-white/15 ring-1 ring-white/30' : 'bg-primary-600 shadow-primary-glow'
        }`}
      >
        <QrIcon size={20} />
      </span>
      MenuQR
    </Link>
  );
}

export default function SiteHeader({ active }: { active?: 'features' | 'pricing' | 'contact' | 'login' }) {
  const { t, locale, setLocale, enabledLocales } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (key: string) =>
    `rounded-lg px-1 text-[15px] font-semibold transition-colors ${focusRing} ${
      active === key ? 'text-primary-700' : 'text-menu-ink-secondary hover:text-menu-ink'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-menu-border bg-white/90 font-menu text-menu-ink backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={linkClass(item.key.split('.')[1])}>
              {t(item.key)}
            </Link>
          ))}
          <Link to="/login" className={linkClass('login')}>
            {t('nav.login')}
          </Link>
          {enabledLocales.length > 1 && (
            <div className="flex gap-0.5 rounded-full bg-menu-surface-muted p-1 ring-1 ring-menu-border" role="group" aria-label={t('public.language')}>
              {enabledLocales.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  aria-pressed={locale === l}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    locale === l ? 'bg-white text-menu-ink shadow-sm' : 'text-menu-ink-muted hover:text-menu-ink'
                  }`}
                >
                  {l === 'ar' ? 'ع' : 'En'}
                </button>
              ))}
            </div>
          )}
          <Link
            to="/register"
            className={`inline-flex h-10 shrink-0 items-center rounded-xl bg-primary-600 px-4 text-sm font-bold text-white shadow-primary-glow transition-colors hover:bg-primary-700 ${focusRing}`}
          >
            {t('nav.getStarted')}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/register"
            className={`inline-flex h-10 items-center rounded-xl bg-primary-600 px-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 ${focusRing}`}
          >
            {t('nav.getStarted')}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className={`tap-target inline-flex items-center justify-center rounded-full text-menu-ink-secondary transition-colors hover:bg-menu-surface-muted hover:text-menu-ink ${focusRing}`}
            aria-label={t('nav.toggleMenu')}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          {/* Starts below the 64px bar so the header itself is never dimmed. */}
          <div className="fixed inset-x-0 bottom-0 top-16 z-40 bg-menu-ink/30 backdrop-blur-[2px] animate-fade-in md:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-x-0 top-full z-50 border-b border-menu-border bg-white shadow-menu-lg animate-slide-up md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Main">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors hover:bg-menu-surface-muted ${
                    active === item.key.split('.')[1] ? 'bg-primary-50 text-primary-700' : 'text-menu-ink'
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors hover:bg-menu-surface-muted ${
                  active === 'login' ? 'bg-primary-50 text-primary-700' : 'text-menu-ink'
                }`}
              >
                {t('nav.login')}
              </Link>
              {enabledLocales.length > 1 && (
                <div className="mt-2 flex items-center justify-between rounded-xl bg-menu-surface-muted px-4 py-3">
                  <span className="text-[15px] font-semibold text-menu-ink">{t('public.language')}</span>
                  <div className="flex gap-0.5 rounded-full bg-white p-1 ring-1 ring-menu-border" role="group" aria-label={t('public.language')}>
                    {enabledLocales.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLocale(l)}
                        aria-pressed={locale === l}
                        className={`rounded-full px-3 py-1 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                          locale === l ? 'bg-primary-600 text-white shadow-sm' : 'text-menu-ink-muted hover:text-menu-ink'
                        }`}
                      >
                        {l === 'ar' ? 'العربية' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
