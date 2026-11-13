import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BrandMark } from '@/components/SiteHeader';
import { useLocale } from '@/lib/locale';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${
    isActive ? 'bg-primary-50 text-primary-800' : 'text-menu-ink-secondary hover:bg-menu-surface-muted hover:text-menu-ink'
  }`;

export default function AdminLayout() {
  const { dir } = useLocale();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div dir={dir} className="menu-bg font-menu flex min-h-screen text-menu-ink antialiased">
      <aside className="flex w-56 shrink-0 flex-col border-e border-menu-border bg-menu-surface-elevated">
        <div className="border-b border-menu-border px-4 py-4">
          <BrandMark />
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-menu-ink-muted">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <NavLink to="/admin" end className={navClass}>
            Overview
          </NavLink>
          <NavLink to="/admin/restaurants" className={navClass}>
            Restaurants
          </NavLink>
          <NavLink to="/admin/subscriptions" className={navClass}>
            Subscriptions
          </NavLink>
          <NavLink to="/admin/contact" className={navClass}>
            Contact
          </NavLink>
        </nav>
        <div className="space-y-1 border-t border-menu-border p-3">
          <Link to="/dashboard" className="block rounded-xl px-3 py-2 text-sm font-semibold text-menu-ink-muted hover:bg-menu-surface-muted hover:text-menu-ink">
            → Restaurant dashboard
          </Link>
          <button
            type="button"
            onClick={logout}
            className="block w-full rounded-xl px-3 py-2 text-start text-sm font-semibold text-menu-ink-muted hover:bg-menu-surface-muted hover:text-menu-ink"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 page-enter lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
