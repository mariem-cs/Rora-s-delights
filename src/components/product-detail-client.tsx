"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";

import type { Product } from "@/lib/types";
import { formatPriceTND } from "@/lib/format";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/cn";

export function ProductDetailClient({ product }: { product: Product }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const addToCart = useCartStore((s) => s.add);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.has(product.id));

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="container-page py-10">
      <Link className="text-xs sm:text-sm font-medium text-cacao-700 hover:text-cacao-900 dark:text-creme/70 dark:hover:text-creme hover:underline transition-colors" href="/products">
        ← {tr.actions.back}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="relative aspect-[4/3] w-full">
            <Image src={product.image} alt={product.name[locale]} fill className="object-cover" priority />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-cacao-900 dark:text-creme">{product.name[locale]}</h1>
          <p className="mt-2 text-cacao-800 dark:text-creme/70">{product.category}</p>
          <p className="mt-4 text-lg font-semibold text-caramel-600">{formatPriceTND(product.price, locale)}</p>

          <p className="mt-6 leading-7 text-cacao-800 dark:text-creme/80">{product.description[locale]}</p>

          {/* Quantity Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-cacao-900 dark:text-creme mb-3">
              {locale === "fr" ? "Quantité :" : "الكمية :"}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                className="btn-outline p-2"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="btn-outline p-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary" type="button" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              {tr.actions.addToCart} ({quantity})
            </button>
            <button
              className={cn("btn-outline", wished ? "border-rose-600/40 text-rose-700" : "")}
              type="button"
              onClick={() => toggleWish(product.id)}
            >
              <Heart className={cn("h-4 w-4", wished ? "fill-current" : "")} />
              {tr.actions.wishlist}
            </button>
            <Link className="btn-outline" href="/cart">
              {tr.nav.cart}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}