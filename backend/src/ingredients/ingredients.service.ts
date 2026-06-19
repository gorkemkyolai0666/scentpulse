import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(atelierId: string) {
    return this.prisma.ingredient.findMany({
      where: { atelierId },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateIngredientDto, atelierId: string) {
    return this.prisma.ingredient.create({
      data: {
        name: dto.name,
        category: (dto.category as any) || 'essential_oil',
        stockMl: dto.stockMl ?? 0,
        unitCost: dto.unitCost ?? 0,
        supplier: dto.supplier || '',
        notes: dto.notes || '',
        atelierId,
      },
    });
  }

  async update(id: string, dto: UpdateIngredientDto, atelierId: string) {
    const ingredient = await this.prisma.ingredient.findFirst({ where: { id, atelierId } });
    if (!ingredient) throw new NotFoundException('Hammadde bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.category) data.category = dto.category as any;

    return this.prisma.ingredient.update({ where: { id }, data });
  }

  async remove(id: string, atelierId: string) {
    const ingredient = await this.prisma.ingredient.findFirst({ where: { id, atelierId } });
    if (!ingredient) throw new NotFoundException('Hammadde bulunamadı');
    return this.prisma.ingredient.delete({ where: { id } });
  }
}
