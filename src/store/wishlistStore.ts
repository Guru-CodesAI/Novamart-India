"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

interface WishlistStore {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (!get().hasItem(productId)) {
          set({ items: [...get().items, productId] });
          toast.success("Added to wishlist!", {
            style: {
              background: "rgba(5,8,22,0.9)",
              color: "#fff",
              border: "1px solid rgba(255,0,255,0.3)",
            },
            icon: "❤️",
          });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
        toast.success("Removed from wishlist", {
          style: {
            background: "rgba(5,8,22,0.9)",
            color: "#fff",
            border: "1px solid rgba(255,0,0,0.3)",
          },
        });
      },

      hasItem: (productId) => get().items.includes(productId),

      toggle: (productId) => {
        if (get().hasItem(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      clear: () => set({ items: [] }),
    }),
    { name: "novamart-wishlist" }
  )
);
