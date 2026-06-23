"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { mockProducts } from "@/lib/mockData";
import { formatINR, getDiscountPercent } from "@/lib/utils";
import Image from "next/image";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { items: wishlistIds, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const wishlistProducts = mounted ? mockProducts.filter((p) => wishlistIds.includes(p.id)) : [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <Heart className="w-5 h-5 text-accent fill-accent" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">My Wishlist</h1>
            <p className="text-sm text-white/40">{wishlistProducts.length} items saved</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] glass-card">
            <Heart className="w-16 h-16 text-white/10 mb-4" />
            <h2 className="font-heading text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-white/40 mb-6">Save items you love and come back later</p>
            <Link href="/shop" className="btn-primary">Start Exploring</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product, i) => {
              const discount = product.offerPrice
                ? getDiscountPercent(product.price, product.offerPrice)
                : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card overflow-hidden group"
                >
                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative h-48 bg-white/5">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 badge-sale">{discount}% OFF</span>
                    )}
                  </div>

                  <div className="p-4">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-sm font-medium text-white/90 line-clamp-2 mb-2 hover:text-white transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-end justify-between mb-3">
                      <div>
                        {product.offerPrice ? (
                          <>
                            <div className="price-offer">{formatINR(product.offerPrice)}</div>
                            <div className="price-original">{formatINR(product.price)}</div>
                          </>
                        ) : (
                          <div className="price-offer">{formatINR(product.price)}</div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addItem(product);
                        removeItem(product.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/30 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Move to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
