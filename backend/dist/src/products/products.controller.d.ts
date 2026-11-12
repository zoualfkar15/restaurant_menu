import { JwtPayload } from '../auth/auth.service';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private products;
    constructor(products: ProductsService);
    list(user: JwtPayload, categoryId?: string): Promise<({
        category: {
            id: string;
            name: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            nameAr: string | null;
            sortOrder: number;
            image: string | null;
        };
    } & {
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
    })[]>;
    create(user: JwtPayload, dto: CreateProductDto): Promise<{
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
    }>;
    one(user: JwtPayload, id: string): Promise<{
        category: {
            id: string;
            name: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            nameAr: string | null;
            sortOrder: number;
            image: string | null;
        };
    } & {
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
    }>;
    update(user: JwtPayload, id: string, dto: UpdateProductDto): Promise<{
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
    }>;
    remove(user: JwtPayload, id: string): Promise<{
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
    }>;
    reorder(user: JwtPayload, body: {
        order: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<({
        category: {
            id: string;
            name: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            nameAr: string | null;
            sortOrder: number;
            image: string | null;
        };
    } & {
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
    })[]>;
}
