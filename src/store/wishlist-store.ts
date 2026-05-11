"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { WishlistItem } from "@/lib/types";

type WishlistState = {
  items: WishlistItem[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
  count: () => number;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const exists = get().items.some((i) => i.productId === productId);
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
        } else {
          set({ items: [{ productId, addedAt: new Date().toISOString() }, ...get().items] });
        }
      },
      has: (productId) => get().items.some((i) => i.productId === productId),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
    }),
    { name: "rd_wishlist_v1", storage: createJSONStorage(() => localStorage), version: 1 },
  ),
);

