import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['essential_oil', 'absolute', 'synthetic', 'alcohol', 'fixative', 'other'])
  category?: string;

  @IsOptional()
  @IsNumber()
  stockMl?: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['essential_oil', 'absolute', 'synthetic', 'alcohol', 'fixative', 'other'])
  category?: string;

  @IsOptional()
  @IsNumber()
  stockMl?: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
