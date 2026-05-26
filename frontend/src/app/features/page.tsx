'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';
import SiteHeader from '@/components/SiteHeader';

const featureKeys = [
  { titleKey: 'features.qrMenu', descKey: 'features.qrMenuDesc' },
  { titleKey: 'features.landing', descKey: 'features.landingDesc' },
  { titleKey: 'features.categories', descKey: 'features.categoriesDesc' },
  { titleKey: 'features.upToDate', descKey: 'features.upToDateDesc' },
  { titleKey: 'features.mobileFirst', descKey: 'features.mobileFirstDesc' },
  { titleKey: 'features.analytics', descKey: 'features.analyticsDesc' },
];

export default function FeaturesPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="features" />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('features.title')}</h1>
          <p className="text-slate-600">{t('features.subtitle')}</p>
        </div>
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">
          {featureKeys.map((f) => (
            <div key={f.titleKey} className="p-6 rounded-xl border border-slate-200 bg-white">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">{t(f.titleKey)}</h2>
              <p className="text-slate-600">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto text-center mt-16">
          <Link href="/register" className="inline-block bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-600">{t('features.startTrial')}</Link>
        </div>
      </main>
    </div>
  );
}
