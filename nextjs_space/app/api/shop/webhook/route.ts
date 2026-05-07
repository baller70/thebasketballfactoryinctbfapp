import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { SHOP_ID, PRINTIFY_TOKEN, PRINTIFY_BASE } from "@/lib/printify"

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-04-30.basil" as any })
}

async function createPrintifyOrder(session: any, items: Array<{productId: string; variantId: number; quantity: number}>) {
  const shippingDetails = session.shipping_details || session.customer_details
  const address = shippingDetails?.address || {}
  const name = shippingDetails?.name || session.customer_details?.name || "Customer"
  const email = session.customer_details?.email || ""

  const orderPayload = {
    external_id: session.id,
    label: `TBF-${session.id.slice(-8)}`,
    line_items: items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
    })),
    shipping_method: 1,
    address_to: {
      first_name: name.split(" ")[0] || name,
      last_name: name.split(" ").slice(1).join(" ") || "",
      email,
      country: address.country || "US",
      region: address.state || "",
      address1: address.line1 || "",
      address2: address.line2 || "",
      city: address.city || "",
      zip: address.postal_code || "",
    },
  }

  const res = await fetch(`${PRINTIFY_BASE}/shops/${SHOP_ID}/orders.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PRINTIFY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Printify order error:", errText)
  }
  return res.ok
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await request.text()
    const sig = request.headers.get("stripe-signature") || ""
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature error:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const metadata = session.metadata || {}
      const itemCount = parseInt(metadata.item_count || "0")

      if (itemCount > 0) {
        const items = []
        for (let i = 0; i < itemCount; i++) {
          items.push({
            productId: metadata[`item_${i}_productId`],
            variantId: parseInt(metadata[`item_${i}_variantId`]),
            quantity: parseInt(metadata[`item_${i}_quantity`] || "1"),
          })
        }
        await createPrintifyOrder(session, items)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
