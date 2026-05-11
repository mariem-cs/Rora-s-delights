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
  
  // IMPORTANT: Exclure complètement la page de login et l'API login
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }
  
  // Vérifier si c'est une route admin protégée
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  
  if (isAdminRoute || isAdminApiRoute) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    
    if (!token) {
      // Rediriger vers login uniquement pour les routes admin
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    
    const isValid = await isValidAdminToken(token);
    
    if (!isValid) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};