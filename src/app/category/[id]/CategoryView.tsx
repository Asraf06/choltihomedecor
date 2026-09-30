"use client";

import Link from "next/link";
import ShopGrid from "@/components/ShopGrid";
import type { Product } from "@/lib/data";
import { useLang } from "@/lib/lang";

export default function CategoryView({ cat, name, initial }: { cat: string; name: string; initial?: Product[] }) {
  const { t } = useLang();

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <Link href="/shop" className="text-[13px] text-muted inline-block mb-3">{t.back}</Link>
      <div className="max-w-[640px] mb-5">
        <h1 className="font-serif text-4xl">{name}</h1>
        <div className="gold-divider" />
      </div>
      <ShopGrid fixedCat={cat} initial={initial} />
    </main>
  );
}
