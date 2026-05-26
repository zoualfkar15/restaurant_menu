import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordMenuView(slug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({ where: { slug, isActive: true } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    await this.prisma.menuView.create({ data: { restaurantId: restaurant.id } });
    return { ok: true };
  }

  async recordQrScan(slug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({ where: { slug, isActive: true } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    await this.prisma.qrScan.create({ data: { restaurantId: restaurant.id } });
    return { ok: true };
  }

  async getStatsForRestaurant(restaurantId: string) {
    const [menuItems, categories, menuViews, qrScans] = await Promise.all([
      this.prisma.product.count({ where: { restaurantId } }),
      this.prisma.category.count({ where: { restaurantId } }),
      this.prisma.menuView.count({ where: { restaurantId } }),
      this.prisma.qrScan.count({ where: { restaurantId } }),
    ]);
    return { menuItems, categories, menuViews, qrScans };
  }

  async getPlatformOverview() {
    const [totalRestaurants, totalUsers, totalMenuViews, totalQrScans] = await Promise.all([
      this.prisma.restaurant.count(),
      this.prisma.user.count(),
      this.prisma.menuView.count(),
      this.prisma.qrScan.count(),
    ]);
    return { totalRestaurants, totalUsers, totalMenuViews, totalQrScans };
  }
}
