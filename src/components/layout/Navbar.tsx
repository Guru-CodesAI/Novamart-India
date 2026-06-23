"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Zap,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { CartDrawer } from "@/components/cart/CartDrawer";

const navLinks = [
  {
    label: "Shop",
    href: "/shop",
    dropdown: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?filter=new" },
      { label: "Best Sellers", href: "/shop?filter=best" },
      { label: "Luxury Collection", href: "/shop?filter=luxury" },
    ],
  },
  {
    label: "Categories",
    href: "/categories",
    dropdown: [
      { label: "Electronics", href: "/shop?category=electronics" },
      { label: "Fashion", href: "/shop?category=fashion" },
      { label: "Gaming", href: "/shop?category=gaming" },
      { label: "Home & Living", href: "/shop?category=home-living" },
      { label: "Mobiles", href: "/shop?category=mobiles" },
      { label: "Accessories", href: "/shop?category=accessories" },
    ],
  },
  { label: "Deals", href: "/deals" },
  { label: "Luxury", href: "/luxury" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();
  const { getItemCount, openCart, isOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "nav-blur shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-80 group-hover:opacity-100 transition-opacity" />
                <Zap className="relative w-full h-full p-1.5 text-white" />
              </div>
              <div>
                <span className="font-heading text-lg font-bold gradient-text">
                  NovaMart
                </span>
                <span className="text-xs text-white/40 font-body block leading-none">
                  INDIA
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {link.dropdown && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 glass rounded-2xl p-2 shadow-xl shadow-black/40 border border-white/10"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {session ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-white/10 hover:border-primary/30 transition-all">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white/70" />
                    )}
                    <span className="text-sm text-white/80 max-w-[80px] truncate">
                      {session.user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-52 glass rounded-2xl p-2 shadow-xl shadow-black/40 border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link href="/dashboard/orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    {session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                      <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-accent hover:bg-accent/10 transition-all">
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hidden sm:flex btn-primary text-sm py-2 px-4"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 nav-blur"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-white/5">
                  {session ? (
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="flex items-center justify-center btn-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-strong rounded-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-white/30"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                    }
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-white/40 hover:text-white" />
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/30 mb-2">POPULAR SEARCHES</p>
                <div className="flex flex-wrap gap-2">
                  {["iPhone 17", "Samsung Galaxy", "RTX 5090", "Nike Air Max", "Sony WH-1000XM6"].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        window.location.href = `/shop?search=${encodeURIComponent(q)}`;
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-primary/20 hover:text-white transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
