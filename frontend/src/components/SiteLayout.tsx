import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import SiteHeader, { BrandMark } from '@/components/SiteHeader';

type ActivePage = 'features' | 'pricing' | 'contact' | 'login';

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

/** Page shell for the marketing site: menu design tokens + shared header/footer. */
export function SiteLayout({ active, children }: { active?: ActivePage; children: ReactNode }) {
  return (
    <div className="menu-bg font-menu flex min-h-screen flex-col overflow-x-clip text-menu-ink antialiased page-enter">
      <SiteHeader active={active} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  const { t } = useLocale();
  const link = `rounded hover:text-menu-ink ${focusRing}`;
  return (
    <footer className="mt-16 border-t border-menu-border bg-menu-surface-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-menu-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <BrandMark />
          <span>{t('footer.rights')}</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-semibold" aria-label="Footer">
          <Link to="/features" className={link}>{t('nav.features')}</Link>
          <Link to="/pricing" className={link}>{t('nav.pricing')}</Link>
          <Link to="/contact" className={link}>{t('nav.contact')}</Link>
          <Link to="/login" className={link}>{t('nav.login')}</Link>
        </nav>
      </div>
    </footer>
  );
}

/** Compact dark‑green page header with rounded bottom corners (same shape as the restaurant hero). */
export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <section className="hero-fallback relative overflow-hidden rounded-b-[32px] px-4 pb-20 pt-12 text-center text-white sm:px-6 lg:rounded-b-[40px] lg:pb-28 lg:pt-16">
      <div className="mx-auto max-w-2xl">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white/95 ring-1 ring-white/25 backdrop-blur-md sm:text-sm">
            {eyebrow}
          </span>
        )}
        <h1 className={`text-balance text-3xl font-extrabold leading-tight drop-shadow-md sm:text-4xl lg:text-5xl ${eyebrow ? 'mt-5' : ''}`}>{title}</h1>
        {subtitle && <p className="text-balance mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

/** White rounded container that overlaps the `PageHero`, like the menu container overlaps the restaurant hero. */
export function PageContainer({ children, className = '', size = 'lg' }: { children: ReactNode; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const maxWidth = size === 'sm' ? 'lg:max-w-2xl' : size === 'md' ? 'lg:max-w-4xl' : 'lg:max-w-6xl';
  return (
    <div className={`relative z-10 mx-3 -mt-10 sm:mx-4 lg:mx-auto lg:-mt-14 lg:px-8 ${maxWidth}`}>
      <div className={`rounded-[28px] bg-menu-surface-elevated p-5 shadow-menu-lg ring-1 ring-menu-border/80 sm:p-8 lg:rounded-[32px] lg:p-10 ${className}`}>{children}</div>
    </div>
  );
}
