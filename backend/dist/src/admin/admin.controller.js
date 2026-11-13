"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const restaurants_service_1 = require("../restaurants/restaurants.service");
const analytics_service_1 = require("../analytics/analytics.service");
const update_restaurant_dto_1 = require("./dto/update-restaurant.dto");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const client_2 = require("@prisma/client");
const slugify_1 = require("../common/slugify");
let AdminController = class AdminController {
    constructor(restaurants, analytics, config, prisma, auth) {
        this.restaurants = restaurants;
        this.analytics = analytics;
        this.config = config;
        this.prisma = prisma;
        this.auth = auth;
    }
    async getRestaurant(user) {
        if (!user.restaurantId)
            throw new common_1.ForbiddenException('No restaurant assigned to your account');
        return this.restaurants.getById(user.restaurantId, user.restaurantId);
    }
    async updateRestaurant(user, dto) {
        if (!user.restaurantId)
            throw new common_1.ForbiddenException('No restaurant assigned to your account');
        return this.restaurants.update(user.restaurantId, dto);
    }
    async getStats(user) {
        if (!user.restaurantId)
            throw new common_1.ForbiddenException('No restaurant assigned to your account');
        return this.analytics.getStatsForRestaurant(user.restaurantId);
    }
    async getQr(user) {
        if (!user.restaurantId)
            throw new common_1.ForbiddenException('No restaurant assigned to your account');
        const restaurant = await this.restaurants.getById(user.restaurantId, user.restaurantId);
        const baseUrl = this.config.get('FRONTEND_URL') ||
            (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3000');
        const menuUrl = `${baseUrl}/restaurant/${restaurant.slug}/menu`;
        return { url: menuUrl, slug: restaurant.slug };
    }
    async onboarding(user, body) {
        if (user.restaurantId)
            throw new common_1.BadRequestException('You already have a restaurant assigned');
        const name = body?.name?.trim();
        if (!name || name.length < 2)
            throw new common_1.BadRequestException('Restaurant name is required (at least 2 characters)');
        let slug = (0, slugify_1.slugify)(name, 'restaurant');
        const existing = await this.prisma.restaurant.findUnique({ where: { slug } });
        if (existing)
            slug = `${slug}-${Date.now().toString(36)}`;
        const restaurant = await this.prisma.restaurant.create({
            data: {
                name,
                slug,
                currency: client_2.Currency.USD,
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
                plan: client_2.SubscriptionPlan.BASIC,
                status: client_2.SubscriptionStatus.ACTIVE,
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
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('restaurant'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRestaurant", null);
__decorate([
    (0, common_1.Put)('restaurant'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRestaurant", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('qr'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getQr", null);
__decorate([
    (0, common_1.Post)('onboarding'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "onboarding", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.RESTAURANT_ADMIN),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService,
        analytics_service_1.AnalyticsService,
        config_1.ConfigService,
        prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map