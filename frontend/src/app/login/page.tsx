'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@notlaristi.com');
    setPassword('demo123456');
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2d1b4e 0%, #1a0f2e 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(183, 110, 121, 0.4) 0%, transparent 50%)' }}
        />
        <div className="max-w-md relative">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-2xl mb-8"
            style={{ background: 'linear-gradient(135deg, #b76e79, #d4959e)', color: '#2d1b4e' }}
          >
            S
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 leading-tight" style={{ color: '#faf7f2' }}>
            Atölyenizin dijital koku defteri
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#c4b5d4' }}>
            Formüller, hammaddeler ve müşteri tercihlerinizi güvenle yönetin. ScentPulse ile niche parfüm atölyenizi bir üst seviyeye taşıyın.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
        <div className="premium-card w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Giriş Yap</h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>ScentPulse hesabınıza giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(192, 57, 43, 0.1)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="ornek@atolye.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="En az 6 karakter"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            <button type="button" onClick={fillDemo} className="btn-secondary w-full text-sm">
              Demo Hesap Bilgilerini Doldur
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-medium" style={{ color: 'var(--accent)' }}>Kayıt Olun</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
