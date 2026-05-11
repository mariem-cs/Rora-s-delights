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

  // Déterminer si c'est un produit Mini (prix < 5 DT) ou Big (prix >= 5 DT)
  const isMini = product.price < 5;
  const isBig = product.price >= 5;

  const handleAddToCart = () => {
    if (isMini) {
      // Mini cookies : ajouter par lot de 5
      addToCart(product.id, 5);
    } else {
      // Big cookies : ajouter à l'unité
      addToCart(product.id, 1);
    }
  };

  return (
    <motion.div whileHover={{ y: -3 }} className="card overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <Image src={product.image} alt={product.name[locale]} fill className="object-cover" />
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link href={`/products/${product.slug}`} className="font-semibold tracking-tight hover:underline line-clamp-2">
              {product.name[locale]}
            </Link>
            <p className="text-sm text-cacao-900/70 dark:text-creme/70 mt-1">
              {product.category}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold whitespace-nowrap">
              {formatPriceTND(product.price, locale)}
            </p>
            {isMini && (
              <p className="text-xs text-gray-500">
                /pièce
              </p>
            )}
          </div>
        </div>

        {/* Badge de taille */}
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isMini 
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
              : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          }`}>
            {isMini ? (locale === "fr" ? "Mini" : "ميني") : (locale === "fr" ? "Big" : "كبير")}
          </span>
          {isMini && (
            <span className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ {locale === "fr" ? "Lot minimum: 5 pièces" : ":الحد الأدنى 5 قطع"}
            </span>
          )}
        </div>

        <p className="text-sm text-cacao-900/70 dark:text-creme/70 line-clamp-2">
          {product.description[locale]}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            className={cn("btn-primary flex-1 py-2 text-xs")}
            type="button"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {tr.actions.addToCart}
            {isMini && " (lot 5)"}
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