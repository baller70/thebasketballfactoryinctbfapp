const PRINTIFY_TOKEN = process.env.PRINTIFY_TOKEN || ""
const SHOP_ID = process.env.PRINTIFY_SHOP_ID || ""
const PRINTIFY_BASE = "https://api.printify.com/v1"

async function fetchPrintify(path: string) {
  const res = await fetch(`${PRINTIFY_BASE}${path}`, {
    headers: { Authorization: `Bearer ${PRINTIFY_TOKEN}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Printify ${res.status}: ${res.statusText}`)
  return res.json()
}

const SIZE_LABELS = new Set(["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"])
const sizeIndex: Record<string, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4, "2XL": 5, "3XL": 6, "4XL": 7, "5XL": 8 }

function parseVariantTitle(title: string): { color: string; size: string } {
  const parts = title.split(" / ")
  if (parts.length < 2) return { color: "Default", size: parts[0] || "M" }
  if (SIZE_LABELS.has(parts[0])) {
    return { color: parts[1], size: parts[0] }
  }
  return { color: parts[0], size: parts[1] }
}

function extractGarmentType(title: string): string {
  const t = title.toLowerCase()
  if (t.includes("hoodie")) return "hoodie"
  if (t.includes("long sleeve")) return "longsleeve"
  if (t.includes("crewneck") || t.includes("sweatshirt")) return "crewneck"
  return "tshirt"
}

interface PrintifyVariant {
  id: number
  title: string
  options: number[]
  price: number
  is_enabled: boolean
}

interface PrintifyImage {
  src: string
  variant_ids: number[]
  is_default: boolean
}

function transformProduct(raw: Record<string, unknown>) {
  const variants = (raw.variants as PrintifyVariant[]) || []
  const images = (raw.images as PrintifyImage[]) || []
  const enabled = variants.filter((v) => v.is_enabled)
  if (!enabled.length) return null

  const colorMap = new Map<string, { name: string; hex: string; sizes: { label: string; variantId: number; price: number }[]; image: string }>()

  for (const v of enabled) {
    const { color: colorName, size: sizeName } = parseVariantTitle(v.title)

    if (!colorMap.has(colorName)) {
      const img = images.find((i) => i.variant_ids.includes(v.id))?.src || images[0]?.src || ""
      let hex = "#333"
      const cn = colorName.toLowerCase()
      if (cn.includes("white")) hex = "#FFFFFF"
      else if (cn.includes("red")) hex = "#DC2626"
      else if (cn.includes("grey") || cn.includes("gray") || cn.includes("heather") || cn.includes("sport")) hex = "#6B7280"
      else if (cn.includes("black")) hex = "#111111"
      colorMap.set(colorName, { name: colorName, hex, sizes: [], image: img })
    }
    colorMap.get(colorName)!.sizes.push({ label: sizeName, variantId: v.id, price: v.price })
  }

  for (const color of colorMap.values()) {
    color.sizes.sort((a, b) => (sizeIndex[a.label] ?? 99) - (sizeIndex[b.label] ?? 99))
  }

  const colors = Array.from(colorMap.values())
  const price = enabled[0].price

  return {
    id: raw.id as string,
    title: (raw.title as string).replace(/^TBF\s+/i, ""),
    garmentType: extractGarmentType(raw.title as string),
    price,
    colors,
    defaultImage: images.find((i) => i.is_default)?.src || images[0]?.src || "",
  }
}

let cachedProducts: ReturnType<typeof transformProduct>[] | null = null
let cacheTime = 0

export async function getProducts() {
  if (cachedProducts && Date.now() - cacheTime < 300_000) return cachedProducts
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
