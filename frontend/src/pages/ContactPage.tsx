import { useLocale } from '@/lib/locale';
import SiteHeader from '@/components/SiteHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ContactPage() {
  const { t } = useLocale();
  useDocumentTitle(`${t('nav.contact')} | MenuQR`);
  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader active="contact" />
      <main className="flex-1 py-12 sm:py-16 px-4">
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-white shadow-lg border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('contact.title')}</h1>
          <p className="text-slate-600 mb-8">{t('contact.subtitle')}</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">{t('auth.name')}</label>
              <input type="text" className={inputClass} placeholder={t('contact.placeholderName')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">{t('auth.email')}</label>
              <input type="email" className={inputClass} placeholder={t('contact.placeholderEmail')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">{t('contact.message')}</label>
              <textarea rows={4} className={inputClass} placeholder={t('contact.placeholderMessage')} />
            </div>
            <button type="submit" className="bg-brand-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-600">{t('contact.send')}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
