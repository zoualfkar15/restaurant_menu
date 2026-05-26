import { IsString, IsOptional, IsObject, IsNumber, Min, Max, IsIn, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

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
