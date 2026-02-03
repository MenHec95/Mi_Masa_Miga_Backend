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
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) { }

  // Solo ADMIN puede crear recetas
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createRecipeDto: CreateRecipeDto, @Req() req) {
    return this.recipesService.create(createRecipeDto, req.user.id);
  }

  // Público - listar todas las recetas
  @Public()
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  // Público - ver una receta por ID
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  // Público - ver receta por slug (para URLs amigables)
  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.recipesService.findBySlug(slug);
  }

  // Solo ADMIN puede editar recetas
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  // Solo ADMIN puede eliminar recetas
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}