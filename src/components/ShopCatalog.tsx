"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Check, ArrowUpDown, X, Search } from "lucide-react";
import { PRODUCTS, CATEGORIES, type Product } from "@/lib/data";
import type { ShopCategory } from "@/lib/catalog-db";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";
import ProductCard from "./ProductCard";

const SORTS = ["featured", "low", "high", "off"];

// Custom dropdown instead of a native select, so the option list matches the site theme.
function SortDropdown({ sort, setSort }: { sort: string; setSort: (s: string) => void }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const current = t.sortOpts[SORTS.indexOf(sort)] ?? t.sortOpts[0];

  return (
    <span className="inline-flex items-center gap-2 text-[13px]">
      <span className="text-muted font-bold hidden sm:inline">{t.sortBy}</span>
      <span className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={`inline-flex items-center gap-2 bg-paper border rounded-full pl-4 pr-3 py-2 text-[13px] font-bold ${open ? "border-clay" : "border-line hover:border-gold"}`}
        >
          <ArrowUpDown size={14} className="text-clay" />
          {current}
          <ChevronDown size={15} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <>
            <button aria-label="Close sort menu" onClick={() => setOpen(false)} className="fixed inset-0 z-[90] cursor-default bg-transparent" />
            <span role="listbox" className="absolute right-0 top-full mt-2 z-[95] min-w-[230px] bg-paper border border-line rounded-2xl shadow-[0_18px_50px_rgba(62,32,12,0.10)] p-2">
              {SORTS.map((s, i) => (
                <button
                  key={s}
                  role="option"
                  aria-selected={sort === s}
                  onClick={() => { setSort(s); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-left ${sort === s ? "bg-clay-light text-clay" : "hover:bg-sand"}`}
                >
                  <span className={`w-5 grid place-items-center ${sort === s ? "" : "invisible"}`}>
                    <Check size={15} />
                  </span>
                  {t.sortOpts[i]}
                </button>
              ))}
            </span>
          </>
        )}
      </span>
    </span>
  );
}

// Shop layout: sticky category sidebar on the left, sort dropdown above the grid on the right.
export default function ShopCatalog({ initial, categories }: { initial?: Product[]; categories?: ShopCategory[] }) {
  const { t, lang } = useLang();
  const { search, setSearch, chromeHidden } = useShop();
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const source = initial?.length ? initial : PRODUCTS;
  const cats = categories?.length ? categories : (CATEGORIES as ShopCategory[]);

  const catIds = ["all", ...cats.map((c) => c.id)];
  const catName = (c: string) => {
    if (c === "all") return t.all;
    const found = cats.find((x) => x.id === c);
    if (!found) return c;
    return lang === "bn" && found.bn ? found.bn : found.name;
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: source.length };
    for (const c of catIds.slice(1)) m[c] = source.filter((p) => p.cat === c).length;
    return m;
  }, [source, cats]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = source.filter(
      (p) =>
        (cat === "all" || p.cat === cat) &&
        (!q || `${p.name} ${p.bn} ${p.cat}`.toLowerCase().includes(q))
    );
    if (sort === "low") filtered.sort((a, b) => a.now - b.now);
    if (sort === "high") filtered.sort((a, b) => b.now - a.now);
    if (sort === "off") filtered.sort((a, b) => b.off - a.off);
    return filtered;
  }, [cat, sort, search]);

  const q = search.trim();
  const hasActive = cat !== "all" || sort !== "featured" || q !== "";
  const clearAll = () => {
    setCat("all");
    setSort("featured");
    setSearch("");
  };

  const activeFilters = (
    <div className="mt-5 pt-4 border-t border-line">
      <div className="flex items-center justify-between mb-2">
        <b className="text-[13px]">{t.activeFilters}</b>
        {hasActive && (
          <button onClick={clearAll} className="inline-flex items-center gap-1 text-[12px] font-bold text-clay hover:text-clay-dark">
            <X size={13} />{t.clearAll}
          </button>
        )}
      </div>
      {!hasActive ? (
        <p className="text-[12px] text-muted">{t.noFilters}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {cat !== "all" && (
            <button onClick={() => setCat("all")} className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[11.5px] font-bold pl-3 pr-2 py-1.5">
              {catName(cat)}<X size={12} />
            </button>
          )}
          {sort !== "featured" && (
            <button onClick={() => setSort("featured")} className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[11.5px] font-bold pl-3 pr-2 py-1.5">
              {t.sortOpts[SORTS.indexOf(sort)]}<X size={12} />
            </button>
          )}
          {q !== "" && (
            <button onClick={() => setSearch("")} className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[11.5px] font-bold pl-3 pr-2 py-1.5">
              <Search size={12} />{q.length > 18 ? `${q.slice(0, 18)}…` : q}<X size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  const sortSelect = <SortDropdown sort={sort} setSort={setSort} />;

  return (
    <div className="flex gap-6 items-start">
      <aside
        style={{ top: chromeHidden ? 16 : 170 }}
        className="hidden lg:block w-60 shrink-0 bg-paper border border-line rounded-[20px] p-4 sticky max-h-[calc(100vh-190px)] overflow-y-auto transition-[top] duration-300"
      >
        <b className="text-[13px] block mb-2">{t.categories}</b>
        <div className="flex flex-col gap-1.5">
          {catIds.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex justify-between items-center rounded-xl px-3.5 py-2.5 text-[13px] font-bold border ${cat === c ? "bg-clay border-clay text-white" : "bg-white border-line hover:border-gold"}`}
            >
              {catName(c)}
              <span className={`text-[11px] rounded-full px-2 py-0.5 ${cat === c ? "bg-white/20" : "bg-sand text-muted"}`}>{counts[c]}</span>
            </button>
          ))}
        </div>
        {activeFilters}
      </aside>
      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-5 px-5">
          {catIds.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold border ${cat === c ? "bg-clay border-clay text-white" : "bg-white border-line"}`}
            >
              {catName(c)}
              <span className={`text-[11px] ${cat === c ? "text-white/80" : "text-muted"}`}>{counts[c]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="flex items-center gap-2 text-[13px] text-muted">
            {list.length} {t.items}
            {hasActive && (
              <button onClick={clearAll} className="inline-flex items-center gap-1 text-[12px] font-bold text-clay hover:text-clay-dark">
                <X size={13} />{t.clearAll}
              </button>
            )}
          </span>
          {sortSelect}
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        {!list.length && <p className="text-center text-muted py-10">{t.empty}</p>}
      </div>
    </div>
  );
}
