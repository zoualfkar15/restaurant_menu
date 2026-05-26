'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/locale';

export default function RegisterPage() {
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.message || t('auth.registerFailed'));
      return;
    }
    if (data.accessToken) {
      typeof window !== 'undefined' && localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    }
    router.push('/dashboard');
  }

  const inputClass = "w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
        <Link href="/" className="block text-center text-xl font-bold text-slate-900 dark:text-white mb-8 hover:opacity-90">
          MenuQR
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('auth.createAccount')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">{t('auth.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
              minLength={8}
            />
          </div>
          <button type="submit" className="w-full bg-brand-500 text-white py-2.5 rounded-lg font-medium hover:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            {t('auth.signUp')}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          {t('auth.hasAccount')} <Link href="/login" className="text-brand-500 dark:text-brand-400 font-medium hover:underline">{t('auth.logIn')}</Link>
        </p>
      </div>
    </div>
  );
}
