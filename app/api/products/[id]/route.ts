export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        merchantPrices: { orderBy: { price: 'asc' } },
        priceHistory: { orderBy: { date: 'asc' } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    // Detect fake discount from price history
    const history = product?.priceHistory ?? [];
    let isFakeDiscount = false;
    if (history.length >= 30) {
      const oldPrices = history.slice(0, Math.floor(history.length * 0.5));
      const midPrices = history.slice(Math.floor(history.length * 0.5), Math.floor(history.length * 0.8));
      const avgOld = oldPrices.reduce((s: number, h: any) => s + (h?.price ?? 0), 0) / (oldPrices.length || 1);
      const avgMid = midPrices.reduce((s: number, h: any) => s + (h?.price ?? 0), 0) / (midPrices.length || 1);
      if (avgMid > avgOld * 1.15) {
        isFakeDiscount = true;
      }
    }

    const lowestInStock = (product?.merchantPrices ?? []).filter((mp: any) => mp?.stockStatus === 'in_stock')?.[0];
    const isAllTimeLow = lowestInStock && lowestInStock.price <= product.lowestHistoricalPrice * 1.02;

    return NextResponse.json({
      product: {
        ...product,
        isFakeDiscount,
        isAllTimeLow,
        priceHistory: (product?.priceHistory ?? []).map((ph: any) => ({
          date: ph?.date?.toISOString?.()?.split?.('T')?.[0] ?? '',
          price: ph?.price ?? 0,
        })),
      },
    });
  } catch (err: any) {
    console.error('Product detail error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
