// src/recipes/recipes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';


@Controller('recipes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recipes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) { }

  // Solo usuarios autenticados pueden crear recetas
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createRecipeDto: CreateRecipeDto, @Req() req) {
    return this.recipesService.create(createRecipeDto, req.user.id);
  }

  // Endpoint público - cualquiera puede ver las recetas
  @Public()
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  // Endpoint público - cualquiera puede ver una receta
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  // Endpoint público - buscar por slug
  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.recipesService.findBySlug(slug);
  }

  // Solo el autor puede editar
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Req() req,
  ) {
    return this.recipesService.update(id, updateRecipeDto, req.user.id);
  }

  // Solo el autor puede eliminar
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req) {
    return this.recipesService.remove(id, req.user.id);
  }
}