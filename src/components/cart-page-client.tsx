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
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{tr.cart.title}</h1>

      {lines.length === 0 ? (
        <div className="mt-6 card p-8 text-center">
          <p className="text-cacao-900/70 dark:text-creme/70">{tr.cart.empty}</p>
          <div className="mt-6">
            <Link className="btn-primary" href="/products">
              {tr.actions.continueShopping}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-cacao-900/70 dark:text-creme/70">{lines.length} items</p>
              <button className="text-sm font-medium hover:underline" onClick={clear} type="button">
                {tr.actions.clear}
              </button>
            </div>

            <div className="mt-4 divide-y divide-cacao-900/10">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-4 py-4">
                  <div className="relative h-20 w-28 overflow-hidden rounded-lg bg-cacao-900/5">
                    <Image src={line.product.image} alt={line.product.name[locale]} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link className="font-medium hover:underline" href={`/products/${line.product.slug}`}>
                        {line.product.name[locale]}
                      </Link>
                      <p className="font-semibold">{formatPriceTND(line.lineTotal, locale)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="text-sm text-cacao-900/70 dark:text-creme/70">
                        Qty:
                        <input
                          className="ml-2 w-20 rounded-lg border border-cacao-900/15 bg-white/70 px-3 py-2 text-sm dark:bg-black/30"
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) => setQuantity(line.productId, Number(e.target.value))}
                        />
                      </label>
                      <button className="text-sm font-medium hover:underline" type="button" onClick={() => remove(line.productId)}>
                        {tr.actions.remove}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="card p-5 sm:p-6">
            <h2 className="text-lg font-semibold">{tr.cart.total}</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-cacao-900/70 dark:text-creme/70">
              <span>{tr.cart.subtotal}</span>
              <span>{formatPriceTND(total, locale)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold">
              <span>{tr.cart.total}</span>
              <span>{formatPriceTND(total, locale)}</span>
            </div>
            <p className="mt-3 text-xs text-cacao-900/60 dark:text-creme/60">{tr.actions.payOnDelivery}</p>
            <Link className="btn-primary mt-6 w-full justify-center" href="/checkout">
              {tr.actions.checkout}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

