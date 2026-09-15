export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { triggerPriceDropNotification } from '@/lib/notification';

export async function GET() {
  try {
    const items = await prisma.trackedItem.findMany({
      where: { userId: 'demo-user' },
      include: {
        product: {
          include: {
            merchantPrices: {
              where: { stockStatus: 'in_stock' },
              orderBy: { price: 'asc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = items.map((item: any) => {
      const currentPrice = item?.product?.merchantPrices?.[0]?.price ?? null;
      return {
        id: item.id,
        productId: item.productId,
        targetPrice: item.targetPrice,
        status: currentPrice != null && currentPrice <= item.targetPrice ? 'reached' : item.status,
        createdAt: item.createdAt,
        product: {
          id: item?.product?.id,
          title: item?.product?.title,
          brand: item?.product?.brand,
          imageUrl: item?.product?.imageUrl,
        },
        currentPrice,
      };
    });

    return NextResponse.json({ items: enriched });
  } catch (err: any) {
    console.error('Tracked items error:', err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, targetPrice, productUrl } = body ?? {};

    // URL'den ürün bulma simülasyonu
    let resolvedProductId = productId;
    if (!resolvedProductId && productUrl) {
      const product = await prisma.product.findFirst();
      resolvedProductId = product?.id;
    }

    if (!resolvedProductId) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 400 });
    }

    // 1. Ürünü takibe ekle
    const item = await prisma.trackedItem.create({
      data: {
        userId: 'demo-user',
        productId: resolvedProductId,
        targetPrice: targetPrice ?? 0,
        status: 'active',
      },
    });

    // 2. Anında bildirim kontrolü için ürünün detaylarını ve en ucuz fiyatını çek
    const productDetails = await prisma.product.findUnique({
      where: { id: resolvedProductId },
      include: {
        merchantPrices: {
          where: { stockStatus: 'in_stock' },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
    });

    const currentPrice = productDetails?.merchantPrices?.[0]?.price;
    const target = targetPrice ?? 0;

    // 3. Eğer güncel fiyat, kullanıcının hedef fiyatına ulaştıysa veya daha altındaysa:
    if (currentPrice != null && currentPrice <= target && productDetails) {

      // Veritabanında durumunu hemen "ulaşıldı" (reached) olarak güncelle
      await prisma.trackedItem.update({
        where: { id: item.id },
        data: { status: 'reached' }
      });

      // İşletim sistemi (Push) bildirimini anında ateşle!
      await triggerPriceDropNotification(
        productDetails.title,
        currentPrice,
        resolvedProductId
      );
    }

    return NextResponse.json({ item });
  } catch (err: any) {
    console.error('Create tracked item error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') ?? '', 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 });
    }
    await prisma.trackedItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete tracked item error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}