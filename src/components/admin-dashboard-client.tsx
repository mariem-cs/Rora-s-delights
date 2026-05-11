"use client";

import { useEffect, useState } from "react";
import { BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import type { Product, Order } from "@/lib/types";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  completedOrders: number;
}

export function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders"),
        ]);

        const productsData = (await productsRes.json()) as { products?: Product[]; error?: string };
        const ordersData = (await ordersRes.json()) as { orders?: Order[]; error?: string };

        if (!productsRes.ok || !ordersRes.ok) {
          throw new Error("Failed to load statistics");
        }

        const products = productsData.products || [];
        const orders = ordersData.orders || [];

        const pendingOrders = orders.filter((o) => o.status === "pending").length;
        const completedOrders = orders.filter((o) => o.status === "completed").length;
        const totalRevenue = orders
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + o.totals.grandTotal, 0);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders,
          completedOrders,
          totalRevenue,
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtext,
    color,
    index,
  }: {
    icon: React.ComponentType<{ className: string }>;
    label: string;
    value: string | number;
    subtext?: string;
    color: "blue" | "green" | "amber" | "rose";
    index: number;
  }) => {
    const colorClasses = {
      blue: "from-blue-500/10 to-blue-600/5 border-blue-200/30 dark:from-blue-900/20 dark:to-blue-800/10 dark:border-blue-700/30",
      green: "from-green-500/10 to-green-600/5 border-green-200/30 dark:from-green-900/20 dark:to-green-800/10 dark:border-green-700/30",
      amber: "from-amber-500/10 to-amber-600/5 border-amber-200/30 dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30",
      rose: "from-rose-500/10 to-rose-600/5 border-rose-200/30 dark:from-rose-900/20 dark:to-rose-800/10 dark:border-rose-700/30",
    };

    const iconColorClasses = {
      blue: "text-blue-600 dark:text-blue-400",
      green: "text-green-600 dark:text-green-400",
      amber: "text-amber-600 dark:text-amber-400",
      rose: "text-rose-600 dark:text-rose-400",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl border p-6 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-cacao-900/70 dark:text-creme/70">{label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
            {subtext && <p className="mt-2 text-xs text-cacao-900/60 dark:text-creme/60">{subtext}</p>}
          </div>
          <div className={`${iconColorClasses[color]} p-3 rounded-xl bg-white/50 dark:bg-black/30`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-cacao-900/10 bg-cacao-900/5 p-6 dark:bg-white/5"
          >
            <div className="h-4 w-20 rounded bg-cacao-900/20 dark:bg-white/20"></div>
            <div className="mt-3 h-8 w-12 rounded bg-cacao-900/20 dark:bg-white/20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl2 border border-rose-200/30 bg-rose-500/5 p-4 text-sm text-rose-700 dark:border-rose-700/30 dark:bg-rose-900/20 dark:text-rose-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-cacao-900/60 dark:text-creme/60">Welcome to your cookie business admin panel</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          subtext="Available for sale"
          color="blue"
        />
        <StatCard
          index={1}
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.totalOrders}
          subtext={`${stats.pendingOrders} pending`}
          color="amber"
        />
        <StatCard
          index={2}
          icon={TrendingUp}
          label="Completed Orders"
          value={stats.completedOrders}
          subtext="Successfully delivered"
          color="green"
        />
        <StatCard
          index={3}
          icon={BarChart3}
          label="Total Revenue"
          value={`${stats.totalRevenue.toFixed(2)} €`}
          subtext="From completed orders"
          color="rose"
        />
      </div>

      {/* Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Order Status Breakdown */}
        <div className="rounded-2xl border border-cacao-900/10 bg-white/40 p-6 dark:border-white/10 dark:bg-black/20 backdrop-blur-sm">
          <h3 className="font-semibold tracking-tight">Order Summary</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cacao-900/70 dark:text-creme/70">Pending Orders</span>
              <span className="inline-flex items-center rounded-full bg-amber-100/60 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {stats.pendingOrders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-cacao-900/70 dark:text-creme/70">Completed Orders</span>
              <span className="inline-flex items-center rounded-full bg-green-100/60 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
                {stats.completedOrders}
              </span>
            </div>
            <div className="border-t border-cacao-900/10 pt-3 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-bold">
                  {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : "0"}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cacao-900/10 dark:bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0}%` }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-2xl border border-cacao-900/10 bg-white/40 p-6 dark:border-white/10 dark:bg-black/20 backdrop-blur-sm">
          <h3 className="font-semibold tracking-tight">System Status</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-cacao-900/70 dark:text-creme/70">API Connection</span>
              <span className="ml-auto text-xs font-medium text-green-700 dark:text-green-400">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-cacao-900/70 dark:text-creme/70">Database</span>
              <span className="ml-auto text-xs font-medium text-green-700 dark:text-green-400">Connected</span>
            </div>
            <div className="border-t border-cacao-900/10 pt-3 dark:border-white/10">
              <p className="text-xs text-cacao-900/60 dark:text-creme/60">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-8 rounded-2xl border border-blue-200/30 bg-blue-500/5 p-4 text-sm text-blue-800 dark:border-blue-700/30 dark:bg-blue-900/20 dark:text-blue-300"
      >
        <p className="font-medium">📊 Tip:</p>
        <p className="mt-1">Navigate to Products to manage your cookie inventory, or go to Orders to view and update customer orders.</p>
      </motion.div>
    </div>
  );
}
