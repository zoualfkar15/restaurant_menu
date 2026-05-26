import { JwtPayload } from '../auth/auth.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private categories;
    constructor(categories: CategoriesService);
    list(user: JwtPayload): Promise<({
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
            price: import("@prisma/client/runtime/library").Decimal;
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
    create(user: JwtPayload, dto: CreateCategoryDto): Promise<{
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
    one(user: JwtPayload, id: string): Promise<{
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
            price: import("@prisma/client/runtime/library").Decimal;
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
    update(user: JwtPayload, id: string, dto: UpdateCategoryDto): Promise<{
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
    remove(user: JwtPayload, id: string): Promise<{
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
    reorder(user: JwtPayload, body: {
        order: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<({
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
            price: import("@prisma/client/runtime/library").Decimal;
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
