import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormulaDto } from './dto/create-formula.dto';
import { UpdateFormulaDto } from './dto/update-formula.dto';

@Injectable()
export class FormulasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(atelierId: string) {
    return this.prisma.formula.findMany({
      where: { atelierId },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateFormulaDto, atelierId: string) {
    return this.prisma.formula.create({
      data: {
        name: dto.name,
        clientId: dto.clientId,
        topNotes: dto.topNotes || '',
        middleNotes: dto.middleNotes || '',
        baseNotes: dto.baseNotes || '',
        concentration: (dto.concentration as any) || 'edp',
        description: dto.description || '',
        atelierId,
      },
      include: { client: true },
    });
  }

  async update(id: string, dto: UpdateFormulaDto, atelierId: string) {
    const formula = await this.prisma.formula.findFirst({ where: { id, atelierId } });
    if (!formula) throw new NotFoundException('Formül bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.concentration) data.concentration = dto.concentration as any;

    return this.prisma.formula.update({
      where: { id },
      data,
      include: { client: true },
    });
  }
}
