import type { Metadata } from "next";
import Header from "@/components/Header";
import { Story } from "@/components/Story";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "About Us - Cholti Home Decor",
  description: "Premium home decor for Bangladesh: sofa cover, bedsheet, cushion cover and curtain.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <Story />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
