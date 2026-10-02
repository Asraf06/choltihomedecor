import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getProducts, getCategories, getSubcategories } from "@/lib/catalog-db";

export const revalidate = 3600;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ cat: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  return {
    title: `${cat} - Cholti Home Decor`,
    description: `All ${cat} products. Add to cart and order on WhatsApp with cash on delivery.`,
  };
}

export default async function ShopCatPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const [products, categories, subs] = await Promise.all([getProducts(), getCategories(), getSubcategories()]);
  if (!categories.some((c) => c.id === cat)) notFound();

  return (
    <>
      <Header categories={categories} />
      <main className="max-w-[1180px] mx-auto px-5 py-8">
        <ShopCatalog initial={products} categories={categories} subs={subs} initialCat={cat} />
      </main>
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
