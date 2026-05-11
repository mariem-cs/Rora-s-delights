"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";

export function ProductsPageClient({ products: initialProducts }: { products: Product[] }) {
  const { locale } = useLocale();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  // Recharger les produits quand la page devient visible
  useEffect(() => {
    const refreshProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/products?t=" + Date.now());
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to refresh products:", error);
      } finally {
        setLoading(false);
      }
    };

    // Recharger quand la page revient au premier plan
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshProducts();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {locale === "fr" ? "Nos Cookies" : "الكوكيز لدينا"}
        </h1>
        {loading && (
          <span className="text-sm text-gray-500 animate-pulse">Mise à jour...</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}