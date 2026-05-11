"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

  const [isBigSize, setIsBigSize] = useState(product.category === "Big");
  const [currentPrice, setCurrentPrice] = useState(product.price);

  useEffect(() => {
    // Calculer le prix selon le format sélectionné
    if (isBigSize) {
      // Si on veut big, chercher la version big ou utiliser le prix actuel
      if (product.category === "Mini") {
        // Pour les mini cookies, le prix big est généralement plus élevé
        setCurrentPrice(product.price * 1.5); // Prix big = prix mini × 1.5
      } else {
        setCurrentPrice(product.price);
      }
    } else {
      // Si on veut mini, chercher la version mini ou utiliser le prix actuel
      if (product.category !== "Mini") {
        // Pour les big cookies, le prix mini est généralement moins élevé
        setCurrentPrice(product.price * 0.8); // Prix mini = prix big × 0.8
      } else {
        setCurrentPrice(product.price);
      }
    }
  }, [isBigSize, product.price, product.category]);

  const handleAddToCart = () => {
    const quantity = isBigSize ? 1 : 5; // Minimum 5 pour mini
    if (!isBigSize && quantity < 5) {
      alert(locale === "fr" ? "Minimum 5 pièces pour les mini cookies" : "حد أدنى 5 قطع للميني كوكيز");
      return;
    }
    addToCart(product.id, quantity);
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
          <div>
            <Link href={`/products/${product.slug}`} className="font-semibold tracking-tight hover:underline">
              {product.name[locale]}
            </Link>
            <p className="text-sm text-cacao-900/70 dark:text-creme/70">{product.category}</p>
          </div>
          <p className="font-semibold">{formatPriceTND(currentPrice, locale)}</p>
        </div>

        {/* Size Selection */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer text-xs">
            <input
              type="radio"
              name={`size-${product.id}`}
              checked={!isBigSize}
              onChange={() => setIsBigSize(false)}
              className="text-caramel-600 focus:ring-caramel-600"
            />
            <span>{locale === "fr" ? "Mini" : "ميني"}</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer text-xs">
            <input
              type="radio"
              name={`size-${product.id}`}
              checked={isBigSize}
              onChange={() => setIsBigSize(true)}
              className="text-caramel-600 focus:ring-caramel-600"
            />
            <span>{locale === "fr" ? "Big" : "كبير"}</span>
          </label>
        </div>

        {!isBigSize && (
          <p className="text-xs text-amber-600">
            {locale === "fr" ? "Min. 5 pièces" : "حد أدنى 5 قطع"}
          </p>
        )}

        <p className="text-sm text-cacao-900/70 dark:text-creme/70">{product.description[locale]}</p>

        <div className="flex items-center gap-2">
          <button
            className={cn("btn-primary flex-1 py-2 text-xs")}
            type="button"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {tr.actions.addToCart} {isBigSize ? "(1)" : "(5+)"}
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
