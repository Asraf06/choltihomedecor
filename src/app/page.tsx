import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import { Story, Reviews } from "@/components/Story";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getHero } from "@/lib/hero-db";
import { getProducts, getCategories, getReviews } from "@/lib/catalog-db";

export const revalidate = 3600;

export default async function Home() {
  const [hero, products, categories, reviews] = await Promise.all([
    getHero(),
    getProducts(),
    getCategories(),
    getReviews(),
  ]);

  return (
    <>
      <Header categories={categories} />
      <main>
        <Hero initial={hero} />
        <Categories initial={categories} />
        <Products initial={products} />
        <Story />
        <Reviews initial={reviews} />
        <CTA />
      </main>
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
