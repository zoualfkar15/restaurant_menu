export declare class UpdateRestaurantDto {
    name?: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    currency?: 'USD' | 'TRY' | 'SYP';
    defaultLocale?: string;
    localesEnabled?: string[];
    logo?: string;
    coverImage?: string;
    phone?: string;
    address?: string;
    addressAr?: string;
    latitude?: number;
    longitude?: number;
    whatsapp?: string;
    email?: string;
    openingHours?: Record<string, string>;
    socialLinks?: Record<string, string>;
}
