"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CartLine } from "@/lib/types";

type CartState = {
  items: CartLine[];
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId, quantity = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.productId === productId);
        if (idx >= 0) items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
        else items.push({ productId, quantity });
        set({ items });
      },
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) return set({ items: get().items.filter((i) => i.productId !== productId) });
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        });
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    {
      name: "rd_cart_v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

