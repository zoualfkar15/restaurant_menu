'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LocaleProvider, useLocale } from '@/lib/locale';

const API = process.env.NEXT_PUBLIC_API_URL || '';

type Product = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  description: string | null;
  descriptionAr?: string | null;
  price: string | number;
  image: string | null;
  isPopular: boolean;
};

type Category = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  image?: string | null;
  products: Product[];
};

type Restaurant = {
  slug: string;
  name: string;
  nameAr?: string | null;
  defaultLocale?: string | null;
  localesEnabled?: string[] | null;
  currency?: string | null;
  categories: Category[];
};

function MenuContent({ restaurant }: { restaurant: Restaurant }) {
  const { locale, setLocale, enabledLocales, formatPrice, localize, t } = useLocale();
  const categories = restaurant.categories || [];
  const [activeSection, setActiveSection] = useState<string>(categories[0]?.slug ?? '');
  const scrollingToRef = useRef<string | null>(null);

  // Scroll-spy: update active category on scroll (works when scrolling down and back up)
  const HEADER_OFFSET = 140; // px from top of viewport – section “at top” is the one containing this line

  useEffect(() => {
    if (categories.length === 0) return;

    const updateActive = () => {
      if (scrollingToRef.current) {
        const slug = scrollingToRef.current;
        setActiveSection(slug);
        const targetEl = document.getElementById(slug);
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          if (rect.top <= HEADER_OFFSET && rect.bottom >= HEADER_OFFSET) {
            scrollingToRef.current = null;
          }
        }
        return;
      }
      const triggerY = HEADER_OFFSET;
      const triggerBandTop = triggerY - 40;
      const triggerBandBottom = triggerY + 40;
      let bestSlug = categories[0]?.slug ?? '';
      let bestScore = -Infinity;
      for (let i = 0; i < categories.length; i++) {
        const el = document.getElementById(categories[i].slug);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const containsTrigger = rect.top <= triggerY && rect.bottom >= triggerY;
        const overlapsBand = rect.top <= triggerBandBottom && rect.bottom >= triggerBandTop;
        if (containsTrigger) {
          bestSlug = categories[i].slug;
          break;
        }
        if (overlapsBand) {
          const overlap = Math.min(rect.bottom, triggerBandBottom) - Math.max(rect.top, triggerBandTop);
          if (overlap > bestScore) {
            bestScore = overlap;
            bestSlug = categories[i].slug;
          }
        } else if (rect.bottom < triggerY) {
          bestSlug = categories[i].slug;
        }
      }
      setActiveSection(bestSlug);
    };

    updateActive(); // initial
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [categories]);

  const scrollToCategory = (slug: string) => {
    setActiveSection(slug);
    scrollingToRef.current = slug;
    const el = document.getElementById(slug);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      scrollingToRef.current = null;
    }, 2500);
  };

  const isRtl = locale === 'ar';

  return (
    <div
      className="min-h-screen pb-24 menu-bg text-menu-ink"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-menu-surface-elevated/98 backdrop-blur-xl border-b border-menu-border shadow-menu-sm">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <Link
              href={`/restaurant/${restaurant.slug}`}
              className="text-sm font-medium text-menu-ink-muted hover:text-menu-accent focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-menu-surface rounded-lg px-2 py-1.5 -ml-2 transition-colors duration-200"
            >
              <span aria-hidden>{isRtl ? '→' : '←'}</span>{' '}
              {localize(restaurant.name, restaurant.nameAr)}
            </Link>
            {enabledLocales.length > 1 && (
              <div className="flex gap-0.5 rounded-full bg-menu-surface-muted p-1 ring-1 ring-menu-border">
                {enabledLocales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLocale(l)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-menu-surface ${locale === l
                        ? 'bg-menu-surface-elevated text-menu-ink shadow-menu-sm ring-1 ring-menu-border'
                        : 'text-menu-ink-muted hover:text-menu-ink hover:bg-stone-200/70'
                      }`}
                  >
                    {l === 'ar' ? 'ع' : 'En'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-menu-ink mt-3 tracking-tight">
            {t('public.menu')}
          </h1>
          <div className="mt-3 h-px w-12 rounded-full bg-brand-500" aria-hidden />
        </div>
        {/* Category nav */}
        <nav
          className="flex gap-2 overflow-x-auto px-4 pt-3 pb-3 mt-3 no-scrollbar scroll-smooth"
          aria-label={t('public.categories')}
        >
          {categories.map((cat) => {
            const isActive = activeSection === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => scrollToCategory(cat.slug)}
                className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-menu-surface border-2 ${isActive
                    ? 'bg-brand-500 text-white border-brand-600 shadow-menu-glow'
                    : 'bg-menu-surface-muted text-menu-ink-secondary border-menu-border hover:bg-menu-border hover:text-menu-ink hover:border-menu-border-strong'
                  }`}
              >
                {localize(cat.name, cat.nameAr)}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {categories.map((cat) => (
          <section
            key={cat.id}
            id={cat.slug}
            className="scroll-mt-40 first:pt-0 pt-14 first:mt-0"
          >
            {/* Category header */}
            <div className="flex items-center gap-4 mb-7">
              {cat.image && (
                <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-menu-border to-menu-border-strong ring-2 ring-menu-surface-elevated shadow-menu-md relative">
                  <Image
                    src={cat.image.startsWith('http') ? cat.image : `${API}${cat.image}`}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-1 rounded-full bg-brand-500" aria-hidden />
                  <h2 className="text-xl font-bold text-menu-ink tracking-tight">
                    {localize(cat.name, cat.nameAr)}
                  </h2>
                </div>
                {cat.products.length > 0 && (
                  <p className="text-sm text-menu-ink-muted mt-2 ms-14 font-medium">
                    {cat.products.length} {t('public.items')}
                  </p>
                )}
              </div>
            </div>

            {/* Product list */}
            <ul className="space-y-5">
              {cat.products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/restaurant/${restaurant.slug}/product/${p.slug}`}
                    className="flex gap-5 p-5 rounded-2xl bg-menu-surface-elevated border border-menu-border shadow-menu-sm hover:shadow-menu-lg hover:border-menu-border-strong menu-card-hover focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-menu-surface group"
                  >
                    <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-menu-surface-muted ring-1 ring-menu-border group-hover:ring-brand-200 transition-all duration-300">
                      {p.image ? (
                        <Image
                          src={p.image.startsWith('http') ? p.image : `${API}${p.image}`}
                          alt={localize(p.name, p.nameAr)}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-menu-surface-muted to-brand-50/40">
                          <span className="text-5xl opacity-50 select-none" aria-hidden>🍽</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-center">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-menu-ink text-base leading-snug">
                          {localize(p.name, p.nameAr)}
                        </span>
                        {p.isPopular && (
                          <span className="text-xs font-semibold uppercase tracking-wide bg-brand-500/12 text-brand-700 px-2.5 py-1 rounded-full border border-brand-300/40">
                            {t('public.popular')}
                          </span>
                        )}
                      </div>
                      {(p.description || p.descriptionAr) && (
                        <p className="text-sm text-menu-ink-secondary mt-1.5 line-clamp-2 leading-relaxed">
                          {localize(p.description, p.descriptionAr)}
                        </p>
                      )}
                      <p className="mt-3">
                        <span className="text-menu-accent font-bold text-lg tabular-nums">
                          {formatPrice(Number(p.price))}
                        </span>
                      </p>
                    </div>
                    <span className="self-center flex items-center justify-center w-10 h-10 rounded-full bg-menu-surface-muted group-hover:bg-brand-500 group-hover:text-white text-menu-ink-muted group-hover:shadow-menu-sm transition-all duration-200 shrink-0 font-medium" aria-hidden>
                      {isRtl ? '←' : '→'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

export default function MenuClient({ restaurant }: { restaurant: Restaurant }) {
  const defaultLocale = (restaurant.defaultLocale === 'en' || restaurant.defaultLocale === 'ar' ? restaurant.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales = Array.isArray(restaurant.localesEnabled) && restaurant.localesEnabled.length > 0
    ? (restaurant.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
    : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = restaurant.currency === 'TRY' ? 'TRY' : restaurant.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <MenuContent restaurant={restaurant} />
    </LocaleProvider>
  );
}
