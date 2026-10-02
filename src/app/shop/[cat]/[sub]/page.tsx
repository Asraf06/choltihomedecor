import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getProducts, getCategories, getSubcategories } from "@/lib/catalog-db";

export const revalidate = 3600;

export async function generateStaticParams() {
  const subs = await getSubcategories();
  return subs.map((s) => ({ cat: s.cat, sub: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string; sub: string }> }): Promise<Metadata> {
  const { cat, sub } = await params;
  return {
    title: `${sub} ${cat} - Cholti Home Decor`,
    description: `All ${sub} products. Add to cart and order on WhatsApp with cash on delivery.`,
  };
}

export default async function ShopSubPage({ params }: { params: Promise<{ cat: string; sub: string }> }) {
  const { cat, sub } = await params;
  const [products, categories, subs] = await Promise.all([getProducts(), getCategories(), getSubcategories()]);
  if (!categories.some((c) => c.id === cat)) notFound();
  if (!subs.some((s) => s.id === sub && s.cat === cat)) notFound();

  return (
    <>
      <Header categories={categories} />
      <main className="max-w-[1180px] mx-auto px-5 py-8">
        <ShopCatalog initial={products} categories={categories} subs={subs} initialCat={cat} initialSub={sub} />
      </main>
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
