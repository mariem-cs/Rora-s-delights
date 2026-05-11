"use client";

import Link from "next/link";
import { Camera, Users, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    
    <footer className="border-t border-cacao-900/10 py-10">
      <div className="container-page">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-6">
              <p>Suivez nous sur nos réseaux sociaux</p>

            <Link
              href="https://www.instagram.com/rora.s_delights?igsh=ZWVubzkydGcyZDZr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cacao-900/70 hover:text-cacao-900 dark:text-creme/70 dark:hover:text-creme transition-colors"
              aria-label="Suivez-nous sur Instagram"
            >
              <Camera className="h-5 w-5" />
              <span className="hidden sm:inline">Instagram</span>
            </Link>

            <Link
              href="https://www.facebook.com/Rora.s.Delights"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cacao-900/70 hover:text-cacao-900 dark:text-creme/70 dark:hover:text-creme transition-colors"
              aria-label="Suivez-nous sur Facebook"
            >
              <Users className="h-5 w-5" />
              <span className="hidden sm:inline">Facebook</span>
            </Link>

            <Link
              href="https://wa.me/21650882185"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cacao-900/70 hover:text-cacao-900 dark:text-creme/70 dark:hover:text-creme transition-colors"
              aria-label="Contactez-nous sur WhatsApp"
            >
              <Phone className="h-5 w-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-cacao-900/70 dark:text-creme/70 sm:flex-row sm:text-left">
            <p>© {new Date().getFullYear()} Rora’s Delights. Tous les droits sont réservés.</p>
            <div className="flex items-center gap-4">
              
              <Link className="hover:underline" href="/admin">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
