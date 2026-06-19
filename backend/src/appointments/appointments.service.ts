import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(atelierId: string) {
    return this.prisma.appointment.findMany({
      where: { atelierId },
      include: { client: true },
      orderBy: { date: 'asc' },
    });
  }

  async create(dto: CreateAppointmentDto, atelierId: string) {
    return this.prisma.appointment.create({
      data: {
        date: new Date(dto.date),
        duration: dto.duration || 45,
        type: (dto.type as any) || 'consultation',
        notes: dto.notes || '',
        perfumerName: dto.perfumerName || '',
        clientId: dto.clientId,
        atelierId,
      },
      include: { client: true },
    });
  }

  async update(id: string, dto: UpdateAppointmentDto, atelierId: string) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, atelierId } });
    if (!appointment) throw new NotFoundException('Randevu bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.status) data.status = dto.status as any;
    if (dto.type) data.type = dto.type as any;

    return this.prisma.appointment.update({
      where: { id },
      data,
      include: { client: true },
    });
  }

  async remove(id: string, atelierId: string) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, atelierId } });
    if (!appointment) throw new NotFoundException('Randevu bulunamadı');
    return this.prisma.appointment.delete({ where: { id } });
  }
}
