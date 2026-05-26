'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LocaleProvider, useLocale } from '@/lib/locale';

const API = process.env.NEXT_PUBLIC_API_URL || '';

const OPENING_DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const dayToTranslationKey: Record<string, string> = {
  monday: 'restaurant.dayMonday',
  tuesday: 'restaurant.dayTuesday',
  wednesday: 'restaurant.dayWednesday',
  thursday: 'restaurant.dayThursday',
  friday: 'restaurant.dayFriday',
  saturday: 'restaurant.daySaturday',
  sunday: 'restaurant.daySunday',
};

type Restaurant = {
  slug: string;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  phone?: string | null;
  address?: string | null;
  addressAr?: string | null;
  latitude?: unknown;
  longitude?: unknown;
  whatsapp?: string | null;
  openingHours?: Record<string, string> | null;
  socialLinks?: Record<string, string> | null;
  defaultLocale?: string | null;
  localesEnabled?: string[] | null;
  currency?: string | null;
};

function RestaurantLandingContent({ restaurant: r }: { restaurant: Restaurant }) {
  const { t, localize, locale, setLocale, enabledLocales } = useLocale();
  const hours = (r.openingHours as Record<string, string>) || {};
  const social = (r.socialLinks as Record<string, string>) || {};
  const lat = r.latitude != null ? Number(r.latitude) : null;
  const lng = r.longitude != null ? Number(r.longitude) : null;
  const hasGeo = lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative">
        {enabledLocales.length > 1 && (
          <div className="absolute top-4 right-4 z-10 flex gap-0.5 rounded-full bg-white/20 backdrop-blur-sm p-1 ring-1 ring-white/30">
            {enabledLocales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 ${
                  locale === l ? 'bg-white text-slate-900 shadow-sm' : 'text-white/90 hover:text-white hover:bg-white/20'
                }`}
              >
                {l === 'ar' ? 'ع' : 'En'}
              </button>
            ))}
          </div>
        )}
        <div className="absolute inset-0 h-64 sm:h-80 bg-gradient-to-b from-slate-800 to-slate-900">
          {r.coverImage ? (
            <>
              <Image
                src={r.coverImage.startsWith('http') ? r.coverImage : `${API}${r.coverImage}`}
                alt=""
                fill
                className="object-cover opacity-70"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
          )}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-24 sm:pb-28 text-center">
          {r.logo && (
            <div className="inline-flex rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl mb-6 w-24 h-24 sm:w-28 sm:h-28 relative bg-white">
              <Image
                src={r.logo.startsWith('http') ? r.logo : `${API}${r.logo}`}
                alt=""
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">{localize(r.name, r.nameAr)}</h1>
          {(r.description || r.descriptionAr) && (
            <p className="mt-3 text-slate-200 text-lg max-w-xl mx-auto drop-shadow">{localize(r.description, r.descriptionAr)}</p>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6">
          <Link
            href={`/restaurant/${r.slug}/menu`}
            className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-center py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {t('public.viewMenu')}
          </Link>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {r.phone && (
              <a href={`tel:${r.phone}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                <span aria-hidden>📞</span> {t('public.call')}
              </a>
            )}
            {(r.address || hasGeo) && (
              <a
                href={hasGeo ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <span aria-hidden>📍</span> {t('public.map')}
              </a>
            )}
            {r.whatsapp && (
              <a
                href={`https://wa.me/${r.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <span aria-hidden>💬</span> WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {(r.address || r.addressAr) && (
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('public.address')}</h2>
              <p className="text-slate-800 font-medium">{localize(r.address, r.addressAr)}</p>
            </div>
          )}
          {r.phone && (
            <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('public.phone')}</h2>
              <a href={`tel:${r.phone}`} className="text-brand-600 font-medium hover:underline">{r.phone}</a>
            </div>
          )}
        </div>

        {Object.keys(hours).length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm mb-6">
            <h2 className="text-slate-900 font-semibold mb-3">{t('public.openingHours')}</h2>
            <ul className="space-y-2">
              {OPENING_DAYS_ORDER.filter((day) => hours[day]).map((day) => {
                const time = hours[day];
                const labelKey = dayToTranslationKey[day];
                const dayLabel = labelKey ? t(labelKey) : day;
                return (
                  <li key={day} className="flex justify-between text-slate-600">
                    <span>{dayLabel}</span>
                    <span className="font-medium text-slate-800">{time}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {hasGeo && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm mb-6">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-slate-900 font-semibold">{t('public.location')}</h2>
            </div>
            <div className="h-56">
              <iframe
                title={`${localize(r.name, r.nameAr)} on map`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(r.longitude) - 0.01}%2C${Number(r.latitude) - 0.01}%2C${Number(r.longitude) + 0.01}%2C${Number(r.latitude) + 0.01}&layer=mapnik&marker=${r.latitude}%2C${r.longitude}`}
                allowFullScreen
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${Number(r.latitude)},${Number(r.longitude)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-4 text-center text-sm text-brand-500 font-medium hover:bg-slate-50"
            >
              {t('public.openInMaps')}
            </a>
          </div>
        )}

        {Object.keys(social).length > 0 && (
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm mb-8">
            <h2 className="text-slate-900 font-semibold mb-3">{t('public.followUs')}</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(social).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize text-brand-500 font-medium hover:underline"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RestaurantLandingClient({ restaurant }: { restaurant: Restaurant }) {
  const defaultLocale = (restaurant.defaultLocale === 'en' || restaurant.defaultLocale === 'ar' ? restaurant.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales = Array.isArray(restaurant.localesEnabled) && restaurant.localesEnabled.length > 0
    ? (restaurant.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
    : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = restaurant.currency === 'TRY' ? 'TRY' : restaurant.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <RestaurantLandingContent restaurant={restaurant} />
    </LocaleProvider>
  );
}
