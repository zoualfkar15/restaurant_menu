import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { PageContainer, PageHero, SiteLayout } from '@/components/SiteLayout';
import { primaryButtonClass, secondaryButtonClass } from '@/components/SiteForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { CheckIcon, StarIcon } from '@/components/menu/icons';

const planKeys = [
  { nameKey: 'pricing.basic', descKey: 'pricing.basicDesc', monthly: 19, yearly: 15, features: ['pricing.feature1Restaurant', 'pricing.featureUnlimited', 'pricing.featureQR', 'pricing.featureLanding', 'pricing.featureEmail'], highlighted: false },
  { nameKey: 'pricing.pro', descKey: 'pricing.proDesc', monthly: 39, yearly: 31, features: ['pricing.featureEverything', 'pricing.featureAnalytics', 'pricing.featurePriority', 'pricing.featureBranding', 'pricing.featureNoBranding'], highlighted: true },
];

export default function PricingPage() {
  const { t } = useLocale();
  useDocumentTitle(`${t('nav.pricing')} | MenuQR`);

  return (
    <SiteLayout active="pricing">
      <PageHero title={t('pricing.title')} subtitle={t('pricing.subtitle')} />

      <PageContainer size="md" className="lg:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {planKeys.map((plan) => (
            <article
              key={plan.nameKey}
              aria-labelledby={`${plan.nameKey}-title`}
              className={`relative flex flex-col rounded-[24px] p-6 sm:p-7 ${
                plan.highlighted
                  ? 'bg-primary-900 text-white shadow-primary-glow ring-2 ring-primary-500'
                  : 'bg-menu-surface ring-1 ring-menu-border'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 end-6 inline-flex items-center gap-1 rounded-full bg-menu-accent px-3 py-1 text-xs font-extrabold text-white shadow-menu-md">
                  <StarIcon size={12} />
                  {t('pricing.popular')}
                </span>
              )}

              <h2 id={`${plan.nameKey}-title`} className="text-xl font-extrabold">
                {t(plan.nameKey)}
              </h2>
              <p className={`mt-1 text-sm ${plan.highlighted ? 'text-white/75' : 'text-menu-ink-muted'}`}>{t(plan.descKey)}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tabular-nums tracking-tight" dir="ltr">
                  €{plan.monthly}
                </span>
                <span className={`text-sm font-semibold ${plan.highlighted ? 'text-white/70' : 'text-menu-ink-muted'}`}>{t('pricing.perMonth')}</span>
              </div>
              <p className={`mt-1 text-xs font-medium ${plan.highlighted ? 'text-white/60' : 'text-menu-ink-muted'}`}>
                {t('pricing.billedYearly', { yearly: String(plan.yearly) })}
              </p>

              <p className={`mt-6 text-xs font-bold uppercase tracking-wide ${plan.highlighted ? 'text-white/60' : 'text-menu-ink-muted'}`}>{t('pricing.includes')}</p>
              <ul className="mt-3 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[15px] font-semibold">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        plan.highlighted ? 'bg-white/15 text-white' : 'bg-primary-50 text-primary-700'
                      }`}
                    >
                      <CheckIcon size={13} />
                    </span>
                    {t(f)}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-8 w-full ${
                  plan.highlighted
                    ? 'inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-white px-5 text-[15px] font-extrabold text-primary-800 shadow-lg shadow-black/10 transition-colors hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900'
                    : primaryButtonClass
                }`}
              >
                {t('pricing.getStarted')}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center text-sm font-semibold text-menu-ink-muted sm:flex-row">
          <span>{t('pricing.questions')}</span>
          <Link to="/contact" className={`${secondaryButtonClass} min-h-[44px] px-4 text-sm`}>
            {t('nav.contact')}
          </Link>
        </div>
      </PageContainer>
    </SiteLayout>
  );
}
