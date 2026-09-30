import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/data";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return { title: "Product not found - Cholti" };
  return {
    title: `${p.name} - Cholti Home Decor`,
    description: `${p.name} - ৳${p.now.toLocaleString()} (was ৳${p.old.toLocaleString()}). Cash on delivery sara Bangladesh e.`,
  };
}

import ProductView from "./ProductView";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
