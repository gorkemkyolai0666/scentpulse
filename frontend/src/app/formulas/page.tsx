'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TopNavLayout } from '@/components/top-nav-layout';
import { getConcentrationLabel } from '@/lib/utils';

interface Formula {
  id: string;
  name: string;
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
  concentration: string;
  description?: string;
  client?: { firstName: string; lastName: string };
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

export default function FormulasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', clientId: '', topNotes: '', middleNotes: '', baseNotes: '', concentration: 'edp', description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getFormulas(), api.getClients()])
      .then(([f, c]) => {
        setFormulas(f);
        setClients(c);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createFormula(form);
      setShowForm(false);
      setForm({ name: '', clientId: '', topNotes: '', middleNotes: '', baseNotes: '', concentration: 'edp', description: '' });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = formulas.filter((f) =>
    `${f.name} ${f.topNotes} ${f.middleNotes} ${f.baseNotes} ${f.client?.firstName || ''} ${f.client?.lastName || ''}`.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Formüller</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{formulas.length} kayıtlı formül</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent shrink-0">
          {showForm ? 'İptal' : 'Yeni Formül'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="premium-card p-6 mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Formül</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Formül adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <div>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="input-field" required>
                <option value="">Müşteri seçin</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <input type="text" placeholder="Üst notalar" value={form.topNotes} onChange={(e) => setForm({ ...form, topNotes: e.target.value })} className="input-field" />
            <input type="text" placeholder="Orta notalar" value={form.middleNotes} onChange={(e) => setForm({ ...form, middleNotes: e.target.value })} className="input-field" />
            <input type="text" placeholder="Alt notalar" value={form.baseNotes} onChange={(e) => setForm({ ...form, baseNotes: e.target.value })} className="input-field" />
            <select value={form.concentration} onChange={(e) => setForm({ ...form, concentration: e.target.value })} className="input-field">
              <option value="edt">EDT</option>
              <option value="edp">EDP</option>
              <option value="parfum">Parfum</option>
              <option value="extrait">Extrait</option>
            </select>
            <textarea placeholder="Açıklama" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field md:col-span-2 min-h-[80px]" />
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Formül ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Formül ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="premium-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen formül bulunamadı' : 'Henüz formül kaydı bulunmuyor'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((formula) => (
            <div key={formula.id} className="premium-card p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{formula.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {formula.client ? `${formula.client.firstName} ${formula.client.lastName}` : '—'}
                  </p>
                </div>
                <span className="badge-gold text-xs shrink-0">{getConcentrationLabel(formula.concentration)}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium shrink-0 w-16" style={{ color: 'var(--accent)' }}>Üst</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{formula.topNotes || '—'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium shrink-0 w-16" style={{ color: 'var(--accent)' }}>Orta</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{formula.middleNotes || '—'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium shrink-0 w-16" style={{ color: 'var(--accent)' }}>Alt</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{formula.baseNotes || '—'}</span>
                </div>
              </div>
              {formula.description && (
                <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  {formula.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </TopNavLayout>
  );
}
