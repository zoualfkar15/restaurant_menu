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
            nameAr: string | null;
            slug: string;
            image: string | null;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        };
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        description: string | null;
        descriptionAr: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isAvailable: boolean;
        isPopular: boolean;
        sortOrder: number;
        ingredients: string | null;
        calories: number | null;
        allergens: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        categoryId: string;
    })[]>;
    create(user: JwtPayload, dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        description: string | null;
        descriptionAr: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isAvailable: boolean;
        isPopular: boolean;
        sortOrder: number;
        ingredients: string | null;
        calories: number | null;
        allergens: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        categoryId: string;
    }>;
    one(user: JwtPayload, id: string): Promise<{
        category: {
            id: string;
            name: string;
            nameAr: string | null;
            slug: string;
            image: string | null;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        };
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        description: string | null;
        descriptionAr: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isAvailable: boolean;
        isPopular: boolean;
        sortOrder: number;
        ingredients: string | null;
        calories: number | null;
        allergens: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        categoryId: string;
    }>;
    update(user: JwtPayload, id: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        description: string | null;
        descriptionAr: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isAvailable: boolean;
        isPopular: boolean;
        sortOrder: number;
        ingredients: string | null;
        calories: number | null;
        allergens: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        categoryId: string;
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        description: string | null;
        descriptionAr: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isAvailable: boolean;
        isPopular: boolean;
        sortOrder: number;
        ingredients: string | null;
        calories: number | null;
        allergens: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
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
            nameAr: string | null;
            slug: string;
            image: string | null;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
        };
    } & {
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        description: string | null;
        descriptionAr: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isAvailable: boolean;
        isPopular: boolean;
        sortOrder: number;
        ingredients: string | null;
        calories: number | null;
        allergens: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        categoryId: string;
    })[]>;
}
