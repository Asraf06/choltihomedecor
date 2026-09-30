import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import CategoryView from "./CategoryView";
import { getProducts, getCategories } from "@/lib/catalog-db";

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${id} - Cholti Home Decor`,
    description: `All ${id} products. Add to cart and order on WhatsApp with cash on delivery.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [products, cats] = await Promise.all([getProducts(), getCategories()]);
  const found = cats.find((c) => c.id === id);
  if (!found) notFound();

  return (
    <>
      <Header categories={cats} />
      <CategoryView cat={id} name={found.name} initial={products} />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
