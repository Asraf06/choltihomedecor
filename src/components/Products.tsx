"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { useLang } from "@/lib/lang";
import ProductCard from "./ProductCard";

// Homepage preview. Full catalog lives on /shop.
export default function Products() {
  const { t } = useLang();
  const featured = PRODUCTS.filter((p) => p.tags.includes("best")).slice(0, 4);

  return (
    <section id="products" className="py-[64px] scroll-mt-[170px]">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="text-center max-w-[640px] mx-auto mb-5">
          <div className="eyebrow">{t.prodEyebrow}</div>
          <h2 className="font-serif text-4xl">{t.prodTitleA} <span className="italic-accent">{t.prodTitleB}</span></h2>
          <div className="gold-divider center" />
          <p className="text-sm text-muted">{t.prodSub}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="text-center mt-7">
          <Link href="/shop" className="inline-flex items-center gap-2 bg-forest text-white rounded-[35px] px-6 py-3 text-[13px] font-bold">
            {t.viewShop} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
