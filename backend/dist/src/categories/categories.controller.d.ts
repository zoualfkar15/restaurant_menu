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
            price: import("@prisma/client/runtime/library").Decimal;
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
    create(user: JwtPayload, dto: CreateCategoryDto): Promise<{
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
    one(user: JwtPayload, id: string): Promise<{
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
            price: import("@prisma/client/runtime/library").Decimal;
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
    update(user: JwtPayload, id: string, dto: UpdateCategoryDto): Promise<{
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
    remove(user: JwtPayload, id: string): Promise<{
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
    reorder(user: JwtPayload, body: {
        order: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<({
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
            price: import("@prisma/client/runtime/library").Decimal;
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
