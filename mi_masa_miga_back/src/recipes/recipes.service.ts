// src/recipes/recipes.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // ajusta la ruta
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) { }

  // Generar slug único
  private async generateSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.recipe.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async create(createRecipeDto: CreateRecipeDto, authorId: string) {
    const slug = await this.generateSlug(createRecipeDto.title);

    const recipe = await this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        slug,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return recipe;
  }

  async findAll() {
    return this.prisma.recipe.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }

    return recipe;
  }

  async findBySlug(slug: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Receta con slug ${slug} no encontrada`);
    }

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string) {
    // Verificar que existe
    const recipe = await this.findOne(id);

    // Verificar que es el autor
    if (recipe.authorId !== userId) {
      throw new ConflictException('No tienes permiso para editar esta receta');
    }

    // Si cambia el título, regenerar slug
    let slug = recipe.slug;
    if (updateRecipeDto.title && updateRecipeDto.title !== recipe.title) {
      slug = await this.generateSlug(updateRecipeDto.title);
    }

    return this.prisma.recipe.update({
      where: { id },
      data: {
        ...updateRecipeDto,
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const recipe = await this.findOne(id);

    if (recipe.authorId !== userId) {
      throw new ConflictException('No tienes permiso para eliminar esta receta');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'Receta eliminada exitosamente' };
  }
}