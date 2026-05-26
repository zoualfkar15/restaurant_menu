-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'TRY');

-- AlterTable Restaurant: add name_ar, description_ar, currency, default_locale, locales_enabled
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "name_ar" TEXT;
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "description_ar" TEXT;
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "currency" "Currency" NOT NULL DEFAULT 'USD';
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "default_locale" TEXT NOT NULL DEFAULT 'ar';
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "locales_enabled" JSONB;

-- AlterTable Category: add name_ar
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "name_ar" TEXT;

-- AlterTable Product: add name_ar, description_ar
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "name_ar" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description_ar" TEXT;
