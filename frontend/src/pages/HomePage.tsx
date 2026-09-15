import { Link } from 'react-router-dom';
import { useLocale } from '@/lib/locale';
import { SiteLayout } from '@/components/SiteLayout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { HOME_FEATURES, type SiteFeature } from '@/lib/siteFeatures';
import { ArrowForwardIcon, CartIcon, ChefHatIcon, LayersIcon, PlateIcon, PlusIcon, QrIcon, SearchIcon, WhatsAppIcon } from '@/components/menu/icons';

const DEMO_MENU_PATH = '/restaurant/demo-cafe/menu';

const STEPS: SiteFeature[] = [
  { icon: LayersIcon, titleKey: 'home.steps.1.title', descKey: 'home.steps.1.desc' },
  { icon: QrIcon, titleKey: 'home.steps.2.title', descKey: 'home.steps.2.desc' },
  { icon: WhatsAppIcon, titleKey: 'home.steps.3.title', descKey: 'home.steps.3.desc' },
];

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900';
const primaryOnDark = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white px-6 text-base font-extrabold text-primary-800 shadow-lg shadow-black/10 transition-all hover:bg-primary-50 active:scale-[0.99] ${focusRing}`;
const ghostOnDark = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white/15 px-6 text-base font-bold text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/25 active:scale-[0.99] ${focusRing}`;
const iconBadge = 'flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700';

