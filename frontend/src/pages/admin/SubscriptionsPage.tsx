import { useEffect, useState } from 'react';
import { authFetch } from '@/services/api';

type Sub = { id: string; plan: string; status: string; isYearly: boolean; startDate: string; endDate: string; restaurant?: { name: string; slug: string } };

export default function AdminSubscriptionsPage() {
  const [list, setList] = useState<{ data: Sub[]; total: number } | null>(null);

  useEffect(() => {
    authFetch('/platform/subscriptions?take=50').then((r) => r.ok ? r.json() : { data: [], total: 0 }).then(setList);
  }, []);

  if (!list) return <p className="font-semibold text-menu-ink-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-menu-ink">Subscriptions</h1>
      <p className="mt-1 text-menu-ink-muted">Total: {list.total}</p>
      <div className="mt-6 overflow-x-auto rounded-[22px] bg-menu-surface-elevated shadow-menu-sm ring-1 ring-menu-border">
        <table className="w-full">
          <thead className="bg-menu-surface-muted"><tr><th className="p-3 text-start text-sm font-bold text-menu-ink">Restaurant</th><th className="p-3 text-start text-sm font-bold text-menu-ink">Plan</th><th className="p-3 text-start text-sm font-bold text-menu-ink">Status</th><th className="p-3 text-start text-sm font-bold text-menu-ink">Billing</th><th className="p-3 text-start text-sm font-bold text-menu-ink">End date</th></tr></thead>
          <tbody>
            {list.data.map((s) => (
              <tr key={s.id} className="border-t border-menu-border">
                <td className="p-3 font-semibold text-menu-ink">{s.restaurant?.name ?? '—'}</td>
                <td className="p-3">{s.plan}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3">{s.isYearly ? 'Yearly' : 'Monthly'}</td>
                <td className="p-3 text-menu-ink-muted">{s.endDate ? new Date(s.endDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
