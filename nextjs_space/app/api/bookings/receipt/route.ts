

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID required' },
        { status: 400 }
      )
    }

    // Fetch booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Generate HTML receipt
    const receiptHtml = generateReceiptHtml(booking)

    // Return HTML response that can be printed as PDF
    return new Response(receiptHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="receipt-${bookingId}.html"`
      }
    })
  } catch (error: any) {
    console.error('Error generating receipt:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate receipt' },
      { status: 500 }
    )
  }
}

function generateReceiptHtml(booking: any): string {
  const pricingInfo = booking.pricingInfo as any || {}
  const selectedDates = booking.selectedDates as string[] || []
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - The Basketball Factory</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #C8B273;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #000;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .header .subtitle {
      color: #C8B273;
      font-size: 18px;
      font-weight: bold;
    }
    .receipt-number {
      text-align: center;
      margin-bottom: 30px;
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #C8B273;
    }
    .receipt-number strong {
      color: #C8B273;
      font-size: 14px;
    }
    .receipt-number .number {
      font-size: 16px;
      font-weight: bold;
      color: #000;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #C8B273;
      margin-bottom: 15px;
      text-transform: uppercase;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 8px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #666;
      font-weight: 600;
    }
    .info-value {
      color: #000;
      text-align: right;
    }
    .total-section {
      background: #f9f9f9;
      padding: 20px;
      margin-top: 30px;
      border: 2px solid #C8B273;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.final {
      border-top: 2px solid #C8B273;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
    }
    .total-row.final .amount {
      color: #C8B273;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .footer .contact {
      margin-top: 15px;
    }
    .footer .contact p {
      margin: 5px 0;
    }
    .paid-stamp {
      text-align: center;
      margin: 20px 0;
    }
    .paid-stamp .stamp {
      display: inline-block;
      border: 3px solid #28a745;
      color: #28a745;
      padding: 10px 30px;
      font-size: 24px;
      font-weight: bold;
      transform: rotate(-5deg);
      text-transform: uppercase;
    }
    @media print {
      body { background: white; padding: 0; }
      .receipt-container { box-shadow: none; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <!-- Header -->
    <div class="header">
      <h1>THE BASKETBALL FACTORY</h1>
      <div class="subtitle">Payment Receipt</div>
    </div>

    <!-- Receipt Number -->
    <div class="receipt-number">
      <strong>RECEIPT NUMBER</strong>
      <div class="number">${booking.paymentIntentId?.toUpperCase() || booking.id}</div>
      <div style="margin-top: 10px; font-size: 14px; color: #666;">
        Date: ${format(new Date(booking.paidAt || booking.createdAt), 'MMMM d, yyyy')}
      </div>
    </div>

    <!-- Paid Stamp -->
    <div class="paid-stamp">
      <div class="stamp">PAID</div>
    </div>

    <!-- Customer Information -->
    <div class="section">
      <div class="section-title">Customer Information</div>
      <div class="info-row">
        <span class="info-label">Player Name:</span>
        <span class="info-value">${booking.athleteName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Parent/Guardian:</span>
        <span class="info-value">${booking.parentName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${booking.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Phone:</span>
        <span class="info-value">${booking.phone}</span>
      </div>
    </div>

    <!-- Program Details -->
    <div class="section">
      <div class="section-title">Program Details</div>
      <div class="info-row">
        <span class="info-label">Program:</span>
        <span class="info-value">${booking.lessonType || 'High School Fall Workouts'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Sessions:</span>
        <span class="info-value">${pricingInfo.sessionCount || selectedDates.length} sessions</span>
      </div>
      ${selectedDates.length > 0 ? `
      <div class="info-row">
        <span class="info-label">Selected Dates:</span>
        <span class="info-value">${selectedDates.slice(0, 3).join(', ')}${selectedDates.length > 3 ? ` +${selectedDates.length - 3} more` : ''}</span>
      </div>
      ` : ''}
    </div>

    <!-- Payment Details -->
    <div class="total-section">
      <div class="section-title" style="margin-bottom: 10px; border-bottom: none;">Payment Summary</div>
      ${pricingInfo.programFee ? `
      <div class="total-row">
        <span>Program Fee:</span>
        <span>$${pricingInfo.programFee.toFixed(2)}</span>
      </div>
      <div class="total-row">
        <span>Credit Card Processing Fee:</span>
        <span>$${(pricingInfo.processingFee || 0).toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="total-row final">
        <span>Total Amount Paid:</span>
        <span class="amount">$${(booking.amountPaid || pricingInfo.price || 0).toFixed(2)}</span>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="section">
      <div class="section-title">Payment Method</div>
      <div class="info-row">
        <span class="info-label">Method:</span>
        <span class="info-value">Credit Card (${booking.cardLast4 ? `ending in ${booking.cardLast4}` : 'Stripe'})</span>
      </div>
      <div class="info-row">
        <span class="info-label">Transaction ID:</span>
        <span class="info-value">${booking.paymentIntentId || booking.id}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment Status:</span>
        <span class="info-value" style="color: #28a745; font-weight: bold;">PAID</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>The Basketball Factory</strong></p>
      <p>38 Station Rd, Sparta, NJ 07871</p>
      <div class="contact">
        <p>Phone: (973) 240-8759</p>
        <p>Email: khouston@thebasketballfactorynj.com</p>
        <p>Website: thebasketballfactoryinc.com</p>
      </div>
      <p style="margin-top: 20px; font-style: italic;">
        Thank you for your payment! We look forward to training with you.
      </p>
    </div>
  </div>

  <script>
    // Auto-print dialog (optional - can be removed if not desired)
    // window.onload = function() { window.print(); }
  </script>
</body>
</html>
  `.trim()
}
