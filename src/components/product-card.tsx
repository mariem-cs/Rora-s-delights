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
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="card overflow-hidden group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cacao-50 dark:bg-cacao-900/20">
          <Image src={product.image} alt={product.name[locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>

      <div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/products/${product.slug}`} className="font-semibold text-sm sm:text-base tracking-tight hover:underline line-clamp-2 text-cacao-900 dark:text-creme">
              {product.name[locale]}
            </Link>
            <p className="text-xs sm:text-sm text-cacao-800 dark:text-creme/60 mt-0.5 sm:mt-1">
              {product.category}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-sm sm:text-base whitespace-nowrap text-caramel-600">
              {formatPriceTND(product.price, locale)}
            </p>
            {isMini && (
              <p className="text-[10px] sm:text-xs text-cacao-900/50 dark:text-creme/50">
                /pièce
              </p>
            )}
          </div>
        </div>

        {/* Badge de taille */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium ${
            isMini 
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" 
              : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
          }`}>
            {isMini ? (locale === "fr" ? "Mini" : "ميني") : (locale === "fr" ? "Big" : "كبير")}
          </span>
          {isMini && (
            <span className="text-[9px] sm:text-xs text-amber-600 dark:text-amber-400 font-medium">
              {locale === "fr" ? "Lot de 5" : "حزمة 5"}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-cacao-800 dark:text-creme/70 line-clamp-2">
          {product.description[locale]}
        </p>

        <div className="flex items-center gap-2 mt-2 sm:mt-3">
          <button
            className={cn("btn-primary flex-1 py-2 text-xs sm:text-sm")}
            type="button"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
            <span className="hidden sm:inline">{tr.actions.addToCart}</span>
            <span className="sm:hidden">Add</span>
            {isMini && " (5)"}
          </button>
          <button
            className={cn("btn-outline px-2 sm:px-3 py-2", wished ? "border-rose-600/40 bg-rose-50/50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400" : "")}
            type="button"
            onClick={() => toggleWish(product.id)}
            aria-label={tr.actions.wishlist}
          >
            <Heart className={cn("h-4 sm:h-5 w-4 sm:w-5", wished ? "fill-current" : "")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}