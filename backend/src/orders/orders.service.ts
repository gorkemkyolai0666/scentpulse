import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(atelierId: string) {
    return this.prisma.order.findMany({
      where: { atelierId },
      include: { client: true, formula: true },
      orderBy: { orderDate: 'desc' },
    });
  }

  async create(dto: CreateOrderDto, atelierId: string) {
    return this.prisma.order.create({
      data: {
        clientId: dto.clientId,
        formulaId: dto.formulaId || null,
        productName: dto.productName || '',
        volumeMl: dto.volumeMl || 50,
        concentration: (dto.concentration as any) || 'edp',
        totalPrice: dto.totalPrice || 0,
        paidAmount: dto.paidAmount || 0,
        orderDate: new Date(dto.orderDate),
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        notes: dto.notes || '',
        atelierId,
      },
      include: { client: true, formula: true },
    });
  }

  async update(id: string, dto: UpdateOrderDto, atelierId: string) {
    const order = await this.prisma.order.findFirst({ where: { id, atelierId } });
    if (!order) throw new NotFoundException('Sipariş bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.concentration) data.concentration = dto.concentration as any;
    if (dto.status) data.status = dto.status as any;
    if (dto.deliveryDate) data.deliveryDate = new Date(dto.deliveryDate);

    return this.prisma.order.update({
      where: { id },
      data,
      include: { client: true, formula: true },
    });
  }
}
