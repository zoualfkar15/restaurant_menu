import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    recordMenuView(slug: string): Promise<{
        ok: boolean;
    }>;
    recordQrScan(slug: string): Promise<{
        ok: boolean;
    }>;
    getStatsForRestaurant(restaurantId: string): Promise<{
        menuItems: number;
        categories: number;
        menuViews: number;
        qrScans: number;
    }>;
    getPlatformOverview(): Promise<{
        totalRestaurants: number;
        totalUsers: number;
        totalMenuViews: number;
        totalQrScans: number;
    }>;
}
