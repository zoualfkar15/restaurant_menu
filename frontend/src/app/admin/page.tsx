'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authFetch } from '@/lib/api';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{
    totalRestaurants?: number;
    totalUsers?: number;
    totalMenuViews?: number;
    totalQrScans?: number;
  } | null>(null);

  useEffect(() => {
    authFetch('/platform/analytics/overview')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => window.location.href = '/login');
  }, []);

  if (!stats) return <div className="p-4">Loading...</div>;

  const cards = [
    { label: 'Restaurants', value: stats.totalRestaurants ?? 0, href: '/admin/restaurants' },
    { label: 'Users', value: stats.totalUsers ?? 0 },
    { label: 'Menu views', value: stats.totalMenuViews ?? 0 },
    { label: 'QR scans', value: stats.totalQrScans ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Platform overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{c.value}</p>
            {c.href && <Link href={c.href} className="text-sm text-brand-500 mt-2 inline-block hover:underline">View →</Link>}
          </div>
        ))}
      </div>
    </div>
  );
}
