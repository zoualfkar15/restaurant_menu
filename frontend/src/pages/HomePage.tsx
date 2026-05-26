import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import SiteHeader from '@/components/SiteHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function HomePage() {
  const { t } = useLocale();
  useDocumentTitle('MenuQR — Digital Menus for Restaurants');

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-24 px-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t('home.hero.title')}</h1>
          <p className="text-lg text-slate-600 mb-10">{t('home.hero.subtitle')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors">{t('nav.startTrial')}</Link>
            <Link to="/restaurant/demo-cafe/menu" className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">{t('nav.viewDemo')}</Link>
          </div>
        </section>
        <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('home.trusted')}</h2>
            <p className="text-slate-600">{t('home.oneLink')}</p>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-4 text-sm text-slate-500">
          <span>{t('footer.rights')}</span>
          <div className="flex gap-6">
            <Link to="/features">{t('nav.features')}</Link>
            <Link to="/pricing">{t('nav.pricing')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
            <Link to="/login">{t('nav.login')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
