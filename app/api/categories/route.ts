export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    const categories = (products ?? []).map((p: any) => p?.category).filter(Boolean);
    return NextResponse.json({ categories });
  } catch (err: any) {
    console.error('Categories error:', err);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
