"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Star, Crown, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { mockProducts } from "@/lib/mockData";

const luxuryProducts = mockProducts.filter((p) => p.luxuryItem);

export default function LuxuryPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-primary/10 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Gold particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-yellow-500/30 mb-6">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400/80">Exclusive Luxury Collection</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-7xl font-bold mb-6">
              <span className="text-white">The Finest</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                In The World
              </span>
            </h1>

            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
              An exclusive curation of the world's most prestigious and rare products,
              reserved for those who demand nothing but perfection.
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              {[
                { value: "100%", label: "Authentic" },
                { value: "24/7", label: "Concierge" },
                { value: "Same Day", label: "Delivery" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{value}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {luxuryProducts.length > 0 ? (
            luxuryProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))
          ) : (
            mockProducts.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
