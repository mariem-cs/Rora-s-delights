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
    <header className={cn("sticky top-0 z-40 border-b border-cacao-900/10 bg-white/70 backdrop-blur-md dark:bg-cacao-900/40 dark:border-white/10 shadow-soft-sm", className)}>
      <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight flex-shrink-0">
          <div className="inline-flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-lg sm:rounded-xl2 bg-cacao-900 text-creme overflow-hidden shadow-soft-sm">
            <Image src="/images/DELIGHTS (1).png" alt="Delights Logo" width={64} height={64} className="object-cover" priority />
          </div>
          <span className="hidden sm:inline text-base sm:text-lg md:text-xl text-cacao-900 dark:text-creme">{tr.shopName}</span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
            <Link className="btn-outline px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm" href="/products">
              <span className="hidden sm:inline">{tr.nav.products}</span>
              <span className="sm:hidden">Shop</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
            <Link className="btn-outline relative px-3 py-2 sm:py-2.5" href="/cart" aria-label={tr.nav.cart}>
              <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel-600 px-1 text-[10px] sm:text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
            <button
              className="btn-outline relative px-3 py-2 sm:py-2.5"
              type="button"
              onClick={() => (window.location.href = "/products#wishlist")}
              aria-label={tr.actions.wishlist}
            >
              <Heart className="h-4 sm:h-5 w-4 sm:w-5" />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] sm:text-[11px] font-semibold text-white">
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
