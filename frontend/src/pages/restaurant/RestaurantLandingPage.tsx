import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRestaurant } from '@/services/api';
import { LocaleProvider, useLocale } from '@/lib/locale';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCart } from '@/hooks/useCart';
import { AboutPageSkeleton } from '@/components/Skeleton';
import RestaurantHero from '@/components/menu/RestaurantHero';
import CartBar from '@/components/menu/CartBar';
import CartDrawer from '@/components/menu/CartDrawer';
import CartToast from '@/components/menu/CartToast';
import InfoSheet from '@/components/menu/InfoSheet';
import { getRestaurantWhatsApp } from '@/utils/whatsapp';
import {
  ArrowForwardIcon,
  ClockIcon,
  ExternalLinkIcon,
  FacebookIcon,
  InfoIcon,
  InstagramIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  PlateIcon,
  WhatsAppIcon,
} from '@/components/menu/icons';
import type { MenuRestaurant } from '@/types/menu';

/** `GET /api/restaurants/:slug` — the menu restaurant shape plus landing-page extras. */
type RestaurantDetails = Omit<MenuRestaurant, 'categories'> & {
  openingHours?: Record<string, string> | null;
  socialLinks?: Record<string, string> | null;
};

const OPENING_DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type Day = (typeof OPENING_DAYS_ORDER)[number];
const DAY_LABEL_KEY: Record<Day, string> = {
  monday: 'restaurant.dayMonday',
  tuesday: 'restaurant.dayTuesday',
  wednesday: 'restaurant.dayWednesday',
  thursday: 'restaurant.dayThursday',
  friday: 'restaurant.dayFriday',
  saturday: 'restaurant.daySaturday',
  sunday: 'restaurant.daySunday',
};
/** `Date#getDay()` → opening-hours key. */
const JS_DAY_KEYS: Day[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

type IconComponent = ComponentType<{ size?: number; className?: string }>;
const SOCIAL_ICONS: Record<string, IconComponent> = { facebook: FacebookIcon, instagram: InstagramIcon };
const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  twitter: 'X (Twitter)',
  x: 'X',
  youtube: 'YouTube',
  snapchat: 'Snapchat',
  telegram: 'Telegram',
  website: 'Website',
};

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';
const iconBadge = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700';
// Stacked icon-over-label tiles on phones; horizontal pills next to the CTA from `md` up.
const quickAction = `flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-menu-surface px-2 py-3 text-xs font-bold text-menu-ink ring-1 ring-menu-border transition-colors hover:bg-primary-50 hover:text-primary-800 hover:ring-primary-200 active:scale-[0.98] md:h-16 md:flex-row md:gap-2 md:px-4 md:py-0 md:text-sm ${focusRing}`;
const quickActionIcon = 'flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-700 ring-1 ring-menu-border md:h-9 md:w-9';
const contactRow = `flex items-center gap-3 rounded-2xl px-2 py-2.5 text-[15px] font-semibold text-menu-ink transition-colors hover:bg-menu-surface ${focusRing}`;

