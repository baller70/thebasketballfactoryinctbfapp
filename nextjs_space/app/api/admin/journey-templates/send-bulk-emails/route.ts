
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendEmail, createEmailTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.email !== 'admin@riseasone.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { journeyIds } = await req.json();

    if (!Array.isArray(journeyIds) || journeyIds.length === 0) {
      return NextResponse.json({ error: 'Invalid journey IDs' }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const journeyId of journeyIds) {
      try {
        // Get journey with pending emails
        const journey = await prisma.customerJourney.findUnique({
          where: { id: journeyId },
          include: {
            registration: true,
            template: {
              include: {
                steps: true
              }
            },
            progress: true
          }
        });

        if (!journey) {
          errors.push({ journeyId, error: 'Journey not found' });
          continue;
        }

        // Find next unsent email
        const nextStep = journey.template.steps.find((step: any) => {
          const progress = journey.progress.find((p: any) => p.stepNumber === step.stepNumber);
          return !progress?.emailSent && step.emailSubject && step.emailBody;
        });

        if (!nextStep) {
          continue; // No pending emails for this journey
        }

        // Calculate scheduled date
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + nextStep.delayDays);

        // Check if it's time to send (scheduled date <= now)
        if (scheduledDate > new Date()) {
          continue; // Not time yet
        }

        // Send email
        const fullName = `${journey.registration.firstName} ${journey.registration.lastName}`;
        const emailHtml = createEmailTemplate(nextStep.emailBody ?? '', fullName);
        const result = await sendEmail({
          to: journey.registration.email,
          subject: nextStep.emailSubject ?? 'Welcome',
          html: emailHtml
        });

        if (result.success) {
          // Update progress
          await prisma.journeyProgress.upsert({
            where: {
              journeyId_stepNumber: {
                journeyId,
                stepNumber: nextStep.stepNumber
              }
            },
            update: {
              emailSent: true,
              emailSentAt: new Date(),
              status: 'completed'
            },
            create: {
              journeyId,
              stepId: nextStep.id,
              stepNumber: nextStep.stepNumber,
              status: 'completed',
              emailSent: true,
              emailSentAt: new Date()
            }
          });

          results.push({ journeyId, stepNumber: nextStep.stepNumber, email: journey.registration.email });
        } else {
          errors.push({ journeyId, error: 'Failed to send email' });
        }
      } catch (error) {
        console.error(`Error processing journey ${journeyId}:`, error);
        errors.push({ journeyId, error: 'Processing error' });
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.length,
      results,
      errors
    });
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
