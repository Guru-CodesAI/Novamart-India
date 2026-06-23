"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatINR, calculateGST } from "@/lib/utils";
import {
  MapPin,
  CreditCard,
  ChevronRight,
  Check,
  Shield,
  Smartphone,
  Banknote,
  Wallet,
  Package,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const steps = ["Address", "Payment", "Review"];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry",
];

const paymentMethods = [
  { id: "upi_gpay", label: "Google Pay", icon: "🟢", category: "UPI" },
  { id: "upi_phonepe", label: "PhonePe", icon: "💜", category: "UPI" },
  { id: "upi_paytm", label: "Paytm", icon: "🔵", category: "UPI" },
  { id: "upi_other", label: "Other UPI", icon: "⚡", category: "UPI" },
  { id: "card_credit", label: "Credit Card", icon: "💳", category: "Card" },
  { id: "card_debit", label: "Debit Card", icon: "💳", category: "Card" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", category: "Banking" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", category: "COD" },
];

export default function CheckoutPage() {
  const { getActiveItems, getSubtotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("upi_gpay");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = mounted ? getActiveItems() : [];
  const subtotal = mounted ? getSubtotal() : 0;
  const discount = Math.round(subtotal * 0.05); // 5% example
  const gst = calculateGST(subtotal - discount, 18);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99; // If subtotal is 0 (like during SSR), we show 0 shipping or let it compute
  const total = subtotal - discount + gst + shipping;

  const [address, setAddress] = useState({
    name: "", mobile: "", email: "", houseNo: "", street: "",
    area: "", city: "", district: "", state: "Karnataka", pincode: "",
  });

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    const generatedId = "NVM" + Date.now().toString().slice(-8).toUpperCase();
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center glass-card p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-success" />
          </motion.div>
          <h2 className="font-heading text-3xl font-bold mb-2">Order Placed!</h2>
          <p className="text-white/50 mb-4">
            Your order has been confirmed and is being processed.
          </p>
          <div className="glass rounded-2xl p-4 mb-6">
            <p className="text-xs text-white/40">Order ID</p>
            <p className="font-mono text-xl text-secondary font-bold">{orderId}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/orders" className="flex-1 btn-primary py-3 text-center">
              Track Order
            </Link>
            <Link href="/shop" className="flex-1 btn-secondary py-3 text-center">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  i === currentStep
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : i < currentStep
                    ? "text-success"
                    : "text-white/30"
                }`}
              >
                {i < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full border text-xs flex items-center justify-center border-current">
                    {i + 1}
                  </span>
                )}
                {step}
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white/20" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 0: Address */}
              {currentStep === 0 && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <h2 className="font-subheading text-lg font-semibold">Delivery Address</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", key: "name", type: "text", placeholder: "Arjun Sharma" },
                      { label: "Mobile Number", key: "mobile", type: "tel", placeholder: "98765 43210" },
                      { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                      { label: "House / Flat No.", key: "houseNo", type: "text", placeholder: "12A, Prestige Towers" },
                      { label: "Street / Road", key: "street", type: "text", placeholder: "MG Road" },
                      { label: "Area / Colony", key: "area", type: "text", placeholder: "Koramangala" },
                      { label: "City", key: "city", type: "text", placeholder: "Bengaluru" },
                      { label: "District", key: "district", type: "text", placeholder: "Bengaluru Urban" },
                      { label: "Pincode", key: "pincode", type: "text", placeholder: "560034" },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key} className={key === "email" || key === "street" ? "sm:col-span-2" : ""}>
                        <label className="text-xs text-white/50 mb-1.5 block">{label}</label>
                        <input
                          type={type}
                          value={address[key as keyof typeof address]}
                          onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                          placeholder={placeholder}
                          className="form-input"
                        />
                      </div>
                    ))}

                    {/* State */}
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">State</label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="form-input appearance-none cursor-pointer"
                      >
                        {indianStates.map((s) => (
                          <option key={s} value={s} className="bg-background">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(1)}
                    className="btn-primary mt-6 flex items-center gap-2"
                    disabled={!address.name || !address.mobile || !address.pincode}
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 1: Payment */}
              {currentStep === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-secondary" />
                    <h2 className="font-subheading text-lg font-semibold">Payment Method</h2>
                  </div>

                  {/* Group by category */}
                  {["UPI", "Card", "Banking", "COD"].map((category) => {
                    const methods = paymentMethods.filter((m) => m.category === category);
                    return (
                      <div key={category} className="mb-6">
                        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">{category}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {methods.map((method) => (
                            <button
                              key={method.id}
                              onClick={() => setSelectedPayment(method.id)}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                                selectedPayment === method.id
                                  ? "bg-primary/15 border-primary/50 text-white"
                                  : "glass border-white/10 text-white/50 hover:border-white/20"
                              }`}
                            >
                              <span className="text-2xl">{method.icon}</span>
                              <span className="text-xs font-medium">{method.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* UPI ID input */}
                  {selectedPayment.startsWith("upi") && (
                    <div className="mb-4">
                      <label className="text-xs text-white/50 mb-1.5 block">UPI ID</label>
                      <input
                        placeholder="yourname@upi or scan QR"
                        className="form-input"
                      />
                    </div>
                  )}

                  {/* Card inputs */}
                  {selectedPayment.startsWith("card") && (
                    <div className="space-y-3 mb-4">
                      <input placeholder="Card Number" className="form-input" />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="MM/YY" className="form-input" />
                        <input placeholder="CVV" type="password" maxLength={3} className="form-input" />
                      </div>
                      <input placeholder="Name on Card" className="form-input" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-success/5 border border-success/20 mb-6">
                    <Shield className="w-4 h-4 text-success" />
                    <p className="text-xs text-success/80">
                      Secured by Razorpay · 256-bit SSL Encryption
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      Review Order
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Review */}
              {currentStep === 2 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Package className="w-5 h-5 text-secondary" />
                    <h2 className="font-subheading text-lg font-semibold">Order Review</h2>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5">
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                          📦
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/90 truncate">{item.product.name}</p>
                          <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-secondary">
                          {formatINR((item.product.offerPrice || item.product.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address Summary */}
                  <div className="glass p-4 rounded-xl border border-white/5 mb-6">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Delivering to</p>
                    <p className="text-sm font-medium">{address.name}</p>
                    <p className="text-xs text-white/50">{address.houseNo}, {address.street}, {address.area}</p>
                    <p className="text-xs text-white/50">{address.city}, {address.state} — {address.pincode}</p>
                    <p className="text-xs text-white/50">📱 +91 {address.mobile}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setCurrentStep(1)} className="btn-secondary flex items-center gap-2">
                      ← Back
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order — {formatINR(total)}
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="glass-card p-5 sticky top-24">
              <h3 className="font-subheading font-semibold mb-4">Order Summary</h3>

              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm py-1.5">
                  <span className="text-white/60 truncate mr-4 max-w-[150px]">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-white/80 flex-shrink-0">
                    {formatINR((item.product.offerPrice || item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="h-px bg-white/10 my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Discount (5%)</span>
                  <span>-{formatINR(discount)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>GST (18%)</span>
                  <span>{formatINR(gst)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-success" : ""}>
                    {shipping === 0 ? "FREE" : formatINR(shipping)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-white/10 my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-secondary">{formatINR(total)}</span>
              </div>

              <p className="text-xs text-white/25 mt-2">
                Inclusive of all applicable taxes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
