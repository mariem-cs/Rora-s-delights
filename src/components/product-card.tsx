"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/lib/types";
import { formatPriceTND } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function ProductCard({ product }: { product: Product }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const addToCart = useCartStore((s) => s.add);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.has(product.id));

  return (
    <motion.div whileHover={{ y: -3 }} className="card overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <Image src={product.image} alt={product.name[locale]} fill className="object-cover" />
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${product.slug}`} className="font-semibold tracking-tight hover:underline">
              {product.name[locale]}
            </Link>
            <p className="text-sm text-cacao-900/70 dark:text-creme/70">{product.category}</p>
          </div>
          <p className="font-semibold">{formatPriceTND(product.price, locale)}</p>
        </div>

        <p className="text-sm text-cacao-900/70 dark:text-creme/70">{product.description[locale]}</p>

        <div className="flex items-center gap-2">
          <button
            className={cn("btn-primary flex-1 py-2 text-xs")}
            type="button"
            onClick={() => addToCart(product.id, 1)}
          >
            <ShoppingCart className="h-4 w-4" />
            {tr.actions.addToCart}
          </button>
          <button
            className={cn("btn-outline px-3 py-2", wished ? "border-rose-600/40 text-rose-700" : "")}
            type="button"
            onClick={() => toggleWish(product.id)}
            aria-label={tr.actions.wishlist}
          >
            <Heart className={cn("h-4 w-4", wished ? "fill-current" : "")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
