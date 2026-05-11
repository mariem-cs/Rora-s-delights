import "server-only";

import { Resend } from "resend";

import type { Order } from "@/lib/types";
import { buildWhatsAppOrderText } from "@/lib/whatsapp";

export async function notifyOrder(order: Order) {
  await Promise.allSettled([notifyByEmail(order), notifyByTelegram(order)]);
}

async function notifyByEmail(order: Order) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO;
  const from = process.env.RESEND_FROM || "orders@roras-delights.local";
  if (!apiKey || !to) return;

  const resend = new Resend(apiKey);
  const text = buildWhatsAppOrderText(order, order.locale);

  await resend.emails.send({
    to,
    from,
    subject: `New order ${order.id}`,
    text,
  });
}

async function notifyByTelegram(order: Order) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const text = buildWhatsAppOrderText(order, order.locale);
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

