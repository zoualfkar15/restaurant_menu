import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { PageContainer, PageHero, SiteLayout } from '@/components/SiteLayout';
import { primaryButtonClass, secondaryButtonClass } from '@/components/SiteForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SITE_FEATURES } from '@/lib/siteFeatures';
import { ArrowForwardIcon, PlateIcon, StarIcon } from '@/components/menu/icons';

export default function FeaturesPage() {
  const { t, locale } = useLocale();
  const isRtl = locale === 'ar';
  useDocumentTitle(`${t('nav.features')} | MenuQR`);

  return (
    <SiteLayout active="features">
      <PageHero
        eyebrow={
          <>
            <StarIcon size={16} />
            {t('nav.features')}
          </>
        }
        title={t('features.title')}
        subtitle={t('features.subtitle')}
      />

      <PageContainer>
        <ul className="grid gap-4 md:grid-cols-2">
          {SITE_FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
            <li key={titleKey}>
              <article className="menu-card-hover flex h-full gap-4 rounded-[22px] bg-menu-surface p-5 ring-1 ring-menu-border hover:bg-menu-surface-elevated hover:shadow-menu-md hover:ring-menu-border-strong">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                  <Icon size={24} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold sm:text-lg">{t(titleKey)}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-menu-ink-muted sm:text-[15px]">{t(descKey)}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 border-t border-menu-border pt-8 sm:flex-row sm:justify-center">
          <Link to="/register" className={primaryButtonClass}>
            {t('features.startTrial')}
            <ArrowForwardIcon size={20} rtl={isRtl} />
          </Link>
          <Link to="/restaurant/demo-cafe/menu" className={secondaryButtonClass}>
            <PlateIcon size={20} className="text-primary-700" />
            {t('nav.viewDemo')}
          </Link>
        </div>
      </PageContainer>
    </SiteLayout>
  );
}
