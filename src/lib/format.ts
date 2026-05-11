import type { Locale } from "@/lib/types";

export function formatPriceTND(value: number, locale: Locale) {
  const fmt = new Intl.NumberFormat(locale === "ar" ? "ar-TN" : "fr-TN", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 2,
  });
  return fmt.format(value);
}

