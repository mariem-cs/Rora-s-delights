import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  const isValid = await verifyToken(token);
  
  if (!isValid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  return NextResponse.json({ authenticated: true });
}