import type { Metadata } from "next";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getProducts, getCategories, getSubcategories } from "@/lib/catalog-db";

export const metadata: Metadata = {
  title: "Offers Hot - Cholti Home Decor",
  description: "Hot offer products with special prices. Add to cart and order on WhatsApp with cash on delivery.",
};

export const revalidate = 3600;

export default async function ShopOffersPage() {
  const [products, categories, subs] = await Promise.all([getProducts(), getCategories(), getSubcategories()]);

  return (
    <>
      <Header categories={categories} />
      <main className="max-w-[1180px] mx-auto px-5 py-8">
        <ShopCatalog initial={products} categories={categories} subs={subs} initialHot />
      </main>
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
