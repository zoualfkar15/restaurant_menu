import { memo } from 'react';
import { Link } from 'react-router-dom';
import AppImage from '@/components/AppImage';
import { useLocale } from '@/lib/locale';
import { getRestaurantWhatsApp } from '@/utils/whatsapp';
import type { MenuRestaurant } from '@/types/menu';
import Sheet from './Sheet';
import { ChefHatIcon, GlobeIcon, InfoIcon, MapPinIcon, PhoneIcon, PlateIcon, WhatsAppIcon } from './icons';

type InfoSheetProps = {
  open: boolean;
  onClose: () => void;
  restaurant: Pick<
    MenuRestaurant,
    'slug' | 'name' | 'nameAr' | 'description' | 'descriptionAr' | 'logo' | 'phone' | 'whatsapp' | 'address' | 'addressAr' | 'latitude' | 'longitude'
  >;
  /** Which public page is showing the sheet — the first row links to the other one. */
  currentPage?: 'menu' | 'about';
};

const rowClass =
  'flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-semibold text-menu-ink transition-colors hover:bg-menu-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500';
const rowIcon = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700';

/** Opened from the hamburger button: restaurant details, contact links and language. */
function InfoSheet({ open, onClose, restaurant, currentPage = 'menu' }: InfoSheetProps) {
  const { t, localize, locale, setLocale, enabledLocales } = useLocale();
  const name = localize(restaurant.name, restaurant.nameAr);
  const description = localize(restaurant.description, restaurant.descriptionAr);
  const address = localize(restaurant.address, restaurant.addressAr);
  const whatsapp = getRestaurantWhatsApp({ whatsapp: restaurant.whatsapp });
  const lat = restaurant.latitude != null ? Number(restaurant.latitude) : NaN;
  const lng = restaurant.longitude != null ? Number(restaurant.longitude) : NaN;
  const hasGeo = !Number.isNaN(lat) && !Number.isNaN(lng);
  const mapsHref = hasGeo
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null;

  return (
    <Sheet open={open} onClose={onClose} title={t('public.restaurantInfo')} variant="bottom" labelledBy="info-sheet-title">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-menu-border">
          {restaurant.logo ? <AppImage src={restaurant.logo} alt="" className="h-full w-full object-cover" width={56} height={56} /> : <ChefHatIcon size={28} />}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-extrabold text-menu-ink"><bdi>{name}</bdi></p>
          {description && (
            <p className="text-sm leading-relaxed text-menu-ink-muted line-clamp-3">
              <bdi>{description}</bdi>
            </p>
          )}
        </div>
      </div>

      <nav className="mt-4 -mx-1 space-y-0.5" aria-label={t('public.restaurantInfo')}>
        {currentPage === 'about' ? (
          <Link to={`/restaurant/${restaurant.slug}/menu`} className={rowClass} onClick={onClose}>
            <span className={rowIcon}><PlateIcon size={20} /></span>
            {t('public.viewMenu')}
          </Link>
        ) : (
          <Link to={`/restaurant/${restaurant.slug}`} className={rowClass} onClick={onClose}>
            <span className={rowIcon}><InfoIcon size={20} /></span>
            {t('public.aboutRestaurant')}
          </Link>
        )}
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone.replace(/\s+/g, '')}`} className={rowClass}>
            <span className={rowIcon}><PhoneIcon size={20} /></span>
            <span className="flex flex-col">
              <span>{t('public.call')}</span>
              <span className="text-xs font-medium text-menu-ink-muted" dir="ltr">{restaurant.phone}</span>
            </span>
          </a>
        )}
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={rowClass}>
            <span className={rowIcon}><WhatsAppIcon size={20} /></span>
            {t('public.whatsapp')}
          </a>
        )}
        {mapsHref && (
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={rowClass}>
            <span className={rowIcon}><MapPinIcon size={20} /></span>
            <span className="flex min-w-0 flex-col">
              <span>{t('public.location')}</span>
              {address && <span className="truncate text-xs font-medium text-menu-ink-muted">{address}</span>}
            </span>
          </a>
        )}
      </nav>

      {enabledLocales.length > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-menu-surface-muted px-3 py-3">
          <span className="flex items-center gap-3 text-[15px] font-semibold text-menu-ink">
            <span className={rowIcon}><GlobeIcon size={20} /></span>
            {t('public.language')}
          </span>
          <div className="flex gap-0.5 rounded-full bg-white p-1 ring-1 ring-menu-border" role="group" aria-label={t('public.language')}>
            {enabledLocales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  locale === l ? 'bg-primary-600 text-white shadow-sm' : 'text-menu-ink-muted hover:text-menu-ink'
                }`}
              >
                {l === 'ar' ? 'العربية' : 'English'}
              </button>
            ))}
          </div>
        </div>
      )}
    </Sheet>
  );
}

export default memo(InfoSheet);
