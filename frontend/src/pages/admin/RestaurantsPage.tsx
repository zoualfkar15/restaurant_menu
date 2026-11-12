import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '@/services/api';

type Restaurant = { id: string; name: string; slug: string; isActive: boolean; _count?: { products: number; categories: number } };

export default function AdminRestaurantsPage() {
  const [list, setList] = useState<{ data: Restaurant[]; total: number } | null>(null);

  useEffect(() => {
    authFetch('/platform/restaurants?take=50').then((r) => r.ok ? r.json() : { data: [], total: 0 }).then(setList);
  }, []);

  if (!list) return <p className="font-semibold text-menu-ink-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-menu-ink">Restaurants</h1>
      <p className="mt-1 text-menu-ink-muted">Total: {list.total}</p>
      <div className="mt-6 overflow-x-auto rounded-[22px] bg-menu-surface-elevated shadow-menu-sm ring-1 ring-menu-border">
        <table className="w-full">
          <thead className="bg-menu-surface-muted"><tr><th className="p-3 text-start text-sm font-bold text-menu-ink">Name</th><th className="p-3 text-start text-sm font-bold text-menu-ink">Slug</th><th className="p-3 text-start text-sm font-bold text-menu-ink">Products</th><th className="p-3 text-start text-sm font-bold text-menu-ink">Status</th><th className="p-3 text-start text-sm font-bold text-menu-ink">Actions</th></tr></thead>
          <tbody>
            {list.data.map((r) => (
              <tr key={r.id} className="border-t border-menu-border">
                <td className="p-3 font-semibold text-menu-ink">{r.name}</td>
                <td className="p-3 text-menu-ink-muted">{r.slug}</td>
                <td className="p-3">{r._count?.products ?? '—'}</td>
                <td className="p-3">{r.isActive ? 'Active' : 'Suspended'}</td>
                <td className="p-3"><Link to={`/restaurant/${r.slug}/menu`} target="_blank" className="text-sm font-bold text-primary-700 hover:text-primary-800">Menu</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
