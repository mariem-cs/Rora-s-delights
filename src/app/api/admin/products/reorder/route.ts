// app/api/admin/products/reorder/route.ts
import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/products";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { products: orderData } = await request.json() as { products: { id: string; order: number }[] };
    
    const currentProducts = await getProducts(true);
    
    // Update orders
    const updatedProducts = currentProducts.map(product => {
      const orderItem = orderData.find(o => o.id === product.id);
      if (orderItem) {
        return { ...product, order: orderItem.order };
      }
      return product;
    });
    
    // Sort by order
    updatedProducts.sort((a, b) => {
      const orderA = (a as any).order ?? 0;
      const orderB = (b as any).order ?? 0;
      return orderA - orderB;
    });
    
    await saveProducts(updatedProducts);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder products" },
      { status: 500 }
    );
  }
}