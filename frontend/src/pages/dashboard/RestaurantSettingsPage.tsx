import { useEffect, useState, useCallback, useRef } from 'react';
import { authFetch } from '@/services/api';
import { useLocale } from '@/lib/locale';
import Spinner from '@/components/Spinner';
import MapPicker from '@/components/MapPicker';

const OPENING_HOURS_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const OPENING_HOURS_DAY_KEYS: Record<(typeof OPENING_HOURS_DAYS)[number], string> = {
  monday: 'restaurant.dayMonday', tuesday: 'restaurant.dayTuesday', wednesday: 'restaurant.dayWednesday',
  thursday: 'restaurant.dayThursday', friday: 'restaurant.dayFriday', saturday: 'restaurant.daySaturday', sunday: 'restaurant.daySunday',
};

type Restaurant = {
  name?: string; nameAr?: string; description?: string; descriptionAr?: string;
  currency?: 'USD' | 'TRY' | 'SYP'; defaultLocale?: 'en' | 'ar'; localesEnabled?: string[];
  phone?: string; address?: string; addressAr?: string; latitude?: number | string | null; longitude?: number | string | null;
  whatsapp?: string; email?: string; openingHours?: Record<string, string>; socialLinks?: Record<string, string>;
};

const RESTAURANT_FORM_KEYS = ['name', 'nameAr', 'description', 'descriptionAr', 'currency', 'defaultLocale', 'localesEnabled', 'phone', 'address', 'addressAr', 'latitude', 'longitude', 'whatsapp', 'email', 'openingHours', 'socialLinks'] as const;

