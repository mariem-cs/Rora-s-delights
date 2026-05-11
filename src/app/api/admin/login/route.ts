import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";

function getSecret() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function POST(req: Request) {
  try {
    // Vérifier que les variables d'environnement sont configurées
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("Admin credentials not configured");
      return NextResponse.json(
        { error: "Configuration admin manquante" },
        { status: 500 }
      );
    }

    const { email, password } = (await req.json()) as { email?: string; password?: string };
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifier les identifiants
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Créer le token JWT
    const token = await new SignJWT({ email, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(getSecret());

    // Définir le cookie
    const cookieStore = cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}