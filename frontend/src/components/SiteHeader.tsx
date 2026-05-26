import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';

type NavItem = { to: string; key: string };
const navItems: NavItem[] = [
  { to: '/features', key: 'nav.features' },
  { to: '/pricing', key: 'nav.pricing' },
  { to: '/contact', key: 'nav.contact' },
];

export default function SiteHeader({ active }: { active?: 'features' | 'pricing' | 'contact' | 'login' }) {
  const { t, locale, setLocale, enabledLocales } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">MenuQR</Link>
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={active === item.key.split('.')[1] ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}
            >
              {t(item.key)}
            </Link>
          ))}
          {enabledLocales.length > 1 && (
            <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
              {enabledLocales.map((l) => (
                <button key={l} type="button" onClick={() => setLocale(l)} className={`px-2.5 py-1 text-sm rounded-md ${locale === l ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}`}>
                  {l === 'ar' ? 'ع' : 'En'}
                </button>
              ))}
            </div>
          )}
          <Link to="/login" className={active === 'login' ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}>{t('nav.login')}</Link>
          <Link to="/register" className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 shrink-0">{t('nav.getStarted')}</Link>
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <Link to="/register" className="bg-brand-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-600">{t('nav.getStarted')}</Link>
          <button type="button" onClick={() => setMobileOpen((o) => !o)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 right-0 top-full md:hidden z-50 border-b border-slate-200 bg-white shadow-lg">
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50">{t(item.key)}</Link>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50">{t('nav.login')}</Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
