
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendEmail, createEmailTemplate } from '@/lib/email';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.email !== 'admin@riseasone.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { journeyId, stepId } = await req.json();

    // Get the journey and step details
    const journey = await prisma.customerJourney.findUnique({
      where: { id: journeyId },
      include: {
        registration: true,
        template: {
          include: {
            steps: true
          }
        }
      }
    });

    if (!journey) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
    }

    const step = await prisma.journeyStep.findUnique({
      where: { id: stepId }
    });

    if (!step || !step.emailSubject || !step.emailBody) {
      return NextResponse.json({ error: 'Step does not have email content' }, { status: 400 });
    }

    // Send the email
    const fullName = `${journey.registration.firstName} ${journey.registration.lastName}`;
    const emailHtml = createEmailTemplate(step.emailBody, fullName);
    const result = await sendEmail({
      to: journey.registration.email,
      subject: step.emailSubject,
      html: emailHtml
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Update progress
    await prisma.journeyProgress.upsert({
      where: {
        journeyId_stepNumber: {
          journeyId,
          stepNumber: step.stepNumber
        }
      },
      update: {
        emailSent: true,
        emailSentAt: new Date(),
        status: 'completed'
      },
      create: {
        journeyId,
        stepId: step.id,
        stepNumber: step.stepNumber,
        status: 'completed',
        emailSent: true,
        emailSentAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending journey email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
