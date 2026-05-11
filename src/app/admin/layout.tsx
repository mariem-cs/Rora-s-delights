"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X, Home } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fermer la sidebar sur mobile quand la route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Empêcher le scroll du body quand la sidebar est ouverte sur mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

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
      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Bouton menu mobile */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar - Responsive */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white/80 dark:bg-black/50 backdrop-blur-sm 
          border-r border-cacao-900/10 dark:border-white/10 
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-caramel-600 transition-colors">
            Rora Delights
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-cacao-900/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6">
          {/* Bouton retour à l'accueil */}
          <Link
            href="/"
            className="flex items-center gap-3 px-6 py-3 text-sm text-cacao-700 dark:text-creme-300 hover:bg-cacao-900/5 dark:hover:bg-white/5 transition-colors border-b border-cacao-900/10 dark:border-white/10 mb-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

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
            className="flex w-full items-center gap-3 px-6 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors mt-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 pt-16 lg:pt-4 lg:p-8 lg:ml-0">
        <div className="max-w-full overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}