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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const catalogInclude = {
    categories: {
        orderBy: { sortOrder: 'asc' },
        include: {
            products: {
                where: { isAvailable: true },
                orderBy: { sortOrder: 'asc' },
            },
        },
    },
};
let RestaurantsService = class RestaurantsService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async findBySlug(slug) {
        return this.getCatalogBySlug(slug);
    }
    async getPublicProfile(slug) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: { slug, isActive: true },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        return restaurant;
    }
    async getMenuBySlug(slug) {
        return this.getCatalogBySlug(slug);
    }
    async getCatalogBySlug(slug) {
        const cached = await this.redis.getCatalog(slug);
        if (cached)
            return cached;
        const restaurant = await this.prisma.restaurant.findFirst({
            where: { slug, isActive: true },
            include: catalogInclude,
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const payload = JSON.parse(JSON.stringify(restaurant));
        await this.redis.setCatalog(restaurant.slug, restaurant.id, payload);
        return payload;
    }
    async getById(id, restaurantId) {
        const where = { id };
        if (restaurantId)
            where.id = restaurantId;
        const restaurant = await this.prisma.restaurant.findFirst({ where });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        return restaurant;
    }
    async update(id, data) {
        const existing = await this.prisma.restaurant.findUnique({
            where: { id },
            select: { slug: true },
        });
        const restaurant = await this.prisma.restaurant.update({ where: { id }, data });
        await this.redis.invalidateRestaurant(id, [existing?.slug, restaurant.slug].filter(Boolean));
        return restaurant;
    }
    async invalidateCatalog(restaurantId) {
        await this.redis.invalidateRestaurant(restaurantId);
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map