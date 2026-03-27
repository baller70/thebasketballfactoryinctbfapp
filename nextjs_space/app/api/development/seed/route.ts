import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const SKILL_CATEGORIES = [
  { name: 'Ball Handling', description: 'Dribbling and ball control', iconName: 'hand', sortOrder: 0 },
  { name: 'Shooting', description: 'Shooting technique and accuracy', iconName: 'target', sortOrder: 1 },
  { name: 'Finishing', description: 'Layups and close-range scoring', iconName: 'flame', sortOrder: 2 },
  { name: 'Defense', description: 'Defensive positioning and technique', iconName: 'shield', sortOrder: 3 },
  { name: 'Speed & Agility', description: 'Quickness and change of direction', iconName: 'zap', sortOrder: 4 },
  { name: 'Footwork', description: 'Foot placement and movement', iconName: 'footprints', sortOrder: 5 },
];

const DEFAULT_BADGES = [
  { name: 'First Steps', description: 'Complete your first submission', iconName: 'star', category: 'general', requirement: 'first_submission', sortOrder: 0 },
  { name: 'Season Starter', description: 'Profile created', iconName: 'star', category: 'general', requirement: 'profile_created', sortOrder: 1 },
  { name: 'Sharpshooter', description: 'Complete 10 shooting drills', iconName: 'target', category: 'shooting', requirement: '10_shooting_drills', sortOrder: 2 },
  { name: 'Lockdown', description: 'Complete 10 defense drills', iconName: 'shield', category: 'defense', requirement: '10_defense_drills', sortOrder: 3 },
  { name: 'Handle King', description: 'Complete 10 ball handling drills', iconName: 'hand', category: 'ball_handling', requirement: '10_ball_handling_drills', sortOrder: 4 },
  { name: 'Lightning Fast', description: 'Complete 10 speed drills', iconName: 'zap', category: 'speed', requirement: '10_speed_drills', sortOrder: 5 },
  { name: 'Iron Feet', description: 'Complete 10 footwork drills', iconName: 'footprints', category: 'footwork', requirement: '10_footwork_drills', sortOrder: 6 },
  { name: 'Finisher', description: 'Complete 10 finishing drills', iconName: 'flame', category: 'finishing', requirement: '10_finishing_drills', sortOrder: 7 },
  { name: 'Dedicated', description: '50 total submissions', iconName: 'star', category: 'general', requirement: '50_submissions', sortOrder: 8 },
  { name: 'Elite', description: '100 total submissions', iconName: 'star', category: 'general', requirement: '100_submissions', sortOrder: 9 },
];

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 });
    }

    let categoriesCreated = 0;
    let badgesCreated = 0;

    for (const cat of SKILL_CATEGORIES) {
      const existing = await prisma.skillCategory.findUnique({
        where: { name: cat.name },
      });
      if (!existing) {
        await prisma.skillCategory.create({
          data: {
            name: cat.name,
            description: cat.description,
            iconName: cat.iconName,
            sortOrder: cat.sortOrder,
          },
        });
        categoriesCreated++;
      }
    }

    for (const badge of DEFAULT_BADGES) {
      const existing = await prisma.devBadge.findFirst({
        where: { name: badge.name },
      });
      if (!existing) {
        await prisma.devBadge.create({
          data: {
            name: badge.name,
            description: badge.description,
            iconName: badge.iconName,
            category: badge.category,
            requirement: badge.requirement,
            sortOrder: badge.sortOrder,
          },
        });
        badgesCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed completed',
      categoriesCreated,
      badgesCreated,
    });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: 'Failed to run seed' },
      { status: 500 }
    );
  }
}
