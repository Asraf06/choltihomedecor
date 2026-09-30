"use client";

import { useState } from "react";
import { PRODUCTS, type Product } from "@/lib/data";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";
import ProductCard from "./ProductCard";

const TAB_IDS = ["all", "best", "sofa", "bedsheet", "cushion", "curtain"];

// Product grid with tabs and header search filtering.
// fixedCat locks the grid to one category (category pages). Otherwise tabs switch freely.
export default function ShopGrid({ fixedCat, initial }: { fixedCat?: string; initial?: Product[] }) {
  const { t } = useLang();
  const { search } = useShop();
  const [tab, setTab] = useState(fixedCat ?? "all");
  const source = initial?.length ? initial : PRODUCTS;

  const list = source.filter((p) => {
    const catOk = fixedCat ? p.cat === fixedCat : true;
    const tabOk = fixedCat || tab === "all" ? true : tab === "best" ? p.tags.includes("best") : p.cat === tab;
    const q = search.trim().toLowerCase();
    return catOk && tabOk && (!q || `${p.name} ${p.bn} ${p.cat}`.toLowerCase().includes(q));
  });

  return (
    <>
      {!fixedCat && (
        <div className="text-center max-w-[640px] mx-auto mb-2">
          <h1 className="font-serif text-4xl">{t.shopTitle}</h1>
          <div className="gold-divider center" />
          <p className="text-sm text-muted">{t.shopSub}</p>
        </div>
      )}
      {!fixedCat && (
        <div className="flex gap-2.5 justify-center flex-wrap my-[18px]">
          {TAB_IDS.map((id, i) => (
            <button key={id} onClick={() => setTab(id)} className={`border rounded-[35px] px-[18px] py-2 text-[13px] font-bold ${tab === id ? "bg-clay border-clay text-white" : "bg-white border-line"}`}>
              {t.tabs[i]}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {!list.length && <p className="text-center text-muted py-10">{t.empty}</p>}
    </>
  );
}
