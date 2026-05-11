"use client";

import { Languages } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/cn";

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();
  return (
    <button
      className={cn("btn-outline px-3 py-2 text-xs", className)}
      onClick={toggleLocale}
      type="button"
      aria-label="Toggle language"
      title={locale === "fr" ? "العربية" : "Français"}
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{locale === "fr" ? "AR" : "FR"}</span>
    </button>
  );
}

