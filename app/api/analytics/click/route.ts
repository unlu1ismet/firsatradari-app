export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantName, productId } = body ?? {};

    if (!merchantName || !productId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.clickAnalytics.create({
      data: { merchantName, productId },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Click track error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
