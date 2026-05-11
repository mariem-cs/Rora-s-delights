"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cacao-50 to-creme-50 dark:from-cacao-950 dark:to-creme-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/80 dark:bg-black/50 backdrop-blur-sm border-r border-cacao-900/10 dark:border-white/10">
          <div className="p-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-caramel-600/10 text-caramel-700 dark:text-caramel-400 border-r-2 border-caramel-600"
                      : "hover:bg-cacao-900/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-6 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}