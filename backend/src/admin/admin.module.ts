import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RestaurantsModule, AnalyticsModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
