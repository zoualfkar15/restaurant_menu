import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '@/services/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';

export default function DashboardPage() {
  const { t } = useLocale();
  const [stats, setStats] = useState<{ menuItems?: number; categories?: number; menuViews?: number; qrScans?: number } | null>(null);
  const [restaurant, setRestaurant] = useState<{ name?: string; slug?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [onboardingError, setOnboardingError] = useState('');
  const [onboardingSuccess, setOnboardingSuccess] = useState('');

  useEffect(() => {
    if (!onboardingSuccess) return;
    const id = setTimeout(() => setOnboardingSuccess(''), 5000);
    return () => clearTimeout(id);
  }, [onboardingSuccess]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sRes, rRes] = await Promise.all([authFetch('/admin/stats'), authFetch('/admin/restaurant')]);
        if (cancelled) return;
        if (rRes.status === 401) { window.location.href = '/login'; return; }
        if (rRes.status === 403) {
          const errData = await rRes.json().catch(() => ({}));
          if ((errData?.message || '').includes('restaurant')) { setNeedsOnboarding(true); return; }
        }
        if (!rRes.ok) { setError(t('dashboard.unableToLoad')); return; }
        setRestaurant(await rRes.json());
        if (sRes.ok) setStats(await sRes.json());
      } catch {
        if (!cancelled) setError(t('dashboard.unableToLoadShort'));
      }
    })();
    return () => { cancelled = true; };
  }, [t]);

  async function handleOnboarding(e: React.FormEvent) {
    e.preventDefault();
    setOnboardingError('');
    setOnboardingSuccess('');
    setOnboardingSubmitting(true);
    try {
      const res = await authFetch('/admin/onboarding', { method: 'POST', body: JSON.stringify({ name: onboardingName.trim() }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setOnboardingError(data.message || t('dashboard.failedCreateRestaurant')); return; }
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      }
      setRestaurant(data.restaurant || data);
      setNeedsOnboarding(false);
      setOnboardingName('');
      setOnboardingSuccess(t('dashboard.restaurantCreated'));
      const statsRes = await authFetch('/admin/stats');
      if (statsRes.ok) setStats(await statsRes.json());
    } catch {
      setOnboardingError(t('dashboard.failedCreateRestaurant'));
    } finally {
      setOnboardingSubmitting(false);
    }
  }

  if (needsOnboarding) {
    return (
      <div className="max-w-md text-slate-900">
        <h1 className="text-2xl font-bold mb-2">{t('dashboard.setupTitle')}</h1>
        <p className="text-slate-600 mb-6">{t('dashboard.setupSubtitle')}</p>
        <form onSubmit={handleOnboarding} className="space-y-4">
          {onboardingSuccess && <p className="text-sm px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800">{onboardingSuccess}</p>}
          {onboardingError && <p className="text-sm px-3 py-2 rounded-lg bg-red-100 text-red-700">{onboardingError}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.restaurantName')}</label>
            <input value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white" required minLength={2} />
          </div>
          <button type="submit" disabled={onboardingSubmitting} className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 disabled:opacity-50">
            {onboardingSubmitting && <Spinner className="w-4 h-4" />}
            {onboardingSubmitting ? t('dashboard.creating') : t('dashboard.createRestaurant')}
          </button>
        </form>
      </div>
    );
  }

  if (error) return <div className="p-4"><p className="text-red-600">{error}</p><Link to="/login" className="mt-4 inline-block text-brand-500 hover:underline">{t('dashboard.goToLogin')}</Link></div>;
  if (!restaurant) return <div className="p-4">{t('dashboard.loading')}</div>;

  const cards = [
    { label: t('dashboard.menuItems'), value: stats?.menuItems ?? '—', href: '/dashboard/menu' },
    { label: t('dashboard.categories'), value: stats?.categories ?? '—', href: '/dashboard/menu' },
    { label: t('dashboard.menuViews'), value: stats?.menuViews ?? '—' },
    { label: t('dashboard.qrScans'), value: stats?.qrScans ?? '—', href: '/dashboard/qr' },
  ];

  return (
    <div>
      {onboardingSuccess && <p className="mb-4 text-sm px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800">{onboardingSuccess}</p>}
      <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
      <p className="text-slate-600 mt-1">{restaurant.name}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
            {c.href && <Link to={c.href} className="text-sm text-brand-500 mt-2 inline-block hover:underline">{t('dashboard.view')}</Link>}
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <Link to={`/restaurant/${restaurant.slug}/menu`} target="_blank" className="text-brand-500 hover:underline">{t('dashboard.openMenu')}</Link>
        <Link to="/dashboard/menu" className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600">{t('dashboard.editMenu')}</Link>
      </div>
    </div>
  );
}
