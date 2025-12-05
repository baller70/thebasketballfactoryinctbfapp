import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedJourneyTemplates() {
  console.log('Seeding email journey templates...')

  // Template 1: New Registration Onboarding (5 emails)
  const template1 = await prisma.journeyTemplate.create({
    data: {
      name: 'New Registration Email Journey',
      description: 'Automated email sequence to welcome and onboard new registrations',
      isDefault: true,
      totalSteps: 5,
      category: 'Registration',
      steps: {
        create: [
          {
            stepNumber: 1,
            title: 'Welcome Email',
            description: 'Initial welcome message with program overview',
            emailSubject: 'Welcome to Rise As One AAU! 🏀',
            emailBody: `
              <h2>Welcome to the Rise As One AAU Family!</h2>
              <p>Thank you for registering with us. We're thrilled to have you join our basketball program!</p>
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>You'll receive a confirmation email with your program details</li>
                <li>Our coaching staff will reach out within 3-5 business days</li>
                <li>Start preparing for an amazing basketball experience!</li>
              </ul>
              <p>If you have any questions, don't hesitate to reach out to us.</p>
              <p>Let's Rise As One!</p>
            `,
            delayDays: 0
          },
          {
            stepNumber: 2,
            title: 'Program Details',
            description: 'Detailed information about schedule, location, and requirements',
            emailSubject: 'Your Program Details & What to Bring',
            emailBody: `
              <h2>Get Ready for Your First Session!</h2>
              <p>Here's everything you need to know:</p>
              
              <h3>📍 Location</h3>
              <p>The Basketball Factory<br>123 Court Street, Your City</p>
              
              <h3>🕐 Schedule</h3>
              <p>Training sessions are held twice weekly. Your coach will provide specific times.</p>
              
              <h3>🎒 What to Bring</h3>
              <ul>
                <li>Basketball shoes (non-marking soles)</li>
                <li>Athletic wear</li>
                <li>Water bottle</li>
                <li>Positive attitude!</li>
              </ul>
              
              <p>We can't wait to see you on the court!</p>
            `,
            delayDays: 2
          },
          {
            stepNumber: 3,
            title: 'Coach Introduction',
            description: 'Introduce the coaching staff and development philosophy',
            emailSubject: 'Meet Your Coaching Team!',
            emailBody: `
              <h2>Your Coaching Team is Excited to Meet You!</h2>
              <p>At Rise As One AAU, we pride ourselves on having experienced, dedicated coaches who are passionate about player development.</p>
              
              <h3>Our Coaching Philosophy</h3>
              <ul>
                <li><strong>Fundamentals First:</strong> Building a strong foundation</li>
                <li><strong>Individual Attention:</strong> Personalized skill development</li>
                <li><strong>Team Unity:</strong> Learning to play together</li>
                <li><strong>Character Development:</strong> Building leaders on and off the court</li>
              </ul>
              
              <p>Your assigned coach will contact you directly to schedule your first assessment.</p>
              
              <p>Questions? Reply to this email anytime!</p>
            `,
            delayDays: 3
          },
          {
            stepNumber: 4,
            title: 'First Session Reminder',
            description: 'Reminder before first training session',
            emailSubject: 'Your First Session is Coming Up! 🏀',
            emailBody: `
              <h2>Get Ready to Hit the Court!</h2>
              <p>Your first training session is just around the corner, and we're excited to get started!</p>
              
              <h3>Quick Reminders:</h3>
              <ul>
                <li>✓ Arrive 10 minutes early for check-in</li>
                <li>✓ Bring your basketball gear and water</li>
                <li>✓ Parent/guardian information form (if not completed)</li>
                <li>✓ Any questions or concerns? Let us know!</li>
              </ul>
              
              <p><strong>Important:</strong> If you need to reschedule, please contact us at least 24 hours in advance.</p>
              
              <p>We're looking forward to training with you!</p>
            `,
            delayDays: 5
          },
          {
            stepNumber: 5,
            title: 'Follow-up & Feedback',
            description: 'Check in after first session and gather feedback',
            emailSubject: 'How Was Your First Session?',
            emailBody: `
              <h2>We Hope You Had a Great First Session!</h2>
              <p>Thank you for joining us! We hope you enjoyed your first training experience with Rise As One AAU.</p>
              
              <h3>We'd Love Your Feedback!</h3>
              <p>Your input helps us provide the best possible experience. Please take a moment to share:</p>
              <ul>
                <li>What did you enjoy most?</li>
                <li>Any concerns or questions?</li>
                <li>Suggestions for improvement?</li>
              </ul>
              
              <p><strong>Reply to this email</strong> with your feedback, or schedule a call with us anytime.</p>
              
              <h3>What's Next?</h3>
              <p>Your coach will continue to work with you on your personalized development plan. Check your email regularly for updates and announcements!</p>
              
              <p>Thank you for being part of our family!</p>
            `,
            delayDays: 7
          }
        ]
      }
    }
  })

  // Template 2: Payment Reminder Journey (3 emails)
  const template2 = await prisma.journeyTemplate.create({
    data: {
      name: 'Payment Reminder Journey',
      description: 'Gentle reminders for pending payments',
      isDefault: true,
      totalSteps: 3,
      category: 'Registration',
      steps: {
        create: [
          {
            stepNumber: 1,
            title: 'Payment Reminder',
            description: 'First reminder about pending payment',
            emailSubject: 'Complete Your Registration - Payment Pending',
            emailBody: `
              <h2>Complete Your Registration</h2>
              <p>We noticed your registration is almost complete! We just need your payment to finalize everything.</p>
              
              <h3>Payment Options:</h3>
              <ul>
                <li>Online payment through our secure portal</li>
                <li>Payment plans available</li>
                <li>Contact us for assistance</li>
              </ul>
              
              <p>Once payment is received, you'll get instant access to all program details and materials.</p>
              
              <p>Questions about payment? We're here to help!</p>
            `,
            delayDays: 0
          },
          {
            stepNumber: 2,
            title: 'Second Reminder',
            description: 'Follow-up reminder',
            emailSubject: 'Secure Your Spot - Payment Reminder',
            emailBody: `
              <h2>Don't Miss Out!</h2>
              <p>Spaces in our program are filling up fast, and we'd hate for you to miss out.</p>
              
              <p><strong>Your spot is reserved for 7 more days</strong></p>
              
              <p>Complete your payment now to:</p>
              <ul>
                <li>✓ Secure your spot</li>
                <li>✓ Get full program access</li>
                <li>✓ Start your basketball journey!</li>
              </ul>
              
              <p>Need help? Reply to this email or call us directly.</p>
            `,
            delayDays: 3
          },
          {
            stepNumber: 3,
            title: 'Final Notice',
            description: 'Last reminder before spot release',
            emailSubject: 'Final Reminder - Registration Expires Soon',
            emailBody: `
              <h2>Last Chance to Secure Your Spot!</h2>
              <p>This is a friendly final reminder that your registration will expire in 2 days.</p>
              
              <p>We understand that circumstances change. If you have any questions or concerns about payment, please reach out – we're always happy to work with you.</p>
              
              <p><strong>To complete your registration:</strong></p>
              <p>Simply reply to this email or visit our payment portal.</p>
              
              <p>We hope to see you on the court soon!</p>
            `,
            delayDays: 4
          }
        ]
      }
    }
  })

  // Template 3: Re-engagement Journey (4 emails)
  const template3 = await prisma.journeyTemplate.create({
    data: {
      name: 'Re-engagement Journey',
      description: 'Re-engage inactive or returning players',
      isDefault: true,
      totalSteps: 4,
      category: 'Training',
      steps: {
        create: [
          {
            stepNumber: 1,
            title: 'We Miss You!',
            description: 'Reach out to inactive players',
            emailSubject: 'We Miss You on the Court! 🏀',
            emailBody: `
              <h2>Come Back and Play!</h2>
              <p>We noticed you haven't been to practice in a while, and we wanted to reach out.</p>
              
              <p>Your spot is still here, and the team would love to see you back on the court!</p>
              
              <h3>What We've Been Up To:</h3>
              <ul>
                <li>New training drills and techniques</li>
                <li>Exciting upcoming games and tournaments</li>
                <li>Team building activities</li>
              </ul>
              
              <p>Life gets busy – we get it. If you need to adjust your schedule or have any concerns, let's talk!</p>
            `,
            delayDays: 0
          },
          {
            stepNumber: 2,
            title: 'Special Offer',
            description: 'Incentive to return',
            emailSubject: 'Special Comeback Offer Just for You',
            emailBody: `
              <h2>Welcome Back Bonus!</h2>
              <p>We want to make it easy for you to rejoin the action.</p>
              
              <h3>Your Comeback Package Includes:</h3>
              <ul>
                <li>1 Free private coaching session</li>
                <li>Updated training plan</li>
                <li>Flexible scheduling options</li>
                <li>Team welcome back event</li>
              </ul>
              
              <p><strong>This offer expires in 14 days</strong></p>
              
              <p>Ready to return? Reply to this email or give us a call!</p>
            `,
            delayDays: 5
          },
          {
            stepNumber: 3,
            title: 'Success Stories',
            description: 'Share recent team achievements',
            emailSubject: 'See What You\'re Missing!',
            emailBody: `
              <h2>Amazing Things Are Happening!</h2>
              <p>Your teammates have been crushing it, and we know you'd love to be part of it.</p>
              
              <h3>Recent Highlights:</h3>
              <ul>
                <li>🏆 Tournament championship win</li>
                <li>📈 Players advancing to higher skill levels</li>
                <li>🎯 New training equipment and facilities</li>
                <li>🌟 College recruitment opportunities</li>
              </ul>
              
              <p>There's never been a better time to return!</p>
              
              <p>Let's get you back in the game!</p>
            `,
            delayDays: 7
          },
          {
            stepNumber: 4,
            title: 'Final Check-in',
            description: 'Last touch point before closing',
            emailSubject: 'One Last Time - We Hope to See You Again',
            emailBody: `
              <h2>We Hope You're Doing Well</h2>
              <p>This is our final message, and we wanted to say thank you for being part of our program.</p>
              
              <p>If basketball isn't in the cards right now, we completely understand. But know that our door is always open if you ever want to return.</p>
              
              <p><strong>Remember:</strong></p>
              <ul>
                <li>You're always welcome back</li>
                <li>No pressure, no judgment</li>
                <li>Your progress is saved</li>
                <li>We're here when you're ready</li>
              </ul>
              
              <p>Wishing you all the best, and remember – once part of Rise As One, always part of the family!</p>
            `,
            delayDays: 7
          }
        ]
      }
    }
  })

  console.log('✓ Created 3 default email journey templates')
  console.log(`  - ${template1.name} (${template1.totalSteps} emails)`)
  console.log(`  - ${template2.name} (${template2.totalSteps} emails)`)
  console.log(`  - ${template3.name} (${template3.totalSteps} emails)`)
}

async function main() {
  try {
    await seedJourneyTemplates()
    console.log('\n✓ Journey templates seeded successfully!')
  } catch (error) {
    console.error('Error seeding journey templates:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
