import { NextResponse } from "next/server";

import { checkAdminCredentials, setAdminCookie, signAdminJwt, adminCredentialsConfigured } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    if (!adminCredentialsConfigured()) {
      return NextResponse.json(
        { error: "Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD." },
        { status: 500 },
      );
    }

    const { email, password } = (await req.json()) as { email?: string; password?: string };
    if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    if (!checkAdminCredentials(email, password)) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await signAdminJwt({ email });
    setAdminCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

