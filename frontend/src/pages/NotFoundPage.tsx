import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { SiteLayout } from '@/components/SiteLayout';
import { primaryButtonClass, secondaryButtonClass } from '@/components/SiteForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ArrowBackIcon, PlateIcon } from '@/components/menu/icons';

export default function NotFoundPage() {
  const { t, locale } = useLocale();
  const isRtl = locale === 'ar';
  useDocumentTitle(`404 | MenuQR`);

  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 pt-16 text-center sm:pt-24">
        <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-primary-50 text-primary-700 ring-1 ring-primary-100">
          <PlateIcon size={44} />
        </div>
        <p className="mt-6 text-6xl font-extrabold tabular-nums text-primary-600/80" dir="ltr">
          404
        </p>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{t('notFound.title')}</h1>
        <p className="mt-3 text-menu-ink-muted">{t('notFound.subtitle')}</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link to="/" className={primaryButtonClass}>
            <ArrowBackIcon size={18} rtl={isRtl} />
            {t('common.backHome')}
          </Link>
          <Link to="/restaurant/demo-cafe/menu" className={secondaryButtonClass}>
            <PlateIcon size={18} className="text-primary-700" />
            {t('nav.viewDemo')}
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
