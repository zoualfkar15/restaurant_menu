import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import SiteHeader from '@/components/SiteHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const planKeys = [
  { nameKey: 'pricing.basic', descKey: 'pricing.basicDesc', monthly: 19, yearly: 15, features: ['pricing.feature1Restaurant', 'pricing.featureUnlimited', 'pricing.featureQR', 'pricing.featureLanding', 'pricing.featureEmail'], highlighted: false },
  { nameKey: 'pricing.pro', descKey: 'pricing.proDesc', monthly: 39, yearly: 31, features: ['pricing.featureEverything', 'pricing.featureAnalytics', 'pricing.featurePriority', 'pricing.featureBranding', 'pricing.featureNoBranding'], highlighted: true },
];

export default function PricingPage() {
  const { t } = useLocale();
  useDocumentTitle(`${t('nav.pricing')} | MenuQR`);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="pricing" />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('pricing.title')}</h1>
          <p className="text-slate-600">{t('pricing.subtitle')}</p>
        </div>
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {planKeys.map((plan) => (
            <div key={plan.nameKey} className={`rounded-2xl border p-8 ${plan.highlighted ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500' : 'border-slate-200 bg-white'}`}>
              <h2 className="text-xl font-bold text-slate-900">{t(plan.nameKey)}</h2>
              <p className="text-slate-600 mt-1 mb-6">{t(plan.descKey)}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-slate-900">€{plan.monthly}</span>
                <span className="text-slate-500">{t('pricing.perMonth')}</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">{t('pricing.billedYearly', { yearly: String(plan.yearly) })}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-700"><span className="text-brand-500">✓</span> {t(f)}</li>
                ))}
              </ul>
              <Link to="/register" className={`block w-full text-center py-3 rounded-lg font-medium ${plan.highlighted ? 'bg-brand-500 text-white hover:bg-brand-600' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{t('pricing.getStarted')}</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
