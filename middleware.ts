import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || "dev-jwt-secret-change-me";
  return new TextEncoder().encode(secret);
}

async function isValidAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isAdminRoute) return NextResponse.next();

  // Allow login page and API without authentication
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Check for valid token
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return handleUnauthorized(req);
  }

  // Verify token
  const isValid = await isValidAdminToken(token);
  if (!isValid) {
    return handleUnauthorized(req);
  }

  return NextResponse.next();
}

function handleUnauthorized(req: NextRequest) {
  // For API requests, return 401
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For page requests, redirect to login
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

