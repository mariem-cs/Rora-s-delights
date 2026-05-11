import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/product-detail-client";
import { getProductBySlug } from "@/lib/products";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name.fr,
    description: product.description.fr,
    openGraph: {
      title: product.name.fr,
      description: product.description.fr,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}

