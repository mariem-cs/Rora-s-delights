"use client";

import { useEffect, useState, useTransition } from "react";

import type { Order, OrderStatus } from "@/lib/types";
import { formatPriceTND } from "@/lib/format";

type OrdersResponse = { orders: Order[] };

const STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      const data = (await res.json()) as OrdersResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders(data.orders);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setStatus = (id: string, status: OrderStatus) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Failed to update status");
        await load();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Orders</h2>
        <button className="btn-outline px-4 py-2 text-xs" type="button" onClick={load}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-cacao-900/70 dark:text-creme/70">Loading…</p>
      ) : error ? (
        <p className="mt-4 text-sm font-medium text-rose-700">{error}</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-cacao-900/70 dark:text-creme/70">No orders yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl2 border border-cacao-900/10 bg-white/60 p-4 dark:bg-black/30">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-cacao-900/60 dark:text-creme/60">{o.id}</p>
                  <p className="mt-1 text-sm font-semibold">
                    {o.customer.name} — {o.customer.phone}
                  </p>
                  <p className="mt-1 text-sm text-cacao-900/70 dark:text-creme/70">{o.customer.address}</p>
                  <p className="mt-1 text-xs text-cacao-900/60 dark:text-creme/60">{new Date(o.createdAt).toLocaleString()}</p>
                </div>

                <div className="min-w-[220px]">
                  <label className="text-xs text-cacao-900/60 dark:text-creme/60">Status</label>
                  <select
                    className="mt-1 w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-3 py-2 text-sm dark:bg-black/30"
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                    disabled={pending}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 border-t border-cacao-900/10 pt-3">
                <div className="space-y-1 text-sm">
                  {o.items.map((it) => (
                    <div key={it.productId} className="flex items-start justify-between gap-3">
                      <span>
                        {it.quantity} × {it.name}
                      </span>
                      <span className="font-semibold">{formatPriceTND(it.lineTotal, o.locale)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPriceTND(o.totals.grandTotal, o.locale)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

