import { NextResponse } from "next/server"

const PRINTIFY_TOKEN = process.env.PRINTIFY_TOKEN || ""
const SHOP_ID = process.env.PRINTIFY_SHOP_ID || ""
const PRINTIFY_BASE = "https://api.printify.com/v1"

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
const SIZE_SET = new Set(SIZE_ORDER)

let cachedProducts: unknown[] | null = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000

export async function fetchPrintify(path: string) {
  const res = await fetch(`${PRINTIFY_BASE}${path}`, {
    headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` },
  })
  if (!res.ok) throw new Error(`Printify ${res.status}`)
  return res.json()
}

function sizeIndex(s: string) {
  const idx = SIZE_ORDER.indexOf(s)
  return idx === -1 ? 999 : idx
}

function extractGarmentType(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes("hoodie")) return "Hoodie"
  if (lower.includes("crewneck") || lower.includes("crew neck") || lower.includes("sweatshirt")) return "Crewneck"
  if (lower.includes("long sleeve")) return "Long Sleeve"
  if (lower.includes("t-shirt") || lower.includes("tee") || lower.includes("tshirt")) return "T-Shirt"
  return "Apparel"
}

export function transformProduct(raw: Record<string, unknown>) {
  const id = raw.id as string
  const title = raw.title as string
  const description = (raw.description as string) || ""
  const images = (raw.images as Array<{ src: string; variant_ids: number[]; is_default: boolean }>) || []
  const variants = (raw.variants as Array<{
    id: number; title: string; price: number; is_enabled: boolean; is_available: boolean
  }>) || []

  const enabledVariants = variants.filter((v) => v.is_enabled && v.is_available)
  if (enabledVariants.length === 0) return null

  const colors: string[] = []
  const sizes: string[] = []
  const variantMap: Record<string, { variantId: number; price: number }> = {}

  for (const v of enabledVariants) {
    const parts = v.title.split(" / ")
    let color = parts[0]?.trim() || "Default"
    let size = parts[1]?.trim() || "One Size"

    if (SIZE_SET.has(color) && !SIZE_SET.has(size)) {
      const tmp = color
      color = size
      size = tmp
    }

    if (!colors.includes(color)) colors.push(color)
    if (!sizes.includes(size)) sizes.push(size)
    variantMap[`${color}|${size}`] = { variantId: v.id, price: v.price }
  }

  sizes.sort((a, b) => sizeIndex(a) - sizeIndex(b))

  const colorImages: Record<string, string> = {}
  const defaultImage = images.find((img) => img.is_default)?.src || images[0]?.src || ""

  for (const color of colors) {
    const colorVariantIds = Object.entries(variantMap)
      .filter(([key]) => key.startsWith(color + "|"))
      .map(([, val]) => val.variantId)
    const img = images.find(
      (img) => img.variant_ids.some((vid) => colorVariantIds.includes(vid))
    )
    colorImages[color] = img?.src || defaultImage
  }

  const price = enabledVariants[0]?.price || 0

  return {
    id,
    title,
    description,
    garmentType: extractGarmentType(title),
    defaultImage,
    colorImages,
    colors,
    sizes,
    variants: variantMap,
    price,
  }
}

export async function getProducts() {
  if (cachedProducts && Date.now() - cacheTime < CACHE_TTL) {
    return cachedProducts
  }

  const data = await fetchPrintify(`/shops/${SHOP_ID}/products.json`)
  const rawProducts = (data.data || data) as Record<string, unknown>[]
  const products = rawProducts
    .filter((p) => ((p.title as string) || "").startsWith("TBF"))
    .map(transformProduct)
    .filter(Boolean)

  cachedProducts = products
  cacheTime = Date.now()

  return products
}

export { SHOP_ID, PRINTIFY_TOKEN, PRINTIFY_BASE }
