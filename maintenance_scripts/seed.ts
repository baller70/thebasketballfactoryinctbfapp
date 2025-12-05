
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create default admin user (test account)
  const adminPassword = await bcrypt.hash('johndoe123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: adminPassword,
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin'
    }
  })

  console.log('Created admin user:', admin.email)

  // Create some sample tryout registrations
  await prisma.tryoutRegistration.createMany({
    data: [
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.j@email.com',
        phone: '555-0123',
        age: 16,
        position: 'Point Guard',
        experience: 'High School Varsity',
        parentName: 'Sarah Johnson',
        parentPhone: '555-0124',
        parentEmail: 'sarah.j@email.com',
        ageDivision: 'High School',
        tryoutDate: new Date('2024-03-15T14:00:00Z'),
        status: 'approved'
      },
      {
        firstName: 'Ashley',
        lastName: 'Williams',
        email: 'ashley.w@email.com',
        phone: '555-0125',
        age: 14,
        position: 'Shooting Guard',
        experience: 'Middle School',
        parentName: 'David Williams',
        parentPhone: '555-0126',
        parentEmail: 'david.w@email.com',
        ageDivision: 'Middle School',
        tryoutDate: new Date('2024-03-20T15:00:00Z'),
        status: 'pending'
      }
    ]
  })

  console.log('Created sample tryout registrations')

  // Create sample contact form submissions
  await prisma.contactForm.createMany({
    data: [
      {
        name: 'Lisa Chen',
        email: 'lisa.chen@email.com',
        subject: 'Training Schedule',
        message: 'I would like to know more about your training schedule for elementary age players.',
        formType: 'general',
        status: 'new'
      },
      {
        name: 'Robert Martinez',
        email: 'r.martinez@email.com',
        subject: 'Training Opportunities',
        message: 'I am interested in training opportunities with The Basketball Factory. I have 10 years of training experience.',
        formType: 'training',
        status: 'new'
      }
    ]
  })

  console.log('Created sample contact forms')
  console.log('Seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
