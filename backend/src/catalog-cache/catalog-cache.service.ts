import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogCacheService {
  private readonly logger = new Logger(CatalogCacheService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async invalidateRestaurant(restaurantId: string | null | undefined) {
    if (!restaurantId) return;
    const row = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { slug: true },
    });
    if (row?.slug) await this.invalidateSlug(row.slug);
  }

  async invalidateSlug(slug: string | null | undefined) {
    if (!slug) return;
    const url =
      this.config.get<string>('CACHE_PURGE_URL') ||
      'https://menuqr-ekk.pages.dev/api/_cache/purge';
    const secret = this.config.get<string>('CACHE_PURGE_SECRET');
    if (!secret) {
      this.logger.warn(`CACHE_PURGE_SECRET missing; skipped purge for ${slug}`);
      return;
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-cache-purge-secret': secret,
        },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        this.logger.error(`Purge ${slug} failed: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      this.logger.error(`Purge ${slug} failed`, err instanceof Error ? err.stack : err);
    }
  }
}
