import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import { Brand } from "@/components/Brand";
import { Reviews } from "@/components/Story";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getHero } from "@/lib/hero-db";
import { getProducts, getCategories, getReviews } from "@/lib/catalog-db";
import { getBrand } from "@/lib/content-db";

export const revalidate = 3600;

export default async function Home() {
  const [hero, products, categories, reviews, brand] = await Promise.all([
    getHero(),
    getProducts(),
    getCategories(),
    getReviews(),
    getBrand(),
  ]);

  return (
    <>
      <Header categories={categories} />
      <main>
        <Hero initial={hero} />
        <Categories initial={categories} />
        <Products initial={products} />
        <Brand initial={brand} />
        <Reviews initial={reviews} />
        <CTA />
      </main>
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
