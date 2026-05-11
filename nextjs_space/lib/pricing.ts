export const STRIPE_FEE_PERCENT = 0.029
export const STRIPE_FEE_FIXED = 0.30

export function calculateStripeFee(basePrice: number): number {
  if (basePrice <= 0) return 0
  return Math.round((basePrice * STRIPE_FEE_PERCENT + STRIPE_FEE_FIXED) * 100) / 100
}

export function calculateTotalWithFee(basePrice: number): number {
  return Math.round((basePrice + calculateStripeFee(basePrice)) * 100) / 100
}

export const LESSON_PRICING = {
  individual: { price: 85, sessionCount: 1, pricePerSession: 85, name: 'Individual Session' },
  '10-pack': { price: 750, sessionCount: 10, pricePerSession: 75, name: '10-Pack Lessons' },
  '20-pack': { price: 1300, sessionCount: 20, pricePerSession: 65, name: '20-Pack Lessons' },
  elite: { price: 0, sessionCount: 0, pricePerSession: 0, name: 'All-Inclusive Elite' },
} as const

export type LessonType = keyof typeof LESSON_PRICING

export function getPrice(lessonType: string) {
  const pricing = LESSON_PRICING[lessonType as LessonType]
  if (!pricing) throw new Error(`Invalid lesson type: ${lessonType}`)
  return pricing
}

export function getPriceWithFee(lessonType: string) {
  const pricing = getPrice(lessonType)
  const fee = calculateStripeFee(pricing.price)
  return {
    ...pricing,
    processingFee: fee,
    totalPrice: calculateTotalWithFee(pricing.price),
  }
}

export function isValidLessonType(type: string): type is LessonType {
  return type in LESSON_PRICING
}
