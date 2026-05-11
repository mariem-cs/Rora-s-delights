import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || "dev-jwt-secret-change-me";
  return new TextEncoder().encode(secret);
}

async function isValidAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload.role === "admin";
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isAdmin) return NextResponse.next();

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/login")) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return reject(req);

  try {
    const ok = await isValidAdminToken(token);
    if (!ok) return reject(req);
    return NextResponse.next();
  } catch {
    return reject(req);
  }
}

function reject(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

