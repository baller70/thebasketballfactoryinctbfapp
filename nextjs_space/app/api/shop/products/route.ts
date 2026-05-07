import { NextResponse } from "next/server"
import { getProducts } from "@/lib/printify"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Printify fetch error:", error)
    return NextResponse.json({ products: [] })
  }
}
