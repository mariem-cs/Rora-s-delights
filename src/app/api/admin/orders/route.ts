import { NextResponse } from "next/server";

import { listOrders } from "@/lib/orders";
import { requireAdminFromCookies } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listOrders();
  return NextResponse.json({ orders });
}

