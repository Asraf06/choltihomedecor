import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import { Story, Reviews } from "@/components/Story";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <Products />
        <Story />
        <Reviews />
        <CTA />
      </main>
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
