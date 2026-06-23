"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Heart, MapPin, CreditCard, RotateCcw, Settings,
  ChevronRight, Star, Check, Clock, Truck, Home, User
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

const navItems = [
  { icon: Package, label: "My Orders", key: "orders" },
  { icon: Heart, label: "Wishlist", key: "wishlist" },
  { icon: MapPin, label: "Addresses", key: "addresses" },
  { icon: CreditCard, label: "Payment Methods", key: "payments" },
  { icon: RotateCcw, label: "Returns", key: "returns" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const mockOrders = [
  {
    id: "NVM12345678",
    date: new Date("2025-01-20"),
    status: "DELIVERED",
    total: 149999,
    items: [{ name: "iPhone 17 Pro Max", qty: 1, price: 149999, image: "" }],
  },
  {
    id: "NVM87654321",
    date: new Date("2025-01-15"),
    status: "SHIPPED",
    total: 59999,
    items: [{ name: "Sony PS5 Pro", qty: 1, price: 59999, image: "" }],
  },
  {
    id: "NVM11223344",
    date: new Date("2025-01-10"),
    status: "CONFIRMED",
    total: 29990,
    items: [{ name: "Sony WH-1000XM6", qty: 1, price: 29990, image: "" }],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Check }> = {
  PENDING: { label: "Pending", color: "text-warning", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "text-primary", icon: Check },
  PACKED: { label: "Packed", color: "text-primary", icon: Package },
  SHIPPED: { label: "Shipped", color: "text-secondary", icon: Truck },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "text-secondary", icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-success", icon: Check },
  CANCELLED: { label: "Cancelled", color: "text-red-400", icon: RotateCcw },
};

const trackingSteps = [
  { status: "CONFIRMED", label: "Order Confirmed", sub: "Your order has been placed" },
  { status: "PACKED", label: "Packed", sub: "Your item is being packed" },
  { status: "SHIPPED", label: "Shipped", sub: "In transit to your location" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", sub: "With delivery partner" },
  { status: "DELIVERED", label: "Delivered", sub: "Package delivered" },
];

interface DashboardClientProps {
  defaultSection?: string;
}

export default function DashboardClient({ defaultSection = "orders" }: DashboardClientProps) {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const order = selectedOrder ? mockOrders.find((o) => o.id === selectedOrder) : null;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4 sticky top-24">
              {/* User Card */}
              <div className="flex items-center gap-3 p-3 mb-4 border-b border-white/5 pb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Arjun Sharma</p>
                  <p className="text-xs text-white/40">arjun@example.com</p>
                  <p className="text-xs text-primary/80 mt-0.5">⭐ Premium Member</p>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {navItems.map(({ icon: Icon, label, key }) => (
                  <button
                    key={key}
                    onClick={() => { setActiveSection(key); setSelectedOrder(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === key
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders */}
            {activeSection === "orders" && !selectedOrder && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="font-heading text-xl font-semibold mb-4">My Orders</h2>
                {mockOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <div key={order.id} className="glass-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-sm font-mono text-white/60">#{order.id}</p>
                          <p className="text-xs text-white/30">{formatDate(order.date)}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-sm font-medium ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </div>

                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                            📦
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 truncate">{item.name}</p>
                            <p className="text-xs text-white/40">Qty: {item.qty}</p>
                          </div>
                          <span className="text-sm font-bold text-secondary">{formatINR(item.price)}</span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-white/30">Order Total: </span>
                          <span className="font-bold text-secondary">{formatINR(order.total)}</span>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order.id)}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
                        >
                          Track Order
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Order Tracking */}
            {activeSection === "orders" && selectedOrder && order && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
                >
                  ← Back to Orders
                </button>

                <div className="glass-card p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="font-heading text-xl font-bold">Order #{order.id}</h2>
                      <p className="text-sm text-white/40">{formatDate(order.date)}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${statusConfig[order.status].color}`}>
                      {order.status === "DELIVERED" ? "✓" : "⏳"} {statusConfig[order.status].label}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-6 relative">
                    {trackingSteps.map((step, i) => {
                      const currentIdx = trackingSteps.findIndex((s) => s.status === order.status);
                      const isDone = i <= currentIdx;
                      const isCurrent = i === currentIdx;

                      return (
                        <div key={step.status} className="timeline-step">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                              isDone
                                ? isCurrent
                                  ? "bg-primary shadow-neon-purple"
                                  : "bg-success"
                                : "bg-white/10"
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-white/30" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className={`font-medium text-sm ${isDone ? "text-white" : "text-white/30"}`}>
                              {step.label}
                            </p>
                            <p className={`text-xs mt-0.5 ${isDone ? "text-white/50" : "text-white/20"}`}>
                              {step.sub}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Wishlist */}
            {activeSection === "wishlist" && (
              <div>
                <h2 className="font-heading text-xl font-semibold mb-4">My Wishlist</h2>
                <div className="glass-card p-12 text-center">
                  <Heart className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40">Your wishlist is empty</p>
                  <Link href="/shop" className="btn-primary inline-flex mt-4">
                    Start Exploring
                  </Link>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeSection === "settings" && (
              <div>
                <h2 className="font-heading text-xl font-semibold mb-4">Account Settings</h2>
                <div className="glass-card p-6 space-y-4">
                  {[
                    { label: "Full Name", value: "Arjun Sharma", type: "text" },
                    { label: "Email Address", value: "arjun@example.com", type: "email" },
                    { label: "Mobile Number", value: "+91 98765 43210", type: "tel" },
                  ].map(({ label, value, type }) => (
                    <div key={label}>
                      <label className="text-xs text-white/40 mb-1.5 block">{label}</label>
                      <input type={type} defaultValue={value} className="form-input" />
                    </div>
                  ))}
                  <button className="btn-primary mt-2">Save Changes</button>
                </div>
              </div>
            )}

            {/* Addresses */}
            {activeSection === "addresses" && (
              <div>
                <h2 className="font-heading text-xl font-semibold mb-4">Saved Addresses</h2>
                <div className="glass-card p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">Home</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
                          Default
                        </span>
                      </div>
                      <p className="text-sm text-white/50">Arjun Sharma</p>
                      <p className="text-sm text-white/50">12A, Prestige Towers, MG Road, Koramangala</p>
                      <p className="text-sm text-white/50">Bengaluru, Karnataka — 560034</p>
                      <p className="text-sm text-white/50">📱 +91 98765 43210</p>
                    </div>
                    <button className="text-xs text-primary hover:text-primary-light transition-colors">Edit</button>
                  </div>
                  <button className="mt-4 flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors">
                    <MapPin className="w-4 h-4" />
                    Add New Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
