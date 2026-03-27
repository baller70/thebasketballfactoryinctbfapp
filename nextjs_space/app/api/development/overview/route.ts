import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
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

    const [totalPointsResult, badgesCount, skillScores, recentPoints, pendingCount] =
      await Promise.all([
        prisma.playerPoints.aggregate({
          where: { playerId: playerProfile.id },
          _sum: { points: true },
        }),
        prisma.playerDevBadge.count({
          where: { playerId: playerProfile.id },
        }),
        prisma.skillScore.groupBy({
          by: ['categoryId'],
          where: { playerId: playerProfile.id },
          _avg: { score: true },
          _count: true,
        }),
        prisma.playerPoints.findMany({
          where: { playerId: playerProfile.id },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        prisma.skillAssignment.count({
          where: {
            submissions: {
              none: {
                playerId: playerProfile.id,
              },
            },
          },
        }),
      ]);

    const categoryIds = skillScores.map((s) => s.categoryId);
    const categories =
      categoryIds.length > 0
        ? await prisma.skillCategory.findMany({
            where: { id: { in: categoryIds } },
          })
        : [];

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.name])
    );

    const skillCategoryScores = Object.fromEntries(
      skillScores.map((s) => [
        categoryMap[s.categoryId] ?? s.categoryId,
        s._avg.score != null ? Math.round(s._avg.score * 10) : 0,
      ])
    );

    const totalPoints = totalPointsResult._sum.points ?? 0;

    const recentPointHistory = recentPoints.map((p) => ({
      id: p.id,
      action: p.action,
      points: p.points,
      details: p.details,
      createdAt: p.createdAt,
    }));

    const overview = {
      totalPoints,
      badgesEarned: badgesCount,
      skillCategoryScores,
      recentPointHistory,
      pendingAssignmentsCount: pendingCount,
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overview' },
      { status: 500 }
    );
  }
}
