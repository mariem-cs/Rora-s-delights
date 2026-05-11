// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Vérifier le type de fichier
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG or WEBP" }, { status: 400 });
    }
    
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }
    
    // Générer un nom unique
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${safeName}`;
    
    // Sur Vercel, on ne peut pas écrire dans le filesystem
    // Donc on utilise une approche alternative
    
    // Convertir l'image en base64 pour stockage temporaire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Retourner l'image en base64
    // Pour Vercel, on va stocker l'image en base64 dans le produit
    // Tu pourras la convertir en fichier plus tard ou utiliser un service comme Cloudinary
    
    return NextResponse.json({ 
      success: true, 
      url: dataUrl,
      // Alternative: Utiliser un service gratuit comme Cloudinary
      // Pour l'instant, on retourne l'image en base64
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}