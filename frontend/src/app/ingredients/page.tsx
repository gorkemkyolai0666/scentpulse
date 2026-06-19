'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { TopNavLayout } from '@/components/top-nav-layout';
import { getIngredientCategoryLabel } from '@/lib/utils';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  stockMl: number;
  unitCost?: number;
  supplier?: string;
}

export default function IngredientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', category: 'essential_oil', stockMl: '', supplier: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadIngredients = () => {
    setLoading(true);
    api.getIngredients()
      .then(setIngredients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) loadIngredients(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createIngredient({
        name: form.name,
        category: form.category,
        stockMl: parseFloat(form.stockMl) || 0,
        supplier: form.supplier || undefined,
      });
      setShowForm(false);
      setForm({ name: '', category: 'essential_oil', stockMl: '', supplier: '' });
      loadIngredients();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hammaddeyi silmek istediğinize emin misiniz?')) return;
    setError('');
    try {
      await api.deleteIngredient(id);
      loadIngredients();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    }
  };

  const filtered = ingredients.filter((i) =>
    `${i.name} ${getIngredientCategoryLabel(i.category)} ${i.supplier || ''}`.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Hammaddeler</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{ingredients.length} kayıtlı hammadde</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-accent shrink-0">
          {showForm ? 'İptal' : 'Yeni Hammadde'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg mb-4 text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="premium-card p-6 mb-6">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Yeni Hammadde</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Hammadde adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              <option value="essential_oil">Esansiyel Yağ</option>
              <option value="absolute">Absolü</option>
              <option value="synthetic">Sentetik</option>
              <option value="alcohol">Alkol</option>
              <option value="fixative">Fiksativ</option>
              <option value="other">Diğer</option>
            </select>
            <input type="number" step="0.1" min="0" placeholder="Stok (ml)" value={form.stockMl} onChange={(e) => setForm({ ...form, stockMl: e.target.value })} className="input-field" required />
            <input type="text" placeholder="Tedarikçi" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="input-field" />
            <div className="md:col-span-2"><button type="submit" className="btn-primary">Kaydet</button></div>
          </form>
        </div>
      )}

      <input
        type="search"
        placeholder="Hammadde ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field mb-4 max-w-md"
        aria-label="Hammadde ara"
      />

      {loading ? (
        <div className="animate-pulse py-12 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="premium-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>
          {search ? 'Aramanızla eşleşen hammadde bulunamadı' : 'Henüz hammadde kaydı bulunmuyor'}
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Ad</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell" style={{ color: 'var(--text-muted)' }}>Kategori</th>
                  <th className="text-left p-4 font-medium" style={{ color: 'var(--text-muted)' }}>Stok (ml)</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>Tedarikçi</th>
                  <th className="text-right p-4 font-medium" style={{ color: 'var(--text-muted)' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ing) => (
                  <tr key={ing.id} className="border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{ing.name}</td>
                    <td className="p-4 hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{getIngredientCategoryLabel(ing.category)}</td>
                    <td className="p-4">
                      <span className={ing.stockMl < 100 ? 'badge-danger' : 'badge-success'}>
                        {ing.stockMl} ml
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell" style={{ color: 'var(--text-muted)' }}>{ing.supplier || '—'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(ing.id)} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--danger)' }}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </TopNavLayout>
  );
}
