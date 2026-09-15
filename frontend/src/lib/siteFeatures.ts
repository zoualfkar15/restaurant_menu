import type { ComponentType } from 'react';
import { ChartIcon, ChefHatIcon, GlobeIcon, LayersIcon, QrIcon, RefreshIcon, SmartphoneIcon, WhatsAppIcon } from '@/components/menu/icons';

export type SiteFeature = {
  icon: ComponentType<{ size?: number; className?: string }>;
  titleKey: string;
  descKey: string;
};

/** Marketing feature list (translation keys), shared by the home and features pages. */
export const SITE_FEATURES: SiteFeature[] = [
  { icon: QrIcon, titleKey: 'features.qrMenu', descKey: 'features.qrMenuDesc' },
  { icon: WhatsAppIcon, titleKey: 'features.whatsapp', descKey: 'features.whatsappDesc' },
  { icon: ChefHatIcon, titleKey: 'features.landing', descKey: 'features.landingDesc' },
  { icon: LayersIcon, titleKey: 'features.categories', descKey: 'features.categoriesDesc' },
  { icon: RefreshIcon, titleKey: 'features.upToDate', descKey: 'features.upToDateDesc' },
  { icon: ChartIcon, titleKey: 'features.analytics', descKey: 'features.analyticsDesc' },
  { icon: SmartphoneIcon, titleKey: 'features.mobileFirst', descKey: 'features.mobileFirstDesc' },
  { icon: GlobeIcon, titleKey: 'features.multilingual', descKey: 'features.multilingualDesc' },
];

/** The highlights shown on the home page. */
export const HOME_FEATURES = SITE_FEATURES.slice(0, 6);
