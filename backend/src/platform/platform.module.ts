import { Module } from '@nestjs/common';
import { PlatformController } from './platform.controller';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [RestaurantsModule, SubscriptionsModule, AnalyticsModule],
  controllers: [PlatformController],
})
export class PlatformModule {}
