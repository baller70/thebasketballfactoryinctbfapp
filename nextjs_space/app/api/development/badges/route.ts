import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MOCK_BADGES = [
  { id: '1', name: 'First Steps', description: 'Complete your first assignment', earned: true, earnedAt: 'Feb 15' },
  { id: '2', name: 'Ball Handler', description: 'Complete 3 Ball Handling drills', earned: true, earnedAt: 'Feb 20' },
  { id: '3', name: 'Shooting Star', description: 'Complete 3 Shooting drills', earned: true, earnedAt: 'Mar 1' },
  { id: '4', name: 'Finisher', description: 'Complete 3 Finishing drills', earned: true, earnedAt: 'Feb 28' },
  { id: '5', name: 'Lockdown', description: 'Complete 3 Defense drills', earned: false },
  { id: '6', name: 'Speed Demon', description: 'Complete 3 Speed & Agility drills', earned: false },
  { id: '7', name: 'Footwork Master', description: 'Complete 3 Footwork drills', earned: false },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      badges: MOCK_BADGES,
      totalPoints: 850,
    });
  } catch (error) {
    console.error('Badges API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { claimTier } = body;

    if (!claimTier) {
      return NextResponse.json(
        { error: 'Tier name required' },
        { status: 400 }
      );
    }

    // In production: validate points, create claim record via Prisma
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Badges claim API error:', error);
    return NextResponse.json(
      { error: 'Failed to claim reward' },
      { status: 500 }
    );
  }
}
