import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '@/services/api';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{ totalRestaurants?: number; totalUsers?: number; totalMenuViews?: number; totalQrScans?: number } | null>(null);

  useEffect(() => {
    authFetch('/platform/analytics/overview').then((r) => r.ok ? r.json() : null).then(setStats).catch(() => { window.location.href = '/login'; });
  }, []);

  if (!stats) return <p className="font-semibold text-menu-ink-muted">Loading...</p>;

  const cards = [
    { label: 'Restaurants', value: stats.totalRestaurants ?? 0, href: '/admin/restaurants' },
    { label: 'Users', value: stats.totalUsers ?? 0 },
    { label: 'Menu views', value: stats.totalMenuViews ?? 0 },
    { label: 'QR scans', value: stats.totalQrScans ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-menu-ink">Platform overview</h1>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-[22px] bg-menu-surface-elevated p-4 shadow-menu-sm ring-1 ring-menu-border sm:p-5">
            <p className="text-sm font-semibold text-menu-ink-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-menu-ink">{c.value}</p>
            {c.href && <Link to={c.href} className="mt-2 inline-block text-sm font-bold text-primary-700 hover:text-primary-800">View →</Link>}
          </div>
        ))}
      </div>
    </div>
  );
}
