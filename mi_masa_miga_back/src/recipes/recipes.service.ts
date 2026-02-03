// src/recipes/recipes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
        title: createRecipeDto.title,
        slug,
        description: createRecipeDto.description,
        coverImage: createRecipeDto.coverImage,
        ingredients: JSON.parse(JSON.stringify(createRecipeDto.ingredients)),
        instructions: JSON.parse(JSON.stringify(createRecipeDto.instructions)),
        prepTime: createRecipeDto.prepTime,
        cookTime: createRecipeDto.cookTime,
        servings: createRecipeDto.servings,
        difficulty: createRecipeDto.difficulty,
        status: createRecipeDto.status,
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
      where: {
        status: 'PUBLISHED',
      },
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

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    // Ya no necesitas verificar authorId porque el guard se encarga
    await this.findOne(id);

    const updateData: any = {};

    if (updateRecipeDto.title) {
      updateData.title = updateRecipeDto.title;
      updateData.slug = await this.generateSlug(updateRecipeDto.title);
    }

    if (updateRecipeDto.description !== undefined) {
      updateData.description = updateRecipeDto.description;
    }

    if (updateRecipeDto.coverImage !== undefined) {
      updateData.coverImage = updateRecipeDto.coverImage;
    }

    if (updateRecipeDto.ingredients) {
      updateData.ingredients = JSON.parse(JSON.stringify(updateRecipeDto.ingredients));
    }

    if (updateRecipeDto.instructions) {
      updateData.instructions = JSON.parse(JSON.stringify(updateRecipeDto.instructions));
    }

    if (updateRecipeDto.prepTime !== undefined) {
      updateData.prepTime = updateRecipeDto.prepTime;
    }

    if (updateRecipeDto.cookTime !== undefined) {
      updateData.cookTime = updateRecipeDto.cookTime;
    }

    if (updateRecipeDto.servings !== undefined) {
      updateData.servings = updateRecipeDto.servings;
    }

    if (updateRecipeDto.difficulty !== undefined) {
      updateData.difficulty = updateRecipeDto.difficulty;
    }

    if (updateRecipeDto.status !== undefined) {
      updateData.status = updateRecipeDto.status;
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateData,
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

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'Receta eliminada exitosamente' };
  }
}