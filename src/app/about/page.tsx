import type { Metadata } from "next";
import Header from "@/components/Header";
import { AboutText } from "@/components/Brand";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getCategories } from "@/lib/catalog-db";
import { getAbout } from "@/lib/content-db";

export const metadata: Metadata = {
  title: "About Us - Cholti Home Decor",
  description: "Premium home decor for Bangladesh: sofa cover, bedsheet, cushion cover and curtain.",
};

export default async function AboutPage() {
  const [categories, about] = await Promise.all([getCategories(), getAbout()]);
  return (
    <>
      <Header categories={categories} />
      <AboutText initial={about} />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
