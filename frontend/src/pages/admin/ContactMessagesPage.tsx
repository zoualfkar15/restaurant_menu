import { useEffect, useState } from 'react';
import { authFetch } from '@/services/api';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export default function AdminContactMessagesPage() {
  const [list, setList] = useState<{ data: ContactMessage[]; total: number } | null>(null);

  useEffect(() => {
    authFetch('/platform/contact-messages?take=100')
      .then((r) => (r.ok ? r.json() : { data: [], total: 0 }))
      .then(setList);
  }, []);

  if (!list) return <p className="font-semibold text-menu-ink-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-menu-ink">Contact messages</h1>
      <p className="mt-1 text-menu-ink-muted">Total: {list.total}</p>
      <div className="mt-6 overflow-x-auto rounded-[22px] bg-menu-surface-elevated shadow-menu-sm ring-1 ring-menu-border">
        <table className="w-full">
          <thead className="bg-menu-surface-muted">
            <tr>
              <th className="p-3 text-start text-sm font-bold text-menu-ink">Name</th>
              <th className="p-3 text-start text-sm font-bold text-menu-ink">Phone</th>
              <th className="p-3 text-start text-sm font-bold text-menu-ink">Email</th>
              <th className="p-3 text-start text-sm font-bold text-menu-ink">Message</th>
              <th className="p-3 text-start text-sm font-bold text-menu-ink">Sent</th>
            </tr>
          </thead>
          <tbody>
            {list.data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-menu-ink-muted">
                  No messages yet.
                </td>
              </tr>
            )}
            {list.data.map((row) => (
              <tr key={row.id} className="border-t border-menu-border align-top">
                <td className="p-3 font-semibold text-menu-ink">{row.name}</td>
                <td className="p-3 font-medium text-menu-ink" dir="ltr">
                  {row.phone}
                </td>
                <td className="p-3 text-menu-ink-muted">{row.email}</td>
                <td className="max-w-sm whitespace-pre-wrap p-3 text-sm text-menu-ink">{row.message}</td>
                <td className="whitespace-nowrap p-3 text-menu-ink-muted">
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
