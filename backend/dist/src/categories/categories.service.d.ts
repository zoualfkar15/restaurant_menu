import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
export declare class CategoriesService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    private bustCatalog;
    create(restaurantId: string, dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        image: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    findAll(restaurantId: string): Promise<({
        products: {
            id: string;
            name: string;
            nameAr: string | null;
            slug: string;
            image: string | null;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            categoryId: string;
            description: string | null;
            descriptionAr: string | null;
            price: Prisma.Decimal;
            isAvailable: boolean;
            isPopular: boolean;
            ingredients: string | null;
            calories: number | null;
            allergens: string | null;
        }[];
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        image: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    })[]>;
    findOne(id: string, restaurantId: string): Promise<{
        products: {
            id: string;
            name: string;
            nameAr: string | null;
            slug: string;
            image: string | null;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            categoryId: string;
            description: string | null;
            descriptionAr: string | null;
            price: Prisma.Decimal;
            isAvailable: boolean;
            isPopular: boolean;
            ingredients: string | null;
            calories: number | null;
            allergens: string | null;
        }[];
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        image: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    update(id: string, restaurantId: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        image: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    remove(id: string, restaurantId: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        image: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    }>;
    reorder(restaurantId: string, order: {
        id: string;
        sortOrder: number;
    }[]): Promise<({
        products: {
            id: string;
            name: string;
            nameAr: string | null;
            slug: string;
            image: string | null;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            categoryId: string;
            description: string | null;
            descriptionAr: string | null;
            price: Prisma.Decimal;
            isAvailable: boolean;
            isPopular: boolean;
            ingredients: string | null;
            calories: number | null;
            allergens: string | null;
        }[];
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        image: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
    })[]>;
}
