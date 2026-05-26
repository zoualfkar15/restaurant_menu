import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { ProductsModule } from '../products/products.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [ProductsModule, AnalyticsModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
