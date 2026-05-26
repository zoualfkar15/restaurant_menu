'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { authFetch } from '@/lib/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const OPENING_HOURS_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const OPENING_HOURS_DAY_KEYS: Record<(typeof OPENING_HOURS_DAYS)[number], string> = {
  monday: 'restaurant.dayMonday',
  tuesday: 'restaurant.dayTuesday',
  wednesday: 'restaurant.dayWednesday',
  thursday: 'restaurant.dayThursday',
  friday: 'restaurant.dayFriday',
  saturday: 'restaurant.daySaturday',
  sunday: 'restaurant.daySunday',
};

type Restaurant = {
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  currency?: 'USD' | 'TRY' | 'SYP';
  defaultLocale?: 'en' | 'ar';
  localesEnabled?: string[];
  phone?: string;
  address?: string;
  addressAr?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  whatsapp?: string;
  email?: string;
  openingHours?: Record<string, string>;
  socialLinks?: Record<string, string>;
};

const RESTAURANT_FORM_KEYS = [
  'name', 'nameAr', 'description', 'descriptionAr', 'currency', 'defaultLocale', 'localesEnabled',
  'phone', 'address', 'addressAr', 'latitude', 'longitude', 'whatsapp', 'email', 'openingHours', 'socialLinks',
] as const;

