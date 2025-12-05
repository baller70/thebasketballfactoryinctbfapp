/**
 * Stripe Processing Fee Calculations
 * 
 * Stripe charges 2.9% + $0.30 per successful card charge
 * This utility calculates the amount to charge customers so that
 * after Stripe's fees, the business receives the desired amount.
 */

export interface PriceBreakdown {
  programFee: number
  processingFee: number
  totalAmount: number
}

/**
 * Calculate the total charge amount including Stripe processing fees
 * Formula: (Desired Amount + $0.30) / (1 - 0.029)
 * 
 * @param desiredAmount - The amount you want to receive after fees
 * @returns PriceBreakdown with program fee, processing fee, and total
 */
export function calculateStripeTotal(desiredAmount: number): PriceBreakdown {
  // Stripe fee: 2.9% + $0.30
  const STRIPE_PERCENTAGE = 0.029
  const STRIPE_FIXED_FEE = 0.30
  
  // Calculate the total amount to charge
  const totalAmount = (desiredAmount + STRIPE_FIXED_FEE) / (1 - STRIPE_PERCENTAGE)
  
  // Round to 2 decimal places
  const roundedTotal = Math.round(totalAmount * 100) / 100
  
  // Calculate the processing fee
  const processingFee = Math.round((roundedTotal - desiredAmount) * 100) / 100
  
  return {
    programFee: desiredAmount,
    processingFee: processingFee,
    totalAmount: roundedTotal
  }
}

/**
 * Format a price breakdown as a string for display
 */
export function formatPriceBreakdown(breakdown: PriceBreakdown): string {
  return `Program: $${breakdown.programFee.toFixed(2)} + Processing: $${breakdown.processingFee.toFixed(2)} = Total: $${breakdown.totalAmount.toFixed(2)}`
}
