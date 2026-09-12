export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const merchant = url.searchParams.get('merchant') ?? '';

    const where: any = { isFlyerDeal: true };
    if (merchant) {
      where.merchantName = merchant;
    }

    const deals = await prisma.merchantPrice.findMany({
      where,
      include: {
        product: {
          include: {
            merchantPrices: {
              where: {
                isFlyerDeal: false,
                stockStatus: 'in_stock',
              },
              orderBy: { price: 'asc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { flyerDate: 'desc' },
    });

    const enriched = (deals ?? []).map((d: any) => {
      const bestOnlinePrice = d?.product?.merchantPrices?.[0]?.price ?? null;
      return {
        id: d.id,
        merchantName: d.merchantName,
        flyerPrice: d.price,
        originalPrice: d.originalPrice,
        flyerDate: d.flyerDate,
        product: {
          id: d?.product?.id,
          title: d?.product?.title,
          brand: d?.product?.brand,
          imageUrl: d?.product?.imageUrl,
          category: d?.product?.category,
        },
        bestOnlinePrice,
        isMarketCheaper: bestOnlinePrice != null ? d.price < bestOnlinePrice : true,
      };
    });

    return NextResponse.json({ deals: enriched });
  } catch (err: any) {
    console.error('Flyer deals error:', err);
    return NextResponse.json({ deals: [] }, { status: 500 });
  }
}
