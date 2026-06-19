import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateFormulaDto {
  @IsString()
  name: string;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  topNotes?: string;

  @IsOptional()
  @IsString()
  middleNotes?: string;

  @IsOptional()
  @IsString()
  baseNotes?: string;

  @IsOptional()
  @IsEnum(['edt', 'edp', 'parfum', 'extrait'])
  concentration?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
