const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get the programs that were posted about
  const programs = await prisma.sEOPageConfig.findMany({
    where: {
      OR: [
        { pagePath: '/programs/high-school-fall-workouts' },
        { pagePath: '/programs/youth-skills-camp' }
      ]
    }
  });
  
  console.log('Program details:\n');
  programs.forEach(p => {
    console.log(`- ${p.pageTitle || p.pagePath}`);
    console.log(`  Path: ${p.pagePath}`);
    console.log(`  Status: ${p.status}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