async function searchLocation(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  if (!query.trim()) return null;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=1`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const first = data?.[0];
  if (!first?.lat || !first?.lon) return null;
  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    displayName: first.display_name || '',
  };
}

export default function DashboardRestaurantPage() {
  const { t } = useLocale();
  const [form, setForm] = useState<Restaurant>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authFetch('/admin/restaurant')
      .then((r) => r.ok ? r.json() : {})
      .then((data) => {
        const hours = data.openingHours && typeof data.openingHours === 'object' ? data.openingHours : {};
        setForm({
          ...data,
          latitude: data.latitude != null ? Number(data.latitude) : undefined,
          longitude: data.longitude != null ? Number(data.longitude) : undefined,
          localesEnabled: Array.isArray(data.localesEnabled) ? data.localesEnabled : ['en', 'ar'],
          defaultLocale: data.defaultLocale === 'en' || data.defaultLocale === 'ar' ? data.defaultLocale : 'ar',
          currency: (data.currency === 'TRY' ? 'TRY' : data.currency === 'SYP' ? 'SYP' : 'USD'),
          addressAr: data.addressAr ?? '',
          openingHours: hours,
        });
      });
  }, []);

  useEffect(() => {
    if (message) {
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [message]);

  const handleLocationSearch = useCallback(async () => {
    setLocationError('');
    if (!locationQuery.trim()) {
      setLocationError(t('restaurant.enterAddress'));
      return;
    }
    setLocationSearching(true);
    try {
      const result = await searchLocation(locationQuery);
      if (result) {
        setForm((f) => ({ ...f, latitude: result.lat, longitude: result.lng, address: result.displayName || f.address }));
        setLocationError('');
      } else {
        setLocationError(t('restaurant.locationNotFound'));
      }
    } catch {
      setLocationError(t('restaurant.searchFailed'));
    } finally {
      setLocationSearching(false);
    }
  }, [locationQuery, t]);

  const handleMapPick = useCallback((lat: number, lng: number) => {
    setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
  }, []);

  const handleCurrentLocation = useCallback(() => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError(t('restaurant.locationUnavailable'));
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setLocationError('');
        setGettingLocation(false);
      },
      () => {
        setLocationError(t('restaurant.locationDenied'));
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setMessageType('');
    const payload: Record<string, unknown> = {};
    for (const key of RESTAURANT_FORM_KEYS) {
      const v = form[key];
      if (v === undefined) continue;
      if (key === 'latitude' || key === 'longitude') {
        const n = v === '' || v == null ? undefined : Number(v);
        if (n !== undefined && !Number.isNaN(n)) payload[key] = n;
      } else if (key === 'openingHours' || key === 'socialLinks') {
        if (v && typeof v === 'object') payload[key] = v;
      } else {
        payload[key] = v;
      }
    }
    try {
      const res = await authFetch('/admin/restaurant', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage(t('restaurant.saved'));
        setMessageType('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || t('restaurant.failedSave'));
        setMessageType('error');
      }
    } catch {
      setMessage(t('restaurant.failedSave'));
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500';
  const labelClass = 'block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1';

  return (
    <div ref={formTopRef} className="max-w-xl p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('restaurant.landingTitle')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <p className={`text-sm px-3 py-2 rounded-lg ${messageType === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200'}`}>
            {message}
          </p>
        )}
        <div>
          <label className={labelClass}>{t('restaurant.nameEn')}</label>
          <input
            value={form.name ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.nameAr')}</label>
          <input
            value={form.nameAr ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
            className={inputClass}
            dir="rtl"
          />
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.descriptionEn')}</label>
          <textarea
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className={inputClass}
            rows={3}
          />
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.descriptionAr')}</label>
          <textarea
            value={form.descriptionAr ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
            className={inputClass}
            rows={3}
            dir="rtl"
          />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4 space-y-4 bg-slate-50 dark:bg-slate-700/50">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">{t('restaurant.languageCurrency')}</h2>
          <div>
            <label className={labelClass}>{t('restaurant.currency')}</label>
            <select
              value={form.currency ?? 'USD'}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value as 'USD' | 'TRY' | 'SYP' }))}
              className={inputClass}
            >
              <option value="USD">USD ($)</option>
              <option value="TRY">TRY (₺)</option>
              <option value="SYP">SYP (£S)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('restaurant.defaultLanguage')}</label>
            <select
              value={form.defaultLocale ?? 'ar'}
              onChange={(e) => setForm((f) => ({ ...f, defaultLocale: e.target.value as 'en' | 'ar' }))}
              className={inputClass}
            >
              <option value="ar">{t('restaurant.arabic')}</option>
              <option value="en">{t('restaurant.english')}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('restaurant.languagesEnabled')}</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t('restaurant.languagesHint')}</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={(form.localesEnabled ?? ['en', 'ar']).includes('en')}
                  onChange={(e) => {
                    const enabled = form.localesEnabled ?? ['en', 'ar'];
                    setForm((f) => ({
                      ...f,
                      localesEnabled: e.target.checked ? [...new Set([...enabled, 'en'])] : enabled.filter((l) => l !== 'en'),
                    }));
                  }}
                  className="rounded"
                />
                {t('restaurant.english')}
              </label>
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={(form.localesEnabled ?? ['en', 'ar']).includes('ar')}
                  onChange={(e) => {
                    const enabled = form.localesEnabled ?? ['en', 'ar'];
                    setForm((f) => ({
                      ...f,
                      localesEnabled: e.target.checked ? [...new Set([...enabled, 'ar'])] : enabled.filter((l) => l !== 'ar'),
                    }));
                  }}
                  className="rounded"
                />
                {t('restaurant.arabic')}
              </label>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4 space-y-3 bg-slate-50 dark:bg-slate-700/50">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">{t('restaurant.openingHoursSection')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('restaurant.openingHoursHint')}</p>
          {OPENING_HOURS_DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <label className={`${labelClass} w-28 shrink-0 mb-0`}>{t(OPENING_HOURS_DAY_KEYS[day])}</label>
              <input
                value={(form.openingHours && form.openingHours[day]) ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    openingHours: { ...(f.openingHours || {}), [day]: e.target.value },
                  }))
                }
                className={inputClass}
                placeholder="9:00 - 22:00"
              />
            </div>
          ))}
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.phone')}</label>
          <input
            value={form.phone ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.addressEn')}</label>
          <input
            value={form.address ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.addressAr')}</label>
          <input
            value={form.addressAr ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, addressAr: e.target.value }))}
            className={inputClass}
            dir="rtl"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('restaurant.latitude')}</label>
            <input
              type="number"
              step="any"
              min={-90}
              max={90}
              value={form.latitude ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value === '' ? undefined : e.target.value }))}
              className={inputClass}
              placeholder="e.g. 52.52"
            />
          </div>
          <div>
            <label className={labelClass}>{t('restaurant.longitude')}</label>
            <input
              type="number"
              step="any"
              min={-180}
              max={180}
              value={form.longitude ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value === '' ? undefined : e.target.value }))}
              className={inputClass}
              placeholder="e.g. 13.405"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.searchLocation')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => { setLocationQuery(e.target.value); setLocationError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleLocationSearch())}
              className={inputClass}
              placeholder={t('restaurant.searchPlaceholder')}
            />
            <button
              type="button"
              onClick={handleLocationSearch}
              disabled={locationSearching}
              className="shrink-0 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              {locationSearching ? '...' : t('restaurant.searchButton')}
            </button>
          </div>
          {locationError && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{locationError}</p>}
          <div className="mt-2">
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={gettingLocation}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              <span aria-hidden>📍</span>
              {gettingLocation ? '...' : t('restaurant.currentLocation')}
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t('restaurant.mapClickHint')}</p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden shadow-sm">
            <div className="w-full" style={{ minHeight: 280 }}>
              <MapPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onChange={handleMapPick}
                height={280}
                hintText={t('restaurant.mapClickToChange')}
                loadingText={t('restaurant.loadingMap')}
              />
            </div>
            {form.latitude != null && form.longitude != null && !Number.isNaN(Number(form.latitude)) && !Number.isNaN(Number(form.longitude)) && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${Number(form.latitude)},${Number(form.longitude)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 px-4 text-center text-sm text-brand-500 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 border-t border-slate-200 dark:border-slate-600"
              >
                {t('public.openInMaps')}
              </a>
            )}
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.whatsapp')}</label>
          <input
            value={form.whatsapp ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            className={inputClass}
            placeholder="+49..."
          />
        </div>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-600 disabled:opacity-50 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
          {saving && <Spinner className="w-4 h-4" />}
          {saving ? t('menu.saving') : t('menu.save')}
        </button>
      </form>
    </div>
  );
}
