"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

import type { Product } from "@/lib/types";
import { formatPriceTND } from "@/lib/format";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/cn";
import { getProducts } from "@/lib/products";

export function ProductDetailClient({ product }: { product: Product }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const addToCart = useCartStore((s) => s.add);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.has(product.id));

  const [isBigSize, setIsBigSize] = useState(product.category === "Big");
  const [quantity, setQuantity] = useState(1);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getProducts();
      setAllProducts(products);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    let targetProduct = product;

    if (isBigSize) {
      // Chercher la version big du produit
      if (product.category === "Mini") {
        // Si on est sur un mini, chercher le big correspondant
        const baseName = product.name[locale].replace("Delight", "Creamy Dream").replace("ديلايت", "كريمي دريم");
        const bigProduct = allProducts.find(p =>
          p.category === "Big" &&
          (p.name.fr.includes(baseName.split(" ")[0]) || p.name.ar.includes(baseName.split(" ")[0]))
        );
        if (bigProduct) targetProduct = bigProduct;
      }
    } else {
      // Chercher la version mini du produit
      if (product.category !== "Mini") {
        // Si on n'est pas sur un mini, chercher le mini correspondant
        const baseName = product.name[locale].split(" ")[0];
        const miniProduct = allProducts.find(p =>
          p.category === "Mini" &&
          (p.name.fr.toLowerCase().includes(baseName.toLowerCase()) ||
           p.name.ar.includes(baseName))
        );
        if (miniProduct) targetProduct = miniProduct;
      }
    }

    setCurrentProduct(targetProduct);

    // Reset quantity si on change de type et qu'on était en dessous du minimum pour mini
    if (!isBigSize && quantity < 5) {
      setQuantity(5);
    }
  }, [isBigSize, product, allProducts, locale, quantity]);

  const handleAddToCart = () => {
    if (!isBigSize && quantity < 5) {
      alert(tr.locale === "fr" ? "Minimum 5 pièces pour les mini cookies" : "حد أدنى 5 قطع للميني كوكيز");
      return;
    }
    addToCart(currentProduct.id, quantity);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => {
      const newQuantity = prev - 1;
      if (!isBigSize && newQuantity < 5) return 5;
      return Math.max(1, newQuantity);
    });
  };

  return (
    <div className="container-page py-10">
      <Link className="text-sm font-medium hover:underline" href="/products">
        ← {tr.actions.back}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="relative aspect-[4/3] w-full">
            <Image src={currentProduct.image} alt={currentProduct.name[locale]} fill className="object-cover" priority />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{currentProduct.name[locale]}</h1>
          <p className="mt-2 text-cacao-900/70 dark:text-creme/70">{currentProduct.category}</p>
          <p className="mt-4 text-lg font-semibold">{formatPriceTND(currentProduct.price, locale)}</p>

          <p className="mt-6 leading-7 text-cacao-900/80 dark:text-creme/80">{currentProduct.description[locale]}</p>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">
              {locale === "fr" ? "Taille des cookies :" : "حجم الكوكيز :"}
            </h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  checked={!isBigSize}
                  onChange={() => setIsBigSize(false)}
                  className="text-caramel-600 focus:ring-caramel-600"
                />
                <span className="text-sm">
                  {locale === "fr" ? "Mini Cookies" : "ميني كوكيز"}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  checked={isBigSize}
                  onChange={() => setIsBigSize(true)}
                  className="text-caramel-600 focus:ring-caramel-600"
                />
                <span className="text-sm">
                  {locale === "fr" ? "Big Cookies" : "كبير كوكيز"}
                </span>
              </label>
            </div>
            {!isBigSize && (
              <p className="text-xs text-amber-600 mt-2">
                {locale === "fr" ? "Minimum 5 pièces pour les mini cookies" : "حد أدنى 5 قطع للميني كوكيز"}
              </p>
            )}
          </div>

          {/* Quantity Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">
              {locale === "fr" ? "Quantité :" : "الكمية :"}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                className="btn-outline p-2"
                disabled={quantity <= (isBigSize ? 1 : 5)}
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
              onClick={() => toggleWish(currentProduct.id)}
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

