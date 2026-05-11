import { getProducts } from "@/lib/products";
import { HomeClient } from "@/components/home-client";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return <HomeClient featured={featured} />;
}
