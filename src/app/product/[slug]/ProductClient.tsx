"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatINR, getDiscountPercent } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

const Product3DViewer = dynamic(
  () => import("@/components/three/Product3DViewer").then((m) => ({ default: m.Product3DViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-2xl flex items-center justify-center">
        <div className="spinner" />
      </div>
    ),
  }
);

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");
  const [show3D, setShow3D] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { addItem } = useCartStore();
  const { toggle, hasItem } = useWishlistStore();

  const isWishlisted = mounted ? hasItem(product.id) : false;
  const discount = product.offerPrice ? getDiscountPercent(product.price, product.offerPrice) : 0;
  const savings = product.offerPrice ? product.price - product.offerPrice : 0;
  const avgRating = product.avgRating || 4.8;

  const images = product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800"
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-white/40">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/70 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images / 3D Viewer */}
          <div className="space-y-4">
            {/* Toggle 2D/3D */}
            <div className="flex gap-2">
              <button
                onClick={() => setShow3D(false)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !show3D ? "bg-primary/20 text-primary border border-primary/40" : "glass border border-white/10 text-white/50"
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => setShow3D(true)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  show3D ? "bg-primary/20 text-primary border border-primary/40" : "glass border border-white/10 text-white/50"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                3D View
              </button>
            </div>

            {/* Main Image / 3D */}
            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card">
              {show3D ? (
                <Suspense fallback={<div className="spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}>
                  <Product3DViewer />
                </Suspense>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-contain p-8"
                    priority
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.newArrival && <span className="badge-new">New</span>}
                    {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
                    {product.luxuryItem && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold border border-yellow-500/30 uppercase">Luxury</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === i ? "border-primary" : "border-white/10"
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-6">
            {/* Brand */}
            {product.brand && (
              <Link
                href={`/shop?brand=${product.brand.slug}`}
                className="text-sm text-primary/80 font-semibold uppercase tracking-wide hover:text-primary transition-colors w-fit"
              >
                {product.brand.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(avgRating) ? "fill-warning text-warning" : "text-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white/80">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-white/40">
                ({product._count?.reviews?.toLocaleString("en-IN") || 0} reviews)
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs border border-warning/20">
                  ⚡ Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Price */}
            <div className="glass-card p-5 space-y-2">
              {product.offerPrice ? (
                <>
                  <div className="price-offer text-3xl">{formatINR(product.offerPrice)}</div>
                  <div className="flex items-center gap-3">
                    <span className="price-original text-base">{formatINR(product.price)}</span>
                    <span className="badge-sale text-xs">{discount}% OFF</span>
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <Check className="w-4 h-4" />
                    You save {formatINR(savings)} on this order!
                  </div>
                  <p className="text-xs text-white/30">
                    Inclusive of all taxes. GST {product.gstRate}% included.
                  </p>
                </>
              ) : (
                <div className="price-offer text-3xl">{formatINR(product.price)}</div>
              )}
            </div>

            {/* Short description */}
            {product.shortDesc && (
              <p className="text-white/60 leading-relaxed">{product.shortDesc}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/50">Quantity:</span>
              <div className="flex items-center gap-3 glass border border-white/10 rounded-2xl px-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-white/30">{product.stock} available</span>
            </div>

            {/* Add to Cart / Wishlist */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => addItem(product, quantity)}
                disabled={product.status === "OUT_OF_STOCK"}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.status === "OUT_OF_STOCK" ? "Out of Stock" : "Add to Cart"}
              </motion.button>

              <button
                onClick={() => toggle(product.id)}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
                  isWishlisted
                    ? "bg-accent/15 border-accent/40 text-accent"
                    : "glass border-white/10 text-white/50 hover:border-accent/30 hover:text-accent"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-accent" : ""}`} />
              </button>

              <button className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Buy Now */}
            <Link href="/checkout">
              <button
                onClick={() => addItem(product, quantity)}
                className="w-full py-4 rounded-2xl border border-secondary/40 text-secondary font-semibold text-base hover:bg-secondary/10 hover:shadow-neon-cyan transition-all"
              >
                ⚡ Buy Now — {formatINR((product.offerPrice || product.price) * quantity)}
              </button>
            </Link>

            {/* Delivery info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Fast Delivery", sub: "2-5 business days" },
                { icon: Shield, label: "Secure Pay", sub: "Razorpay encrypted" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass p-3 rounded-xl text-center border border-white/5">
                  <Icon className="w-4 h-4 text-secondary mx-auto mb-1" />
                  <p className="text-xs font-medium text-white/70">{label}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* SKU */}
            <p className="text-xs text-white/25">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <div className="mt-16">
          <div className="flex gap-1 p-1 glass-strong rounded-2xl w-fit mb-8">
            {(["overview", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-lg"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {tab === "specs" ? "Specifications" : tab === "overview" ? "Overview" : "Reviews"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="glass-card p-8 max-w-4xl">
                  <p className="text-white/70 leading-relaxed text-base whitespace-pre-line">
                    {product.description}
                  </p>

                  {product.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/40 border border-white/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specs" && product.specifications && (
                <div className="glass-card p-8 max-w-2xl">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], i) => (
                        <tr key={key} className={i % 2 === 0 ? "bg-white/2" : ""}>
                          <td className="py-3 pr-8 text-sm text-white/40 font-medium w-40">{key}</td>
                          <td className="py-3 text-sm text-white/80">{value as string}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6 max-w-3xl">
                  {/* Overall Rating Card */}
                  <div className="glass-card p-6 flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold gradient-text">{avgRating.toFixed(1)}</div>
                      <div className="flex mt-2 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(avgRating) ? "fill-warning text-warning" : "text-white/20"}`} />
                        ))}
                      </div>
                      <div className="text-xs text-white/40 mt-1">{product._count?.reviews?.toLocaleString("en-IN") || 0} reviews</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-white/40 w-4">{star}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-warning to-yellow-500"
                              style={{ width: `${star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : star === 2 ? 1 : 1}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="glass-card p-5 border border-white/5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {review.user?.image ? (
                                <Image
                                  src={review.user.image}
                                  alt={review.user.name || "User"}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/25 text-primary flex items-center justify-center font-bold text-sm">
                                  {review.user?.name ? review.user.name[0].toUpperCase() : "U"}
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-semibold text-white">{review.user?.name || "Verified Customer"}</h4>
                                <p className="text-[10px] text-white/30">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-warning text-warning" : "text-white/10"}`} />
                              ))}
                            </div>
                          </div>
                          {review.title && <h5 className="text-sm font-semibold text-white/90">{review.title}</h5>}
                          <p className="text-sm text-white/60 leading-relaxed">{review.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/30 text-center py-4">Be the first to review this product!</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
