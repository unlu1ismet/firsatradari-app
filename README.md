# FırsatRadarı 🔍💰

Türkiye'nin en popüler e-ticaret platformları ve zincir marketler arasında fiyat karşılaştırma ve barkod tarama uygulaması.

## Özellikler

- 📷 **Barkod Tarayıcı** — Kamera ile canlı EAN-13 barkod tarama + manuel giriş
- 🏠 **Keşfet** — Trend indirimler, kategori filtreleme, anlık arama
- 🛒 **Aktüel Radar** — A101, BİM, Şok haftalık katalog fırsatları
- 🔔 **Fiyat Takibi** — Hedef fiyat alarmları, 30/60 günlük fiyat grafikleri
- 💸 **Sahte İndirim Tespiti** — Fiyat geçmişi analizi ile gerçek indirimleri ayırt edin
- 🔗 **Affiliate Altyapısı** — Amazon TR, Trendyol, Hepsiburada, A101 için otomatik affiliate link üretimi

## Desteklenen Platformlar

| Platform | Tür |
|----------|-----|
| Amazon TR | E-ticaret |
| Trendyol | E-ticaret |
| Hepsiburada | E-ticaret |
| A101 | Zincir Market |
| BİM | Zincir Market |
| Şok | Zincir Market |

## Teknolojiler

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- Recharts
- html5-qrcode

## Kurulum

```bash
yarn install
yarn prisma generate
yarn prisma db push
yarn prisma db seed
yarn dev
```

## Lisans

MIT
