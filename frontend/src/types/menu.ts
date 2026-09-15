/**
 * Public menu data model — mirrors the shape returned by
 * `GET /api/restaurants/:slug/menu` (restaurant → categories → products).
 */
export type MenuProduct = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  description?: string | null;
  descriptionAr?: string | null;
  price: string | number;
  image: string | null;
  isPopular?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  image?: string | null;
  products: MenuProduct[];
};

export type MenuRestaurant = {
  slug: string;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  addressAr?: string | null;
  latitude?: unknown;
  longitude?: unknown;
  defaultLocale?: string | null;
  localesEnabled?: string[] | null;
  currency?: string | null;
  categories: MenuCategory[];
};
