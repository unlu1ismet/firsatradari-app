import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// VAPID Ayarları
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:hello@firsatradari.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Fiyat düştüğünde çağrılacak otomatik fonksiyon
export async function triggerPriceDropNotification(productTitle: string, currentPrice: number, productId: number) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany();

    if (subscriptions.length === 0) return;

    // Bildirime tıklanınca direkt o ürünün sayfasına gitsin
    const payload = JSON.stringify({
      title: '🎉 Hedef Fiyata Ulaştı!',
      body: `${productTitle} beklediğiniz fiyata (${currentPrice.toLocaleString('tr-TR')} ₺) düştü. Hemen inceleyin!`,
      url: `/urun/${productId}`
    });

    // Kayıtlı tüm abonelere bildirimi yolla
    const pushPromises = subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        },
        payload
      ).catch((err) => console.error("Cihaza bildirim gönderilemedi:", err))
    );

    await Promise.all(pushPromises);
    console.log("Otomatik bildirim başarıyla tetiklendi.");

  } catch (error) {
    console.error('Push bildirim hatası:', error);
  }
}