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
    <div className="container-page py-10 sm:py-14">
      <section className="card overflow-hidden p-8 sm:p-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-cacao-900 dark:text-creme sm:text-5xl">
            {tr.home.heroTitle}
          </h1>
          <p className="mt-4 text-base text-cacao-900/70 dark:text-creme/70 sm:text-lg">{tr.home.heroSubtitle}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href="/products">
              {tr.nav.products}
            </Link>
            <Link className="btn-outline" href="/cart">
              {tr.nav.cart}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">{tr.home.featured}</h2>
          <Link className="text-sm font-medium hover:underline" href="/products">
            {tr.actions.view}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

