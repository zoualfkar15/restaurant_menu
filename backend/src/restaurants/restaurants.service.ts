import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { slug, isActive: true },
      include: {
        categories: {
          orderBy: { sortOrder: 'asc' as const },
          include: {
            products: {
              where: { isAvailable: true },
              orderBy: { sortOrder: 'asc' as const },
            },
          },
        },
      },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async getPublicProfile(slug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { slug, isActive: true },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async getMenuBySlug(slug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { slug, isActive: true },
      include: {
        categories: {
          orderBy: { sortOrder: 'asc' as const },
          include: {
            products: {
              where: { isAvailable: true },
              orderBy: { sortOrder: 'asc' as const },
            },
          },
        },
      },
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
    return this.prisma.restaurant.update({ where: { id }, data });
  }
}
