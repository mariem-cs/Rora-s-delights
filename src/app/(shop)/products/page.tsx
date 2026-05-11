import { ProductsPageClient } from "@/components/products-page-client";
import { getProducts } from "@/lib/products";


export const dynamic = 'force-dynamic'; // Force le rendu dynamique
export const revalidate = 0; // Désactive le cache

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsPageClient products={products} />;
}