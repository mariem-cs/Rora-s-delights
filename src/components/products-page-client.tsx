"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { useWishlistStore } from "@/store/wishlist-store";
import { useState } from "react";

type FilterType = "all" | "mini" | "big";

export function ProductsPageClient({ products }: { products: Product[] }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const wishlist = useWishlistStore((s) => s.items);
  const wishedIds = new Set(wishlist.map((i) => i.productId));
  const wishedProducts = products.filter((p) => wishedIds.has(p.id));

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Filtrer les produits selon le filtre actif
  const filteredProducts = products.filter((product) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "mini") return product.category === "Mini";
    if (activeFilter === "big") return product.category === "Big";
    return true;
  });

  const filterOptions = [
    { key: "all", label: "Tous" },
    { key: "mini", label: "Mini Cookies" },
    { key: "big", label: "Big Cookies" },
  ] as const;

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{tr.products.title}</h1>
            <p className="mt-1 text-sm text-cacao-900/70 dark:text-creme/70">
              {filteredProducts.length} items
            </p>
          </div>

          {/* Barre de filtrage */}
          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeFilter === option.key
                    ? "bg-cacao-600 text-white dark:bg-cacao-500"
                    : "bg-cacao-100 text-cacao-700 hover:bg-cacao-200 dark:bg-cacao-800 dark:text-cacao-200 dark:hover:bg-cacao-700"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-cacao-900/70 dark:text-creme/70">{tr.products.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div id="wishlist" className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">{tr.actions.wishlist}</h2>
        <p className="mt-1 text-sm text-cacao-900/70 dark:text-creme/70">
          {wishedProducts.length === 0 ? "—" : `${wishedProducts.length} items`}
        </p>

        {wishedProducts.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

