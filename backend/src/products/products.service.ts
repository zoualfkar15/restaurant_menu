import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  private async bustCatalog(restaurantId: string) {
    await this.redis.invalidateRestaurant(restaurantId);
  }

  async create(restaurantId: string, dto: CreateProductDto) {
    const slug = slugify(dto.name);
    const maxOrder = await this.prisma.product.findFirst({
      where: { categoryId: dto.categoryId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    const sortOrder = dto.sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1;
    const product = await this.prisma.product.create({
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
    await this.bustCatalog(restaurantId);
    return product;
  }

  async findAll(restaurantId: string, categoryId?: string) {
    const where: { restaurantId: string; categoryId?: string } = { restaurantId };
    if (categoryId) where.categoryId = categoryId;
    return this.prisma.product.findMany({
      where,
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
      include: { category: true },
    });
  }

  async findOne(id: string, restaurantId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, restaurantId },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(restaurantSlug: string, productSlug: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { slug: restaurantSlug, isActive: true },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    const product = await this.prisma.product.findFirst({
      where: { restaurantId: restaurant.id, slug: productSlug },
      include: { category: true, restaurant: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, restaurantId: string, dto: UpdateProductDto) {
    await this.findOne(id, restaurantId);
    const slug = dto.name ? slugify(dto.name) : undefined;
    const product = await this.prisma.product.update({
      where: { id },
      data: { ...dto, slug },
    });
    await this.bustCatalog(restaurantId);
    return product;
  }

  async remove(id: string, restaurantId: string) {
    await this.findOne(id, restaurantId);
    const product = await this.prisma.product.delete({ where: { id } });
    await this.bustCatalog(restaurantId);
    return product;
  }

  async reorder(restaurantId: string, order: { id: string; sortOrder: number }[]) {
    await Promise.all(
      order.map(({ id, sortOrder }) =>
        this.prisma.product.updateMany({
          where: { id, restaurantId },
          data: { sortOrder },
        }),
      ),
    );
    await this.bustCatalog(restaurantId);
    return this.findAll(restaurantId);
  }
}
