import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? 'all';

    let assignmentIds: string[] | null = null;
    if (category !== 'all') {
      const assignments = await prisma.skillAssignment.findMany({
        where: { categoryId: category },
        select: { id: true },
      });
      assignmentIds = assignments.map((a) => a.id);
    }

    const pointsByPlayer = await prisma.playerPoints.groupBy({
      by: ['playerId'],
      _sum: { points: true },
      ...(assignmentIds !== null &&
        assignmentIds.length > 0 && {
          where: { sourceId: { in: assignmentIds } },
        }),
    });

    const playerIds = pointsByPlayer.map((p) => p.playerId);
    const profiles =
      playerIds.length > 0
        ? await prisma.playerProfile.findMany({
            where: { id: { in: playerIds } },
          })
        : [];

    const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));

    const leaderboard = pointsByPlayer
      .map((p) => ({
        playerId: p.playerId,
        points: p._sum.points ?? 0,
        profile: profileMap[p.playerId],
      }))
      .filter((p) => p.profile)
      .sort((a, b) => b.points - a.points)
      .map((p, index) => ({
        rank: index + 1,
        playerId: p.playerId,
        name:
          `${p.profile!.firstName ?? ''} ${p.profile!.lastName ?? ''}`.trim() ||
          p.profile!.email,
        points: p.points,
        profileImage: p.profile!.profileImage ?? null,
      }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
