import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getCategories, getFabrics, getSizes, getColors } from "@/lib/catalog-db";

import ProductView from "./ProductView";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const p = products.find((x) => x.slug === slug);
  if (!p) return { title: "Product not found - Cholti" };
  return {
    title: `${p.name} - Cholti Home Decor`,
    description: `${p.name} - ৳${p.now.toLocaleString()} (was ৳${p.old.toLocaleString()}). Cash on delivery sara Bangladesh e.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, cats] = await Promise.all([getProducts(), getCategories()]);
  const product = products.find((x) => x.slug === slug);
  if (!product) notFound();
  const related = products.filter((x) => x.slug !== slug).slice(0, 4);
  const [fabrics, sizes, colors] = await Promise.all([getFabrics(), getSizes(product.cat), getColors()]);
  return <ProductView product={product} related={related} categories={cats} fabrics={fabrics} sizes={sizes} colors={colors} />;
}
