const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst({ where: { role: 'admin' } });
  console.log('Existing admin:', existing?.email || 'none');

  const cats = [
    { name: 'Ball Handling', description: 'Dribbling moves, crossovers, hesitations, and ball control drills', iconName: 'hand', sortOrder: 1 },
    { name: 'Shooting', description: 'Form shooting, catch-and-shoot, off-the-dribble, and range development', iconName: 'target', sortOrder: 2 },
    { name: 'Finishing', description: 'Layups, floaters, contact finishes, and moves around the rim', iconName: 'flame', sortOrder: 3 },
    { name: 'Defense', description: 'Defensive stance, closeouts, on-ball and help-side principles', iconName: 'shield', sortOrder: 4 },
    { name: 'Speed & Agility', description: 'Lateral quickness, first-step explosiveness, and conditioning', iconName: 'zap', sortOrder: 5 },
    { name: 'Footwork', description: 'Pivots, jab steps, triple-threat moves, and post footwork', iconName: 'footprints', sortOrder: 6 },
  ];
  for (const c of cats) {
    await prisma.skillCategory.upsert({ where: { name: c.name }, create: c, update: {} });
  }
  console.log('Skill categories seeded:', cats.length);

  const badges = [
    { name: 'First Steps', description: 'Completed your first skill assignment', iconName: 'footprints', category: 'milestone', requirement: '1 submission', sortOrder: 1 },
    { name: 'Season Starter', description: 'Joined the player development program', iconName: 'check', category: 'milestone', requirement: 'Profile created', sortOrder: 2 },
    { name: 'Sharpshooter', description: 'Completed 10 shooting drills', iconName: 'target', category: 'skill', requirement: '10 shooting submissions', sortOrder: 3 },
    { name: 'Lockdown', description: 'Completed 10 defense drills', iconName: 'shield', category: 'skill', requirement: '10 defense submissions', sortOrder: 4 },
    { name: 'Handle King', description: 'Completed 10 ball handling drills', iconName: 'hand', category: 'skill', requirement: '10 ball handling submissions', sortOrder: 5 },
    { name: 'Lightning Fast', description: 'Completed 10 speed & agility drills', iconName: 'zap', category: 'skill', requirement: '10 speed submissions', sortOrder: 6 },
    { name: 'Iron Feet', description: 'Completed 10 footwork drills', iconName: 'footprints', category: 'skill', requirement: '10 footwork submissions', sortOrder: 7 },
    { name: 'Finisher', description: 'Completed 10 finishing drills', iconName: 'flame', category: 'skill', requirement: '10 finishing submissions', sortOrder: 8 },
    { name: 'Dedicated', description: 'Completed 50 total submissions', iconName: 'award', category: 'milestone', requirement: '50 submissions', sortOrder: 9 },
    { name: 'Elite', description: 'Completed 100 total submissions', iconName: 'star', category: 'milestone', requirement: '100 submissions', sortOrder: 10 },
  ];

  for (const b of badges) {
    const ex = await prisma.devBadge.findFirst({ where: { name: b.name } });
    if (!ex) await prisma.devBadge.create({ data: b });
  }
  console.log('Badges seeded:', badges.length);

  const catCount = await prisma.skillCategory.count();
  const badgeCount = await prisma.devBadge.count();
  console.log('Total categories:', catCount, 'Total badges:', badgeCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
