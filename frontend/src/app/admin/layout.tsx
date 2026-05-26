'use client';

import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-slate-900 text-white shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link href="/admin" className="font-bold">MenuQR Admin</Link>
        </div>
        <nav className="p-2 space-y-1 flex-1">
          <Link href="/admin" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">Overview</Link>
          <Link href="/admin/restaurants" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">Restaurants</Link>
          <Link href="/admin/subscriptions" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">Subscriptions</Link>
        </nav>
        <div className="p-2 border-t border-slate-700">
          <Link href="/dashboard" className="block px-3 py-2 text-sm text-slate-400 hover:text-white">→ Restaurant dashboard</Link>
          <button
            type="button"
            onClick={() => { typeof window !== 'undefined' && (localStorage.removeItem('accessToken'), localStorage.removeItem('refreshToken'), (window.location.href = '/login')); }}
            className="block w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
