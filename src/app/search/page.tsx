import type { Metadata } from "next";
import Header from "@/components/Header";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getProducts, getCategories } from "@/lib/catalog-db";
import SearchResults from "./SearchResults";

export const metadata: Metadata = {
  title: "Search - Cholti Home Decor",
  description: "Search products by name.",
};

export const revalidate = 3600;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const hits = query
    ? products.filter((p) =>
        [p.name, p.bn, p.cat, p.sub ?? "", ...(p.tags ?? [])].join(" ").toLowerCase().includes(query)
      )
    : [];

  return (
    <>
      <Header categories={categories} />
      <main className="max-w-[1180px] mx-auto px-5 py-8 min-h-[50vh]">
        <SearchResults query={q ?? ""} hits={hits} />
      </main>
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
