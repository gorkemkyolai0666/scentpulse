import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsNumber()
  volumeMl?: number;

  @IsOptional()
  @IsEnum(['edt', 'edp', 'parfum', 'extrait'])
  concentration?: string;

  @IsOptional()
  @IsEnum(['quoted', 'confirmed', 'in_production', 'ready', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
