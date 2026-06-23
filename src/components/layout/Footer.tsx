"use client";

import Link from "next/link";
import { Zap, Instagram, Twitter, Youtube, Github, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Investor Relations", href: "/investors" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Returns", href: "/returns" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Track Order", href: "/track" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Compliance", href: "/compliance" },
  ],
  categories: [
    { label: "Electronics", href: "/shop?category=electronics" },
    { label: "Fashion", href: "/shop?category=fashion" },
    { label: "Gaming", href: "/shop?category=gaming" },
    { label: "Luxury Collection", href: "/luxury" },
    { label: "Home & Living", href: "/shop?category=home-living" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

const paymentMethods = ["UPI", "GPay", "PhonePe", "Paytm", "Visa", "Mastercard", "RuPay", "NetBanking", "COD"];

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-white/5 overflow-hidden">
      {/* Aurora glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-primary/50 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading text-lg font-bold gradient-text">NovaMart</span>
                <span className="text-xs text-white/40 font-body block leading-none">INDIA</span>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
              India's most futuristic eCommerce platform. Experience shopping beyond reality with immersive 3D product showcases.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <a href="mailto:support@novamart.in" className="flex items-center gap-2 text-sm text-white/40 hover:text-secondary transition-colors">
                <Mail className="w-4 h-4" />
                support@novamart.in
              </a>
              <a href="tel:+918000000000" className="flex items-center gap-2 text-sm text-white/40 hover:text-secondary transition-colors">
                <Phone className="w-4 h-4" />
                +91 80000 00000
              </a>
              <div className="flex items-start gap-2 text-sm text-white/40">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Bengaluru, Karnataka, India 560001</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/40 hover:shadow-neon-purple transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Payment Methods */}
        <div className="mb-8">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
            Accepted Payment Methods
          </p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-3 py-1.5 rounded-lg glass border border-white/10 text-xs text-white/50 font-medium"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2025 NovaMart India Pvt. Ltd. All rights reserved. | GST: 29AADCN1234B1Z5
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">Made with ❤️ in India 🇮🇳</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success/70">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
