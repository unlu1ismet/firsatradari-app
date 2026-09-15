import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    // Veritabanına abonelik bilgilerini ekle veya varsa güncelle
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
      create: {
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
        userId: "demo-user", // Şimdilik demo kullanıcı için
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Abonelik kayıt hatası:', error);
    return NextResponse.json({ error: 'Abonelik kaydedilemedi' }, { status: 500 });
  }
}