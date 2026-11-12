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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor(config) {
        this.logger = new common_1.Logger(RedisService_1.name);
        const url = config.get('REDIS_URL', 'redis://localhost:6379');
        this.client = new ioredis_1.Redis(url, {
            maxRetriesPerRequest: 2,
            enableReadyCheck: true,
            enableOfflineQueue: false,
            connectTimeout: 3000,
            retryStrategy: (times) => Math.min(times * 200, 2000),
        });
        this.client.on('error', (err) => {
            this.logger.warn(`Redis error: ${err.message}`);
        });
        this.client.on('connect', () => {
            this.logger.log(`Connected to Redis at ${url}`);
        });
    }
    async onModuleDestroy() {
        try {
            await this.client.quit();
        }
        catch {
            this.client.disconnect();
        }
    }
    slugKey(slug) {
        return `menuqr:catalog:${slug}`;
    }
    idKey(restaurantId) {
        return `menuqr:catalog:id:${restaurantId}`;
    }
    async getCatalog(slug) {
        try {
            const raw = await this.client.get(this.slugKey(slug));
            if (!raw)
                return null;
            return JSON.parse(raw);
        }
        catch (err) {
            this.logger.warn(`Catalog cache read failed: ${err.message}`);
            return null;
        }
    }
    async setCatalog(slug, restaurantId, payload) {
        try {
            const json = JSON.stringify(payload);
            await this.client
                .multi()
                .set(this.slugKey(slug), json)
                .set(this.idKey(restaurantId), slug)
                .exec();
        }
        catch (err) {
            this.logger.warn(`Catalog cache write failed: ${err.message}`);
        }
    }
    async invalidateRestaurant(restaurantId, extraSlugs = []) {
        try {
            const mapped = await this.client.get(this.idKey(restaurantId));
            const slugs = new Set(extraSlugs.filter(Boolean));
            if (mapped)
                slugs.add(mapped);
            const keys = [this.idKey(restaurantId), ...[...slugs].map((s) => this.slugKey(s))];
            if (keys.length)
                await this.client.del(...keys);
        }
        catch (err) {
            this.logger.warn(`Catalog cache invalidate failed: ${err.message}`);
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map