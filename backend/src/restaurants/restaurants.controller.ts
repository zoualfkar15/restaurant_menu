import { Controller, Get, Param, Post } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { ProductsService } from '../products/products.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private restaurants: RestaurantsService,
    private analytics: AnalyticsService,
    private products: ProductsService,
  ) {}

  @Get(':slug/products/:productSlug')
  async getProduct(
    @Param('slug') slug: string,
    @Param('productSlug') productSlug: string,
  ) {
    return this.products.findBySlug(slug, productSlug);
  }

  @Get(':slug/menu')
  async getMenu(@Param('slug') slug: string) {
    return this.restaurants.getMenuBySlug(slug);
  }

  @Post(':slug/menu/view')
  async recordMenuView(@Param('slug') slug: string) {
    return this.analytics.recordMenuView(slug);
  }

  @Post(':slug/qr/scan')
  async recordQrScan(@Param('slug') slug: string) {
    return this.analytics.recordQrScan(slug);
  }

  @Get(':slug')
  async getProfile(@Param('slug') slug: string) {
    return this.restaurants.getPublicProfile(slug);
  }
}
