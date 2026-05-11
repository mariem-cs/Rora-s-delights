import { CheckoutPageClient } from "@/components/checkout-page-client";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const products = await getProducts();
  return <CheckoutPageClient products={products} />;
}

