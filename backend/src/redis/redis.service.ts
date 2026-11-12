import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

/**
 * Public restaurant catalog cache.
 * Keys have no TTL — they live until a product, category, or restaurant mutation deletes them.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.client = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      enableOfflineQueue: false,
      connectTimeout: 3000,
      retryStrategy: (times) => Math.min(times * 200, 2000),
    });
    this.client.on('error', (err) => {
      this.logger.warn(`Redis error: ${err.message}`);
    });
    this.client.on('connect', () => {
      this.logger.log(`Connected to Redis at ${url}`);
    });
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch {
      this.client.disconnect();
    }
  }

  private slugKey(slug: string) {
    return `menuqr:catalog:${slug}`;
  }

  private idKey(restaurantId: string) {
    return `menuqr:catalog:id:${restaurantId}`;
  }

  async getCatalog<T = unknown>(slug: string): Promise<T | null> {
    try {
      const raw = await this.client.get(this.slugKey(slug));
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      this.logger.warn(`Catalog cache read failed: ${(err as Error).message}`);
      return null;
    }
  }

  /** Persist catalog with no expiry. */
  async setCatalog(slug: string, restaurantId: string, payload: unknown): Promise<void> {
    try {
      const json = JSON.stringify(payload);
      await this.client
        .multi()
        .set(this.slugKey(slug), json)
        .set(this.idKey(restaurantId), slug)
        .exec();
    } catch (err) {
      this.logger.warn(`Catalog cache write failed: ${(err as Error).message}`);
    }
  }

  /**
   * Drop catalog keys for a restaurant. Pass extra slugs when the slug may have changed
   * (the id → slug pointer still holds the previously cached slug).
   */
  async invalidateRestaurant(restaurantId: string, extraSlugs: string[] = []): Promise<void> {
    try {
      const mapped = await this.client.get(this.idKey(restaurantId));
      const slugs = new Set(extraSlugs.filter(Boolean));
      if (mapped) slugs.add(mapped);
      const keys = [this.idKey(restaurantId), ...[...slugs].map((s) => this.slugKey(s))];
      if (keys.length) await this.client.del(...keys);
    } catch (err) {
      this.logger.warn(`Catalog cache invalidate failed: ${(err as Error).message}`);
    }
  }
}