async function searchLocation(query: string) {
  if (!query.trim()) return null;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=1`, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  const data = await res.json();
  const first = data?.[0];
  if (!first?.lat || !first?.lon) return null;
  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon), displayName: first.display_name || '' };
}

export default function RestaurantSettingsPage() {
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
    authFetch('/admin/restaurant').then((r) => r.ok ? r.json() : null).then((data: Restaurant | null) => {
      if (!data) return;
      const hours = data.openingHours && typeof data.openingHours === 'object' ? data.openingHours : {};
      setForm({
        ...data,
        latitude: data.latitude != null ? Number(data.latitude) : undefined,
        longitude: data.longitude != null ? Number(data.longitude) : undefined,
        localesEnabled: Array.isArray(data.localesEnabled) ? data.localesEnabled : ['en', 'ar'],
        defaultLocale: data.defaultLocale === 'en' || data.defaultLocale === 'ar' ? data.defaultLocale : 'ar',
        currency: data.currency === 'TRY' ? 'TRY' : data.currency === 'SYP' ? 'SYP' : 'USD',
        addressAr: data.addressAr ?? '',
        openingHours: hours,
      });
    });
  }, []);

  useEffect(() => { if (message) formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [message]);

  const handleLocationSearch = useCallback(async () => {
    setLocationError('');
    if (!locationQuery.trim()) { setLocationError(t('restaurant.enterAddress')); return; }
    setLocationSearching(true);
    try {
      const result = await searchLocation(locationQuery);
      if (result) setForm((f) => ({ ...f, latitude: result.lat, longitude: result.lng, address: result.displayName || f.address }));
      else setLocationError(t('restaurant.locationNotFound'));
    } catch { setLocationError(t('restaurant.searchFailed')); }
    finally { setLocationSearching(false); }
  }, [locationQuery, t]);

  const handleMapPick = useCallback((lat: number, lng: number) => setForm((f) => ({ ...f, latitude: lat, longitude: lng })), []);

  const handleCurrentLocation = useCallback(() => {
    setLocationError('');
    if (!navigator.geolocation) { setLocationError(t('restaurant.locationUnavailable')); return; }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })); setGettingLocation(false); },
      () => { setLocationError(t('restaurant.locationDenied')); setGettingLocation(false); },
      { enableHighAccuracy: true, timeout: 10000 },
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
      } else payload[key] = v;
    }
    try {
      const res = await authFetch('/admin/restaurant', { method: 'PUT', body: JSON.stringify(payload) });
      if (res.ok) { setMessage(t('restaurant.saved')); setMessageType('success'); }
      else { setMessage((await res.json().catch(() => ({}))).message || t('restaurant.failedSave')); setMessageType('error'); }
    } catch { setMessage(t('restaurant.failedSave')); setMessageType('error'); }
    finally { setSaving(false); }
  }

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-brand-500';
  const labelClass = 'block text-sm font-medium text-slate-800 mb-1';

  return (
    <div ref={formTopRef} className="max-w-xl p-6 rounded-2xl bg-white shadow border border-slate-200">
      <h1 className="text-2xl font-bold mb-6">{t('restaurant.landingTitle')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <p className={`text-sm px-3 py-2 rounded-lg ${messageType === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>{message}</p>}
        <div><label className={labelClass}>{t('restaurant.nameEn')}</label><input value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} /></div>
        <div><label className={labelClass}>{t('restaurant.nameAr')}</label><input value={form.nameAr ?? ''} onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))} className={inputClass} dir="rtl" /></div>
        <div><label className={labelClass}>{t('restaurant.descriptionEn')}</label><textarea value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} rows={3} /></div>
        <div><label className={labelClass}>{t('restaurant.descriptionAr')}</label><textarea value={form.descriptionAr ?? ''} onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))} className={inputClass} rows={3} dir="rtl" /></div>
        <div className="rounded-xl border border-slate-200 p-4 space-y-4 bg-slate-50">
          <h2 className="font-semibold">{t('restaurant.languageCurrency')}</h2>
          <div><label className={labelClass}>{t('restaurant.currency')}</label><select value={form.currency ?? 'USD'} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value as 'USD' | 'TRY' | 'SYP' }))} className={inputClass}><option value="USD">USD ($)</option><option value="TRY">TRY (₺)</option><option value="SYP">SYP (£S)</option></select></div>
          <div><label className={labelClass}>{t('restaurant.defaultLanguage')}</label><select value={form.defaultLocale ?? 'ar'} onChange={(e) => setForm((f) => ({ ...f, defaultLocale: e.target.value as 'en' | 'ar' }))} className={inputClass}><option value="ar">{t('restaurant.arabic')}</option><option value="en">{t('restaurant.english')}</option></select></div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50">
          <h2 className="font-semibold">{t('restaurant.openingHoursSection')}</h2>
          {OPENING_HOURS_DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <label className={`${labelClass} w-28 shrink-0 mb-0`}>{t(OPENING_HOURS_DAY_KEYS[day])}</label>
              <input value={(form.openingHours && form.openingHours[day]) ?? ''} onChange={(e) => setForm((f) => ({ ...f, openingHours: { ...(f.openingHours || {}), [day]: e.target.value } }))} className={inputClass} placeholder="9:00 - 22:00" />
            </div>
          ))}
        </div>
        <div><label className={labelClass}>{t('restaurant.phone')}</label><input value={form.phone ?? ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} /></div>
        <div><label className={labelClass}>{t('restaurant.addressEn')}</label><input value={form.address ?? ''} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={inputClass} /></div>
        <div><label className={labelClass}>{t('restaurant.addressAr')}</label><input value={form.addressAr ?? ''} onChange={(e) => setForm((f) => ({ ...f, addressAr: e.target.value }))} className={inputClass} dir="rtl" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>{t('restaurant.latitude')}</label><input type="number" step="any" value={form.latitude ?? ''} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value === '' ? undefined : e.target.value }))} className={inputClass} /></div>
          <div><label className={labelClass}>{t('restaurant.longitude')}</label><input type="number" step="any" value={form.longitude ?? ''} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value === '' ? undefined : e.target.value }))} className={inputClass} /></div>
        </div>
        <div>
          <label className={labelClass}>{t('restaurant.searchLocation')}</label>
          <div className="flex gap-2">
            <input type="text" value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); setLocationError(''); }} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleLocationSearch())} className={inputClass} placeholder={t('restaurant.searchPlaceholder')} />
            <button type="button" onClick={handleLocationSearch} disabled={locationSearching} className="shrink-0 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-medium disabled:opacity-50">{locationSearching ? '...' : t('restaurant.searchButton')}</button>
          </div>
          {locationError && <p className="text-sm text-red-600 mt-1">{locationError}</p>}
          <button type="button" onClick={handleCurrentLocation} disabled={gettingLocation} className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 font-medium disabled:opacity-50">📍 {gettingLocation ? '...' : t('restaurant.currentLocation')}</button>
        </div>
        <MapPicker
          latitude={form.latitude != null ? Number(form.latitude) : null}
          longitude={form.longitude != null ? Number(form.longitude) : null}
          onChange={handleMapPick}
          height={280}
          hintText={t('restaurant.mapClickToChange')}
          loadingText={t('restaurant.loadingMap')}
        />
        <div><label className={labelClass}>{t('restaurant.whatsapp')}</label><input value={form.whatsapp ?? ''} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} className={inputClass} placeholder="+49..." /></div>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50">{saving && <Spinner />}{saving ? t('menu.saving') : t('menu.save')}</button>
      </form>
    </div>
  );
}
