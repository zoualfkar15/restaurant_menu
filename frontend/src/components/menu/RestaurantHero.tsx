import { memo } from 'react';
import AppImage from '@/components/AppImage';
import { useLocale } from '@/lib/locale';
import { useCartCount } from '@/hooks/useCart';
import type { MenuRestaurant } from '@/types/menu';
import { CartIcon, ChefHatIcon, MenuIcon } from './icons';

type RestaurantHeroProps = {
  restaurant: Pick<MenuRestaurant, 'slug' | 'name' | 'nameAr' | 'description' | 'descriptionAr' | 'logo' | 'coverImage'>;
  onOpenInfo: () => void;
  onOpenCart: () => void;
  /** Keep the cart button on large screens too (pages without the desktop cart sidebar). */
  showCartOnDesktop?: boolean;
};

const iconBtn =
  'tap-target inline-flex items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

function RestaurantHero({ restaurant, onOpenInfo, onOpenCart, showCartOnDesktop = false }: RestaurantHeroProps) {
  const { t, localize, locale, setLocale, enabledLocales } = useLocale();
  const count = useCartCount(restaurant.slug);
  const name = localize(restaurant.name, restaurant.nameAr);
  const tagline = localize(restaurant.description, restaurant.descriptionAr);

  return (
    <header className="relative h-[250px] overflow-hidden rounded-b-[32px] text-white sm:h-[280px] lg:h-[320px] lg:rounded-b-[40px]">
      {restaurant.coverImage ? (
        <>
          <AppImage src={restaurant.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/75" />
        </>
      ) : (
        <div className="hero-fallback absolute inset-0" />
      )}

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col px-4 sm:px-6 lg:px-8">
        {/* Physical positions (menu left, cart right) to match the reference layout in both LTR and RTL. */}
        <div className="flex items-center justify-between pt-3 sm:pt-4" dir="ltr">
          <button type="button" onClick={onOpenInfo} className={iconBtn} aria-label={t('public.restaurantInfo')}>
            <MenuIcon size={22} />
          </button>

          <div className="flex items-center gap-2">
            {enabledLocales.length > 1 && (
              <div className="hidden items-center gap-0.5 rounded-full bg-white/15 p-1 ring-1 ring-white/25 backdrop-blur-md lg:flex" role="group" aria-label={t('public.language')}>
                {enabledLocales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLocale(l)}
                    aria-pressed={locale === l}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      locale === l ? 'bg-white text-menu-ink shadow-sm' : 'text-white/90 hover:bg-white/15'
                    }`}
                  >
                    {l === 'ar' ? 'ع' : 'En'}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={onOpenCart}
              className={`${iconBtn} relative ${showCartOnDesktop ? '' : 'lg:hidden'}`}
              aria-label={`${t('cart.viewCart')}${count > 0 ? ` (${count})` : ''}`}
            >
              <CartIcon size={22} />
              {count > 0 && (
                <span
                  key={count}
                  className="animate-pop absolute -end-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-menu-accent px-1 text-[11px] font-extrabold text-white ring-2 ring-white/80"
                  aria-hidden
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center pb-10 text-center sm:pb-12">
          <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-md sm:h-[72px] sm:w-[72px]">
            {restaurant.logo ? (
              <AppImage src={restaurant.logo} alt="" className="h-full w-full object-cover" width={72} height={72} loading="eager" />
            ) : (
              <ChefHatIcon size={38} />
            )}
          </div>
          <h1 className="text-balance px-4 text-[26px] font-extrabold leading-tight drop-shadow-md sm:text-3xl lg:text-4xl">
            <bdi>{name}</bdi>
          </h1>
          {tagline && (
            <p className="text-balance mt-1.5 max-w-md px-6 text-sm text-white/85 drop-shadow sm:text-base line-clamp-2">
              <bdi>{tagline}</bdi>
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

export default memo(RestaurantHero);
