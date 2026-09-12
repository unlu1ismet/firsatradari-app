export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') ?? '';
    const sort = url.searchParams.get('sort') ?? 'discount';
    const category = url.searchParams.get('category') ?? '';

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        merchantPrices: {
          where: { stockStatus: 'in_stock' },
          orderBy: { price: 'asc' },
        },
      },
    });

    const enriched = products.map((p: any) => {
      const prices = p?.merchantPrices ?? [];
      const lowest = prices?.[0];
      const highestOriginal = prices.reduce((max: number, mp: any) => {
        return (mp?.originalPrice ?? 0) > max ? mp.originalPrice : max;
      }, 0);

      // Check price history for fake discount / all-time low
      return {
        id: p.id,
        barcode: p.barcode,
        title: p.title,
        brand: p.brand,
        category: p.category,
        imageUrl: p.imageUrl,
        lowestPrice: lowest?.price ?? null,
        originalPrice: highestOriginal > 0 ? highestOriginal : null,
        lowestHistoricalPrice: p.lowestHistoricalPrice,
        merchantCount: prices?.length ?? 0,
        isFakeDiscount: false,
        isAllTimeLow: lowest?.price != null && lowest.price <= p.lowestHistoricalPrice * 1.02,
      };
    });

    // Sort
    if (sort === 'price') {
      enriched.sort((a: any, b: any) => (a?.lowestPrice ?? Infinity) - (b?.lowestPrice ?? Infinity));
    } else if (sort === 'discount') {
      enriched.sort((a: any, b: any) => {
        const dA = a?.originalPrice && a?.lowestPrice ? (1 - a.lowestPrice / a.originalPrice) : 0;
        const dB = b?.originalPrice && b?.lowestPrice ? (1 - b.lowestPrice / b.originalPrice) : 0;
        return dB - dA;
      });
    } else if (sort === 'allTimelow') {
      enriched.sort((a: any, b: any) => (b?.isAllTimeLow ? 1 : 0) - (a?.isAllTimeLow ? 1 : 0));
    }

    return NextResponse.json({ products: enriched });
  } catch (err: any) {
    console.error('Products API error:', err);
    return NextResponse.json({ products: [], error: 'Server error' }, { status: 500 });
  }
}
