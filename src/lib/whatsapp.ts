import type { Locale, Order } from "@/lib/types";
import { formatPriceTND } from "@/lib/format";

function getShopWhatsAppNumber() {
  return process.env.WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

export function buildWhatsAppOrderUrl(order: Order) {
  const number = getShopWhatsAppNumber();
  if (!number) return "";
  const text = buildWhatsAppOrderText(order, order.locale);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppOrderText(order: Order, locale: Locale) {
  const isAr = locale === "ar";
  const lines: string[] = [];
  lines.push(isAr ? "طلب جديد" : "Nouvelle commande");
  lines.push(`ID: ${order.id}`);
  lines.push("");
  lines.push(isAr ? "الزبون:" : "Client:");
  lines.push(`${order.customer.name} — ${order.customer.phone}`);
  lines.push(order.customer.address);
  if (order.customer.notes) lines.push((isAr ? "ملاحظات: " : "Notes: ") + order.customer.notes);
  lines.push("");
  lines.push(isAr ? "الطلبات:" : "Articles:");
  for (const it of order.items) {
    lines.push(`- ${it.quantity} × ${it.name} (${formatPriceTND(it.unitPrice, locale)}) = ${formatPriceTND(it.lineTotal, locale)}`);
  }
  lines.push("");
  lines.push(`${isAr ? "الإجمالي" : "Total"}: ${formatPriceTND(order.totals.grandTotal, locale)}`);
  return lines.join("\n");
}

