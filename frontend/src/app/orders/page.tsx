'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TopNavLayout } from '@/components/top-nav-layout';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel, getConcentrationLabel } from '@/lib/utils';

interface Order {
  id: string;
  productName: string;
  volumeMl: number;
  concentration: string;
  status: string;
  totalPrice: number;
  orderDate: string;
  deliveryDate?: string;
  client?: { firstName: string; lastName: string };
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadOrders = () => {
    setLoading(true);
    api.getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadOrders(); }, [user]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setError('');
    try {
      await api.updateOrder(id, { status });
      loadOrders();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <TopNavLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Siparişler</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{orders.length} sipariş kaydı</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : orders.length === 0 ? (
        <div className="premium-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Henüz sipariş kaydı bulunmuyor
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="premium-card p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {order.productName || 'İsimsiz Ürün'}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {order.client?.firstName} {order.client?.lastName}
                  </div>
                  <div className="text-sm mt-1 flex flex-wrap gap-2 items-center" style={{ color: 'var(--text-muted)' }}>
                    <span>{order.volumeMl} ml</span>
                    <span>·</span>
                    <span>{getConcentrationLabel(order.concentration)}</span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Sipariş: {formatDate(order.orderDate)}
                    {order.deliveryDate && ` · Teslim: ${formatDate(order.deliveryDate)}`}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>{formatCurrency(order.totalPrice)}</span>
                  <span className={getStatusBadgeClass(order.status)}>{getStatusLabel(order.status)}</span>
                  {order.status === 'quoted' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'confirmed')} className="btn-secondary text-xs">Onayla</button>
                  )}
                  {order.status === 'confirmed' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'in_production')} className="btn-secondary text-xs">Üretime Al</button>
                  )}
                  {order.status === 'in_production' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'ready')} className="btn-secondary text-xs">Hazır İşaretle</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="btn-accent text-xs">Teslim Et</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </TopNavLayout>
  );
}
