"use client";

import Link from "next/link";

import type { Product } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";

export function HomeClient({ featured }: { featured: Product[] }) {
  const { locale } = useLocale();
  const tr = t(locale);

  return (
    <div className="container-page py-6 sm:py-10 md:py-14">
      <section className="card overflow-hidden p-6 sm:p-8 md:p-12 bg-gradient-to-br from-caramel-50 via-white to-creme dark:from-cacao-900/30 dark:via-cacao-900/20 dark:to-cacao-900/10">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-cacao-900 dark:text-creme leading-tight">
            {tr.home.heroTitle}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-cacao-800 dark:text-creme/70 leading-relaxed">{tr.home.heroSubtitle}</p>
          <div className="mt-6 sm:mt-8 flex flex-col gap-2 sm:gap-3 sm:flex-row">
            <Link className="btn-primary" href="/products">
              {tr.nav.products}
            </Link>
            <Link className="btn-outline" href="/cart">
              {tr.nav.cart}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 sm:mt-12 md:mt-14">
        <div className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-cacao-900 dark:text-creme">{tr.home.featured}</h2>
          <Link className="text-xs sm:text-sm font-medium text-caramel-600 dark:text-caramel-400 hover:underline transition-colors" href="/products">
            {tr.actions.view}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

