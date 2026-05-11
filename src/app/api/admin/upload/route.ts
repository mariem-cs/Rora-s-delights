
// app/api/admin/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

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
    
    // Upload vers Vercel Blob
    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    
    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      pathname: blob.pathname 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}