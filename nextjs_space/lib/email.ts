
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'The Basketball Factory <khouston@thebasketballfactorynj.com>' }: SendEmailParams) {
  try {
    console.log('📤 Attempting to send email:', {
      to,
      from,
      subject,
      hasHtml: !!html,
      htmlLength: html?.length || 0
    })
    
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('❌ Error sending email via Resend:', {
        to,
        subject,
        error: result.error
      });
      return { success: false, error: result.error };
    }

    console.log('✅ Email sent successfully via Resend:', {
      to,
      subject,
      messageId: result.data?.id
    })

    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Exception sending email via Resend:', {
      to,
      subject,
      error: error instanceof Error ? error.message : 'Unknown error',
      fullError: error
    });
    return { success: false, error };
  }
}

export function createEmailTemplate(content: string, customerName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0066cc 0%, #004d99 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: white;
            padding: 30px 20px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rise As One AAU</h1>
        </div>
        <div class="content">
          ${customerName ? `<p>Hi ${customerName},</p>` : ''}
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Rise As One AAU - The Basketball Factory</p>
          <p>If you have any questions, please contact us at khouston@thebasketballfactorynj.com</p>
        </div>
      </body>
    </html>
  `;
}
