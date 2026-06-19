import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(['consultation', 'blending', 'pickup', 'follow_up'])
  type?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  perfumerName?: string;

  @IsString()
  clientId: string;
}
