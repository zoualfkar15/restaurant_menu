import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useLocale } from '@/lib/locale';

export default function DashboardLayout() {
  const { t, locale, setLocale } = useLocale();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`w-64 sm:w-56 bg-white border-r border-slate-200 shrink-0 flex flex-col fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-200 md:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" className="font-bold text-slate-900" onClick={() => setSidebarOpen(false)}>MenuQR</Link>
          <button type="button" onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden">✕</button>
        </div>
        <nav className="p-2 space-y-1 flex-1 overflow-auto">
          <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">{t('dashboard.overview')}</Link>
          <Link to="/dashboard/menu" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">{t('dashboard.menu')}</Link>
          <Link to="/dashboard/restaurant" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">{t('dashboard.landingPage')}</Link>
          <Link to="/dashboard/qr" onClick={() => setSidebarOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">{t('dashboard.qrCode')}</Link>
        </nav>
        <div className="p-2 border-t border-slate-100 space-y-1">
          <div className="flex items-center gap-1 px-3 py-2">
            <span className="text-sm text-slate-500 mr-2">{t('dashboard.language')}</span>
            <button type="button" onClick={() => setLocale('en')} className={`flex-1 px-2 py-1.5 text-sm font-medium rounded-md ${locale === 'en' ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>En</button>
            <button type="button" onClick={() => setLocale('ar')} className={`flex-1 px-2 py-1.5 text-sm font-medium rounded-md ${locale === 'ar' ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>ع</button>
          </div>
          <Link to="/" className="block px-3 py-2 text-sm text-slate-500 hover:text-slate-700">{t('dashboard.backToSite')}</Link>
          <button type="button" onClick={logout} className="block w-full text-left px-3 py-2 text-sm text-slate-500 hover:text-slate-700">{t('dashboard.logOut')}</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 md:static flex items-center gap-3 px-3 py-3 md:hidden bg-slate-50 border-b border-slate-200">
          <button type="button" onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200" aria-label="Open menu">☰</button>
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-auto text-slate-900 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
