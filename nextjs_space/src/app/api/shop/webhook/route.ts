import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const dynamic = "force-dynamic"

const PRINTIFY_BASE = "https://api.printify.com/v1"

let _stripe: Stripe | null = null
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")
  }
  return _stripe
}

async function createPrintifyOrder(
  sessionId: string,
  items: Array<{ pid: string; vid: number; qty: number }>,
  address: Stripe.Address & { name?: string },
  email: string
) {
  const token = process.env.PRINTIFY_TOKEN
  const shopId = process.env.PRINTIFY_SHOP_ID
  if (!token || !shopId) {
    throw new Error("Missing PRINTIFY_TOKEN or PRINTIFY_SHOP_ID")
  }

  const nameParts = (address.name || "Customer").split(" ")
  const firstName = nameParts[0] || "Customer"
  const lastName = nameParts.slice(1).join(" ") || ""

  const body = {
    external_id: sessionId.slice(-20),
    label: `TBF Shop - ${sessionId.slice(-8)}`,
    line_items: items.map((item) => ({
      product_id: item.pid,
      variant_id: item.vid,
      quantity: item.qty,
    })),
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: "",
      country: address.country || "US",
      region: address.state || "",
      address1: address.line1 || "",
      address2: address.line2 || "",
      city: address.city || "",
      zip: address.postal_code || "",
    },
  }

  const res = await fetch(`${PRINTIFY_BASE}/shops/${shopId}/orders.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Printify order failed (${res.status}): ${errorText}`)
  }

  return res.json()
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.metadata?.type !== "printify_gear") {
      return NextResponse.json({ received: true, action: "skipped_non_printify" })
    }

    const printifyItemsRaw = session.metadata?.printifyItems
    if (!printifyItemsRaw) {
      console.error("No printifyItems in session metadata:", session.id)
      return NextResponse.json({ received: true, action: "no_items" })
    }

    const items: Array<{ pid: string; vid: number; qty: number }> = printifyItemsRaw
      .split("|||")
      .map((s) => JSON.parse(s))

    const shippingDetails = (session as any).shipping_details || session.customer_details
    const address = shippingDetails?.address || {}
    const name = shippingDetails?.name || session.customer_details?.name || "Customer"
    const email = session.customer_details?.email || ""

    try {
      const order = await createPrintifyOrder(
        session.id,
        items,
        { ...address, name } as Stripe.Address & { name: string },
        email
      )
      console.log(`Printify order created for session ${session.id}:`, order.id)
      return NextResponse.json({ received: true, action: "order_created", printifyOrderId: order.id })
    } catch (err) {
      console.error(`Failed to create Printify order for session ${session.id}:`, err)
      return NextResponse.json({ received: true, action: "order_failed", error: String(err) }, { status: 200 })
    }
  }

  return NextResponse.json({ received: true, action: "ignored" })
}
