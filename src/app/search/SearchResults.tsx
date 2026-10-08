"use client";

import ProductCard from "@/components/ProductCard";
import { useLang } from "@/lib/lang";
import type { Product } from "@/lib/data";

export default function SearchResults({ query, hits }: { query: string; hits: Product[] }) {
  const { t } = useLang();
  return (
    <>
      <h1 className="font-serif text-2xl md:text-3xl">
        {t.searchResults} “{query}” ({hits.length})
      </h1>
      <div className="gold-divider" />
      {!hits.length ? (
        <p className="text-lg text-muted">{t.noResults}</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {hits.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
