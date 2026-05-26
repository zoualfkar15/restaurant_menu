import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/auth.service';
import { Role } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('admin/products')
@UseGuards(ThrottlerGuard, JwtAuthGuard, RolesGuard)
@Roles(Role.RESTAURANT_ADMIN)
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('categoryId') categoryId?: string,
  ) {
    if (!user.restaurantId) return [];
    return this.products.findAll(user.restaurantId, categoryId);
  }

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateProductDto) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.products.create(user.restaurantId, dto);
  }

  @Get(':id')
  async one(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.products.findOne(id, user.restaurantId);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.products.update(id, user.restaurantId, dto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.products.remove(id, user.restaurantId);
  }

  @Patch('reorder')
  async reorder(
    @CurrentUser() user: JwtPayload,
    @Body() body: { order: { id: string; sortOrder: number }[] },
  ) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.products.reorder(user.restaurantId, body.order);
  }
}
