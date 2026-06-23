"use client";

import { useRef, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Shield,
  Truck,
  RefreshCw,
  Headphones,
  Star,
  Package,
  Zap,
  Globe,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { mockReviews } from "@/lib/mockData";
import type { Product, Category } from "@/types";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <div className="w-full h-full bg-transparent" /> }
);

const featureCards = [
  { icon: Truck, title: "Lightning Delivery", desc: "Same day & next day delivery across 500+ cities in India", color: "#00F5FF" },
  { icon: Shield, title: "100% Secure", desc: "Bank-grade encryption & Razorpay secure payment gateway", color: "#7C3AED" },
  { icon: RefreshCw, title: "Easy Returns", desc: "Hassle-free 30-day returns with full refund guarantee", color: "#FF00FF" },
  { icon: Headphones, title: "24x7 Support", desc: "Expert support team available round the clock in Hindi & English", color: "#F59E0B" },
  { icon: Package, title: "Authentic Products", desc: "100% genuine products with manufacturer warranty", color: "#22C55E" },
  { icon: Globe, title: "PAN India Shipping", desc: "Free shipping on orders above ₹999 across all 28 states", color: "#00F5FF" },
];

interface HomeClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function HomeClient({ initialProducts, initialCategories }: HomeClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const featuredProducts = initialProducts.filter((p) => p.featured).slice(0, 4);
  const trendingProducts = initialProducts.filter((p) => p.trending);

  return (
    <div className="relative overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden grid-bg"
        id="hero"
      >
        {/* Aurora background */}
        <div className="absolute inset-0 hero-gradient pointer-events-none" />

        {/* 3D Scene */}
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
        >
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
              <span className="text-sm text-white/70 font-medium">
                India's Next Generation 3D Commerce Platform
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-title mb-6"
            >
              <span className="text-white">Experience</span>
              <br />
              <span className="gradient-text">Shopping</span>
              <br />
              <span className="text-white/90">Beyond</span>{" "}
              <span className="neon-text-cyan">Reality</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hero-subtitle mb-10 max-w-xl"
            >
              Discover premium products with immersive 3D experiences,
              cinematic storytelling, and Apple-quality design — made for
              Bharat's boldest shoppers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/shop" className="magnetic-btn">
                <button className="btn-primary flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4" />
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/luxury">
                <button className="btn-secondary flex items-center gap-2 text-base">
                  Shop Now
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap gap-8 mt-14"
            >
              {[
                { label: "Products", value: "10,000+" },
                { label: "Happy Customers", value: "5 Lakh+" },
                { label: "Cities Delivered", value: "500+" },
                { label: "Avg Rating", value: "4.9★" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-bold font-heading gradient-text-purple-cyan">
                    {value}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30 uppercase tracking-widest">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-primary/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-24 relative" id="featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="✦ Featured"
            title="Handpicked for You"
            subtitle="Curated selection of the most coveted products across all categories"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/shop">
              <button className="btn-secondary flex items-center gap-2">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-24 relative" id="categories">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="✦ Categories"
            title="Shop by Category"
            subtitle="From cutting-edge electronics to luxury fashion, find everything you love"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-12">
            {initialCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link href={`/shop?category=${cat.slug}`}>
                  <div className="category-card glass-card p-4 text-center group">
                    <div
                      className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}30` }}
                    >
                      {cat.icon}
                    </div>
                    <p className="text-xs font-medium text-white/70 group-hover:text-white transition-colors leading-tight">
                      {cat.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRENDING / AI RECOMMENDATIONS ============ */}
      <section className="py-24 relative" id="trending">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="✦ AI Picks"
            title="Trending In India"
            subtitle="AI-curated selections based on what millions of Indians are loving right now"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {trendingProducts.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="py-24 relative" id="features">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="✦ Why NovaMart"
            title="Built for India's Best"
            subtitle="Every feature designed to give you the most premium shopping experience"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-6 group"
              >
                <div
                  className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}
                >
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <h3 className="font-subheading text-base font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="py-24 relative overflow-hidden" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="✦ Reviews"
            title="Loved Across India"
            subtitle="Join over 5 lakh happy customers who chose NovaMart"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {mockReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="review-card p-6 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                    <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.name}</p>
                    <p className="text-xs text-white/40">{review.city} · {review.date}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-warning text-warning" : "text-white/20"}`} />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-white/70 leading-relaxed mb-3">
                  "{review.review}"
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">Purchased:</span>
                  <span className="text-xs text-primary/80">{review.product}</span>
                  <span className="ml-auto text-xs text-success">✓ Verified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 relative overflow-hidden" id="cta">
        <div className="absolute inset-0 tunnel-bg pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Glowing rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[400, 600, 800].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                top: -size / 2,
                left: -size / 2,
                borderColor: i === 0 ? "rgba(124,58,237,0.3)" : i === 1 ? "rgba(0,245,255,0.2)" : "rgba(255,0,255,0.1)",
              }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-secondary/30 mb-6">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/70">Join 5,00,000+ Premium Shoppers</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Ready To Upgrade
              <br />
              <span className="gradient-text">Your Shopping</span>
              <br />
              Experience?
            </h2>

            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join millions of Indians experiencing the future of shopping with NovaMart's
              immersive 3D commerce platform.
            </p>

            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
              {[
                { label: "Free Shipping", sublabel: "On orders above ₹999" },
                { label: "Secure Payments", sublabel: "100% encrypted" },
                { label: "Easy Returns", sublabel: "30-day hassle-free" },
              ].map(({ label, sublabel }) => (
                <div key={label} className="text-center">
                  <div className="text-sm font-semibold text-white/80">{label}</div>
                  <div className="text-xs text-white/30">{sublabel}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto"
    >
      <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 block">
        {eyebrow}
      </span>
      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        {title}
      </h2>
      <p className="text-white/50 text-base leading-relaxed">{subtitle}</p>
    </motion.div>
  );
}
