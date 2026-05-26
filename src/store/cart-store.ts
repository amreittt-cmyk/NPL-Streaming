"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  couponCode: string;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setCouponCode: (code: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: "",
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.productId === item.productId
                  ? { ...entry, quantity: entry.quantity + item.quantity }
                  : entry,
              ),
            };
          }

          return { items: [...state.items, item] };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((entry) => (entry.productId === productId ? { ...entry, quantity } : entry))
            .filter((entry) => entry.quantity > 0),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.productId !== productId),
        })),
      setCouponCode: (couponCode) => set({ couponCode }),
      clearCart: () => set({ items: [], couponCode: "" }),
    }),
    {
      name: "npl-live-cart",
    },
  ),
);
