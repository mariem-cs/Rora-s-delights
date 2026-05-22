"use client";

import Link from "next/link";
import Image from "next/image";

import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { formatPriceTND } from "@/lib/format";

export function CartPageClient({ products }: { products: Product[] }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const clear = useCartStore((s) => s.clear);

  const lines = items
    .map((it) => {
      const product = products.find((p) => p.id === it.productId);
      if (!product) return null;
      const lineTotal = product.price * it.quantity;
      return { ...it, product, lineTotal };
    })
    .filter(Boolean) as Array<{ product: Product; productId: string; quantity: number; lineTotal: number }>;

  const total = lines.reduce((acc, l) => acc + l.lineTotal, 0);

  return (
    <div className="container-page py-6 sm:py-10 md:py-14">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-cacao-900 dark:text-creme">{tr.cart.title}</h1>

      {lines.length === 0 ? (
        <div className="mt-6 card p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-cacao-900/70 dark:text-creme/70">{tr.cart.empty}</p>
          <div className="mt-6">
            <Link className="btn-primary" href="/products">
              {tr.actions.continueShopping}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card p-4 sm:p-6 overflow-x-auto">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-cacao-900/70 dark:text-creme/70">{lines.length} items</p>
              <button className="text-xs sm:text-sm font-medium text-caramel-600 dark:text-caramel-400 hover:underline transition-colors" onClick={clear} type="button">
                {tr.actions.clear}
              </button>
            </div>

            <div className="mt-4 divide-y divide-cacao-900/10 dark:divide-white/10">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-3 sm:gap-4 py-3 sm:py-4">
                  <div className="relative h-16 sm:h-20 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg bg-cacao-900/5">
                    <Image src={line.product.image} alt={line.product.name[locale]} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link className="font-medium hover:underline line-clamp-2 text-sm sm:text-base text-cacao-900 dark:text-creme" href={`/products/${line.product.slug}`}>
                        {line.product.name[locale]}
                      </Link>
                      <p className="font-semibold text-sm sm:text-base text-caramel-600 flex-shrink-0">{formatPriceTND(line.lineTotal, locale)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <label className="text-xs sm:text-sm text-cacao-900/70 dark:text-creme/70 flex items-center gap-1">
                        Qty:
                        <input
                          className="w-14 sm:w-16 rounded-lg border border-cacao-900/15 dark:border-white/15 bg-white/70 dark:bg-cacao-900/20 px-2 py-1.5 text-xs sm:text-sm"
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) => setQuantity(line.productId, Number(e.target.value))}
                        />
                      </label>
                      <button className="text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline transition-colors" type="button" onClick={() => remove(line.productId)}>
                        {tr.actions.remove}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="card p-4 sm:p-6 h-fit sticky top-24 sm:top-24">
            <h2 className="text-base sm:text-lg font-bold text-cacao-900 dark:text-creme">{tr.cart.total}</h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-cacao-900/70 dark:text-creme/70">
                <span>{tr.cart.subtotal}</span>
                <span>{formatPriceTND(total, locale)}</span>
              </div>
              <div className="border-t border-cacao-900/10 dark:border-white/10 pt-2 flex items-center justify-between text-sm sm:text-base font-bold">
                <span>{tr.cart.total}</span>
                <span className="text-caramel-600">{formatPriceTND(total, locale)}</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] sm:text-xs text-cacao-900/60 dark:text-creme/60">{tr.actions.payOnDelivery}</p>
            <Link className="btn-primary mt-6 w-full justify-center text-xs sm:text-sm" href="/checkout">
              {tr.actions.checkout}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

