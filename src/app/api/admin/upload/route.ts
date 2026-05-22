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
    
    // Accept any image format - no file type restrictions
    // Check if it's an image by MIME type prefix
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }
    
    // Increase file size limit to 20MB for better quality images
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB` }, { status: 400 });
    }
    
    // Générer un nom unique
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${randomStr}-${safeName}`;
    
    // Convertir l'image en base64 pour stockage temporaire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    // Log upload info
    console.log(`Image uploaded: ${filename}, Type: ${file.type}, Size: ${(file.size / 1024).toFixed(2)}KB`);
    
    // Retourner l'image en base64
    // Pour Vercel, on va stocker l'image en base64 dans le produit
    // On peut aussi utiliser un service comme Cloudinary, Supabase Storage, ou AWS S3
    
    return NextResponse.json({ 
      success: true, 
      url: dataUrl,
      filename: filename,
      type: file.type,
      size: file.size
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Upload failed" 
    }, { status: 500 });
  }
}