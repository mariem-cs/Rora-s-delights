"use client";

import Link from "next/link";
import { Camera, Users, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    
    <footer className="border-t border-cacao-900/10 dark:border-white/10 py-8 sm:py-12 bg-cacao-50/30 dark:bg-cacao-900/20 mt-8 sm:mt-12">
      <div className="container-page">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <p className="text-sm sm:text-base text-cacao-900 dark:text-creme font-medium">Suivez nous</p>

            <Link
              href="https://www.instagram.com/rora.s_delights?igsh=ZWVubzkydGcyZDZr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/60 dark:bg-cacao-900/30 text-cacao-900 dark:text-creme hover:bg-white dark:hover:bg-cacao-900/50 transition-all duration-200 shadow-soft-sm"
              aria-label="Suivez-nous sur Instagram"
            >
              <Camera className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline text-sm">Instagram</span>
            </Link>

            <Link
              href="https://www.facebook.com/Rora.s.Delights"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/60 dark:bg-cacao-900/30 text-cacao-900 dark:text-creme hover:bg-white dark:hover:bg-cacao-900/50 transition-all duration-200 shadow-soft-sm"
              aria-label="Suivez-nous sur Facebook"
            >
              <Users className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline text-sm">Facebook</span>
            </Link>

            <Link
              href="https://wa.me/21650882185"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-100/60 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200 shadow-soft-sm"
              aria-label="Contactez-nous sur WhatsApp"
            >
              <Phone className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="hidden sm:inline text-sm">WhatsApp</span>
            </Link>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs sm:text-sm text-cacao-900/70 dark:text-creme/70 w-full sm:flex-row">
            <p>© {new Date().getFullYear()} Rora's Delights. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link className="hover:underline hover:text-cacao-900 dark:hover:text-creme transition-colors" href="/admin">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
