import { Controller, Get, Put, Post, Body, UseGuards, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/auth.service';
import { Role } from '@prisma/client';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { SubscriptionPlan, SubscriptionStatus, Currency } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

@Controller('admin')
@UseGuards(ThrottlerGuard, JwtAuthGuard, RolesGuard)
@Roles(Role.RESTAURANT_ADMIN)
export class AdminController {
  constructor(
    private restaurants: RestaurantsService,
    private analytics: AnalyticsService,
    private config: ConfigService,
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}

  @Get('restaurant')
  async getRestaurant(@CurrentUser() user: JwtPayload) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.restaurants.getById(user.restaurantId, user.restaurantId);
  }

  @Put('restaurant')
  async updateRestaurant(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateRestaurantDto,
  ) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.restaurants.update(user.restaurantId, dto);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: JwtPayload) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.analytics.getStatsForRestaurant(user.restaurantId);
  }

  @Get('qr')
  async getQr(@CurrentUser() user: JwtPayload) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    const restaurant = await this.restaurants.getById(user.restaurantId, user.restaurantId);
    const baseUrl =
      this.config.get<string>('FRONTEND_URL') ||
      (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3000');
    const menuUrl = `${baseUrl}/restaurant/${restaurant.slug}/menu`;
    // QR image can be generated client-side or via a library; return URL for client to render
    return { url: menuUrl, slug: restaurant.slug };
  }

  /** Create a restaurant and assign it to the current user (only when user has no restaurant). */
  @Post('onboarding')
  async onboarding(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string },
  ) {
    if (user.restaurantId) throw new BadRequestException('You already have a restaurant assigned');
    const name = body?.name?.trim();
    if (!name || name.length < 2) throw new BadRequestException('Restaurant name is required (at least 2 characters)');
    let slug = slugify(name);
    const existing = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const restaurant = await this.prisma.restaurant.create({
      data: {
        name,
        slug,
        currency: Currency.USD,
        defaultLocale: 'ar',
        localesEnabled: ['en', 'ar'],
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
    await this.prisma.user.update({
      where: { id: user.sub },
      data: { restaurantId: restaurant.id },
    });
    const restaurantData = await this.restaurants.getById(restaurant.id, restaurant.id);
    const tokens = await this.auth.issueTokensForUser(user.sub);
    return { restaurant: restaurantData, ...tokens };
  }
}
