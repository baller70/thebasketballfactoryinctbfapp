"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ShoppingCart, X, Plus, Minus, Check, ChevronUp, Loader2 } from "lucide-react"
import { toast } from "sonner"

type PrintifyProduct = {
  id: string
  title: string
  description: string
  garmentType: string
  defaultImage: string
  colorImages: Record<string, string>
  colors: string[]
  sizes: string[]
  variants: Record<string, { variantId: number; price: number }>
  price: number
}

type CartItem = {
  printifyProductId: string
  variantId: number
  name: string
  color: string
  size: string
  price: number
  quantity: number
  image: string
}

const COLOR_MAP: Record<string, string> = {
  Black: "#000000",
  White: "#FFFFFF",
  Red: "#DC2626",
  "Sport Grey": "#9CA3AF",
  "Dark Grey Heather": "#4B5563",
  Grey: "#6B7280",
  "Athletic Heather": "#9CA3AF",
  "Grey Heather": "#9CA3AF",
  Navy: "#1E3A5F",
}

function ShopInner() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<PrintifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({})
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [checkingOut, setCheckingOut] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(true)

  const isSuccess = searchParams.get("success") === "true"

  useEffect(() => {
    fetch("/api/shop/products")
      .then((r) => r.json())
      .then((data) => {
        const items: PrintifyProduct[] = data.products || []
        setProducts(items)
        const initialColors: Record<string, string> = {}
        for (const p of items) {
          const matchingColor = p.colors.find((c) => p.colorImages[c] === p.defaultImage)
          if (matchingColor) initialColors[p.id] = matchingColor
        }
        setSelectedColors(initialColors)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function getActiveImage(product: PrintifyProduct) {
    const color = selectedColors[product.id]
    if (color && product.colorImages[color]) return product.colorImages[color]
    return product.defaultImage
  }

  function addToCart(product: PrintifyProduct) {
    const color = selectedColors[product.id] || product.colors[0]
    const size = selectedSizes[product.id]
    if (!size) {
      toast.error("Please select a size")
      return
    }
    const key = `${color}|${size}`
    const variant = product.variants[key]
    if (!variant) {
      toast.error("That combination is not available")
      return
    }
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.printifyProductId === product.id && i.color === color && i.size === size
      )
      if (existing) {
        return prev.map((i) =>
          i.printifyProductId === product.id && i.color === color && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [
        ...prev,
        {
          printifyProductId: product.id,
          variantId: variant.variantId,
          name: product.title,
          color,
          size,
          price: variant.price,
          quantity: 1,
          image: getActiveImage(product),
        },
      ]
    })
    setAddedFeedback(product.id)
    setTimeout(() => setAddedFeedback(null), 1500)
    toast.success(`${product.garmentType} added to cart`)
  }

  function removeFromCart(id: string, color: string, size: string) {
    setCart((prev) =>
      prev.filter((i) => !(i.printifyProductId === id && i.color === color && i.size === size))
    )
  }

  function updateQuantity(id: string, color: string, size: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.printifyProductId === id && i.color === color && i.size === size
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    )
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  async function handleCheckout() {
    if (cart.length === 0) return
    setCheckingOut(true)
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          printifyItems: cart.map((i) => ({
            printifyProductId: i.printifyProductId,
            variantId: i.variantId,
            name: i.name,
            color: i.color,
            size: i.size,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || "Checkout failed")
        setCheckingOut(false)
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
      setCheckingOut(false)
    }
  }

  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/30 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-[2px] w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                Official Gear
              </span>
              <div className="h-[2px] w-8 bg-primary" />
            </div>
            <h1 className="text-4xl font-bold uppercase tracking-wider text-white md:text-6xl">
              TBF <span className="text-primary">Shop</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/50 md:text-base">
              Official The Basketball Factory apparel. Premium quality clothing for hoopers.
            </p>
          </div>
        </div>
      </div>

      {/* Success */}
      {isSuccess && (
        <div className="border-b border-green-200 bg-green-50">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-500">
              <Check className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">Order placed successfully!</p>
              <p className="text-xs text-green-600">Thank you. A confirmation email is on its way.</p>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => {
              const activeColor = selectedColors[p.id] || p.colors[0]
              const activeSize = selectedSizes[p.id]
              const activeImg = getActiveImage(p)
              const isAdded = addedFeedback === p.id

              return (
                <div
                  key={p.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-muted to-muted/50">
                    {activeImg && (
                      <Image
                        src={activeImg}
                        alt={p.title}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute right-3 top-3">
                      <div className="rounded-xl bg-charcoal px-3 py-1.5 text-lg font-bold text-white">
                        ${ ((p.price || 0) / 100).toFixed(0) }
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{p.garmentType}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.title}</p>
                    </div>

                    {/* Colors */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() =>
                            setSelectedColors((prev) => ({ ...prev, [p.id]: c }))
                          }
                          title={c}
                          className={`size-7 rounded-full border-2 transition-all ${
                            activeColor === c
                              ? "scale-110 border-primary ring-2 ring-primary/30"
                              : "border-border hover:border-primary/50"
                          }`}
                          style={{ backgroundColor: COLOR_MAP[c] || "#888" }}
                        />
                      ))}
                    </div>

                    {/* Sizes */}
                    <div className="flex flex-wrap gap-1">
                      {p.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            setSelectedSizes((prev) => ({ ...prev, [p.id]: s }))
                          }
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all ${
                            activeSize === s
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => addToCart(p)}
                      disabled={!activeSize}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                        isAdded
                          ? "bg-green-500 text-white"
                          : !activeSize
                            ? "cursor-not-allowed bg-muted text-muted-foreground"
                            : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98]"
                      }`}
                    >
                      {isAdded ? (
                        <><Check className="size-4" /> Added!</>
                      ) : !activeSize ? (
                        "Select a Size"
                      ) : (
                        <><ShoppingCart className="size-4" /> Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-8 md:w-[420px]">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/15">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="flex w-full items-center justify-between bg-charcoal px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="size-5 text-white" />
                  <div className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary">
                    <span className="text-[9px] font-bold text-primary-foreground">{cartCount}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white">Your Cart</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-primary">
                  ${(cartTotal / 100).toFixed(2)}
                </span>
                <ChevronUp
                  className={`size-4 text-white/50 transition-transform ${cartOpen ? "" : "rotate-180"}`}
                />
              </div>
            </button>

            {cartOpen && (
              <>
                <div className="max-h-56 space-y-3 overflow-y-auto px-5 py-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.printifyProductId}-${item.color}-${item.size}`}
                      className="flex items-center gap-3"
                    >
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-foreground">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.color} / {item.size} &middot; ${(item.price / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.printifyProductId, item.color, item.size, -1)
                          }
                          className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-accent"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.printifyProductId, item.color, item.size, 1)
                          }
                          className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-accent"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="w-14 text-right text-sm font-bold text-foreground">
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            removeFromCart(item.printifyProductId, item.color, item.size)
                          }
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Total
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      ${(cartTotal / 100).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 disabled:opacity-50 active:scale-[0.98]"
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-40">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <ShopInner />
    </Suspense>
  )
}
