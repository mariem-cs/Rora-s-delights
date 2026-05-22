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
      <div className="container-page py-6 sm:py-10">
        <div className="card p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-cacao-900/70 dark:text-creme/70">{tr.cart.empty}</p>
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
    <div className="container-page py-6 sm:py-10 md:py-14">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-cacao-900 dark:text-creme">{tr.checkout.title}</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-cacao-900 dark:text-creme">{tr.checkout.customer}</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4">
            <label className="text-xs sm:text-sm">
              <span className="block text-cacao-900/70 dark:text-creme/70 font-medium mb-1.5">{tr.checkout.name}</span>
              <input
                className="w-full rounded-lg border border-cacao-900/15 dark:border-white/15 bg-white/70 dark:bg-cacao-900/20 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm placeholder-cacao-900/40 dark:placeholder-creme/40 outline-none focus:ring-2 focus:ring-caramel-400 dark:focus:ring-caramel-300 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
              />
            </label>
            <label className="text-xs sm:text-sm">
              <span className="block text-cacao-900/70 dark:text-creme/70 font-medium mb-1.5">{tr.checkout.phone}</span>
              <input
                className="w-full rounded-lg border border-cacao-900/15 dark:border-white/15 bg-white/70 dark:bg-cacao-900/20 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm placeholder-cacao-900/40 dark:placeholder-creme/40 outline-none focus:ring-2 focus:ring-caramel-400 dark:focus:ring-caramel-300 transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Votre téléphone"
                required
              />
            </label>
            <label className="text-xs sm:text-sm">
              <span className="block text-cacao-900/70 dark:text-creme/70 font-medium mb-1.5">{tr.checkout.address}</span>
              <textarea
                className="w-full rounded-lg border border-cacao-900/15 dark:border-white/15 bg-white/70 dark:bg-cacao-900/20 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm placeholder-cacao-900/40 dark:placeholder-creme/40 outline-none focus:ring-2 focus:ring-caramel-400 dark:focus:ring-caramel-300 transition-all resize-none"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Votre adresse"
                required
              />
            </label>
            <label className="text-xs sm:text-sm">
              <span className="block text-cacao-900/70 dark:text-creme/70 font-medium mb-1.5">{tr.checkout.notes}</span>
              <textarea
                className="w-full rounded-lg border border-cacao-900/15 dark:border-white/15 bg-white/70 dark:bg-cacao-900/20 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm placeholder-cacao-900/40 dark:placeholder-creme/40 outline-none focus:ring-2 focus:ring-caramel-400 dark:focus:ring-caramel-300 transition-all resize-none"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes optionnelles"
              />
            </label>
          </div>

          {error && <p className="mt-4 text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">{error}</p>}

          <button className="btn-primary mt-6 w-full justify-center text-xs sm:text-sm" type="button" disabled={pending} onClick={placeOrder}>
            {pending ? "..." : tr.checkout.placeOrder}
          </button>
          <p className="mt-3 text-[10px] sm:text-xs text-cacao-900/60 dark:text-creme/60">
            {tr.actions.payOnDelivery}
          </p>
        </div>

        <aside className="card p-4 sm:p-6 h-fit sticky top-24 sm:top-24">
          <h2 className="text-base sm:text-lg font-bold text-cacao-900 dark:text-creme">{tr.cart.total}</h2>
          <div className="mt-4 space-y-2 text-xs sm:text-sm max-h-60 overflow-y-auto">
            {lines.map((l) => (
              <div key={l.product.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-cacao-900 dark:text-creme line-clamp-1">{l.product.name[locale]}</p>
                  <p className="text-cacao-900/70 dark:text-creme/70 text-[10px] sm:text-xs">
                    {l.quantity} × {formatPriceTND(l.product.price, locale)}
                  </p>
                </div>
                <p className="font-semibold text-cacao-900 dark:text-creme flex-shrink-0">{formatPriceTND(l.total, locale)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-cacao-900/10 dark:border-white/10 pt-3">
            <div className="flex items-center justify-between font-bold text-sm sm:text-base">
              <span>{tr.cart.total}</span>
              <span className="text-caramel-600">{formatPriceTND(total, locale)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

