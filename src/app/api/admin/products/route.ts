import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { z } from "zod";

import { getProducts, saveProducts } from "@/lib/products";
import { requireAdminFromCookies } from "@/lib/admin-auth";

const productInputSchema = z.object({
  slug: z.string().min(1),
  name: z.object({ fr: z.string().min(1), ar: z.string().min(1) }),
  description: z.object({ fr: z.string().min(1), ar: z.string().min(1) }),
  price: z.number().nonnegative(),
  image: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function GET() {
  const admin = await requireAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const admin = await requireAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const input = productInputSchema.parse(body);
    const now = new Date().toISOString();
    const products = await getProducts();

    if (products.some((p) => p.slug === input.slug)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const product = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    await saveProducts([product, ...products]);
    return NextResponse.json({ product });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

