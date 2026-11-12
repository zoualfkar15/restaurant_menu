"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const restaurants_module_1 = require("./restaurants/restaurants.module");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const upload_module_1 = require("./upload/upload.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const platform_module_1 = require("./platform/platform.module");
const analytics_module_1 = require("./analytics/analytics.module");
const admin_module_1 = require("./admin/admin.module");
const catalog_cache_module_1 = require("./catalog-cache/catalog-cache.module");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                { name: 'short', ttl: 1000, limit: 10 },
                { name: 'medium', ttl: 60000, limit: 100 },
                { name: 'long', ttl: 3600000, limit: 500 },
            ]),
            prisma_module_1.PrismaModule,
            catalog_cache_module_1.CatalogCacheModule,
            auth_module_1.AuthModule,
            restaurants_module_1.RestaurantsModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            upload_module_1.UploadModule,
            subscriptions_module_1.SubscriptionsModule,
            platform_module_1.PlatformModule,
            analytics_module_1.AnalyticsModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map