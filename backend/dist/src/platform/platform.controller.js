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
exports.PlatformController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const restaurants_service_1 = require("../restaurants/restaurants.service");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const analytics_service_1 = require("../analytics/analytics.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_2 = require("@prisma/client");
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
let PlatformController = class PlatformController {
    constructor(prisma, restaurants, subscriptions, analytics) {
        this.prisma = prisma;
        this.restaurants = restaurants;
        this.subscriptions = subscriptions;
        this.analytics = analytics;
    }
    async listRestaurants(skip = 0, take = 20) {
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
    async createRestaurant(body) {
        const slug = body.slug || slugify(body.name);
        const exists = await this.prisma.restaurant.findUnique({ where: { slug } });
        if (exists)
            throw new Error('Slug already taken');
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
                plan: client_2.SubscriptionPlan.BASIC,
                status: client_2.SubscriptionStatus.ACTIVE,
                isYearly: false,
                startDate,
                endDate,
            },
        });
        return restaurant;
    }
    async getRestaurant(id) {
        const r = await this.prisma.restaurant.findUnique({
            where: { id },
            include: {
                categories: true,
                _count: { select: { products: true } },
                subscriptions: { take: 1, orderBy: { createdAt: 'desc' } },
            },
        });
        if (!r)
            throw new common_1.NotFoundException('Restaurant not found');
        return r;
    }
    async updateRestaurant(id, body) {
        return this.prisma.restaurant.update({ where: { id }, data: body });
    }
    async deleteRestaurant(id) {
        return this.prisma.restaurant.delete({ where: { id } });
    }
    async listSubscriptions(skip = 0, take = 50) {
        return this.subscriptions.listAll(Number(skip), Number(take));
    }
    async getRestaurantSubscription(id) {
        return this.subscriptions.getByRestaurantId(id);
    }
    async updateSubscription(id, body) {
        return this.subscriptions.update(id, body);
    }
    async analyticsOverview() {
        return this.analytics.getPlatformOverview();
    }
};
exports.PlatformController = PlatformController;
__decorate([
    (0, common_1.Get)('restaurants'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "listRestaurants", null);
__decorate([
    (0, common_1.Post)('restaurants'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "createRestaurant", null);
__decorate([
    (0, common_1.Get)('restaurants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getRestaurant", null);
__decorate([
    (0, common_1.Put)('restaurants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "updateRestaurant", null);
__decorate([
    (0, common_1.Delete)('restaurants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "deleteRestaurant", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "listSubscriptions", null);
__decorate([
    (0, common_1.Get)('restaurants/:id/subscription'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getRestaurantSubscription", null);
__decorate([
    (0, common_1.Put)('subscriptions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "analyticsOverview", null);
exports.PlatformController = PlatformController = __decorate([
    (0, common_1.Controller)('platform'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.PLATFORM_OWNER),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        restaurants_service_1.RestaurantsService,
        subscriptions_service_1.SubscriptionsService,
        analytics_service_1.AnalyticsService])
], PlatformController);
//# sourceMappingURL=platform.controller.js.map