const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('tbfadmin2026', 10);
  const parentHash = await bcrypt.hash('tbfparent2026', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@thebasketballfactoryinc.com' },
    create: { email: 'admin@thebasketballfactoryinc.com', password: adminHash, name: 'Coach Kevin', role: 'admin' },
    update: {},
  });
  console.log('Admin user:', admin.email, admin.id);

  const parent = await prisma.user.upsert({
    where: { email: 'parent@test.com' },
    create: { email: 'parent@test.com', password: parentHash, name: 'Test Parent', role: 'user' },
    update: {},
  });
  console.log('Parent user:', parent.email, parent.id);

  const profile = await prisma.playerProfile.upsert({
    where: { email: 'player@test.com' },
    create: {
      userId: parent.id,
      firstName: 'Demo',
      lastName: 'Player',
      email: 'player@test.com',
      dateOfBirth: new Date('2012-06-15'),
      age: 13,
      grade: '8th',
      position: 'Guard',
      skillLevel: 'intermediate',
      parentName: 'Test Parent',
      parentEmail: 'parent@test.com',
    },
    update: {},
  });
  console.log('Player profile:', profile.firstName, profile.lastName, profile.id);

  // Award Season Starter badge
  const badge = await prisma.devBadge.findFirst({ where: { name: 'Season Starter' } });
  if (badge) {
    await prisma.playerDevBadge.upsert({
      where: { playerId_badgeId: { playerId: profile.id, badgeId: badge.id } },
      create: { playerId: profile.id, badgeId: badge.id },
      update: {},
    });
    console.log('Season Starter badge awarded');
  }

  // Add some demo points
  await prisma.playerPoints.create({ data: { playerId: profile.id, action: 'profile_created', points: 25, details: 'Joined the development program' } });
  await prisma.playerPoints.create({ data: { playerId: profile.id, action: 'badge_earned', points: 25, details: 'Earned Season Starter badge' } });
  console.log('Demo points added');
}

main().catch(console.error).finally(() => prisma.$disconnect());
