import { useState } from 'react';
import { useLocale } from '@/lib/locale';
import { PageContainer, PageHero, SiteLayout } from '@/components/SiteLayout';
import { FormError, primaryButtonClass, TextAreaField, TextField } from '@/components/SiteForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PhoneIcon } from '@/components/menu/icons';
import { submitContact } from '@/services/api';
import Spinner from '@/components/Spinner';

export default function ContactPage() {
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useDocumentTitle(`${t('nav.contact')} | MenuQR`);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const { res, data } = await submitContact({ name, email, phone, message });
      if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message[0] : data.message;
        setError(typeof msg === 'string' && msg ? msg : t('contact.failed'));
        return;
      }
      setSuccess(t('contact.success'));
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setError(t('contact.failed'));
    } finally {
      setSubmitting(false);
    }
  }

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
        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormError>{error}</FormError>
          {success && (
            <p role="status" className="rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800 ring-1 ring-primary-100">
              {success}
            </p>
          )}
          <TextField
            id="contact-name"
            label={t('auth.name')}
            type="text"
            autoComplete="name"
            placeholder={t('contact.placeholderName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={120}
          />
          <TextField
            id="contact-email"
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            placeholder={t('contact.placeholderEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            id="contact-phone"
            label={t('contact.phone')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={t('contact.placeholderPhone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            minLength={6}
            maxLength={30}
            dir="ltr"
          />
          <TextAreaField
            id="contact-message"
            label={t('contact.message')}
            rows={5}
            placeholder={t('contact.placeholderMessage')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={2}
            maxLength={2000}
          />
          <button type="submit" className={`${primaryButtonClass} w-full sm:w-auto sm:min-w-[160px]`} disabled={submitting}>
            {submitting && <Spinner className="h-4 w-4" />}
            {submitting ? t('contact.sending') : t('contact.send')}
          </button>
        </form>
      </PageContainer>
    </SiteLayout>
  );
}
