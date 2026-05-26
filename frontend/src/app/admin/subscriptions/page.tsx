'use client';

import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/api';

type Sub = {
  id: string;
  plan: string;
  status: string;
  isYearly: boolean;
  startDate: string;
  endDate: string;
  restaurant?: { name: string; slug: string };
};

export default function AdminSubscriptionsPage() {
  const [list, setList] = useState<{ data: Sub[]; total: number } | null>(null);

  useEffect(() => {
    authFetch('/platform/subscriptions?take=50')
      .then((r) => r.ok ? r.json() : { data: [], total: 0 })
      .then(setList);
  }, []);

  if (!list) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
      <p className="text-slate-600 mt-1">Total: {list.total}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Restaurant</th>
              <th className="text-left p-3">Plan</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Billing</th>
              <th className="text-left p-3">End date</th>
            </tr>
          </thead>
          <tbody>
            {list.data.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{s.restaurant?.name ?? '—'}</td>
                <td className="p-3">{s.plan}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3">{s.isYearly ? 'Yearly' : 'Monthly'}</td>
                <td className="p-3 text-slate-600">{s.endDate ? new Date(s.endDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
