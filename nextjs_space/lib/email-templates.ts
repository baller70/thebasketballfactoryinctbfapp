
import { format } from 'date-fns'

interface BookingEmailData {
  bookingId: string
  lessonType: string
  athleteName: string
  athleteAge: number
  skillLevel: string
  parentName: string
  email: string
  phone: string
  selectedDates: string[]
  selectedTimes: string[]
  pricingInfo: {
    price: number
    sessionPrice?: number
  }
  isElite: boolean
}

export function createCustomerConfirmationEmail(data: BookingEmailData): string {
  const isElite = data.lessonType === 'elite'
  const isProgram = data.lessonType === 'full-program' || data.lessonType === 'single-session'
  
  // Determine display name for the booking type
  const bookingTypeName = isProgram 
    ? (data.lessonType === 'full-program' ? 'Full Program (7 Sessions)' : 'Single Session Drop-In')
    : (data.lessonType === 'individual' ? 'Individual Session (1 Hour)' :
       data.lessonType === '10-pack' ? '10-Pack Lessons' :
       '20-Pack Lessons')

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
            background-color: #f5f5f5;
          }
          .header {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #000;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            background: white;
            padding: 30px 20px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .confirmation-box {
            background: #f9f9f9;
            border-left: 4px solid #FFD700;
            padding: 15px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
          }
          .detail-value {
            color: #000;
          }
          .schedule-item {
            background: #f9f9f9;
            padding: 10px 15px;
            margin: 5px 0;
            border-radius: 5px;
            border-left: 3px solid #FFD700;
          }
          .footer {
            background: #2c2c2c;
            color: #fff;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
          .footer a {
            color: #FFD700;
            text-decoration: none;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #FFD700;
            color: #000;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
            font-weight: bold;
          }
          .highlight {
            color: #FFD700;
            font-weight: bold;
          }
          .what-to-bring {
            background: #fff8dc;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .what-to-bring ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .what-to-bring li {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏀 BOOKING CONFIRMED!</h1>
        </div>
        <div class="content">
          <p>Hi ${data.parentName},</p>
          
          ${isElite ? `
            <p>Thank you for your interest in our <strong>All-Inclusive Elite Training Package</strong>! We're excited to help ${data.athleteName} reach the next level in their basketball journey.</p>
            
            <div class="confirmation-box">
              <h3 style="margin-top: 0; color: #FFD700;">✓ Consultation Request Received</h3>
              <p><strong>Kevin Houston will contact you within 24 hours</strong> at <span class="highlight">${data.phone}</span> to schedule your personalized consultation call.</p>
            </div>
            
            <h3>What We'll Discuss:</h3>
            <ul>
              <li>${data.athleteName}'s current skill level and basketball experience</li>
              <li>Specific goals and areas for improvement</li>
              <li>Customized training program structure</li>
              <li>Schedule and availability</li>
              <li>Investment and payment options</li>
            </ul>
          ` : `
            <p>Congratulations! Your ${isProgram ? 'program registration has' : 'private training sessions have'} been <strong>successfully confirmed</strong>. ${data.athleteName} is officially on the path to basketball excellence!</p>
            
            <div class="confirmation-box">
              <h3 style="margin-top: 0; color: #FFD700;">✓ Payment Confirmed</h3>
              <p>Your payment of <strong style="font-size: 24px; color: #FFD700;">$${data.pricingInfo.price}</strong> has been processed successfully.</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Booking ID: ${data.bookingId}</p>
            </div>
            
            <h3>${isProgram ? 'Registration' : 'Booking'} Details</h3>
            <div class="detail-row">
              <span class="detail-label">${isProgram ? 'Program:' : 'Package:'}</span>
              <span class="detail-value">${bookingTypeName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Athlete:</span>
              <span class="detail-value">${data.athleteName}, Age ${data.athleteAge}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Skill Level:</span>
              <span class="detail-value">${data.skillLevel.charAt(0).toUpperCase() + data.skillLevel.slice(1)}</span>
            </div>
            
            <h3 style="margin-top: 25px;">📅 Scheduled Sessions</h3>
            ${data.selectedDates.map((date: any, index: number) => `
              <div class="schedule-item">
                <strong>${format(new Date(date), 'EEEE, MMMM d, yyyy')}</strong><br/>
                ${isProgram 
                  ? `Time: ${data.selectedTimes[index] || '6:00 PM - 7:30 PM'} • Duration: 90 minutes` 
                  : `Time: ${data.selectedTimes[index]} • Duration: 60 minutes`
                }
              </div>
            `).join('')}
            
            <div class="what-to-bring">
              <h3 style="margin-top: 0;">What to Bring:</h3>
              <ul>
                <li>✓ Athletic clothing and court shoes (non-marking soles)</li>
                <li>✓ Water bottle (stay hydrated!)</li>
                <li>✓ Towel</li>
                <li>✓ Positive attitude and willingness to learn</li>
              </ul>
              <p style="font-size: 12px; margin-bottom: 0;"><em>All basketballs and training equipment are provided.</em></p>
            </div>
          `}
          
          <h3>Facility Location</h3>
          <p>
            <strong>The Basketball Factory</strong><br/>
            38 Station Rd, Sparta, NJ 07871<br/>
            <a href="https://maps.google.com/?q=38+Station+Rd+Sparta+NJ+07871" target="_blank">Get Directions →</a>
          </p>
          ${!isElite ? `<p><em>Please arrive 5-10 minutes early to your first session for a quick facility tour.</em></p>` : ''}
          
          <h3>Questions or Need Help?</h3>
          <p>
            Feel free to reach out to us:<br/>
            📧 <a href="mailto:khouston@thebasketballfactorynj.com">khouston@thebasketballfactorynj.com</a><br/>
            📞 <a href="tel:+19732408759">(973) 240-8759</a>
          </p>
          
          <p style="margin-top: 30px;">
            We're excited to work with ${data.athleteName} and help them achieve their basketball goals!
          </p>
          
          <p style="margin-top: 20px;">
            <strong>Let's Rise Together!</strong><br/>
            The Basketball Factory Team
          </p>
        </div>
        <div class="footer">
          <p><strong>© ${new Date().getFullYear()} The Basketball Factory Inc</strong></p>
          <p>38 Station Rd, Sparta, NJ 07871</p>
          <p>
            <a href="https://thebasketballfactoryinc.com">Visit Our Website</a> | 
            <a href="mailto:khouston@thebasketballfactorynj.com">Contact Us</a>
          </p>
        </div>
      </body>
    </html>
  `
}

export function createAdminNotificationEmail(data: BookingEmailData): string {
  const isElite = data.lessonType === 'elite'
  const isProgram = data.lessonType === 'full-program' || data.lessonType === 'single-session'
  
  // Determine display name for the booking type
  const bookingTypeName = isProgram 
    ? (data.lessonType === 'full-program' ? 'Full Program (7 Sessions)' : 'Single Session Drop-In')
    : (data.lessonType === 'individual' ? 'Individual Session' :
       data.lessonType === '10-pack' ? '10-Pack Lessons' :
       data.lessonType === '20-pack' ? '20-Pack Lessons' :
       '🌟 All-Inclusive Elite')

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
            background-color: #f5f5f5;
          }
          .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
            color: #FFD700;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            background: white;
            padding: 30px 20px;
            border: 1px solid #e0e0e0;
            border-top: none;
          }
          .alert-box {
            background: ${isElite ? '#fff8dc' : '#e8f5e9'};
            border-left: 4px solid ${isElite ? '#FFD700' : '#4caf50'};
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .detail-section {
            background: #f9f9f9;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
          }
          .detail-value {
            color: #000;
            text-align: right;
          }
          .schedule-item {
            background: #fff;
            padding: 10px 15px;
            margin: 5px 0;
            border-radius: 5px;
            border-left: 3px solid #FFD700;
          }
          .footer {
            background: #2c2c2c;
            color: #fff;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 8px 8px;
          }
          .price-highlight {
            font-size: 28px;
            font-weight: bold;
            color: #4caf50;
          }
          .action-required {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 NEW BOOKING RECEIVED</h1>
        </div>
        <div class="content">
          ${isElite ? `
            <div class="action-required">
              <h3 style="margin: 0 0 10px 0; color: #856404;">⚠️ ACTION REQUIRED</h3>
              <p style="margin: 0;"><strong>Elite Package Consultation Requested</strong><br/>
              Contact customer within 24 hours to schedule consultation call.</p>
            </div>
          ` : `
            <div class="alert-box">
              <h3 style="margin-top: 0; color: #4caf50;">✓ Payment Received</h3>
              <p class="price-highlight">$${data.pricingInfo.price}</p>
              <p style="margin-bottom: 0; font-size: 12px; color: #666;">Booking ID: ${data.bookingId}</p>
            </div>
          `}
          
          <h3>${isProgram ? 'Program' : 'Package'} Details</h3>
          <div class="detail-section">
            <div class="detail-row">
              <span class="detail-label">${isProgram ? 'Program Type:' : 'Package Type:'}</span>
              <span class="detail-value">${bookingTypeName}</span>
            </div>
            ${!isElite ? `
              <div class="detail-row">
                <span class="detail-label">Price per Session:</span>
                <span class="detail-value">$${data.pricingInfo.sessionPrice || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value"><strong>$${data.pricingInfo.price}</strong></span>
              </div>
            ` : ''}
          </div>
          
          <h3>Customer Information</h3>
          <div class="detail-section">
            <div class="detail-row">
              <span class="detail-label">Parent/Guardian:</span>
              <span class="detail-value">${data.parentName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value"><a href="mailto:${data.email}">${data.email}</a></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value"><a href="tel:${data.phone}">${data.phone}</a></span>
            </div>
          </div>
          
          <h3>Athlete Information</h3>
          <div class="detail-section">
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${data.athleteName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Age:</span>
              <span class="detail-value">${data.athleteAge} years old</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Skill Level:</span>
              <span class="detail-value">${data.skillLevel.charAt(0).toUpperCase() + data.skillLevel.slice(1)}</span>
            </div>
          </div>
          
          ${!isElite && data.selectedDates.length > 0 ? `
            <h3>📅 Scheduled Sessions</h3>
            ${data.selectedDates.map((date: any, index: number) => `
              <div class="schedule-item">
                <strong>Session ${index + 1}:</strong> ${format(new Date(date), 'EEEE, MMMM d, yyyy')}<br/>
                <strong>Time:</strong> ${data.selectedTimes[index]}
              </div>
            `).join('')}
          ` : ''}
          
          ${isElite ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">Next Steps:</h4>
              <ol style="margin: 0; padding-left: 20px;">
                <li>Call ${data.parentName} at <strong>${data.phone}</strong> within 24 hours</li>
                <li>Schedule a consultation call to discuss ${data.athleteName}'s goals</li>
                <li>Create a customized training plan</li>
                <li>Discuss pricing and schedule</li>
              </ol>
            </div>
          ` : `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #1976d2;">Next Steps:</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Add sessions to training calendar</li>
                <li>Prepare personalized training plan for ${data.athleteName}</li>
                <li>Send reminder emails 48 hours before first session</li>
              </ul>
            </div>
          `}
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; font-size: 12px; color: #666;">
            <strong>Booking ID:</strong> ${data.bookingId}<br/>
            <strong>Received:</strong> ${format(new Date(), 'MMMM d, yyyy \'at\' h:mm a')}
          </p>
        </div>
        <div class="footer">
          <p><strong>The Basketball Factory Admin System</strong></p>
          <p>This is an automated notification. Do not reply to this email.</p>
        </div>
      </body>
    </html>
  `
}
