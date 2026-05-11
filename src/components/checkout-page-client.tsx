"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { formatPriceTND } from "@/lib/format";

export function CheckoutPageClient({ products }: { products: Product[] }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const router = useRouter();
  const cart = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const lines = useMemo(() => {
    return cart
      .map((it) => {
        const product = products.find((p) => p.id === it.productId);
        if (!product) return null;
        return { product, quantity: it.quantity, total: product.price * it.quantity };
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number; total: number }>;
  }, [cart, products]);

  const total = lines.reduce((acc, l) => acc + l.total, 0);

  const placeOrder = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            locale,
            customer: { name, phone, address, notes: notes || undefined },
            cart,
          }),
        });
        const data = (await res.json()) as { orderId?: string; whatsappUrl?: string; error?: string };
        if (!res.ok) throw new Error(data.error || "Failed to create order");
        clear();
        router.push(`/success?orderId=${encodeURIComponent(data.orderId!)}&wa=${encodeURIComponent(data.whatsappUrl || "")}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  if (lines.length === 0) {
    return (
      <div className="container-page py-10">
        <div className="card p-8 text-center">
          <p className="text-cacao-900/70 dark:text-creme/70">{tr.cart.empty}</p>
          <div className="mt-6">
            <Link className="btn-primary" href="/products">
              {tr.actions.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{tr.checkout.title}</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">{tr.checkout.customer}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <label className="text-sm">
              <span className="text-cacao-900/70 dark:text-creme/70">{tr.checkout.name}</span>
              <input
                className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-caramel-400 dark:bg-black/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-cacao-900/70 dark:text-creme/70">{tr.checkout.phone}</span>
              <input
                className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-caramel-400 dark:bg-black/30"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-cacao-900/70 dark:text-creme/70">{tr.checkout.address}</span>
              <textarea
                className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-caramel-400 dark:bg-black/30"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-cacao-900/70 dark:text-creme/70">{tr.checkout.notes}</span>
              <textarea
                className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-caramel-400 dark:bg-black/30"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>

          {error && <p className="mt-4 text-sm font-medium text-rose-700">{error}</p>}

          <button className="btn-primary mt-6 w-full justify-center" type="button" disabled={pending} onClick={placeOrder}>
            {pending ? "..." : tr.checkout.placeOrder}
          </button>
          <p className="mt-3 text-xs text-cacao-900/60 dark:text-creme/60">
            {tr.actions.payOnDelivery}
          </p>
        </div>

        <aside className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">{tr.cart.total}</h2>
          <div className="mt-4 space-y-3 text-sm">
            {lines.map((l) => (
              <div key={l.product.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{l.product.name[locale]}</p>
                  <p className="text-cacao-900/70 dark:text-creme/70">
                    {l.quantity} × {formatPriceTND(l.product.price, locale)}
                  </p>
                </div>
                <p className="font-semibold">{formatPriceTND(l.total, locale)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-cacao-900/10 pt-4">
            <div className="flex items-center justify-between font-semibold">
              <span>{tr.cart.total}</span>
              <span>{formatPriceTND(total, locale)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

