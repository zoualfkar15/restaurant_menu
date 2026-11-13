import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogCacheService } from '../catalog-cache/catalog-cache.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { slugify } from '../common/slugify';

@Controller('platform')
@UseGuards(ThrottlerGuard, JwtAuthGuard, RolesGuard)
@Roles(Role.PLATFORM_OWNER)
export class PlatformController {
  constructor(
    private prisma: PrismaService,
    private restaurants: RestaurantsService,
    private subscriptions: SubscriptionsService,
    private analytics: AnalyticsService,
    private catalogCache: CatalogCacheService,
  ) {}

  @Get('restaurants')
  async listRestaurants(
    @Query('skip') skip = 0,
    @Query('take') take = 20,
  ) {
    const [data, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        skip: Number(skip),
        take: Number(take),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { products: true, categories: true } },
          subscriptions: { take: 1, orderBy: { createdAt: 'desc' } },
        },
      }),
      this.prisma.restaurant.count(),
    ]);
    return { data, total, skip: Number(skip), take: Number(take) };
  }

  @Post('restaurants')
  async createRestaurant(
    @Body() body: { name: string; slug?: string; description?: string },
  ) {
    const slug = body.slug || slugify(body.name, 'restaurant');
    const exists = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (exists) throw new Error('Slug already taken');
    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
      },
    });
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    await this.prisma.subscription.create({
      data: {
        restaurantId: restaurant.id,
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
        isYearly: false,
        startDate,
        endDate,
      },
    });
    return restaurant;
  }

  @Get('restaurants/:id')
  async getRestaurant(@Param('id') id: string) {
    const r = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: true,
        _count: { select: { products: true } },
        subscriptions: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!r) throw new NotFoundException('Restaurant not found');
    return r;
  }

  @Put('restaurants/:id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string; description?: string; isActive?: boolean },
  ) {
    const existing = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!existing) throw new NotFoundException('Restaurant not found');
    const updated = await this.prisma.restaurant.update({ where: { id }, data: body });
    await this.catalogCache.invalidateSlug(existing.slug);
    if (updated.slug !== existing.slug) await this.catalogCache.invalidateSlug(updated.slug);
    return updated;
  }

  @Delete('restaurants/:id')
  async deleteRestaurant(@Param('id') id: string) {
    const existing = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!existing) throw new NotFoundException('Restaurant not found');
    await this.catalogCache.invalidateSlug(existing.slug);
    return this.prisma.restaurant.delete({ where: { id } });
  }

  @Get('subscriptions')
  async listSubscriptions(
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ) {
    return this.subscriptions.listAll(Number(skip), Number(take));
  }

  @Get('restaurants/:id/subscription')
  async getRestaurantSubscription(@Param('id') id: string) {
    return this.subscriptions.getByRestaurantId(id);
  }

  @Put('subscriptions/:id')
  async updateSubscription(
    @Param('id') id: string,
    @Body() body: { plan?: SubscriptionPlan; status?: SubscriptionStatus },
  ) {
    return this.subscriptions.update(id, body);
  }

  @Get('analytics/overview')
  async analyticsOverview() {
    return this.analytics.getPlatformOverview();
  }

  @Get('contact-messages')
  async listContactMessages(
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ) {
    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        skip: Number(skip),
        take: Number(take),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactMessage.count(),
    ]);
    return { data, total, skip: Number(skip), take: Number(take) };
  }
}
