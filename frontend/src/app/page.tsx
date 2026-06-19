'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ background: 'rgba(250, 247, 242, 0.85)', borderColor: 'var(--border-color)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #b76e79, #d4959e)', color: '#2d1b4e' }}
            >
              S
            </div>
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--brand)' }}>
              ScentPulse
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm hidden sm:inline-flex">Giriş Yap</Link>
            <Link href="/register" className="btn-accent text-sm">Kayıt Ol</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at 70% 20%, rgba(183, 110, 121, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(45, 27, 78, 0.15) 0%, transparent 50%)',
            }}
          />
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
            <div className="max-w-2xl">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-6 font-medium"
                style={{ color: 'var(--accent)' }}
              >
                Niche Parfüm Atölyesi SaaS
              </p>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-8" style={{ color: 'var(--brand)' }}>
                Her damla,<br />
                <span style={{ color: 'var(--accent)' }}>bir hikâye</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--text-muted)' }}>
                Müşteri koku tercihlerinden formül notalarına, hammadde stoğundan randevu planına — atölyenizin tüm ritmini tek platformda yönetin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-accent px-8 py-3 text-base">Atölyeni Aç</Link>
                <Link href="/login" className="btn-secondary px-8 py-3 text-base">Demo Hesap</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  num: '01',
                  title: 'Formül Arşivi',
                  desc: 'Üst, orta ve alt notaları kaydedin. Her müşteriye özel koku imzasını koruyun.',
                },
                {
                  num: '02',
                  title: 'Hammadde Stoku',
                  desc: 'Esansiyel yağ, absolü ve fiksativ envanterinizi ml bazında takip edin.',
                },
                {
                  num: '03',
                  title: 'Atölye Randevuları',
                  desc: 'Koku danışmanlığı, karışım seansları ve teslim randevularını planlayın.',
                },
              ].map((item) => (
                <article key={item.num} className="group">
                  <span
                    className="font-display text-4xl font-bold block mb-4 transition-colors"
                    style={{ color: 'var(--border-color)' }}
                  >
                    {item.num}
                  </span>
                  <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--brand)' }}>
                    {item.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20">
          <div
            className="rounded-2xl p-10 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #2d1b4e 0%, #4a3568 100%)' }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#faf7f2' }}>
              Atölyenizi dijitalleştirmeye hazır mısınız?
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: '#c4b5d4' }}>
              Ücretsiz kayıt olun ve parfüm atölyenizi dakikalar içinde yönetmeye başlayın.
            </p>
            <Link href="/register" className="btn-accent inline-block px-10 py-3">
              Hemen Başlayın
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
        ScentPulse &copy; 2026 — Niche parfüm atölyesi yönetim platformu
      </footer>
    </div>
  );
}
