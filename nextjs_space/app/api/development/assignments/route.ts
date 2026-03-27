import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const SUBMISSION_POINTS = 15;

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

    const assignments = await prisma.skillAssignment.findMany({
      include: {
        category: true,
        submissions: {
          where: { playerId: playerProfile.id },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { categoryId: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    const grouped = assignments.reduce<
      Record<
        string,
        {
          category: { id: string; name: string; iconName: string | null };
          assignments: Array<
            (typeof assignments)[0] & {
              mySubmission: (typeof assignments)[0]['submissions'][0] | null;
            }
          >;
        }
      >
    >((acc, a) => {
      const key = a.categoryId;
      if (!acc[key]) {
        acc[key] = { category: a.category, assignments: [] };
      }
      acc[key].assignments.push({
        ...a,
        submissions: undefined,
        mySubmission: a.submissions[0] ?? null,
      } as any);
      return acc;
    }, {});

    const result = Object.values(grouped).map((g) => ({
      category: g.category,
      assignments: g.assignments.map(({ submissions: _, ...a }) => ({
        ...a,
        mySubmission: a.mySubmission,
      })),
    }));

    return NextResponse.json({ assignments: result });
  } catch (error) {
    console.error('Assignments GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

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
    const { assignmentId, videoUrl, notes } = body;

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'assignmentId is required' },
        { status: 400 }
      );
    }

    const assignment = await prisma.skillAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const [submission] = await prisma.$transaction([
      prisma.skillSubmission.create({
        data: {
          assignmentId,
          playerId: playerProfile.id,
          videoUrl: videoUrl ?? null,
          notes: notes ?? null,
          status: 'submitted',
        },
      }),
      prisma.playerPoints.create({
        data: {
          playerId: playerProfile.id,
          action: 'submission',
          points: SUBMISSION_POINTS,
          details: `Submitted: ${assignment.title}`,
          sourceId: assignmentId,
        },
      }),
    ]);

    return NextResponse.json({
      submission: {
        id: submission.id,
        assignmentId: submission.assignmentId,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
      pointsAwarded: SUBMISSION_POINTS,
    });
  } catch (error) {
    console.error('Assignments POST error:', error);
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    );
  }
}
