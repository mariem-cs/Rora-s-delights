import { NextResponse } from "next/server";
import { z } from "zod";

import { updateOrderStatus } from "@/lib/orders";
import { requireAdminFromCookies } from "@/lib/admin-auth";

const schema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

