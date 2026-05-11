"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { useWishlistStore } from "@/store/wishlist-store";

export function ProductsPageClient({ products }: { products: Product[] }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const wishlist = useWishlistStore((s) => s.items);
  const wishedIds = new Set(wishlist.map((i) => i.productId));
  const wishedProducts = products.filter((p) => wishedIds.has(p.id));

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{tr.products?.title || "Nos Cookies"}</h1>
            <p className="mt-1 text-sm text-cacao-900/70 dark:text-creme/70">
              {products.length} items
            </p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-cacao-900/70 dark:text-creme/70">{tr.products?.empty || "Aucun produit"}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div id="wishlist" className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">{tr.actions?.wishlist || "Wishlist"}</h2>
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