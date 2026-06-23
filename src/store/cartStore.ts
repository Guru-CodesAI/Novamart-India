"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface CartItemLocal {
  product: Product;
  quantity: number;
  savedForLater: boolean;
}

interface CartStore {
  items: CartItemLocal[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
  getSavedItems: () => CartItemLocal[];
  getActiveItems: () => CartItemLocal[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find(
          (i) => i.product.id === product.id && !i.savedForLater
        );

        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && !i.savedForLater
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
          toast.success("Quantity updated!", {
            style: {
              background: "rgba(5,8,22,0.9)",
              color: "#fff",
              border: "1px solid rgba(124,58,237,0.3)",
            },
          });
        } else {
          set({ items: [...items, { product, quantity, savedForLater: false }] });
          toast.success(`${product.name} added to cart!`, {
            style: {
              background: "rgba(5,8,22,0.9)",
              color: "#fff",
              border: "1px solid rgba(124,58,237,0.3)",
            },
            icon: "🛒",
          });
        }
        set({ isOpen: true });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
        toast.success("Item removed", {
          style: {
            background: "rgba(5,8,22,0.9)",
            color: "#fff",
            border: "1px solid rgba(255,0,0,0.3)",
          },
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      saveForLater: (productId) => {
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, savedForLater: true } : i
          ),
        });
        toast.success("Saved for later!", {
          style: {
            background: "rgba(5,8,22,0.9)",
            color: "#fff",
            border: "1px solid rgba(0,245,255,0.3)",
          },
        });
      },

      moveToCart: (productId) => {
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, savedForLater: false } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        const activeItems = get().items.filter((i) => !i.savedForLater);
        const subtotal = activeItems.reduce(
          (sum, i) => sum + (i.product.offerPrice || i.product.price) * i.quantity,
          0
        );
        const gst = Math.round((subtotal * 18) / 100);
        return subtotal + gst;
      },

      getSubtotal: () => {
        return get()
          .items.filter((i) => !i.savedForLater)
          .reduce(
            (sum, i) => sum + (i.product.offerPrice || i.product.price) * i.quantity,
            0
          );
      },

      getItemCount: () => {
        return get()
          .items.filter((i) => !i.savedForLater)
          .reduce((sum, i) => sum + i.quantity, 0);
      },

      getSavedItems: () => get().items.filter((i) => i.savedForLater),
      getActiveItems: () => get().items.filter((i) => !i.savedForLater),
    }),
    { name: "novamart-cart" }
  )
);
