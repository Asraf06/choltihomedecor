import type { Metadata } from "next";
import Header from "@/components/Header";
import { Story } from "@/components/Story";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getCategories } from "@/lib/catalog-db";

export const metadata: Metadata = {
  title: "About Us - Cholti Home Decor",
  description: "Premium home decor for Bangladesh: sofa cover, bedsheet, cushion cover and curtain.",
};

export default async function AboutPage() {
  return (
    <>
      <Header categories={await getCategories()} />
      <Story />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
