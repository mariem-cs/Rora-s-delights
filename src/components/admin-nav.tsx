"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/cn";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const linkClass = (href: string) =>
    cn(
      "rounded-xl2 px-4 py-2 text-sm font-medium hover:bg-cacao-900/5 dark:hover:bg-white/10",
      pathname === href ? "bg-cacao-900/5 dark:bg-white/10" : "",
    );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Link className={linkClass("/admin")} href="/admin">
          Dashboard
        </Link>
        <Link className={linkClass("/admin/products")} href="/admin/products">
          Products
        </Link>
        <Link className={linkClass("/admin/orders")} href="/admin/orders">
          Orders
        </Link>
      </div>
      <button className="btn-outline px-4 py-2 text-xs" type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

