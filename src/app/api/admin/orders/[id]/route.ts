import { NextResponse } from "next/server";
import { z } from "zod";

import { updateOrderStatus } from "@/lib/orders";

const schema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = schema.parse(body);
    const order = await updateOrderStatus(params.id, status);
    return NextResponse.json({ order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

