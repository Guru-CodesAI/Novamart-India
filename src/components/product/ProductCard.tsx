"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye, Zap } from "lucide-react";
import { formatINR, getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const { addItem } = useCartStore();
  const { toggle, hasItem } = useWishlistStore();

  const isWishlisted = mounted ? hasItem(product.id) : false;
  const discount = product.offerPrice
    ? getDiscountPercent(product.price, product.offerPrice)
    : 0;

  const avgRating = product.avgRating || 4.5;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setHovered(true)}
        className="group relative glass-card cursor-pointer overflow-hidden"
      >
        {/* Neon glow on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,245,255,0.05))",
            boxShadow: "inset 0 0 30px rgba(124,58,237,0.1)",
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.newArrival && <span className="badge-new">New</span>}
          {product.trending && <span className="badge-hot">🔥 Hot</span>}
          {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
          {product.luxuryItem && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold border border-yellow-500/30 uppercase">
              Luxury
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center transition-all hover:border-accent/30"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isWishlisted ? "fill-accent text-accent" : "text-white/50"
            }`}
          />
        </button>

        {/* Product Image — no outer Link to avoid nested <a> with title Link below */}
        <div
          className="relative h-52 bg-gradient-to-br from-white/5 to-transparent overflow-hidden cursor-pointer"
          onClick={() => router.push(`/product/${product.slug}`)}
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-contain p-4 transition-transform duration-500 ${
                hovered ? "scale-110" : "scale-100"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                <Zap className="w-10 h-10 text-white/10" />
              </div>
            </div>
          )}

          {/* Hover overlay — button not anchor to avoid nesting */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center gap-3"
          >
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/product/${product.slug}`); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white hover:bg-white/20 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            {product.brand && (
              <span className="text-xs text-primary/80 font-medium uppercase tracking-wide">
                {product.brand.name}
              </span>
            )}
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-subheading text-sm font-medium text-white/90 leading-snug line-clamp-2 mb-2 hover:text-white transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(avgRating)
                      ? "fill-warning text-warning"
                      : "text-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/40">
              {avgRating.toFixed(1)} ({product._count?.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
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

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => addItem(product)}
              disabled={product.status === "OUT_OF_STOCK"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/30 hover:shadow-neon-purple transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {product.status === "OUT_OF_STOCK" ? "Sold Out" : "Add"}
            </motion.button>
          </div>

          {/* Stock warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-[10px] text-warning/80 mt-2">
              ⚡ Only {product.stock} left in stock!
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
