import { useLocale } from '@/lib/locale';
import { PageContainer, PageHero, SiteLayout } from '@/components/SiteLayout';
import { primaryButtonClass, TextAreaField, TextField } from '@/components/SiteForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PhoneIcon } from '@/components/menu/icons';

export default function ContactPage() {
  const { t } = useLocale();
  useDocumentTitle(`${t('nav.contact')} | MenuQR`);

  return (
    <SiteLayout active="contact">
      <PageHero
        eyebrow={
          <>
            <PhoneIcon size={16} />
            {t('nav.contact')}
          </>
        }
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />

      <PageContainer size="sm">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <TextField id="contact-name" label={t('auth.name')} type="text" autoComplete="name" placeholder={t('contact.placeholderName')} />
          <TextField id="contact-email" label={t('auth.email')} type="email" autoComplete="email" placeholder={t('contact.placeholderEmail')} />
          <TextAreaField id="contact-message" label={t('contact.message')} rows={5} placeholder={t('contact.placeholderMessage')} />
          <button type="submit" className={`${primaryButtonClass} w-full sm:w-auto sm:min-w-[160px]`}>
            {t('contact.send')}
          </button>
        </form>
      </PageContainer>
    </SiteLayout>
  );
}
