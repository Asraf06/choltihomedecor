import type { Metadata } from "next";
import Header from "@/components/Header";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getCategories } from "@/lib/catalog-db";
import WishlistView from "./WishlistView";

export const metadata: Metadata = {
  title: "Wishlist - Cholti Home Decor",
  description: "Your saved products. Add to cart when ready.",
};

export default async function WishlistPage() {
  return (
    <>
      <Header categories={await getCategories()} />
      <WishlistView />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
