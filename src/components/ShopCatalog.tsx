"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, ArrowUpDown, X, Search } from "lucide-react";
import { PRODUCTS, CATEGORIES, type Product } from "@/lib/data";
import type { ShopCategory, ShopSub } from "@/lib/catalog-db";
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
    <span className="inline-flex items-center gap-2 text-[17px]">
      <span className="text-muted font-bold hidden sm:inline">{t.sortBy}</span>
      <span className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={`inline-flex items-center gap-2 bg-paper border rounded-full pl-4 pr-3 py-2 text-[17px] font-bold ${open ? "border-clay" : "border-line hover:border-gold"}`}
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
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[17px] font-bold text-left ${sort === s ? "bg-clay-light text-clay dark:bg-clay dark:text-white" : "hover:bg-sand"}`}
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
// Categories with subcategories fold/unfold (chevron). Picking a sub filters the grid.
export default function ShopCatalog({ initial, categories, subs, initialCat = "all", initialSub = "all", initialHot = false }: { initial?: Product[]; categories?: ShopCategory[]; subs?: ShopSub[]; initialCat?: string; initialSub?: string; initialHot?: boolean }) {
  const { t, lang } = useLang();
  const { search, setSearch, chromeHidden } = useShop();
  const router = useRouter();
  const [cat, setCat] = useState(initialCat);
  const [sub, setSub] = useState(initialSub);
  const [hot, setHot] = useState(initialHot);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialCat !== "all" ? { [initialCat]: true } : {});
  const [sort, setSort] = useState("featured");
  const source = initial?.length ? initial : PRODUCTS;
  const cats = categories?.length ? categories : (CATEGORIES as ShopCategory[]);
  const allSubs = subs ?? [];
  const subsOf = (c: string) => allSubs.filter((s) => s.cat === c);

  const catIds = ["all", ...cats.map((c) => c.id)];
  const catName = (c: string) => {
    if (c === "all") return t.all;
    const found = cats.find((x) => x.id === c);
    if (!found) return c;
    return lang === "bn" && found.bn ? found.bn : found.name;
  };
  const subName = (s: ShopSub) => (lang === "bn" && s.bn ? s.bn : s.name);

  const selectCat = (c: string) => {
    setCat(c);
    setSub("all");
    if (c !== "all" && subsOf(c).length) setExpanded((e) => ({ ...e, [c]: true }));
    // Stay in shop, only the URL updates: /shop, /shop/sofa, /shop/sofa/turkish-print
    router.replace(c === "all" ? "/shop" : `/shop/${c}`, { scroll: false });
  };
  const selectSub = (c: string, s: string) => {
    setCat(c);
    setSub(s);
    setExpanded((e) => ({ ...e, [c]: true }));
    router.replace(s === "all" || s === "" ? `/shop/${c}` : `/shop/${c}/${s}`, { scroll: false });
  };
  const selectSubOnly = (s: string) => {
    setSub(s);
    router.replace(s === "all" || s === "" ? `/shop/${cat}` : `/shop/${cat}/${s}`, { scroll: false });
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: source.length };
    for (const c of catIds.slice(1)) m[c] = source.filter((p) => p.cat === c).length;
    m.hot = source.filter((p) => p.tags.includes("hot")).length;
    return m;
  }, [source, cats]);

  const subCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of allSubs) m[s.id] = source.filter((p) => p.sub === s.id).length;
    return m;
  }, [source, subs]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = source.filter(
      (p) =>
        (cat === "all" || p.cat === cat) &&
        (sub === "all" ? true : sub === "" ? !p.sub : p.sub === sub) &&
        (!hot || p.tags.includes("hot")) &&
        (!q || `${p.name} ${p.bn} ${p.cat}`.toLowerCase().includes(q))
    );
    if (sort === "low") filtered.sort((a, b) => a.now - b.now);
    if (sort === "high") filtered.sort((a, b) => b.now - a.now);
    if (sort === "off") filtered.sort((a, b) => b.off - a.off);
    return filtered;
  }, [cat, sub, sort, search]);

  const q = search.trim();
  const hasActive = cat !== "all" || sub !== "all" || sort !== "featured" || q !== "" || hot;
  const clearHot = () => {
    setHot(false);
    router.replace("/shop", { scroll: false });
  };
  const clearAll = () => {
    setCat("all");
    setSub("all");
    setSort("featured");
    setSearch("");
    setHot(false);
    router.replace("/shop", { scroll: false });
  };

  const activeFilters = (
    <div className="mt-5 pt-4 border-t border-line">
      <div className="flex items-center justify-between mb-2">
        <b className="text-[17px]">{t.activeFilters}</b>
        {hasActive && (
          <button onClick={clearAll} className="inline-flex items-center gap-1 text-[16px] font-bold text-clay hover:text-clay-dark">
            <X size={13} />{t.clearAll}
          </button>
        )}
      </div>
      {!hasActive ? (
        <p className="text-[16px] text-muted">{t.noFilters}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {hot && (
            <button onClick={clearHot} className="inline-flex items-center gap-1 rounded-full bg-clay text-white text-[15.5px] font-bold pl-3 pr-2 py-1.5">
              {t.offers} HOT<X size={12} />
            </button>
          )}
          {cat !== "all" && (
            <button onClick={() => selectCat("all")} className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[15.5px] font-bold pl-3 pr-2 py-1.5">
              {catName(cat)}<X size={12} />
            </button>
          )}
          {sub !== "all" && (
            <button onClick={() => selectSubOnly("all")} className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[15.5px] font-bold pl-3 pr-2 py-1.5">
              {allSubs.find((s) => s.id === sub)?.name ?? sub}<X size={12} />
            </button>
          )}
          {sort !== "featured" && (
            <button onClick={() => setSort("featured")} className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[15.5px] font-bold pl-3 pr-2 py-1.5">
              {t.sortOpts[SORTS.indexOf(sort)]}<X size={12} />
            </button>
          )}
          {q !== "" && (
            <button onClick={() => setSearch("")} className="inline-flex items-center gap-1 rounded-full bg-forest text-white text-[15.5px] font-bold pl-3 pr-2 py-1.5">
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
        <b className="text-[17px] block mb-2">{t.categories}</b>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => selectCat("all")}
            className={`flex justify-between items-center rounded-xl px-3.5 py-2.5 text-[17px] font-bold border ${cat === "all" && sub === "all" ? "bg-clay border-clay text-white" : "bg-paper border-line hover:border-gold text-ink"}`}
          >
            {catName("all")}
            <span className={`text-[15px] rounded-full px-2 py-0.5 ${cat === "all" && sub === "all" ? "bg-white/20" : "bg-sand text-muted"}`}>{counts["all"]}</span>
          </button>
          <button
            onClick={() => setHot((h) => !h)}
            aria-pressed={hot}
            className={`flex justify-between items-center rounded-xl px-3.5 py-2.5 text-[17px] font-bold border ${hot ? "bg-clay border-clay text-white" : "bg-paper border-line hover:border-gold text-ink"}`}
          >
            <span>{t.offers} <span className={`text-[13px] font-extrabold rounded-full px-1.5 py-0.5 ${hot ? "bg-white/20" : "bg-clay text-white"}`}>HOT</span></span>
            <span className={`text-[15px] rounded-full px-2 py-0.5 ${hot ? "bg-white/20" : "bg-sand text-muted"}`}>{counts.hot ?? 0}</span>
          </button>
          {cats.map((c) => {
            const children = subsOf(c.id);
            const isOpen = !!expanded[c.id];
            const isActive = cat === c.id;
            return (
              <div key={c.id}>
                <div className={`flex items-center rounded-xl border ${isActive ? "bg-clay border-clay text-white" : "bg-paper border-line hover:border-gold text-ink"}`}>
                  <button
                    onClick={() => selectCat(c.id)}
                    className="flex-1 flex justify-between items-center pl-3.5 pr-1 py-2.5 text-[17px] font-bold text-left"
                  >
                    {catName(c.id)}
                    <span className={`text-[15px] rounded-full px-2 py-0.5 ${isActive ? "bg-white/20" : "bg-sand text-muted"}`}>{counts[c.id]}</span>
                  </button>
                  {!!children.length && (
                    <button
                      onClick={() => setExpanded((e) => ({ ...e, [c.id]: !e[c.id] }))}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${c.name} subcategories`}
                      className="w-9 h-9 grid place-items-center shrink-0"
                    >
                      <ChevronDown size={15} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {isOpen && !!children.length && (
                  <div className="flex flex-col gap-1 mt-1 ml-3 pl-3 border-l-2 border-line">
                    {children.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => selectSub(c.id, s.id)}
                        className={`flex justify-between items-center rounded-lg px-3 py-2 text-[16.5px] font-bold border ${sub === s.id && isActive ? "bg-forest border-forest text-white" : "bg-paper border-line hover:border-gold text-ink"}`}
                      >
                        {subName(s)}
                        <span className={`text-[15px] rounded-full px-2 py-0.5 ${sub === s.id && isActive ? "bg-white/20" : "bg-sand text-muted"}`}>{subCounts[s.id] ?? 0}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {activeFilters}
      </aside>
      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-5 px-5">
          <button
            onClick={() => setHot((h) => !h)}
            aria-pressed={hot}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[17px] font-bold border ${hot ? "bg-clay border-clay text-white" : "bg-paper border-line"}`}
          >
            {t.offers} HOT
            <span className={`text-[15px] ${hot ? "text-white/80" : "text-muted"}`}>{counts.hot ?? 0}</span>
          </button>
          {catIds.map((c) => (
            <button
              key={c}
              onClick={() => selectCat(c)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[17px] font-bold border ${cat === c && sub === "all" ? "bg-clay border-clay text-white" : "bg-paper border-line"}`}
            >
              {catName(c)}
              <span className={`text-[15px] ${cat === c && sub === "all" ? "text-white/80" : "text-muted"}`}>{counts[c]}</span>
            </button>
          ))}
        </div>
        {cat !== "all" && !!subsOf(cat).length && (
          <div className="lg:hidden flex gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-5 px-5 -mt-1">
            <button
              onClick={() => selectSubOnly("all")}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[16px] font-bold border ${sub === "all" ? "bg-forest border-forest text-white" : "bg-paper border-line"}`}
            >
              {t.all} ({counts[cat]})
            </button>
            {subsOf(cat).map((s) => (
              <button
                key={s.id}
                onClick={() => selectSubOnly(s.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[16px] font-bold border ${sub === s.id ? "bg-forest border-forest text-white" : "bg-paper border-line"}`}
              >
                {subName(s)} ({subCounts[s.id] ?? 0})
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="flex items-center gap-2 text-[17px] text-muted">
            {list.length} {t.items}
            {hasActive && (
              <button onClick={clearAll} className="inline-flex items-center gap-1 text-[16px] font-bold text-clay hover:text-clay-dark">
                <X size={13} />{t.clearAll}
              </button>
            )}
          </span>
          {sortSelect}
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 md:gap-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        {!list.length && <p className="text-center text-muted py-10">{t.empty}</p>}
      </div>
    </div>
  );
}
