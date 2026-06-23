"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Package, Users, ShoppingBag, DollarSign,
  BarChart3, Settings, Plus, Search, ChevronRight,
  AlertTriangle, CheckCircle, Clock, ArrowUpRight,
  Tag, Zap, LayoutDashboard,
} from "lucide-react";
import { formatINR, formatINRShort, formatDate } from "@/lib/utils";
import { mockProducts } from "@/lib/mockData";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", key: "overview" },
  { icon: Package, label: "Products", key: "products" },
  { icon: ShoppingBag, label: "Orders", key: "orders" },
  { icon: Users, label: "Customers", key: "customers" },
  { icon: Tag, label: "Coupons", key: "coupons" },
  { icon: BarChart3, label: "Analytics", key: "analytics" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const stats = [
  {
    label: "Today's Revenue",
    value: 52450,
    change: "+18.2%",
    positive: true,
    icon: DollarSign,
    color: "#22C55E",
  },
  {
    label: "This Month",
    value: 845900,
    change: "+34.5%",
    positive: true,
    icon: TrendingUp,
    color: "#7C3AED",
  },
  {
    label: "This Year",
    value: 12450000,
    change: "+127%",
    positive: true,
    icon: BarChart3,
    color: "#00F5FF",
  },
  {
    label: "Total Orders",
    value: 4821,
    change: "+12.3%",
    positive: true,
    icon: ShoppingBag,
    color: "#F59E0B",
    isCount: true,
  },
  {
    label: "Total Customers",
    value: 28945,
    change: "+8.7%",
    positive: true,
    icon: Users,
    color: "#FF00FF",
    isCount: true,
  },
  {
    label: "Low Stock",
    value: 12,
    change: "3 critical",
    positive: false,
    icon: AlertTriangle,
    color: "#EF4444",
    isCount: true,
  },
];

const recentOrders = [
  { id: "NVM91827364", customer: "Arjun Sharma", items: 2, total: 149999, status: "CONFIRMED", city: "Chennai" },
  { id: "NVM82736451", customer: "Priya Nair", items: 1, total: 379900, status: "SHIPPED", city: "Bengaluru" },
  { id: "NVM73645281", customer: "Rahul Gupta", items: 3, total: 29990, status: "DELIVERED", city: "Mumbai" },
  { id: "NVM64531728", customer: "Kavya Menon", items: 1, total: 84900, status: "PENDING", city: "Hyderabad" },
  { id: "NVM55421836", customer: "Vikram Singh", items: 2, total: 59999, status: "OUT_FOR_DELIVERY", city: "Delhi" },
];

const statusColors: Record<string, string> = {
  PENDING: "text-warning bg-warning/10 border-warning/20",
  CONFIRMED: "text-primary bg-primary/10 border-primary/20",
  SHIPPED: "text-secondary bg-secondary/10 border-secondary/20",
  OUT_FOR_DELIVERY: "text-secondary bg-secondary/10 border-secondary/20",
  DELIVERED: "text-success bg-success/10 border-success/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [productSearch, setProductSearch] = useState("");

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-16 bottom-0 glass border-r border-white/5 flex flex-col py-6 overflow-y-auto z-40 hidden lg:flex">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold gradient-text">NovaMart</p>
              <p className="text-[10px] text-white/30">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {sidebarItems.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
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

        <div className="px-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 p-3 rounded-xl glass border border-white/5">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-white/40">System Healthy</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6">
        {/* Overview */}
        {activeSection === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-2xl font-bold">Dashboard Overview</h1>
                <p className="text-sm text-white/40 mt-0.5">Welcome back! Here's what's happening.</p>
              </div>
              <div className="text-sm text-white/40">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                    >
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.positive ? "text-success" : "text-red-400"}`}>
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-heading mb-1" style={{ color: stat.color }}>
                    {stat.isCount ? stat.value.toLocaleString("en-IN") : formatINRShort(stat.value)}
                  </div>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Revenue Bar Chart (Visual Mockup) */}
            <div className="glass-card p-6 mb-6">
              <h3 className="font-subheading text-base font-semibold mb-4">Monthly Revenue</h3>
              <div className="flex items-end gap-2 h-32">
                {[30, 45, 60, 40, 75, 55, 80, 65, 90, 70, 85, 95].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, #7C3AED, #00F5FF)`,
                        opacity: i === 11 ? 1 : 0.4 + (i / 20),
                      }}
                    />
                    <span className="text-[8px] text-white/25">
                      {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-subheading text-base font-semibold">Recent Orders</h3>
                <button
                  onClick={() => setActiveSection("orders")}
                  className="text-xs text-primary hover:text-primary-light transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>City</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-mono text-xs text-white/60">#{order.id.slice(-8)}</td>
                      <td className="text-sm font-medium">{order.customer}</td>
                      <td className="text-xs text-white/50">{order.city}</td>
                      <td className="text-xs text-white/50">{order.items} items</td>
                      <td className="text-sm font-bold text-secondary">{formatINR(order.total)}</td>
                      <td>
                        <span className={`text-xs px-2 py-1 rounded-lg border ${statusColors[order.status]}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Products */}
        {activeSection === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-heading text-2xl font-bold">Products</h1>
              <button className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 flex items-center gap-2 glass border border-white/10 rounded-2xl px-4 py-2.5">
                <Search className="w-4 h-4 text-white/30" />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm">
                            📦
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/90">{product.name}</p>
                            <p className="text-xs text-white/30">{product.brand?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-white/40">{product.sku}</td>
                      <td>
                        <div>
                          {product.offerPrice && (
                            <div className="text-xs text-success">{formatINR(product.offerPrice)}</div>
                          )}
                          <div className={`text-sm ${product.offerPrice ? "line-through text-white/30 text-xs" : "font-bold text-secondary"}`}>
                            {formatINR(product.price)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`text-sm font-medium ${product.stock <= 5 ? "text-red-400" : product.stock <= 20 ? "text-warning" : "text-success"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs px-2 py-1 rounded-lg border ${
                          product.status === "ACTIVE"
                            ? "text-success bg-success/10 border-success/20"
                            : "text-red-400 bg-red-400/10 border-red-400/20"
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="text-xs text-primary hover:text-primary-light transition-colors px-2 py-1">Edit</button>
                          <button className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Other sections placeholder */}
        {!["overview", "products"].includes(activeSection) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px] glass-card"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary/50" />
            </div>
            <h2 className="font-heading text-xl font-semibold mb-2 capitalize">{activeSection}</h2>
            <p className="text-white/40 text-sm">This section is coming soon.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
