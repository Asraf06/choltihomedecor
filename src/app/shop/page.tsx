import type { Metadata } from "next";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Shop All Products - Cholti Home Decor",
  description: "Full catalog: sofa cover, bedsheet, cushion cover and curtain. Add to cart and order on WhatsApp.",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="max-w-[1180px] mx-auto px-5 py-8">
        <ShopCatalog />
      </main>
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
