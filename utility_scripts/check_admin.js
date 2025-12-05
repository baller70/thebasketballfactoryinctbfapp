const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true, email: true, name: true, role: true }
    });
    console.log('Admin users:', JSON.stringify(admins, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();
