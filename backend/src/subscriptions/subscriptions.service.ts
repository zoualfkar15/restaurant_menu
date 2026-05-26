import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getByRestaurantId(restaurantId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });
    if (!sub) throw new NotFoundException('No subscription found');
    return sub;
  }

  async create(
    restaurantId: string,
    plan: SubscriptionPlan,
    isYearly: boolean,
    status: SubscriptionStatus = SubscriptionStatus.ACTIVE,
  ) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (isYearly ? 12 : 1));
    return this.prisma.subscription.create({
      data: { restaurantId, plan, status, isYearly, startDate, endDate },
    });
  }

  async update(id: string, data: { plan?: SubscriptionPlan; status?: SubscriptionStatus }) {
    return this.prisma.subscription.update({ where: { id }, data });
  }

  async listAll(skip = 0, take = 50) {
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { restaurant: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.subscription.count(),
    ]);
    return { data, total, skip, take };
  }
}
