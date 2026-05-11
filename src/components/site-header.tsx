"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function SiteHeader({ className }: { className?: string }) {
  const { locale } = useLocale();
  const tr = t(locale);
  const cartCount = useCartStore((s) => s.count());
  const wishCount = useWishlistStore((s) => s.count());

  return (
    <header className={cn("sticky top-0 z-40 border-b border-cacao-900/10 bg-white/70 backdrop-blur dark:bg-black/50", className)}>
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl2 bg-cacao-900 text-creme overflow-hidden">
            <Image src="/images/DELIGHTS (1).png" alt="Delights Logo" width={64} height={64} className="object-cover" />
          </div>
          <span className="hidden sm:inline text-lg">{tr.shopName}</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link className="btn-outline px-4 py-2 text-xs" href="/products">
              {tr.nav.products}
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link className="btn-outline relative px-3 py-2 text-xs" href="/cart" aria-label={tr.nav.cart}>
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel-600 px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <button
              className="btn-outline relative px-3 py-2 text-xs"
              type="button"
              onClick={() => (window.location.href = "/products#wishlist")}
              aria-label={tr.actions.wishlist}
            >
              <Heart className="h-4 w-4" />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white">
                  {wishCount}
                </span>
              )}
            </button>
          </motion.div>

          <ThemeToggle />
          <LocaleToggle />
        </nav>
      </div>
    </header>
  );
}
