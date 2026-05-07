"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import { ShoppingCart, X, Plus, Minus, Check, ChevronUp, Loader2, Package, Truck, Home, CreditCard } from "lucide-react"
import { toast } from "sonner"

interface SizeOption { label: string; variantId: number; price: number }
interface ColorOption { name: string; hex: string; sizes: SizeOption[]; image: string }
interface Product { id: string; title: string; garmentType: string; price: number; colors: ColorOption[]; defaultImage: string }

type CartItem = {
  productId: string
  variantId: number
  name: string
  color: string
  size: string
  price: number
  quantity: number
  image: string
}

function ShopInner() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(true)
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({})
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string | null>>({})
  const [checkingOut, setCheckingOut] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null)

  const isSuccess = searchParams.get("success") === "true"

  useEffect(() => {
    fetch("/api/shop/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function addToCart(product: Product) {
    const colorIdx = selectedColors[product.id] || 0
    const color = product.colors[colorIdx]
    if (!color) return
    const sizeLabel = selectedSizes[product.id]
    if (!sizeLabel) {
      toast.error("Please select a size")
      return
    }
    const size = color.sizes.find((s) => s.label === sizeLabel)
    if (!size) {
      toast.error("That combination is not available")
      return
    }

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.color === color.name && i.size === sizeLabel
      )
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.color === color.name && i.size === sizeLabel
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: size.variantId,
          name: product.title,
          color: color.name,
          size: sizeLabel,
          price: size.price,
          quantity: 1,
          image: color.image,
        },
      ]
    })

    setAddedFeedback(product.id)
    setTimeout(() => setAddedFeedback(null), 1500)
    toast.success(`${product.garmentType} added to cart`)
  }

  function removeFromCart(productId: string, color: string, size: string) {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.color === color && i.size === size))
    )
  }

  function updateQuantity(productId: string, color: string, size: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.color === color && i.size === size
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
        body: JSON.stringify({ items: cart }),
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

  const GARMENT_LABELS: Record<string, string> = {
    tshirt: "T-Shirt",
    hoodie: "Hoodie",
    longsleeve: "Long Sleeve",
    crewneck: "Crewneck",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-tbf-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header alwaysDark />

      <div className="pt-20 pb-24">
        {/* Hero Banner */}
        <div className="relative bg-black overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ backgroundImage: "url(/basketball-training-gold-court-optimized.jpeg)", backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-[2px] bg-tbf-gold" />
                  <span className="text-tbf-gold text-xs font-bold uppercase tracking-[0.3em]">Official Gear</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-audiowide text-white leading-tight">
                  TBF<br/><span className="text-tbf-gold">SHOP</span>
                </h1>
                <p className="text-white/50 text-sm md:text-base mt-4 max-w-md">
                  Official The Basketball Factory apparel. Premium quality gear for hoopers of all ages.
                </p>
              </div>
              <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] relative flex-shrink-0">
                <Image
                  src="/basketball-factory-main-logo.png"
                  alt="TBF Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Success */}
        {isSuccess && (
          <div className="bg-green-50 border-b border-green-200">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">Order placed successfully!</p>
                <p className="text-xs text-green-600">Thank you for your purchase. A confirmation email is on its way.</p>
              </div>
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-center text-lg font-audiowide text-black uppercase tracking-wide mb-10">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: ShoppingCart, label: "Place Your Order", desc: "Pick your product, color and size and check out securely through our store." },
              { icon: CreditCard, label: "Order Confirmed", desc: "Your payment is processed and you will receive a confirmation with your order details." },
              { icon: Package, label: "Packed & Shipped", desc: "Your order is carefully quality-checked and shipped out with a tracking number sent to your inbox." },
              { icon: Home, label: "Delivered to You", desc: "Your TBF gear arrives directly to your doorstep." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-gray-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-tbf-gold rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-black">{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-black mb-1">{step.label}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Details */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 flex items-start gap-4">
            <div className="w-10 h-10 bg-tbf-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Truck className="w-5 h-5 text-tbf-gold" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Shipping Details</p>
              <p className="text-xs text-gray-500 mt-1">All apparel orders ship directly to your address. Please allow <span className="font-bold text-black">5-13 business days</span> for delivery. You will receive a tracking number by email once your order ships.</p>
            </div>
          </div>
        </div>

        {/* APPAREL Section */}
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-tbf-gold rounded-full" />
            <div>
              <h2 className="text-xl font-audiowide text-black uppercase tracking-wide">Apparel</h2>
              <p className="text-xs text-gray-400 mt-0.5">Hoodies, T-Shirts, Long Sleeves & Crewnecks — all to your door</p>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-400 text-lg py-12">No products available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => {
                const colorIdx = selectedColors[product.id] || 0
                const activeColor = product.colors[colorIdx]
                const activeImage = activeColor?.image || product.defaultImage
                const activeSize = selectedSizes[product.id] || null
                const isAdded = addedFeedback === product.id
                const activeSizeObj = activeColor?.sizes.find((s) => s.label === activeSize)

                return (
                  <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
                      {activeImage && (
                        <Image
                          src={activeImage}
                          alt={product.title}
                          fill
                          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                      {/* Garment type badge top-left */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-tbf-gold text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {GARMENT_LABELS[product.garmentType] || product.garmentType}
                        </div>
                      </div>
                      {/* Price badge top-right */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-black text-white text-lg font-bold pl-3 pr-3.5 py-1.5 rounded-xl">
                          ${((activeSizeObj?.price || product.price) / 100).toFixed(0)}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-black">{product.title}</h3>

                      {/* Colors */}
                      <div className="flex gap-2 mt-3 mb-3">
                        {product.colors.map((color, ci) => (
                          <button
                            key={color.name}
                            onClick={() => { setSelectedColors((p) => ({ ...p, [product.id]: ci })); setSelectedSizes((p) => ({ ...p, [product.id]: null })) }}
                            className={`w-7 h-7 rounded-full transition-all ${ci === colorIdx ? "ring-2 ring-tbf-gold ring-offset-2" : ""} ${color.hex === "#FFFFFF" ? "border-2 border-gray-200" : ""}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>

                      {/* Sizes */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {activeColor?.sizes.map((size) => (
                          <button
                            key={size.label}
                            onClick={() => setSelectedSizes((p) => ({ ...p, [product.id]: size.label }))}
                            className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all ${
                              activeSize === size.label
                                ? "bg-tbf-gold text-black font-bold ring-1 ring-tbf-gold"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!activeSize}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          isAdded
                            ? "bg-green-500 text-white"
                            : !activeSize
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-tbf-gold hover:brightness-110 text-black shadow-lg shadow-tbf-gold/20 active:scale-[0.98]"
                        }`}
                      >
                        {isAdded ? (
                          <><Check className="w-4 h-4" /> Added!</>
                        ) : !activeSize ? (
                          "Select a Size"
                        ) : (
                          <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart (bottom) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-4 left-4 md:left-auto md:right-8 md:w-[420px] z-50">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/15 overflow-hidden">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="w-full px-5 py-4 bg-black flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-tbf-gold rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-black">{cartCount}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white">Your Cart</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-tbf-gold">${(cartTotal / 100).toFixed(2)}</span>
                <ChevronUp className={`w-4 h-4 text-white/50 transition-transform ${cartOpen ? "" : "rotate-180"}`} />
              </div>
            </button>

            {cartOpen && (
              <>
                <div className="px-5 py-4 max-h-56 overflow-y-auto space-y-3">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.color}-${item.size}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-black truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.color} / {item.size} &middot; ${(item.price / 100).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => updateQuantity(item.productId, item.color, item.size, -1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-black w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.color, item.size, 1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-black w-14 text-right">${((item.price * item.quantity) / 100).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.productId, item.color, item.size)} className="text-gray-300 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total</span>
                    <span className="text-lg font-bold text-black">${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full py-3.5 rounded-xl bg-tbf-gold hover:brightness-110 text-black text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-tbf-gold/20 active:scale-[0.98]"
                  >
                    {checkingOut ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
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
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-12 h-12 border-4 border-tbf-gold border-t-transparent rounded-full animate-spin" /></div>}>
      <ShopInner />
    </Suspense>
  )
}
