import type { Metadata } from "next";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getProducts, getCategories, getSubcategories } from "@/lib/catalog-db";

export const metadata: Metadata = {
  title: "Shop All Products - Cholti Home Decor",
  description: "Full catalog: sofa cover, bedsheet, cushion cover and curtain. Add to cart and order on WhatsApp.",
};

export const revalidate = 60;

export default async function ShopPage() {
  const [products, categories, subs] = await Promise.all([getProducts(), getCategories(), getSubcategories()]);

  return (
    <>
      <Header categories={categories} />
      <main className="max-w-[1180px] mx-auto px-5 py-8">
        <ShopCatalog initial={products} categories={categories} subs={subs} />
      </main>
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
