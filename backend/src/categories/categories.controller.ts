import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/auth.service';
import { Role } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('admin/categories')
@UseGuards(ThrottlerGuard, JwtAuthGuard, RolesGuard)
@Roles(Role.RESTAURANT_ADMIN)
export class CategoriesController {
  constructor(private categories: CategoriesService) {}

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    if (!user.restaurantId) return [];
    return this.categories.findAll(user.restaurantId);
  }

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateCategoryDto) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.categories.create(user.restaurantId, dto);
  }

  @Get(':id')
  async one(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.categories.findOne(id, user.restaurantId);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.categories.update(id, user.restaurantId, dto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.categories.remove(id, user.restaurantId);
  }

  @Patch('reorder')
  async reorder(
    @CurrentUser() user: JwtPayload,
    @Body() body: { order: { id: string; sortOrder: number }[] },
  ) {
    if (!user.restaurantId) throw new ForbiddenException('No restaurant assigned to your account');
    return this.categories.reorder(user.restaurantId, body.order);
  }
}
