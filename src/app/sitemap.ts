import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await getProducts();

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    { url: `${base}/cart`, lastModified: new Date() },
    { url: `${base}/checkout`, lastModified: new Date() },
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date(p.updatedAt || p.createdAt || Date.now()) })),
  ];
}

