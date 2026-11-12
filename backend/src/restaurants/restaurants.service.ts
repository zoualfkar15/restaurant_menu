import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CatalogCacheService } from '../catalog-cache/catalog-cache.service';

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
    private catalogCache: CatalogCacheService,
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

  /** Public catalog: restaurant info, categories, and products in one query. */
  async getCatalogBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { slug, isActive: true },
      include: catalogInclude,
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async getById(id: string, restaurantId?: string) {
    const where: Prisma.RestaurantWhereInput = { id };
    if (restaurantId) where.id = restaurantId;
    const restaurant = await this.prisma.restaurant.findFirst({ where });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: string, data: Prisma.RestaurantUpdateInput) {
    const payload = { ...data } as Prisma.RestaurantUpdateInput & {
      primaryColor?: string | null;
      logo?: string | null;
      coverImage?: string | null;
    };
    if (payload.primaryColor === '') payload.primaryColor = null;
    if (payload.logo === '') payload.logo = null;
    if (payload.coverImage === '') payload.coverImage = null;
    const before = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { slug: true },
    });
    const updated = await this.prisma.restaurant.update({ where: { id }, data: payload });
    await this.catalogCache.invalidateSlug(before?.slug);
    if (updated.slug !== before?.slug) await this.catalogCache.invalidateSlug(updated.slug);
    return updated;
  }
}
