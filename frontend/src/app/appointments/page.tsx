'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TopNavLayout } from '@/components/top-nav-layout';
import { formatDateTime, getStatusBadgeClass, getStatusLabel, getAppointmentTypeLabel } from '@/lib/utils';

interface Appointment {
  id: string;
  date: string;
  type: string;
  status: string;
  notes?: string;
  client?: { firstName: string; lastName: string };
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', type: 'consultation', clientId: '', notes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getAppointments(), api.getClients()])
      .then(([appts, custs]) => {
        setAppointments(appts);
        setClients(custs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createAppointment({ ...form, date: new Date(form.date).toISOString() });
      setShowForm(false);
      setForm({ date: '', type: 'consultation', clientId: '', notes: '' });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteAppointment(id);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setError('');
    try {
      await api.updateAppointment(id, { status });
      loadData();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Randevular</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{appointments.length} randevu</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent shrink-0">
          {showForm ? 'İptal' : 'Yeni Randevu'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="premium-card p-6 mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Randevu</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Müşteri</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="input-field" required>
                <option value="">Seçin</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Tür</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="consultation">Koku Danışmanlığı</option>
                <option value="blending">Karışım Atölyesi</option>
                <option value="pickup">Teslim</option>
                <option value="follow_up">Takip</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Tarih & Saat</label>
              <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Not</label>
              <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : appointments.length === 0 ? (
        <div className="premium-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          Henüz randevu kaydı bulunmuyor
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="premium-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {appt.client?.firstName} {appt.client?.lastName}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {getAppointmentTypeLabel(appt.type)} — {formatDateTime(appt.date)}
                </div>
                {appt.notes && (
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{appt.notes}</div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={getStatusBadgeClass(appt.status)}>{getStatusLabel(appt.status)}</span>
                {appt.status === 'scheduled' && (
                  <button onClick={() => handleStatusUpdate(appt.id, 'confirmed')} className="btn-secondary text-xs">Onayla</button>
                )}
                {appt.status === 'confirmed' && (
                  <button onClick={() => handleStatusUpdate(appt.id, 'completed')} className="btn-secondary text-xs">Tamamla</button>
                )}
                <button onClick={() => handleDelete(appt.id)} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--danger)' }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </TopNavLayout>
  );
}
