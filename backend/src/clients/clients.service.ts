import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(atelierId: string) {
    return this.prisma.client.findMany({
      where: { atelierId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, atelierId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, atelierId },
      include: {
        appointments: { orderBy: { date: 'desc' }, take: 5 },
        orders: { orderBy: { orderDate: 'desc' }, take: 5 },
        formulas: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!client) throw new NotFoundException('Müşteri bulunamadı');
    return client;
  }

  async create(dto: CreateClientDto, atelierId: string) {
    return this.prisma.client.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email || '',
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        address: dto.address || '',
        city: dto.city || '',
        preferences: dto.preferences || '',
        notes: dto.notes || '',
        atelierId,
      },
    });
  }

  async update(id: string, dto: UpdateClientDto, atelierId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, atelierId } });
    if (!client) throw new NotFoundException('Müşteri bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.birthDate) data.birthDate = new Date(dto.birthDate);

    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: string, atelierId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, atelierId } });
    if (!client) throw new NotFoundException('Müşteri bulunamadı');

    await this.prisma.order.deleteMany({ where: { clientId: id } });
    await this.prisma.formula.deleteMany({ where: { clientId: id } });
    await this.prisma.appointment.deleteMany({ where: { clientId: id } });

    return this.prisma.client.delete({ where: { id } });
  }
}
