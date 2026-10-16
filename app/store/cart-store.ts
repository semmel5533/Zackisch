"use client";

import { create } from "zustand";
import type { CartItem } from "@/lib/types";

export const MAX_CART_ITEM_QUANTITY = 50;

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: Math.min(i.quantity + 1, MAX_CART_ITEM_QUANTITY) }
              : i,
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((i) => i.id !== id),
        };
      }
      return {
        items: state.items.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(quantity, MAX_CART_ITEM_QUANTITY) }
            : i,
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  total: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  itemCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