function InfoCard({ id, icon, title, children, className = '' }: { id: string; icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`rounded-[22px] bg-menu-surface-elevated p-4 shadow-menu-sm ring-1 ring-menu-border sm:p-5 ${className}`}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className={iconBadge}>{icon}</span>
        <h2 id={`${id}-title`} className="text-base font-extrabold text-menu-ink sm:text-lg">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function AboutContent({ restaurant: r }: { restaurant: RestaurantDetails }) {
  const { t, localize, locale } = useLocale();
  const { openCart, closeCart, totalItems } = useCart(r.slug);
  const navigate = useNavigate();
  const [infoOpen, setInfoOpen] = useState(false);
  const isRtl = locale === 'ar';
  const menuPath = `/restaurant/${r.slug}/menu`;

  const name = localize(r.name, r.nameAr);
  const description = localize(r.description, r.descriptionAr);
  const address = localize(r.address, r.addressAr);
  const whatsapp = getRestaurantWhatsApp({ whatsapp: r.whatsapp });
  const phoneHref = r.phone ? `tel:${r.phone.replace(/\s+/g, '')}` : null;

  const lat = r.latitude != null ? Number(r.latitude) : NaN;
  const lng = r.longitude != null ? Number(r.longitude) : NaN;
  const hasGeo = !Number.isNaN(lat) && !Number.isNaN(lng);
  const mapsHref = hasGeo
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null;
  const embedSrc = hasGeo
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
    : null;

  const hours = r.openingHours ?? {};
  const openingDays = OPENING_DAYS_ORDER.filter((day) => hours[day]);
  const today = JS_DAY_KEYS[new Date().getDay()];
  const social = Object.entries(r.socialLinks ?? {}).filter(([, url]) => typeof url === 'string' && url.trim() !== '');

  const hasQuickActions = Boolean(phoneHref || whatsapp || mapsHref);
  // The hero already shows the tagline (clamped to two lines); only repeat it in full when it is long.
  const showAbout = Boolean(description && description.length > 100);
  const hasBottomBar = totalItems > 0;

  useDocumentTitle(`${t('public.aboutRestaurant')} | ${name}`);
  const openInfo = useCallback(() => setInfoOpen(true), []);
  const closeInfo = useCallback(() => setInfoOpen(false), []);
  // Empty-cart "browse menu": close the (global) drawer first so the menu page doesn't open with it showing.
  const browseMenu = useCallback(() => {
    closeCart();
    navigate(menuPath);
  }, [closeCart, navigate, menuPath]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`menu-bg font-menu min-h-screen overflow-x-clip text-menu-ink antialiased page-enter ${hasBottomBar ? 'pb-44 lg:pb-12' : 'pb-10 lg:pb-12'}`}
    >
      <RestaurantHero restaurant={r} onOpenInfo={openInfo} onOpenCart={openCart} showCartOnDesktop />

      <div className="relative z-10 mx-3 -mt-7 sm:mx-4 lg:mx-auto lg:-mt-10 lg:max-w-[1100px] lg:px-8">
        <main className="rounded-[28px] bg-menu-surface-elevated px-4 pb-6 pt-5 shadow-menu-lg ring-1 ring-menu-border/80 sm:px-6 lg:rounded-[32px] lg:px-8 lg:pb-10 lg:pt-8">
          {/* Primary action + quick contact actions */}
          <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
            <Link
              to={menuPath}
              className={`group flex h-16 items-center gap-3 rounded-2xl bg-primary-600 px-4 text-white shadow-primary-glow transition-all hover:bg-primary-700 active:scale-[0.99] md:min-w-0 md:flex-1 ${focusRing}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <PlateIcon size={22} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col text-start">
                <span className="text-base font-extrabold leading-tight">{t('public.viewMenu')}</span>
                {whatsapp && <span className="truncate text-xs font-medium text-white/80">{t('public.viewMenuHint')}</span>}
              </span>
              <ArrowForwardIcon size={22} rtl={isRtl} className="shrink-0 opacity-80 transition-opacity group-hover:opacity-100" />
            </Link>

            {hasQuickActions && (
              <div className="grid auto-cols-fr grid-flow-col gap-2 md:flex md:shrink-0">
                {phoneHref && (
                  <a href={phoneHref} className={quickAction}>
                    <span className={quickActionIcon}>
                      <PhoneIcon size={18} />
                    </span>
                    {t('public.call')}
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={quickAction}>
                    <span className={quickActionIcon}>
                      <WhatsAppIcon size={18} />
                    </span>
                    {t('public.whatsapp')}
                  </a>
                )}
                {mapsHref && (
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={quickAction}>
                    <span className={quickActionIcon}>
                      <MapPinIcon size={18} />
                    </span>
                    {t('public.map')}
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:mt-6">
            {showAbout && (
              <InfoCard id="about" icon={<InfoIcon size={20} />} title={t('public.aboutRestaurant')} className="md:col-span-2">
                <p className="text-[15px] leading-relaxed text-menu-ink-secondary">
                  <bdi>{description}</bdi>
                </p>
              </InfoCard>
            )}

            {openingDays.length > 0 && (
              <InfoCard id="hours" icon={<ClockIcon size={20} />} title={t('public.openingHours')}>
                <ul className="-mx-1 space-y-0.5">
                  {openingDays.map((day) => {
                    const isToday = day === today;
                    return (
                      <li
                        key={day}
                        className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm ${
                          isToday ? 'bg-primary-50 font-bold text-primary-900' : 'text-menu-ink-secondary'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {t(DAY_LABEL_KEY[day])}
                          {isToday && (
                            <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-extrabold text-white">{t('public.today')}</span>
                          )}
                        </span>
                        <span className={`tabular-nums ${isToday ? '' : 'font-semibold text-menu-ink'}`} dir="ltr">
                          {hours[day]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </InfoCard>
            )}

            {(embedSrc || address) && (
              <InfoCard id="location" icon={<MapPinIcon size={20} />} title={t('public.location')}>
                {embedSrc && (
                  <div className="overflow-hidden rounded-2xl bg-menu-surface-muted ring-1 ring-menu-border">
                    <iframe
                      title={t('public.location')}
                      src={embedSrc}
                      className="block h-48 w-full border-0 sm:h-56"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                )}
                {address && (
                  <p className={`text-[15px] font-semibold leading-relaxed text-menu-ink ${embedSrc ? 'mt-3' : ''}`}>
                    <bdi>{address}</bdi>
                  </p>
                )}
                {mapsHref && (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-50 px-4 text-sm font-bold text-primary-700 ring-1 ring-primary-200 transition-colors hover:bg-primary-100 ${focusRing}`}
                  >
                    <ExternalLinkIcon size={16} />
                    {t('public.openInMaps')}
                  </a>
                )}
              </InfoCard>
            )}

            {(phoneHref || whatsapp) && (
              <InfoCard id="contact" icon={<PhoneIcon size={20} />} title={t('public.contactUs')}>
                <div className="-mx-1 space-y-0.5">
                  {phoneHref && r.phone && (
                    <a href={phoneHref} className={contactRow}>
                      <span className={iconBadge}>
                        <PhoneIcon size={18} />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-xs font-semibold text-menu-ink-muted">{t('public.phone')}</span>
                        <span className="truncate tabular-nums" dir="ltr">
                          {r.phone}
                        </span>
                      </span>
                    </a>
                  )}
                  {whatsapp && (
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={contactRow}>
                      <span className={iconBadge}>
                        <WhatsAppIcon size={18} />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-xs font-semibold text-menu-ink-muted">{t('public.whatsapp')}</span>
                        <span className="truncate tabular-nums" dir="ltr">
                          {`+${whatsapp}`}
                        </span>
                      </span>
                    </a>
                  )}
                </div>
              </InfoCard>
            )}

            {social.length > 0 && (
              <InfoCard id="social" icon={<LinkIcon size={20} />} title={t('public.followUs')}>
                <div className="flex flex-wrap gap-2">
                  {social.map(([network, url]) => {
                    const key = network.toLowerCase();
                    const Icon = SOCIAL_ICONS[key] ?? LinkIcon;
                    const label = SOCIAL_LABELS[key] ?? network.charAt(0).toUpperCase() + network.slice(1);
                    return (
                      <a
                        key={network}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex h-11 items-center gap-2 rounded-full bg-menu-surface px-4 text-sm font-bold text-menu-ink ring-1 ring-menu-border transition-colors hover:bg-primary-50 hover:text-primary-800 hover:ring-primary-200 ${focusRing}`}
                      >
                        <Icon size={18} className="text-primary-700" />
                        {label}
                      </a>
                    );
                  })}
                </div>
              </InfoCard>
            )}
          </div>
        </main>
      </div>

      <CartBar restaurant={r} />
      <CartDrawer restaurant={r} onBrowse={browseMenu} />
      <CartToast hasBottomBar={hasBottomBar} />
      <InfoSheet open={infoOpen} onClose={closeInfo} restaurant={r} currentPage="about" />
    </div>
  );
}

export default function RestaurantLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    getRestaurant(slug)
      .then((data) => {
        if (!cancelled) setRestaurant(data as RestaurantDetails | null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <AboutPageSkeleton />;
  if (!restaurant) {
    return (
      <div className="menu-bg font-menu flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-menu-ink-muted">
          <span className="block text-lg font-bold text-menu-ink">المطعم غير موجود</span>
          <span className="block text-sm">Restaurant not found</span>
        </p>
      </div>
    );
  }

  const defaultLocale = (restaurant.defaultLocale === 'en' || restaurant.defaultLocale === 'ar' ? restaurant.defaultLocale : 'ar') as 'en' | 'ar';
  const enabledLocales =
    Array.isArray(restaurant.localesEnabled) && restaurant.localesEnabled.length > 0
      ? (restaurant.localesEnabled.filter((l) => l === 'en' || l === 'ar') as ('en' | 'ar')[])
      : (['ar', 'en'] as ('en' | 'ar')[]);
  const currency = restaurant.currency === 'TRY' ? 'TRY' : restaurant.currency === 'SYP' ? 'SYP' : 'USD';

  return (
    <LocaleProvider defaultLocale={defaultLocale} enabledLocales={enabledLocales} currency={currency}>
      <AboutContent restaurant={restaurant} />
    </LocaleProvider>
  );
}
