import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class CatalogCacheService {
    private config;
    private prisma;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService);
    invalidateRestaurant(restaurantId: string | null | undefined): Promise<void>;
    invalidateSlug(slug: string | null | undefined): Promise<void>;
}
