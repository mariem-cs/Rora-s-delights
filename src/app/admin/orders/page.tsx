"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, RefreshCw, Clock, CheckCircle2, AlertCircle, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Order, OrderStatus } from "@/lib/types";
import { formatPriceTND } from "@/lib/format";

type OrdersResponse = { orders: Order[] };

const STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

// Définir le type pour les icônes
type IconComponent = React.ComponentType<{ className?: string }>;

const STATUS_CONFIG: Record<OrderStatus, { color: string; icon: IconComponent; label: string }> = {
  pending: { color: "amber", icon: Clock, label: "Pending" },
  confirmed: { color: "blue", icon: AlertCircle, label: "Confirmed" },
  preparing: { color: "purple", icon: Package, label: "Preparing" },
  ready: { color: "green", icon: CheckCircle2, label: "Ready" },
  completed: { color: "emerald", icon: CheckCircle2, label: "Completed" },
  cancelled: { color: "rose", icon: AlertCircle, label: "Cancelled" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      const data = (await res.json()) as OrdersResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders(data.orders);
      setSuccess("Orders loaded successfully");
      setTimeout(() => setSuccess(null), 2000);
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
    setSuccess(null);
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
        setSuccess("Order status updated");
        setTimeout(() => setSuccess(null), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const getStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      pending: "bg-amber-100/60 text-amber-800 border-amber-200/30 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/30",
      confirmed: "bg-blue-100/60 text-blue-800 border-blue-200/30 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/30",
      preparing: "bg-purple-100/60 text-purple-800 border-purple-200/30 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700/30",
      ready: "bg-green-100/60 text-green-800 border-green-200/30 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/30",
      completed: "bg-emerald-100/60 text-emerald-800 border-emerald-200/30 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/30",
      cancelled: "bg-rose-100/60 text-rose-800 border-rose-200/30 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700/30",
    };
    return colors[status];
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="mt-1 text-sm text-cacao-900/60 dark:text-creme/60">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline inline-flex items-center gap-2 px-4 py-2 text-xs"
          type="button"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 rounded-xl2 border border-rose-200/30 bg-rose-500/5 p-3 text-sm text-rose-700 dark:border-rose-700/30 dark:bg-rose-900/20 dark:text-rose-400"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 rounded-xl2 border border-green-200/30 bg-green-500/5 p-3 text-sm text-green-700 dark:border-green-700/30 dark:bg-green-900/20 dark:text-green-400"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      {!loading && (
        <div className="mb-6 flex flex-wrap gap-2">
          {["all" as const, ...STATUSES].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                filterStatus === status
                  ? "bg-cacao-900/15 dark:bg-white/20"
                  : "hover:bg-cacao-900/10 dark:hover:bg-white/10"
              }`}
            >
              {status === "all" ? "All Orders" : STATUS_CONFIG[status].label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="animate-pulse rounded-2xl border border-cacao-900/10 bg-cacao-900/5 p-6 dark:bg-white/5"
            >
              <div className="h-4 w-40 rounded bg-cacao-900/20 dark:bg-white/20"></div>
              <div className="mt-3 h-3 w-60 rounded bg-cacao-900/20 dark:bg-white/20"></div>
            </motion.div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-cacao-900/10 bg-white/40 p-12 text-center dark:bg-black/20">
          <Package className="mx-auto h-12 w-12 text-cacao-900/30 dark:text-white/20" />
          <p className="mt-3 font-medium text-cacao-900/70 dark:text-creme/70">No orders found</p>
          <p className="mt-1 text-sm text-cacao-900/50 dark:text-creme/50">No orders match the selected filter</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((o, index) => {
              const isExpanded = expandedId === o.id;
              const config = STATUS_CONFIG[o.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={o.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-cacao-900/10 bg-gradient-to-br from-white/50 to-white/30 dark:from-black/30 dark:to-black/20 dark:border-white/10 backdrop-blur-sm"
                >
                  {/* Order Header */}
                  <motion.button
                    onClick={() => setExpandedId(isExpanded ? null : o.id)}
                    className="w-full px-6 py-4 text-left hover:bg-cacao-900/2 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <StatusIcon className="h-5 w-5 text-cacao-900/60 dark:text-creme/60" />
                          <div>
                            <p className="font-mono text-xs text-cacao-900/50 dark:text-creme/50">{o.id.slice(0, 8)}</p>
                            <p className="text-sm font-semibold tracking-tight">{o.customer.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatPriceTND(o.totals.grandTotal, o.locale)}</p>
                          <p className="text-xs text-cacao-900/60 dark:text-creme/60">
                            {new Date(o.createdAt).toLocaleDateString(o.locale === "fr" ? "fr-FR" : "ar-SA")}
                          </p>
                        </div>

                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(o.status)}`}>
                          {config.label}
                        </span>

                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown className="h-4 w-4 text-cacao-900/60 dark:text-creme/60" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Order Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-cacao-900/10 dark:border-white/10"
                      >
                        <div className="px-6 py-4 space-y-4">
                          {/* Customer Info */}
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                              <p className="text-xs text-cacao-900/60 dark:text-creme/60 font-medium">Phone</p>
                              <p className="mt-1 text-sm font-medium">{o.customer.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-cacao-900/60 dark:text-creme/60 font-medium">Address</p>
                              <p className="mt-1 text-sm font-medium">{o.customer.address}</p>
                            </div>
                          </div>

                          {o.customer.notes && (
                            <div>
                              <p className="text-xs text-cacao-900/60 dark:text-creme/60 font-medium">Notes</p>
                              <p className="mt-1 text-sm text-cacao-900/80 dark:text-creme/80">{o.customer.notes}</p>
                            </div>
                          )}

                          {/* Items */}
                          <div className="border-t border-cacao-900/10 dark:border-white/10 pt-4">
                            <p className="text-xs font-medium text-cacao-900/60 dark:text-creme/60 mb-3">Items</p>
                            <div className="space-y-2">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex items-start justify-between gap-3 text-sm">
                                  <div>
                                    <p className="font-medium">{it.name}</p>
                                    <p className="text-xs text-cacao-900/60 dark:text-creme/60">Qty: {it.quantity}</p>
                                  </div>
                                  <p className="font-semibold whitespace-nowrap">{formatPriceTND(it.lineTotal, o.locale)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status Update */}
                          <div className="border-t border-cacao-900/10 dark:border-white/10 pt-4">
                            <label className="text-xs text-cacao-900/60 dark:text-creme/60 font-medium block mb-2">Update Status</label>
                            <select
                              className="w-full rounded-xl2 border border-cacao-900/15 bg-white/70 px-3 py-2 text-sm dark:bg-black/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cacao-900/20 dark:focus:ring-white/20"
                              value={o.status}
                              onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                              disabled={pending}
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {STATUS_CONFIG[s].label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Total */}
                          <div className="border-t border-cacao-900/10 dark:border-white/10 pt-4 flex items-center justify-between">
                            <p className="font-semibold text-cacao-900/80 dark:text-creme/80">Total Amount</p>
                            <p className="text-lg font-bold">{formatPriceTND(o.totals.grandTotal, o.locale)}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}