import { PrismaService } from '../prisma/prisma.service';
import { CatalogCacheService } from '../catalog-cache/catalog-cache.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
export declare class CategoriesService {
    private prisma;
    private catalogCache;
    constructor(prisma: PrismaService, catalogCache: CatalogCacheService);
    create(restaurantId: string, dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        nameAr: string | null;
        sortOrder: number;
        image: string | null;
    }>;
    findAll(restaurantId: string): Promise<({
        products: {
            id: string;
            name: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            nameAr: string | null;
            description: string | null;
            descriptionAr: string | null;
            sortOrder: number;
            image: string | null;
            isPopular: boolean;
            isAvailable: boolean;
            price: Prisma.Decimal;
            ingredients: string | null;
            calories: number | null;
            allergens: string | null;
            categoryId: string;
        }[];
    } & {
        id: string;
        name: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        nameAr: string | null;
        sortOrder: number;
        image: string | null;
    })[]>;
    findOne(id: string, restaurantId: string): Promise<{
        products: {
            id: string;
            name: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            nameAr: string | null;
            description: string | null;
            descriptionAr: string | null;
            sortOrder: number;
            image: string | null;
            isPopular: boolean;
            isAvailable: boolean;
            price: Prisma.Decimal;
            ingredients: string | null;
            calories: number | null;
            allergens: string | null;
            categoryId: string;
        }[];
    } & {
        id: string;
        name: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        nameAr: string | null;
        sortOrder: number;
        image: string | null;
    }>;
    update(id: string, restaurantId: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        nameAr: string | null;
        sortOrder: number;
        image: string | null;
    }>;
    remove(id: string, restaurantId: string): Promise<{
        id: string;
        name: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        nameAr: string | null;
        sortOrder: number;
        image: string | null;
    }>;
    reorder(restaurantId: string, order: {
        id: string;
        sortOrder: number;
    }[]): Promise<({
        products: {
            id: string;
            name: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            nameAr: string | null;
            description: string | null;
            descriptionAr: string | null;
            sortOrder: number;
            image: string | null;
            isPopular: boolean;
            isAvailable: boolean;
            price: Prisma.Decimal;
            ingredients: string | null;
            calories: number | null;
            allergens: string | null;
            categoryId: string;
        }[];
    } & {
        id: string;
        name: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        nameAr: string | null;
        sortOrder: number;
        image: string | null;
    })[]>;
}
