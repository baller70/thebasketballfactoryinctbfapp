require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBookings() {
  try {
    // Check if Booking table exists
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
    
    console.log('Total bookings:', bookings.length);
    console.log('\nRecent bookings:');
    bookings.forEach((booking, i) => {
      console.log(`\n${i + 1}. Booking ID: ${booking.id}`);
      console.log(`   Parent Name: ${booking.parentName}`);
      console.log(`   Parent Email: ${booking.parentEmail}`);
      console.log(`   Athlete Name: ${booking.athleteName}`);
      console.log(`   Total Amount: $${booking.totalAmount}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Created: ${booking.createdAt}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings();
