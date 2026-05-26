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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(restaurantId, dto) {
        const slug = slugify(dto.name);
        const maxOrder = await this.prisma.product.findFirst({
            where: { categoryId: dto.categoryId },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        const sortOrder = dto.sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1;
        return this.prisma.product.create({
            data: {
                restaurantId,
                categoryId: dto.categoryId,
                name: dto.name,
                slug,
                description: dto.description,
                descriptionAr: dto.descriptionAr,
                nameAr: dto.nameAr,
                price: dto.price,
                image: dto.image,
                isAvailable: dto.isAvailable ?? true,
                isPopular: dto.isPopular ?? false,
                sortOrder,
                ingredients: dto.ingredients,
                calories: dto.calories,
                allergens: dto.allergens,
            },
        });
    }
    async findAll(restaurantId, categoryId) {
        const where = { restaurantId };
        if (categoryId)
            where.categoryId = categoryId;
        return this.prisma.product.findMany({
            where,
            orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
            include: { category: true },
        });
    }
    async findOne(id, restaurantId) {
        const product = await this.prisma.product.findFirst({
            where: { id, restaurantId },
            include: { category: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findBySlug(restaurantSlug, productSlug) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: { slug: restaurantSlug, isActive: true },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        const product = await this.prisma.product.findFirst({
            where: { restaurantId: restaurant.id, slug: productSlug },
            include: { category: true, restaurant: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, restaurantId, dto) {
        await this.findOne(id, restaurantId);
        const slug = dto.name ? slugify(dto.name) : undefined;
        return this.prisma.product.update({
            where: { id },
            data: { ...dto, slug },
        });
    }
    async remove(id, restaurantId) {
        await this.findOne(id, restaurantId);
        return this.prisma.product.delete({ where: { id } });
    }
    async reorder(restaurantId, order) {
        await Promise.all(order.map(({ id, sortOrder }) => this.prisma.product.updateMany({
            where: { id, restaurantId },
            data: { sortOrder },
        })));
        return this.findAll(restaurantId);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map