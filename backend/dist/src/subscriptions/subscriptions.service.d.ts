import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getByRestaurantId(restaurantId: string): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        isYearly: boolean;
        startDate: Date;
        endDate: Date;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    }>;
    create(restaurantId: string, plan: SubscriptionPlan, isYearly: boolean, status?: SubscriptionStatus): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        isYearly: boolean;
        startDate: Date;
        endDate: Date;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    }>;
    update(id: string, data: {
        plan?: SubscriptionPlan;
        status?: SubscriptionStatus;
    }): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        isYearly: boolean;
        startDate: Date;
        endDate: Date;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    }>;
    listAll(skip?: number, take?: number): Promise<{
        data: ({
            restaurant: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            isYearly: boolean;
            startDate: Date;
            endDate: Date;
            stripeCustomerId: string | null;
            stripeSubscriptionId: string | null;
        })[];
        total: number;
        skip: number;
        take: number;
    }>;
}
