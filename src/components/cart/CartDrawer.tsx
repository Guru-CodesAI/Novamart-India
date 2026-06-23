"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, Heart, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatINR, calculateGST } from "@/lib/utils";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    getActiveItems,
    getSavedItems,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    getSubtotal,
  } = useCartStore();

  const activeItems = getActiveItems();
  const savedItems = getSavedItems();
  const subtotal = getSubtotal();
  const discount = 0; // Apply coupon logic
  const gst = calculateGST(subtotal - discount, 18);
  const total = subtotal - discount + gst;
  const shipping = subtotal > 999 ? 0 : 99;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full sm:w-[420px] flex flex-col cart-drawer overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold">Your Cart</h2>
                  <p className="text-xs text-white/40">{activeItems.length} items</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm">Your cart is empty</p>
                  <Link href="/shop" onClick={closeCart} className="btn-primary text-sm py-2 px-4">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                activeItems.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-3 rounded-2xl"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white/90 truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-secondary font-bold text-sm">
                            {formatINR(item.product.offerPrice || item.product.price)}
                          </span>
                          {item.product.offerPrice && (
                            <span className="text-white/30 text-xs line-through">
                              {formatINR(item.product.price)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 glass rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => saveForLater(item.product.id)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-secondary hover:bg-secondary/10 transition-all"
                              title="Save for later"
                            >
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                    Saved for Later ({savedItems.length})
                  </p>
                  {savedItems.map((item) => (
                    <div key={item.product.id} className="glass p-3 rounded-xl border border-white/5 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden">
                          {item.product.images[0] && (
                            <Image src={item.product.images[0]} alt={item.product.name} width={48} height={48} className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/70 truncate">{item.product.name}</p>
                          <p className="text-xs text-secondary">{formatINR(item.product.offerPrice || item.product.price)}</p>
                        </div>
                        <button
                          onClick={() => moveToCart(item.product.id)}
                          className="text-xs text-primary hover:text-primary-light transition-colors"
                        >
                          Move to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary + Checkout */}
            {activeItems.length > 0 && (
              <div className="p-4 border-t border-white/5 space-y-3">
                {/* Coupon */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 glass border border-white/10 rounded-xl px-3 py-2.5">
                    <Tag className="w-4 h-4 text-white/30" />
                    <input
                      placeholder="Coupon code"
                      className="bg-transparent text-sm text-white/80 outline-none placeholder:text-white/25 flex-1"
                    />
                  </div>
                  <button className="px-4 py-2.5 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all">
                    Apply
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="glass rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount</span>
                      <span>-{formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-white/60">
                    <span>GST (18%)</span>
                    <span>{formatINR(gst)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-success" : ""}>
                      {shipping === 0 ? "FREE" : formatINR(shipping)}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-secondary">{formatINR(total + shipping)}</span>
                  </div>
                </div>

                {/* Free shipping notice */}
                {shipping > 0 && (
                  <p className="text-xs text-center text-white/30">
                    Add {formatINR(999 - subtotal)} more for FREE shipping
                  </p>
                )}

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark font-semibold text-white hover:shadow-neon-purple transition-all duration-300 group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="flex items-center justify-center text-sm text-white/40 hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
