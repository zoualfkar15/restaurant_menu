import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '@/services/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';
import { FormError, inputClass, labelClass, primaryButtonClass } from '@/components/SiteForm';

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
      <div className="max-w-md rounded-[28px] bg-menu-surface-elevated p-6 shadow-menu-lg ring-1 ring-menu-border/80 sm:p-8">
        <h1 className="text-2xl font-extrabold text-menu-ink">{t('dashboard.setupTitle')}</h1>
        <p className="mt-2 mb-6 text-menu-ink-muted">{t('dashboard.setupSubtitle')}</p>
        <form onSubmit={handleOnboarding} className="space-y-4">
          {onboardingSuccess && <p className="rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800 ring-1 ring-primary-100">{onboardingSuccess}</p>}
          <FormError>{onboardingError}</FormError>
          <div>
            <label htmlFor="onboarding-name" className={labelClass}>{t('dashboard.restaurantName')}</label>
            <input id="onboarding-name" value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} className={inputClass} required minLength={2} />
          </div>
          <button type="submit" disabled={onboardingSubmitting} className={primaryButtonClass}>
            {onboardingSubmitting && <Spinner className="h-4 w-4" />}
            {onboardingSubmitting ? t('dashboard.creating') : t('dashboard.createRestaurant')}
          </button>
        </form>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <FormError>{error}</FormError>
        <Link to="/login" className="mt-4 inline-block text-sm font-bold text-primary-700 hover:text-primary-800">{t('dashboard.goToLogin')}</Link>
      </div>
    );
  }
  if (!restaurant) return <p className="font-semibold text-menu-ink-muted">{t('dashboard.loading')}</p>;

  const cards = [
    { label: t('dashboard.menuItems'), value: stats?.menuItems ?? '—', href: '/dashboard/menu' },
    { label: t('dashboard.categories'), value: stats?.categories ?? '—', href: '/dashboard/menu' },
    { label: t('dashboard.menuViews'), value: stats?.menuViews ?? '—' },
    { label: t('dashboard.qrScans'), value: stats?.qrScans ?? '—', href: '/dashboard/qr' },
  ];

  return (
    <div>
      {onboardingSuccess && <p className="mb-4 rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800 ring-1 ring-primary-100">{onboardingSuccess}</p>}
      <h1 className="text-2xl font-extrabold text-menu-ink">{t('dashboard.title')}</h1>
      <p className="mt-1 text-menu-ink-muted">{restaurant.name}</p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-[22px] bg-menu-surface-elevated p-4 shadow-menu-sm ring-1 ring-menu-border sm:p-5">
            <p className="text-sm font-semibold text-menu-ink-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-menu-ink">{c.value}</p>
            {c.href && <Link to={c.href} className="mt-2 inline-block text-sm font-bold text-primary-700 hover:text-primary-800">{t('dashboard.view')}</Link>}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to={`/restaurant/${restaurant.slug}/menu`} target="_blank" className="text-sm font-bold text-primary-700 hover:text-primary-800">{t('dashboard.openMenu')}</Link>
        <Link to="/dashboard/menu" className={primaryButtonClass}>{t('dashboard.editMenu')}</Link>
      </div>
    </div>
  );
}
