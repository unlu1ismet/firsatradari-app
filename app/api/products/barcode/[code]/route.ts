export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const product = await prisma.product.findUnique({
      where: { barcode: code },
      include: {
        merchantPrices: { orderBy: { price: 'asc' } },
      },
    });

    if (!product) {
      return NextResponse.json({ found: false, product: null });
    }

    return NextResponse.json({ found: true, product });
  } catch (err: any) {
    console.error('Barcode lookup error:', err);
    return NextResponse.json({ found: false, error: 'Server error' }, { status: 500 });
  }
}
