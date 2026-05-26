'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale';

type NavItem = { href: string; key: string };
const navItems: NavItem[] = [
  { href: '/features', key: 'nav.features' },
  { href: '/pricing', key: 'nav.pricing' },
  { href: '/contact', key: 'nav.contact' },
];

export default function SiteHeader({ active }: { active?: 'features' | 'pricing' | 'contact' | 'login' }) {
  const { t, locale, setLocale, enabledLocales } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white shrink-0">
          MenuQR
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={active === item.key.split('.')[1] ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}
            >
              {t(item.key)}
            </Link>
          ))}
          {enabledLocales.length > 1 && (
            <div className="flex gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 p-0.5">
              {enabledLocales.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`px-2.5 py-1 text-sm rounded-md ${locale === l ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {l === 'ar' ? 'ع' : 'En'}
                </button>
              ))}
            </div>
          )}
          <Link href="/login" className={active === 'login' ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}>
            {t('nav.login')}
          </Link>
          <Link href="/register" className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 shrink-0">
            {t('nav.getStarted')}
          </Link>
        </nav>

        {/* Mobile: hamburger + Get started */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/register" className="bg-brand-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-600">
            {t('nav.getStarted')}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full md:hidden z-50 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
            <nav className="px-4 py-4 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-left ${active === item.key.split('.')[1] ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {t(item.key)}
                </Link>
              ))}
              {enabledLocales.length > 1 && (
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('restaurant.defaultLanguage')}</span>
                  <div className="flex gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 p-0.5">
                    {enabledLocales.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLocale(l)}
                        className={`px-3 py-1.5 text-sm rounded-md ${locale === l ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
                      >
                        {l === 'ar' ? 'عربية' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-left ${active === 'login' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {t('nav.login')}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
