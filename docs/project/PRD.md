# ScentPulse — Ürün Gereksinim Dokümanı

## Vizyon

ScentPulse, Türkiye'deki niş parfüm atölyeleri ve koku formülasyon stüdyoları için geliştirilmiş dijital yönetim platformudur. Müşteri profillerini, koku formüllerini, hammadde envanterini, üretim siparişlerini ve konsültasyon randevularını tek bir yerden yönetmelerini sağlar.

## Hedef Kitle

- Bağımsız parfüm atölyeleri
- Niş koku markaları
- Parfümörler ve koku tasarımcıları
- Butik parfüm mağazaları

## Sektör

Niş parfüm / koku formülasyon

## Tasarım Yönü

**Premium / Editorial Luxury**
- Renk paleti: Deep Purple (#2D1B4E), Rose Gold (#B76E79), Cream (#FAF7F2)
- Tipografi: Cormorant Garamond (display) + Inter (body)
- Üst navigasyon, editorial kartlar, lüks boşluk kullanımı
- Koyu/Açık mod desteği

## Temel Özellikler (MVP)

### 1. Müşteri Yönetimi
- Müşteri kayıt (ad, telefon, e-posta, koku tercihleri)
- Müşteri arama ve filtreleme

### 2. Formül Yönetimi
- Koku formülleri (üst/orta/alt notalar, konsantrasyon)
- Müşteriye özel formül kayıtları

### 3. Hammadde Envanteri
- Esans, absolü, alkol stok takibi
- Düşük stok uyarıları

### 4. Sipariş Yönetimi
- Parfüm sipariş takibi (hacim, konsantrasyon)
- Durum yönetimi (teklif, onay, üretim, hazır, teslim)

### 5. Randevu Yönetimi
- Konsültasyon, karışım, teslim randevuları

### 6. Dashboard
- Toplam müşteri, bugünkü randevu, bekleyen sipariş, düşük stok

## Teknik Stack

- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Auth:** JWT tabanlı kimlik doğrulama
- **Deploy:** Railway (backend + DB), Vercel (frontend)

## İş Modeli

B2B SaaS — atölye bazında aylık abonelik

## Portlar

- Backend: 4037
- Frontend: 3037
