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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByRestaurantId(restaurantId) {
        const sub = await this.prisma.subscription.findFirst({
            where: { restaurantId },
            orderBy: { createdAt: 'desc' },
        });
        if (!sub)
            throw new common_1.NotFoundException('No subscription found');
        return sub;
    }
    async create(restaurantId, plan, isYearly, status = client_1.SubscriptionStatus.ACTIVE) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (isYearly ? 12 : 1));
        return this.prisma.subscription.create({
            data: { restaurantId, plan, status, isYearly, startDate, endDate },
        });
    }
    async update(id, data) {
        return this.prisma.subscription.update({ where: { id }, data });
    }
    async listAll(skip = 0, take = 50) {
        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: { restaurant: { select: { id: true, name: true, slug: true } } },
            }),
            this.prisma.subscription.count(),
        ]);
        return { data, total, skip, take };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map