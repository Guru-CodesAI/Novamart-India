import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indian Rupee formatter
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate discount percentage
export function getDiscountPercent(original: number, offer: number): number {
  return Math.round(((original - offer) / original) * 100);
}

// Format large INR numbers (₹1,00,000 → ₹1 Lakh)
export function formatINRShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

// Generate star array from rating
export function getStars(rating: number): { filled: boolean }[] {
  return Array.from({ length: 5 }, (_, i) => ({ filled: i < Math.floor(rating) }));
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Slugify
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Calculate GST
export function calculateGST(amount: number, rate: number = 18): number {
  return Math.round((amount * rate) / 100);
}

// Get total with GST
export function getTotalWithGST(
  subtotal: number,
  discount: number = 0,
  gstRate: number = 18,
  shipping: number = 0
): {
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
} {
  const afterDiscount = subtotal - discount;
  const gst = calculateGST(afterDiscount, gstRate);
  return {
    subtotal,
    discount,
    gst,
    shipping,
    total: afterDiscount + gst + shipping,
  };
}

// Random between
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Format date in Indian style
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

// Check if mobile device
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
