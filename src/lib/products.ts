import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { getJson, putJson, hasBlobToken } from "@/lib/blob-json";
import type { Product } from "@/lib/types";

const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.object({ fr: z.string().min(1), ar: z.string().min(1) }),
  description: z.object({ fr: z.string().min(1), ar: z.string().min(1) }),
  price: z.number().nonnegative(),
  image: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
    order: z.number().optional()// Ajouter cette ligne

});

const productsSchema = z.array(productSchema);

const seedPath = path.join(process.cwd(), "src", "data", "products.seed.json");
const BLOB_PRODUCTS_PATH = "products/products.json";

// Cache simple pour éviter de lire le fichier trop souvent
let cachedProducts: Product[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 5000; // 5 secondes

async function readSeedProducts(): Promise<Product[]> {
  const raw = await fs.readFile(seedPath, "utf-8");
  const parsed = productsSchema.parse(JSON.parse(raw));
  return parsed;
}

async function writeSeedProducts(products: Product[]) {
  await fs.writeFile(seedPath, JSON.stringify(products, null, 2) + "\n", "utf-8");
}

export async function getProducts(forceRefresh = false): Promise<Product[]> {
  // Forcer le rafraîchissement si demandé
  if (forceRefresh) {
    cachedProducts = null;
  }
  
  // Vérifier le cache
  const now = Date.now();
  if (cachedProducts && (now - lastFetch) < CACHE_TTL) {
    return cachedProducts;
  }
  
  let products: Product[];
  
  if (hasBlobToken()) {
    const fromBlob = await getJson<Product[]>(BLOB_PRODUCTS_PATH);
    products = fromBlob ? productsSchema.parse(fromBlob) : await readSeedProducts();
  } else {
    products = await readSeedProducts();
  }
  
  // Mettre en cache
  cachedProducts = products;
  lastFetch = now;
  
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function saveProducts(products: Product[]) {
  const validated = productsSchema.parse(products);
  
  // Invalider le cache
  cachedProducts = null;
  
  if (hasBlobToken()) {
    await putJson(BLOB_PRODUCTS_PATH, validated);
    return { persistedTo: "blob" as const };
  }

  if (process.env.NODE_ENV !== "production") {
    await writeSeedProducts(validated);
    return { persistedTo: "seed" as const };
  }

  throw new Error(
    "No persistence configured. Set BLOB_READ_WRITE_TOKEN (recommended) to enable admin product CRUD in production.",
  );
}

// Fonction pour forcer le rafraîchissement depuis le client
export async function refreshProducts(): Promise<Product[]> {
  return getProducts(true);
}