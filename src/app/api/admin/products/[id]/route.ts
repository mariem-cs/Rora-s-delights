import { NextResponse } from "next/server";
import { z } from "zod";

import { getProducts, saveProducts } from "@/lib/products";

const updateSchema = z
  .object({
    slug: z.string().min(1).optional(),
    name: z.object({ fr: z.string().min(1), ar: z.string().min(1) }).optional(),
    description: z.object({ fr: z.string().min(1), ar: z.string().min(1) }).optional(),
    price: z.number().nonnegative().optional(),
    image: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    featured: z.boolean().optional(),
  })
  .strict();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const patch = updateSchema.parse(body);
    const products = await getProducts();
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (patch.slug && products.some((p) => p.slug === patch.slug && p.id !== params.id)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const updated = { ...products[idx], ...patch, updatedAt: new Date().toISOString() };
    const next = [...products];
    next[idx] = updated;
    await saveProducts(next);
    return NextResponse.json({ product: updated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const products = await getProducts();
    const next = products.filter((p) => p.id !== params.id);
    if (next.length === products.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await saveProducts(next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

