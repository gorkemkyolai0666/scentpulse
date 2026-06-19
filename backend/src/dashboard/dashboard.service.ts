import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(atelierId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const weekEnd = new Date(todayStart.getTime() + 7 * 86400000);

    const [
      totalClients,
      todayAppointments,
      weekAppointments,
      pendingOrders,
      readyOrders,
      totalOrders,
      lowStockIngredients,
      recentClients,
      upcomingAppointments,
    ] = await Promise.all([
      this.prisma.client.count({ where: { atelierId } }),
      this.prisma.appointment.count({
        where: { atelierId, date: { gte: todayStart, lt: todayEnd } },
      }),
      this.prisma.appointment.count({
        where: { atelierId, date: { gte: todayStart, lt: weekEnd } },
      }),
      this.prisma.order.count({
        where: { atelierId, status: { in: ['quoted', 'confirmed', 'in_production'] } },
      }),
      this.prisma.order.count({
        where: { atelierId, status: 'ready' },
      }),
      this.prisma.order.count({ where: { atelierId } }),
      this.prisma.ingredient.count({
        where: { atelierId, stockMl: { lt: 100 } },
      }),
      this.prisma.client.findMany({
        where: { atelierId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.appointment.findMany({
        where: {
          atelierId,
          date: { gte: todayStart },
          status: { in: ['scheduled', 'confirmed'] },
        },
        include: { client: true },
        orderBy: { date: 'asc' },
        take: 5,
      }),
    ]);

    return {
      totalClients,
      todayAppointments,
      weekAppointments,
      pendingOrders,
      readyOrders,
      totalOrders,
      lowStockIngredients,
      recentClients,
      upcomingAppointments,
    };
  }
}
