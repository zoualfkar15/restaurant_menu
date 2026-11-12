import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(restaurantId: string, dto: CreateCategoryDto) {
    const slug = slugify(dto.name);
    const maxOrder = await this.prisma.category.findFirst({
      where: { restaurantId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    const sortOrder = dto.sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1;
    try {
      return await this.prisma.category.create({
        data: {
          restaurantId,
          name: dto.name,
          slug,
          sortOrder,
          ...(dto.image != null && dto.image !== '' && { image: dto.image }),
          ...(dto.nameAr != null && dto.nameAr !== '' && { nameAr: dto.nameAr }),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('A category with this name already exists');
        if (e.code === 'P2003') throw new BadRequestException('Invalid reference');
      }
      throw e;
    }
  }

  async findAll(restaurantId: string) {
    return this.prisma.category.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
      include: { products: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findOne(id: string, restaurantId: string) {
    const cat = await this.prisma.category.findFirst({
      where: { id, restaurantId },
      include: { products: true },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: string, restaurantId: string, dto: UpdateCategoryDto) {
    await this.findOne(id, restaurantId);
    const slug = dto.name ? slugify(dto.name) : undefined;
    return this.prisma.category.update({
      where: { id },
      data: { ...dto, slug },
    });
  }

  async remove(id: string, restaurantId: string) {
    await this.findOne(id, restaurantId);
    return this.prisma.category.delete({ where: { id } });
  }

  async reorder(restaurantId: string, order: { id: string; sortOrder: number }[]) {
    await Promise.all(
      order.map(({ id, sortOrder }) =>
        this.prisma.category.updateMany({
          where: { id, restaurantId },
          data: { sortOrder },
        }),
      ),
    );
    return this.findAll(restaurantId);
  }
}
