export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const COMMISSION_RATES: Record<string, number> = {
  'Amazon': 0.04,
  'Trendyol': 0.035,
  'Hepsiburada': 0.03,
  'A101': 0.02,
  'BİM': 0.02,
  'Şok': 0.02,
};

export async function GET() {
  try {
    const clicks = await prisma.clickAnalytics.groupBy({
      by: ['merchantName'],
      _count: { id: true },
    });

    const stats = (clicks ?? []).map((c: any) => {
      const name = c?.merchantName ?? 'Bilinmiyor';
      const count = c?._count?.id ?? 0;
      const rate = COMMISSION_RATES[name] ?? 0.02;
      // Simulate average order value of 2500 TL
      const avgOrderValue = 2500;
      const conversionRate = 0.03;
      return {
        merchantName: name,
        clicks: count,
        estimatedCommission: Math.round(count * conversionRate * avgOrderValue * rate),
      };
    });

    stats.sort((a: any, b: any) => (b?.clicks ?? 0) - (a?.clicks ?? 0));

    return NextResponse.json({ stats });
  } catch (err: any) {
    console.error('Analytics error:', err);
    return NextResponse.json({ stats: [] }, { status: 500 });
  }
}
