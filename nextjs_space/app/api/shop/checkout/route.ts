import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getProducts } from "@/lib/printify"

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-04-30.basil" as any })
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://thebasketballfactoryinc.com"

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    const products = await getProducts()
    const lineItems: Array<{price_data:{currency:string;product_data:{name:string;images?:string[]};unit_amount:number};quantity:number}> = []

    for (const item of items) {
      const product = products.find((p: any) => p?.id === item.productId)
      if (!product) continue
      const color = product.colors.find((c: any) => c.name === item.color)
      if (!color) continue
      const size = color.sizes.find((s: any) => s.label === item.size)
      if (!size) continue

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${product.title} - ${item.color} / ${item.size}`,
            images: color.image ? [color.image] : undefined,
          },
          unit_amount: size.price,
        },
        quantity: item.quantity || 1,
      })
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 })
    }

    const metadata: Record<string, string> = {}
    items.forEach((item: any, i: number) => {
      metadata[`item_${i}_productId`] = item.productId
      metadata[`item_${i}_variantId`] = String(item.variantId)
      metadata[`item_${i}_quantity`] = String(item.quantity || 1)
    })
    metadata.item_count = String(items.length)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${BASE_URL}/shop?success=true`,
      cancel_url: `${BASE_URL}/shop?canceled=true`,
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 })
  }
}
