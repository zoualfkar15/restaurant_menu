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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const client_1 = require("@prisma/client");
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
let CategoriesService = class CategoriesService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async bustCatalog(restaurantId) {
        await this.redis.invalidateRestaurant(restaurantId);
    }
    async create(restaurantId, dto) {
        const slug = slugify(dto.name);
        const maxOrder = await this.prisma.category.findFirst({
            where: { restaurantId },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        const sortOrder = dto.sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1;
        try {
            const category = await this.prisma.category.create({
                data: {
                    restaurantId,
                    name: dto.name,
                    slug,
                    sortOrder,
                    ...(dto.image != null && dto.image !== '' && { image: dto.image }),
                    ...(dto.nameAr != null && dto.nameAr !== '' && { nameAr: dto.nameAr }),
                },
            });
            await this.bustCatalog(restaurantId);
            return category;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002')
                    throw new common_1.ConflictException('A category with this name already exists');
                if (e.code === 'P2003')
                    throw new common_1.BadRequestException('Invalid reference');
            }
            throw e;
        }
    }
    async findAll(restaurantId) {
        return this.prisma.category.findMany({
            where: { restaurantId },
            orderBy: { sortOrder: 'asc' },
            include: { products: { orderBy: { sortOrder: 'asc' } } },
        });
    }
    async findOne(id, restaurantId) {
        const cat = await this.prisma.category.findFirst({
            where: { id, restaurantId },
            include: { products: true },
        });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
    async update(id, restaurantId, dto) {
        await this.findOne(id, restaurantId);
        const slug = dto.name ? slugify(dto.name) : undefined;
        const category = await this.prisma.category.update({
            where: { id },
            data: { ...dto, slug },
        });
        await this.bustCatalog(restaurantId);
        return category;
    }
    async remove(id, restaurantId) {
        await this.findOne(id, restaurantId);
        const category = await this.prisma.category.delete({ where: { id } });
        await this.bustCatalog(restaurantId);
        return category;
    }
    async reorder(restaurantId, order) {
        await Promise.all(order.map(({ id, sortOrder }) => this.prisma.category.updateMany({
            where: { id, restaurantId },
            data: { sortOrder },
        })));
        await this.bustCatalog(restaurantId);
        return this.findAll(restaurantId);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map