/** Decorative, wireframe-style preview of the customer menu built from the same design tokens. */
function MenuPreview() {
  const skeletonRow = (i: number) => (
    <div key={i} className="flex gap-2 rounded-xl bg-white p-2 shadow-menu-sm ring-1 ring-menu-border">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-menu-surface-muted to-primary-50 text-primary-300">
        <PlateIcon size={18} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className={`h-2 rounded-full bg-menu-ink/80 ${i === 1 ? 'w-14' : 'w-[72px]'}`} />
        <span className={`mt-1.5 h-1.5 rounded-full bg-menu-border-strong ${i === 2 ? 'w-16' : 'w-24'}`} />
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="h-2 w-8 rounded-full bg-menu-ink/80" />
          {i === 0 ? (
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-primary-50 px-1 ring-1 ring-primary-200">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-white">
                <PlusIcon size={9} />
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-menu-ink" />
              <span className="h-0.5 w-2 rounded-full bg-menu-ink-muted" />
            </span>
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white">
              <PlusIcon size={11} />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-[260px] rounded-[40px] bg-menu-ink p-2.5 shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:w-[280px]" aria-hidden>
      <div className="overflow-hidden rounded-[32px] bg-menu-surface">
        <div className="hero-fallback relative h-[124px] rounded-b-[22px] px-4 pt-3 text-white">
          <div className="flex items-center justify-between" dir="ltr">
            <span className="h-7 w-7 rounded-full bg-white/15 ring-1 ring-white/25" />
            <span className="relative h-7 w-7 rounded-full bg-white/15 ring-1 ring-white/25">
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-menu-accent ring-2 ring-white/80" />
            </span>
          </div>
          <div className="mt-2 flex flex-col items-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30">
              <ChefHatIcon size={20} />
            </span>
            <span className="mt-2 h-2.5 w-24 rounded-full bg-white/90" />
            <span className="mt-1.5 h-1.5 w-16 rounded-full bg-white/50" />
          </div>
        </div>

        <div className="relative z-10 mx-2 -mt-4 rounded-t-[18px] bg-white px-2.5 pb-3 pt-2.5 shadow-menu-md ring-1 ring-menu-border">
          <div className="flex h-8 items-center gap-1.5 rounded-xl bg-menu-surface-muted px-2.5 ring-1 ring-menu-border">
            <SearchIcon size={12} className="text-menu-ink-muted" />
            <span className="h-1.5 w-14 rounded-full bg-menu-border-strong" />
          </div>
          <div className="mt-2 flex gap-1.5">
            <span className="h-6 w-10 rounded-full bg-primary-600" />
            <span className="h-6 w-12 rounded-full bg-menu-surface-muted ring-1 ring-menu-border" />
            <span className="h-6 w-14 rounded-full bg-menu-surface-muted ring-1 ring-menu-border" />
            <span className="h-6 w-11 rounded-full bg-menu-surface-muted ring-1 ring-menu-border" />
          </div>
          <div className="mt-2.5 space-y-2">{[0, 1, 2].map(skeletonRow)}</div>
          <div className="mt-2.5 flex h-9 items-center justify-between rounded-xl bg-primary-900 px-2.5 text-white">
            <span className="flex items-center gap-1.5">
              <CartIcon size={13} />
              <span className="h-1.5 w-12 rounded-full bg-white/80" />
            </span>
            <span className="h-1.5 w-7 rounded-full bg-white/90" />
          </div>
          <div className="mt-1.5 flex h-8 items-center justify-center gap-1.5 rounded-xl bg-primary-600 text-white">
            <WhatsAppIcon size={13} />
            <span className="h-1.5 w-20 rounded-full bg-white/85" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t, locale } = useLocale();
  const isRtl = locale === 'ar';
  useDocumentTitle('MenuQR — Digital Menus for Restaurants');

  const ctaButtons = (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
      <Link to="/register" className={primaryOnDark}>
        {t('nav.startTrial')}
        <ArrowForwardIcon size={20} rtl={isRtl} />
      </Link>
      <Link to={DEMO_MENU_PATH} className={ghostOnDark}>
        <PlateIcon size={20} />
        {t('nav.viewDemo')}
      </Link>
    </div>
  );

  return (
    <SiteLayout>
      <>
        {/* Hero */}
        <section className="hero-fallback relative overflow-hidden rounded-b-[32px] text-white lg:rounded-b-[40px]">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-16 lg:px-8 lg:pb-32 lg:pt-20">
            <div className="text-center lg:text-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white/95 ring-1 ring-white/25 backdrop-blur-md sm:text-sm">
                <QrIcon size={16} />
                {t('home.hero.badge')}
              </span>
              <h1 className="text-balance mt-5 text-3xl font-extrabold leading-[1.2] drop-shadow-md sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                {t('home.hero.title')}
              </h1>
              <p className="text-balance mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0">{t('home.hero.subtitle')}</p>
              <div className="mt-8">{ctaButtons}</div>
            </div>

            <Link
              to={DEMO_MENU_PATH}
              className={`group mx-auto block w-fit rounded-[44px] transition-transform hover:-translate-y-1 ${focusRing}`}
              aria-label={t('home.demo.caption')}
            >
              <MenuPreview />
              <span className="mt-4 flex items-center justify-center gap-1.5 text-sm font-bold text-white/80 transition-colors group-hover:text-white">
                {t('home.demo.caption')}
                <ArrowForwardIcon size={16} rtl={isRtl} />
              </span>
            </Link>
          </div>
        </section>

        {/* How it works — overlaps the hero like the menu container */}
        <section className="relative z-10 mx-3 -mt-12 sm:mx-4 lg:mx-auto lg:max-w-6xl lg:px-8" aria-labelledby="steps-title">
          <div className="rounded-[28px] bg-menu-surface-elevated p-5 shadow-menu-lg ring-1 ring-menu-border/80 sm:p-8 lg:rounded-[32px] lg:p-10">
            <div className="text-center">
              <h2 id="steps-title" className="text-2xl font-extrabold sm:text-3xl">
                {t('home.steps.title')}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-menu-ink-muted">{t('home.oneLink')}</p>
            </div>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, titleKey, descKey }, i) => (
                <li key={titleKey} className="relative rounded-[22px] bg-menu-surface p-5 ring-1 ring-menu-border">
                  <div className="flex items-center gap-3">
                    <span className={iconBadge}>
                      <Icon size={22} />
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-extrabold text-white">{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold">{t(titleKey)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-menu-ink-muted">{t(descKey)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20" aria-labelledby="features-title">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-primary-700">{t('home.trusted')}</p>
            <h2 id="features-title" className="text-balance mt-2 text-2xl font-extrabold sm:text-3xl">
              {t('features.title')}
            </h2>
            <p className="mt-3 text-menu-ink-muted">{t('features.subtitle')}</p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
              <li key={titleKey}>
                <article className="menu-card-hover h-full rounded-[22px] bg-menu-surface-elevated p-5 shadow-menu-sm ring-1 ring-menu-border hover:shadow-menu-md hover:ring-menu-border-strong">
                  <span className={iconBadge}>
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold">{t(titleKey)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-menu-ink-muted">{t(descKey)}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20" aria-labelledby="cta-title">
          <div className="hero-fallback relative overflow-hidden rounded-[28px] px-6 py-10 text-center text-white shadow-menu-lg lg:rounded-[32px] lg:py-14">
            <h2 id="cta-title" className="text-balance text-2xl font-extrabold sm:text-3xl">
              {t('home.cta.title')}
            </h2>
            <p className="text-balance mx-auto mt-3 max-w-xl text-white/80">{t('home.cta.subtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/register" className={primaryOnDark}>
                {t('nav.startTrial')}
                <ArrowForwardIcon size={20} rtl={isRtl} />
              </Link>
              <Link to="/pricing" className={ghostOnDark}>
                {t('nav.pricing')}
              </Link>
            </div>
          </div>
        </section>
      </>
    </SiteLayout>
  );
}
