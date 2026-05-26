import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '@/services/api';

type Restaurant = { id: string; name: string; slug: string; isActive: boolean; _count?: { products: number; categories: number } };

export default function AdminRestaurantsPage() {
  const [list, setList] = useState<{ data: Restaurant[]; total: number } | null>(null);

  useEffect(() => {
    authFetch('/platform/restaurants?take=50').then((r) => r.ok ? r.json() : { data: [], total: 0 }).then(setList);
  }, []);

  if (!list) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Restaurants</h1>
      <p className="text-slate-600 mt-1">Total: {list.total}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Slug</th><th className="text-left p-3">Products</th><th className="text-left p-3">Status</th><th className="text-left p-3">Actions</th></tr></thead>
          <tbody>
            {list.data.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-slate-600">{r.slug}</td>
                <td className="p-3">{r._count?.products ?? '—'}</td>
                <td className="p-3">{r.isActive ? 'Active' : 'Suspended'}</td>
                <td className="p-3"><Link to={`/restaurant/${r.slug}/menu`} target="_blank" className="text-brand-500 hover:underline text-sm">Menu</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
