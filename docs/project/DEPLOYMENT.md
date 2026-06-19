# ScentPulse — Dağıtım Kılavuzu

## Demo Hesap

- **E-posta:** demo@notlaristi.com
- **Şifre:** demo123456

## Ortam Değişkenleri

### Backend
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — https://scentpulse.vercel.app
- `PORT` — 8080 (Railway production)

### Frontend
- `NEXT_PUBLIC_API_URL` — https://scentpulse-backend-production.up.railway.app/api

## Demo URL'leri

- **Frontend:** https://scentpulse.vercel.app
- **Backend API:** https://scentpulse-backend-production.up.railway.app/api
- **Health Check:** https://scentpulse-backend-production.up.railway.app/api/health

## Bulut Canlı Önizleme Linki

- **Google IDX Import:** https://idx.google.com/import?url=https://github.com/gorkemkyolai0666/scentpulse

Son güncelleme: 2026-06-19 — Railway rate limit sonrası yeniden provision tetiklendi; güncel provision scriptleri ile sync.

## Yerel Geliştirme

```bash
# Backend
cd backend && npm install --legacy-peer-deps
npx prisma migrate deploy && npx prisma db seed
npm run start:prod

# Frontend
cd frontend && npm install && npm run dev
```

Portlar: Backend 4037, Frontend 3037
