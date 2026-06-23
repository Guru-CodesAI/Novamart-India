// NovaMart India - Type Definitions

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  sku: string;
  price: number;
  offerPrice?: number;
  stock: number;
  categoryId: string;
  brandId?: string;
  images: string[];
  model3dUrl?: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  luxuryItem: boolean;
  gstRate: number;
  weight?: number;
  specifications?: Record<string, string>;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  brand?: Brand;
  reviews?: Review[];
  _count?: { reviews: number };
  avgRating?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
  featured: boolean;
  sortOrder: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  featured: boolean;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  body: string;
  images: string[];
  verified: boolean;
  helpful: number;
  createdAt: Date;
  user?: User;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN" | "VENDOR";
  createdAt: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  savedForLater: boolean;
  product: Product;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  email?: string;
  houseNo: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  type: "HOME" | "WORK" | "OTHER";
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod?: string;
  razorpayOrderId?: string;
  subtotal: number;
  discount: number;
  gst: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
  address: Address;
  items: OrderItem[];
  tracking?: TrackingEvent[];
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

export interface TrackingEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  message?: string;
  location?: string;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FLAT" | "SHIPPING";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  active: boolean;
}

// Filter/Search types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  discount?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "best_selling" | "highest_rated";
  search?: string;
  page?: number;
  limit?: number;
}

// Cart store state
export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Wishlist store state
export interface WishlistStore {
  items: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  toggle: (productId: string) => void;
}

// Payment types
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color: string };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

// Admin dashboard
export interface DashboardStats {
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
}
