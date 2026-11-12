import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleDestroy {
    private readonly logger;
    private readonly client;
    constructor(config: ConfigService);
    onModuleDestroy(): Promise<void>;
    private slugKey;
    private idKey;
    getCatalog<T = unknown>(slug: string): Promise<T | null>;
    setCatalog(slug: string, restaurantId: string, payload: unknown): Promise<void>;
    invalidateRestaurant(restaurantId: string, extraSlugs?: string[]): Promise<void>;
}
