'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, locale, setLocale } = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: drawer on mobile, fixed on desktop */}
      <aside
        className={`
          w-64 sm:w-56 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shrink-0 flex flex-col
          fixed md:static inset-y-0 left-0 z-50
          transform transition-transform duration-200 ease-out
          md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-slate-900 dark:text-white" onClick={() => setSidebarOpen(false)}>
            MenuQR
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-2 space-y-1 flex-1 overflow-auto">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
            {t('dashboard.overview')}
          </Link>
          <Link href="/dashboard/menu" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
            {t('dashboard.menu')}
          </Link>
          <Link href="/dashboard/restaurant" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
            {t('dashboard.landingPage')}
          </Link>
          <Link href="/dashboard/qr" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
            {t('dashboard.qrCode')}
          </Link>
        </nav>
        <div className="p-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
          <div className="flex items-center gap-1 px-3 py-2">
            <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">{t('dashboard.language')}</span>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`flex-1 px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${locale === 'en' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              En
            </button>
            <button
              type="button"
              onClick={() => setLocale('ar')}
              className={`flex-1 px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${locale === 'ar' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              ع
            </button>
          </div>
          <Link href="/" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            {t('dashboard.backToSite')}
          </Link>
          <button
            type="button"
            onClick={() => { typeof window !== 'undefined' && (localStorage.removeItem('accessToken'), localStorage.removeItem('refreshToken'), (window.location.href = '/login')); }}
            className="block w-full text-left px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            {t('dashboard.logOut')}
          </button>
        </div>
      </aside>

      {/* Main: top bar on mobile with hamburger */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 md:static flex items-center gap-3 px-3 py-3 md:py-0 md:px-0 md:pb-0 md:pt-0 md:block bg-slate-50 dark:bg-slate-900 border-b md:border-b-0 border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 md:hidden"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-auto text-slate-900 dark:text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
