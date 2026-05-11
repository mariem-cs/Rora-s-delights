import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { notifyOrder } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    const whatsappUrl = buildWhatsAppOrderUrl(order);

    // Optional notifications (Resend / Telegram)
    await notifyOrder(order);

    return NextResponse.json({ orderId: order.id, whatsappUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

