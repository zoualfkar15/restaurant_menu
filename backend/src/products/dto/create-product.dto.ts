import { IsString, MinLength, IsOptional, IsNumber, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPopular?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsString()
  ingredients?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  calories?: number;

  @IsOptional()
  @IsString()
  allergens?: string;

  @IsOptional()
  @IsString()
  nameAr?: string;
}
