'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';
import SiteHeader from '@/components/SiteHeader';

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-24 px-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-10">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-600">
              {t('nav.startTrial')}
            </Link>
            <Link href="/restaurant/demo-cafe/menu" className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50">
              {t('nav.viewDemo')}
            </Link>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-700">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">{t('home.trusted')}</h2>
            <p className="text-slate-600 dark:text-slate-300">{t('home.oneLink')}</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>{t('footer.rights')}</span>
          <div className="flex gap-6">
            <Link href="/features">{t('nav.features')}</Link>
            <Link href="/pricing">{t('nav.pricing')}</Link>
            <Link href="/contact">{t('nav.contact')}</Link>
            <Link href="/login">{t('nav.login')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
