import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const TIERS: Record<string, number> = {
  't-shirt': 500,
  'long-sleeve': 1250,
  hoodie: 2000,
  backpack: 2750,
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const playerProfile = await prisma.playerProfile.findFirst({
      where: { userId: session.user.id },
    });

    if (!playerProfile) {
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { rewardTier, brandChoice } = body;

    if (!rewardTier || !(rewardTier in TIERS)) {
      return NextResponse.json(
        { error: 'Invalid reward tier. Must be one of: t-shirt, long-sleeve, hoodie, backpack' },
        { status: 400 }
      );
    }

    const pointsRequired = TIERS[rewardTier];

    const totalPointsResult = await prisma.playerPoints.aggregate({
      where: { playerId: playerProfile.id },
      _sum: { points: true },
    });

    const totalPoints = totalPointsResult._sum.points ?? 0;

    if (totalPoints < pointsRequired) {
      return NextResponse.json(
        {
          error: `Insufficient points. You have ${totalPoints}, need ${pointsRequired} for ${rewardTier}.`,
        },
        { status: 400 }
      );
    }

    const existing = await prisma.playerReward.findUnique({
      where: {
        playerId_rewardTier: {
          playerId: playerProfile.id,
          rewardTier,
        },
      },
    });

    if (existing?.claimedAt) {
      return NextResponse.json(
        { error: 'Reward already claimed' },
        { status: 400 }
      );
    }

    const reward = await prisma.playerReward.upsert({
      where: {
        playerId_rewardTier: {
          playerId: playerProfile.id,
          rewardTier,
        },
      },
      create: {
        playerId: playerProfile.id,
        rewardTier,
        brandChoice: brandChoice ?? null,
        claimedAt: new Date(),
      },
      update: {
        brandChoice: brandChoice ?? undefined,
        claimedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      reward: {
        id: reward.id,
        rewardTier: reward.rewardTier,
        brandChoice: reward.brandChoice,
        claimedAt: reward.claimedAt,
      },
    });
  } catch (error) {
    console.error('Badges claim API error:', error);
    return NextResponse.json(
      { error: 'Failed to claim reward' },
      { status: 500 }
    );
  }
}
