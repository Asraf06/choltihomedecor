import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import CategoryView from "./CategoryView";

const CATS = ["sofa", "bedsheet", "cushion", "curtain"] as const;

export async function generateStaticParams() {
  return CATS.map((id) => ({ id }));
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
  if (!CATS.includes(id as (typeof CATS)[number])) notFound();

  return (
    <>
      <Header />
      <CategoryView cat={id} />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
