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
var CatalogCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogCacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogCacheService = CatalogCacheService_1 = class CatalogCacheService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger(CatalogCacheService_1.name);
    }
    async invalidateRestaurant(restaurantId) {
        if (!restaurantId)
            return;
        const row = await this.prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { slug: true },
        });
        if (row?.slug)
            await this.invalidateSlug(row.slug);
    }
    async invalidateSlug(slug) {
        if (!slug)
            return;
        const url = this.config.get('CACHE_PURGE_URL') ||
            'https://menuqr-ekk.pages.dev/api/_cache/purge';
        const secret = this.config.get('CACHE_PURGE_SECRET');
        if (!secret) {
            this.logger.warn(`CACHE_PURGE_SECRET missing; skipped purge for ${slug}`);
            return;
        }
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-cache-purge-secret': secret,
                },
                body: JSON.stringify({ slug }),
            });
            if (!res.ok) {
                this.logger.error(`Purge ${slug} failed: ${res.status} ${await res.text()}`);
            }
        }
        catch (err) {
            this.logger.error(`Purge ${slug} failed`, err instanceof Error ? err.stack : err);
        }
    }
};
exports.CatalogCacheService = CatalogCacheService;
exports.CatalogCacheService = CatalogCacheService = CatalogCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], CatalogCacheService);
//# sourceMappingURL=catalog-cache.service.js.map