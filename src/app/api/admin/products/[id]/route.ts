// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const products = await getProducts(true);
    const index = products.findIndex(p => p.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Mettre à jour le produit en gardant l'ID existant
    const updatedProduct = {
      ...products[index],
      ...body,
      id: products[index].id, // Garder l'ID original
      updatedAt: new Date().toISOString(),
    };
    
    products[index] = updatedProduct;
    await saveProducts(products);
    
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const products = await getProducts(true);
    const filtered = products.filter(p => p.id !== params.id);
    
    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    await saveProducts(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}