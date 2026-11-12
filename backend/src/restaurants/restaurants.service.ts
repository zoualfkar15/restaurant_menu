import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Prisma } from '@prisma/client';

/** Single Prisma include: restaurant + categories + available products. */
const catalogInclude = {
  categories: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
} satisfies Prisma.RestaurantInclude;

@Injectable()
export class RestaurantsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findBySlug(slug: string) {
    return this.getCatalogBySlug(slug);
  }

  async getPublicProfile(slug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { slug, isActive: true },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async getMenuBySlug(slug: string) {
    return this.getCatalogBySlug(slug);
  }

  /**
   * Public catalog: restaurant info, categories, and products in one query.
   * Cached in Redis with no TTL; mutations call `invalidateCatalog`.
   */
  async getCatalogBySlug(slug: string) {
    const cached = await this.redis.getCatalog(slug);
    if (cached) return cached;

    const restaurant = await this.prisma.restaurant.findFirst({
      where: { slug, isActive: true },
      include: catalogInclude,
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const payload = JSON.parse(JSON.stringify(restaurant));
    await this.redis.setCatalog(restaurant.slug, restaurant.id, payload);
    return payload;
  }

  async getById(id: string, restaurantId?: string) {
    const where: Prisma.RestaurantWhereInput = { id };
    if (restaurantId) where.id = restaurantId;
    const restaurant = await this.prisma.restaurant.findFirst({ where });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: string, data: Prisma.RestaurantUpdateInput) {
    const existing = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { slug: true },
    });
    const restaurant = await this.prisma.restaurant.update({ where: { id }, data });
    await this.redis.invalidateRestaurant(id, [existing?.slug, restaurant.slug].filter(Boolean) as string[]);
    return restaurant;
  }

  async invalidateCatalog(restaurantId: string) {
    await this.redis.invalidateRestaurant(restaurantId);
  }
}
