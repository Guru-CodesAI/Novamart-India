"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Zap, Mail, Phone, ArrowRight, Shield, Loader2, Chrome } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [mode, setMode] = useState<"otp" | "phone">("otp");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate OTP send
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("otp", {
        redirect: false,
        email: mode === "otp" ? email : "",
        phone: mode === "phone" ? phone : "",
        otp,
        callbackUrl: "/",
      });

      if (res?.error) {
        setError("Invalid OTP. Try '123456' for testing.");
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden grid-bg">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-xl gradient-text">NovaMart</div>
              <div className="text-xs text-white/30">INDIA</div>
            </div>
          </div>

          <h1 className="font-heading text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-sm text-white/50 text-center mb-8">
            Sign in to access your premium shopping experience
          </p>

          {/* Google Sign In */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl glass border border-white/15 text-white font-medium hover:bg-white/5 transition-all mb-6 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5" />
            )}
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 glass-strong rounded-xl mb-6">
            <button
              onClick={() => { setMode("otp"); setStep("input"); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "otp" ? "bg-primary text-white" : "text-white/40"
              }`}
            >
              <Mail className="w-4 h-4 inline mr-1.5" />
              Email OTP
            </button>
            <button
              onClick={() => { setMode("phone"); setStep("input"); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "phone" ? "bg-primary text-white" : "text-white/40"
              }`}
            >
              <Phone className="w-4 h-4 inline mr-1.5" />
              Mobile OTP
            </button>
          </div>

          {/* OTP Form */}
          <form onSubmit={step === "input" ? handleSendOTP : handleVerifyOTP}>
            {step === "input" ? (
              <div className="space-y-4">
                {mode === "otp" ? (
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="form-input"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Mobile Number</label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 rounded-xl glass border border-white/10 text-sm text-white/60">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        required
                        maxLength={10}
                        className="form-input flex-1"
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Send OTP
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">
                    Enter the 6-digit OTP sent to {mode === "otp" ? email : `+91 ${phone}`}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="form-input text-center text-2xl tracking-[0.5em] font-bold"
                  />
                </div>

                {error && (
                  <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 py-2.5 px-3.5 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Verify & Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => { setStep("input"); setError(""); }}
                  className="w-full text-sm text-white/40 hover:text-white transition-colors"
                >
                  ← Change {mode === "otp" ? "email" : "number"}
                </button>
              </div>
            )}
          </form>

          {/* Security Note */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/5">
            <Shield className="w-4 h-4 text-success/70" />
            <p className="text-xs text-white/30">
              Secured with 256-bit encryption. Your data is safe.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-4">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary/70 hover:text-primary">Terms</Link> and{" "}
          <Link href="/privacy" className="text-primary/70 hover:text-primary">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
