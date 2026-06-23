"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  X,
  Star,
  LayoutGrid,
  LayoutList,
  Filter,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, Category } from "@/types";

const sortOptions = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Best Selling", value: "best_selling" },
  { label: "Highest Rated", value: "highest_rated" },
];

const priceRanges = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000 – ₹50,000", min: 15000, max: 50000 },
  { label: "₹50,000 – ₹1,50,000", min: 50000, max: 150000 },
  { label: "Above ₹1,50,000", min: 150000, max: Infinity },
];

interface ShopClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ShopClient({ initialProducts, initialCategories }: ShopClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let products = [...initialProducts];

    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category?.slug === selectedCategory);
    }

    if (priceRange) {
      products = products.filter((p) => {
        const price = p.offerPrice || p.price;
        return price >= priceRange.min && price <= priceRange.max;
      });
    }

    if (minRating > 0) {
      products = products.filter((p) => (p.avgRating || 0) >= minRating);
    }

    if (inStockOnly) {
      products = products.filter((p) => p.stock > 0);
    }

    if (discountOnly) {
      products = products.filter((p) => p.offerPrice !== undefined);
    }

    switch (sortBy) {
      case "price_asc":
        products.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        break;
      case "price_desc":
        products.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        break;
      case "highest_rated":
        products.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case "best_selling":
        products.sort((a, b) => (b._count?.reviews || 0) - (a._count?.reviews || 0));
        break;
      default:
        // newest first (default)
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return products;
  }, [initialProducts, search, selectedCategory, priceRange, minRating, inStockOnly, discountOnly, sortBy]);

  const activeFilters = [
    selectedCategory !== "all" && initialCategories.find(c => c.slug === selectedCategory)?.name || null,
    priceRange && "Price Filter",
    minRating > 0 && `${minRating}+ Stars`,
    inStockOnly && "In Stock",
    discountOnly && "On Sale",
  ].filter(Boolean);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="relative py-16 grid-bg border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">
              ✦ All Products
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Shop <span className="gradient-text">Everything</span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Explore our curated collection of luxury & flagship products across India
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 glass border border-white/10 rounded-2xl px-4 py-3">
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/80 outline-none cursor-pointer bg-transparent appearance-none pr-8 min-w-[180px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
              filterOpen
                ? "bg-primary/20 border-primary/40 text-primary"
                : "glass border-white/10 text-white/70"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex glass border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 transition-all ${viewMode === "grid" ? "bg-primary/20 text-primary" : "text-white/40"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 transition-all ${viewMode === "list" ? "bg-primary/20 text-primary" : "text-white/40"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="glass-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Category */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Category</h4>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedCategory === "all" ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      All Categories
                    </button>
                    {initialCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedCategory === cat.slug ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Price Range</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setPriceRange(null)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                        !priceRange ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      All Prices
                    </button>
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange(range)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                          priceRange?.label === range.label ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Min Rating</h4>
                  <div className="space-y-1.5">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                          minRating === rating ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {rating === 0 ? "All Ratings" : (
                          <>
                            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                            {rating}+ Stars
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Availability</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span className="text-sm text-white/60">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={discountOnly}
                        onChange={(e) => setDiscountOnly(e.target.checked)}
                        className="w-4 h-4 rounded accent-primary"
                      />
                      <span className="text-sm text-white/60">On Sale Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((filter) => (
              <span key={filter as string} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-sm text-primary">
                {filter as string}
                <button onClick={() => {
                  if (filter === selectedCategory || initialCategories.find(c => c.name === filter)?.slug === selectedCategory) setSelectedCategory("all");
                  if (filter === "Price Filter") setPriceRange(null);
                  if (typeof filter === "string" && filter.includes("Stars")) setMinRating(0);
                  if (filter === "In Stock") setInStockOnly(false);
                  if (filter === "On Sale") setDiscountOnly(false);
                }}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-white/40 mb-6">
          Showing <span className="text-white/70">{filtered.length}</span> products
        </p>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-white/40">No products found</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("all"); setPriceRange(null); setMinRating(0); setInStockOnly(false); setDiscountOnly(false); }}
              className="btn-secondary text-sm py-2 px-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 max-w-3xl"
            }`}
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
