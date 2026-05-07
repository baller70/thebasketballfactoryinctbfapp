import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

let _stripe: Stripe | null = null
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")
  }
  return _stripe
}

const BASE_URL = process.env.BASE_URL || "https://thebasketballfactoryinc.com"

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await request.json()
    const { printifyItems } = body

    if (!printifyItems || !Array.isArray(printifyItems) || printifyItems.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 })
    }

    const lineItems: Array<{price_data:{currency:string;product_data:{name:string};unit_amount:number};quantity:number}> = []
    const printifyMeta: string[] = []

    for (const item of printifyItems) {
      const sizeSuffix = item.size ? ` (${item.size})` : ""
      const colorSuffix = item.color ? ` - ${item.color}` : ""
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `${item.name}${colorSuffix}${sizeSuffix}` },
          unit_amount: item.price,
        },
        quantity: item.quantity || 1,
      })
      printifyMeta.push(JSON.stringify({
        pid: item.printifyProductId,
        vid: item.variantId,
        qty: item.quantity || 1,
      }))
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${BASE_URL}/shop?success=true`,
      cancel_url: `${BASE_URL}/shop?cancelled=true`,
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata: {
        type: "printify_gear",
        printifyItems: printifyMeta.join("|||"),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Shop checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
