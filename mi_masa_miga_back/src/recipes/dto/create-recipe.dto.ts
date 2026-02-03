
import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsInt,
    IsEnum,
    IsOptional,
    IsUrl,
    Min,
    ArrayMinSize,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeDifficulty, RecipeStatus } from '@prisma/client';

export class IngredientDto {
    @IsString()
    @IsNotEmpty()
    quantity: string;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    @Min(3)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    coverImage?: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    ingredients: IngredientDto[];

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    instructions: string[];

    @IsInt()
    @Min(1)
    prepTime: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    cookTime?: number;

    @IsInt()
    @Min(1)
    servings: number;

    @IsEnum(RecipeDifficulty)
    @IsOptional()
    difficulty?: RecipeDifficulty;

    @IsEnum(RecipeStatus)
    @IsOptional()
    status?: RecipeStatus;
}