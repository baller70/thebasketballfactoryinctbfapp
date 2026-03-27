import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { helpType, message } = body;

    if (!helpType || !message) {
      return NextResponse.json(
        { error: 'Help type and message required' },
        { status: 400 }
      );
    }

    // In production: save to DB via Prisma, notify coach
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Extra help API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}
