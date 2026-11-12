import { IsString, IsOptional, IsObject, IsNumber, Min, Max, IsIn, IsArray, Matches, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsOptional()
  @IsIn(['USD', 'TRY', 'SYP'])
  currency?: 'USD' | 'TRY' | 'SYP';

  @IsOptional()
  @IsIn(['en', 'ar'])
  defaultLocale?: string;

  @IsOptional()
  @IsArray()
  @IsIn(['en', 'ar'], { each: true })
  localesEnabled?: string[];

  @IsOptional()
  @ValidateIf((_, value) => value != null)
  @IsString()
  logo?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value != null)
  @IsString()
  coverImage?: string | null;

  /** Hex like #087f5b. Empty string clears to the default MenuQR green. */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? null : value))
  @ValidateIf((_, value) => value != null)
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  primaryColor?: string | null;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  addressAr?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsObject()
  openingHours?: Record<string, string>;

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}
