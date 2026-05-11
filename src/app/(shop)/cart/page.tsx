import { CartPageClient } from "@/components/cart-page-client";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const products = await getProducts();
  return <CartPageClient products={products} />;
}

