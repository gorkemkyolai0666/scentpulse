'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TopNavLayout } from '@/components/top-nav-layout';
import { formatDateTime, getStatusBadgeClass, getStatusLabel, getAppointmentTypeLabel } from '@/lib/utils';

interface DashboardStats {
  totalClients: number;
  todayAppointments: number;
  pendingOrders: number;
  readyOrders: number;
  lowStockIngredients: number;
  recentClients?: Array<{ id: string; firstName: string; lastName: string; phone: string; preferences?: string }>;
  upcomingAppointments?: Array<{ id: string; date: string; type: string; status: string; client?: { firstName: string; lastName: string } }>;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.dashboardStats()
        .then(setStats)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <TopNavLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Merhaba, {user.firstName}
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Atölyenizin güncel durumu</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-6 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 rounded w-20 mb-3" style={{ background: 'var(--border-color)' }} />
              <div className="h-8 rounded w-12" style={{ background: 'var(--border-color)' }} />
            </div>
          ))}
        </div>
      ) : stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Toplam Müşteri</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalClients}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Bugünkü Randevu</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{stats.todayAppointments}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Bekleyen Sipariş</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>{stats.pendingOrders}</span>
            </div>
            <div className="stat-card">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Teslime Hazır</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--success)' }}>{stats.readyOrders}</span>
            </div>
            <div className="stat-card col-span-2 lg:col-span-1">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Düşük Stok</span>
              <span className="text-3xl font-bold" style={{ color: 'var(--danger)' }}>{stats.lowStockIngredients}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Yaklaşan Randevular</h2>
                <Link href="/appointments" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Tümü</Link>
              </div>
              {!stats.upcomingAppointments?.length ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Yaklaşan randevu bulunmuyor</p>
              ) : (
                <div className="space-y-3">
                  {stats.upcomingAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {appt.client?.firstName} {appt.client?.lastName}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{getAppointmentTypeLabel(appt.type)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{formatDateTime(appt.date)}</div>
                        <span className={getStatusBadgeClass(appt.status)}>{getStatusLabel(appt.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Son Müşteriler</h2>
                <Link href="/clients" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Tümü</Link>
              </div>
              {!stats.recentClients?.length ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>Henüz müşteri kaydı bulunmuyor</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{client.phone}</div>
                      </div>
                      <div className="text-xs text-right max-w-[120px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {client.preferences || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </TopNavLayout>
  );
}
