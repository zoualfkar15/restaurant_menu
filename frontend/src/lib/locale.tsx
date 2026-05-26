import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { translate, type Locale as LocaleType } from '@/lib/translations';

export type Locale = 'en' | 'ar';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: 'ltr' | 'rtl';
  enabledLocales: Locale[];
  setEnabledLocales: (locales: Locale[]) => void;
  currency: 'USD' | 'TRY' | 'SYP';
  setCurrency: (c: 'USD' | 'TRY' | 'SYP') => void;
  formatPrice: (price: number) => string;
  localize: <T>(value: T | null | undefined, valueAr: T | null | undefined) => T;
  t: (key: string, params?: Record<string, string>) => string;
};

const defaultEnabled: Locale[] = ['ar', 'en'];
const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolveInitialLocale(defaultLocale: Locale, initialEnabled: Locale[]): Locale {
  const allowed = initialEnabled.length > 0 ? initialEnabled : defaultEnabled;
  const stored = window.localStorage.getItem('menuqr_locale') as Locale | null;
  if (stored === 'en' || stored === 'ar') {
    if (allowed.includes(stored)) return stored;
  }
  return allowed.includes(defaultLocale) ? defaultLocale : allowed[0];
}

export function LocaleProvider({
  children,
  defaultLocale = 'ar',
  enabledLocales: initialEnabled = defaultEnabled,
  currency: initialCurrency = 'USD',
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
  enabledLocales?: Locale[];
  currency?: 'USD' | 'TRY' | 'SYP';
}) {
  const allowed = initialEnabled.length > 0 ? initialEnabled : defaultEnabled;
  const [locale, setLocaleState] = useState<Locale>(() =>
    resolveInitialLocale(defaultLocale, initialEnabled),
  );
  const [enabledLocales, setEnabledLocales] = useState<Locale[]>(allowed);
  const [currency, setCurrencyState] = useState<'USD' | 'TRY' | 'SYP'>(initialCurrency);
  const localeRef = useRef(locale);
  localeRef.current = locale;

  const allowedKey = allowed.join(',');
  useEffect(() => {
    const list = allowedKey ? (allowedKey.split(',') as Locale[]) : [...defaultEnabled];
    setEnabledLocales(list);
    if (!list.includes(localeRef.current)) {
      const next = list.includes(defaultLocale) ? defaultLocale : list[0];
      setLocaleState(next);
      window.localStorage.setItem('menuqr_locale', next);
    }
  }, [allowedKey, defaultLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem('menuqr_locale', l);
  }, []);

  const formatPrice = useCallback(
    (price: number) => {
      if (currency === 'TRY') return `₺${price.toFixed(2)}`;
      if (currency === 'SYP') return locale === 'ar' ? `ل.س ${price.toFixed(2)}` : `£S ${price.toFixed(2)}`;
      return `$${price.toFixed(2)}`;
    },
    [currency, locale],
  );

  const localize = useCallback(
    <T,>(value: T | null | undefined, valueAr: T | null | undefined): T => {
      if (locale === 'ar' && valueAr != null && valueAr !== '') return valueAr as T;
      return (value ?? valueAr ?? '') as T;
    },
    [locale],
  );

  const t = useCallback(
    (key: string, params?: Record<string, string>) => translate(locale as LocaleType, key, params),
    [locale],
  );

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        dir,
        enabledLocales,
        setEnabledLocales,
        currency,
        setCurrency: setCurrencyState,
        formatPrice,
        localize,
        t,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export function useLocaleOptional() {
  return useContext(LocaleContext);
}
