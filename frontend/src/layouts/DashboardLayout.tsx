import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { BrandMark } from '@/components/SiteHeader';
import { CloseIcon, MenuIcon } from '@/components/menu/icons';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
    isActive ? 'bg-primary-50 text-primary-800' : 'text-menu-ink-secondary hover:bg-menu-surface-muted hover:text-menu-ink'
  }`;

export default function DashboardLayout() {
  const { t, locale, setLocale, dir } = useLocale();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const close = () => setSidebarOpen(false);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div dir={dir} className="menu-bg font-menu flex min-h-screen text-menu-ink antialiased">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-menu-ink/30 backdrop-blur-[2px] md:hidden" onClick={close} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-64 shrink-0 flex-col border-e border-menu-border bg-menu-surface-elevated shadow-menu-lg transition-transform duration-200 md:static md:translate-x-0 md:shadow-none ${
          sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full md:ltr:translate-x-0 md:rtl:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-menu-border px-4 py-4">
          <BrandMark />
          <button
            type="button"
            onClick={close}
            className="tap-target inline-flex items-center justify-center rounded-xl text-menu-ink-muted hover:bg-menu-surface-muted hover:text-menu-ink md:hidden"
            aria-label="Close"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-auto p-3">
          <NavLink to="/dashboard" end className={navClass} onClick={close}>
            {t('dashboard.overview')}
          </NavLink>
          <NavLink to="/dashboard/menu" className={navClass} onClick={close}>
            {t('dashboard.menu')}
          </NavLink>
          <NavLink to="/dashboard/restaurant" className={navClass} onClick={close}>
            {t('dashboard.landingPage')}
          </NavLink>
          <NavLink to="/dashboard/qr" className={navClass} onClick={close}>
            {t('dashboard.qrCode')}
          </NavLink>
        </nav>
        <div className="space-y-2 border-t border-menu-border p-3">
          <div className="flex items-center justify-between rounded-xl bg-menu-surface-muted px-3 py-2">
            <span className="text-sm font-semibold text-menu-ink">{t('dashboard.language')}</span>
            <div className="flex gap-0.5 rounded-full bg-white p-1 ring-1 ring-menu-border" role="group" aria-label={t('dashboard.language')}>
              {(['en', 'ar'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`min-w-[36px] rounded-full px-2 py-1 text-xs font-bold ${
                    locale === l ? 'bg-primary-600 text-white shadow-sm' : 'text-menu-ink-muted hover:text-menu-ink'
                  }`}
                >
                  {l === 'en' ? 'En' : 'ع'}
                </button>
              ))}
            </div>
          </div>
          <Link to="/" className="block rounded-xl px-3 py-2 text-sm font-semibold text-menu-ink-muted hover:bg-menu-surface-muted hover:text-menu-ink">
            {t('dashboard.backToSite')}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="block w-full rounded-xl px-3 py-2 text-start text-sm font-semibold text-menu-ink-muted hover:bg-menu-surface-muted hover:text-menu-ink"
          >
            {t('dashboard.logOut')}
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-menu-border bg-white/90 px-3 py-3 backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="tap-target inline-flex items-center justify-center rounded-xl text-menu-ink hover:bg-menu-surface-muted"
            aria-label="Open menu"
          >
            <MenuIcon size={22} />
          </button>
          <BrandMark className="text-base" />
        </div>
        <main className="flex-1 overflow-auto p-4 page-enter sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
