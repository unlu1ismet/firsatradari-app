export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const reminders = await prisma.flyerReminder.findMany({
      where: { userId: 'demo-user' },
    });
    return NextResponse.json({ reminders });
  } catch (err: any) {
    console.error('Flyer reminder error:', err);
    return NextResponse.json({ reminders: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantName } = body ?? {};
    if (!merchantName) {
      return NextResponse.json({ error: 'Market adı gerekli' }, { status: 400 });
    }

    const reminder = await prisma.flyerReminder.upsert({
      where: {
        userId_merchantName: {
          userId: 'demo-user',
          merchantName,
        },
      },
      update: {},
      create: { userId: 'demo-user', merchantName },
    });

    return NextResponse.json({ reminder });
  } catch (err: any) {
    console.error('Create flyer reminder error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
