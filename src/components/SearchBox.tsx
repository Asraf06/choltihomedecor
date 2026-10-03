"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";

type Hit = { slug: string; name: string; bn: string; cat: string; now: number; img: string };

export default function SearchBox({ placeholder, label }: { placeholder: string; label: string }) {
  const { search, setSearch } = useShop();
  const { t } = useLang();
  const router = useRouter();
  const [hits, setHits] = useState<Hit[]>([]);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = search.trim();
    if (q.length < 2) {
      setHits([]);
      setOpen(false);
      setDone(false);
      return;
    }
    setDone(false);
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/products?q=${encodeURIComponent(q)}`);
        const d = await r.json();
        setHits(Array.isArray(d.products) ? d.products : []);
        setOpen(true);
        setHi(-1);
      } catch {
        setHits([]);
        setOpen(true);
      } finally {
        setDone(true);
      }
    }, 280);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [search]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/product/${slug}`);
  };

  return (
    <div ref={boxRef} className="relative flex-1 min-w-0">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => { if (hits.length) setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && hits.length) { e.preventDefault(); setHi((h) => (h + 1) % hits.length); }
          else if (e.key === "ArrowUp" && hits.length) { e.preventDefault(); setHi((h) => (h - 1 + hits.length) % hits.length); }
          else if (e.key === "Enter" && hi >= 0 && hits[hi]) { e.preventDefault(); e.stopPropagation(); go(hits[hi].slug); }
          else if (e.key === "Escape") setOpen(false);
        }}
        placeholder={placeholder}
        className="flex-1 w-full bg-transparent outline-none text-lg"
        aria-label={label}
        maxLength={60}
        role="combobox"
        aria-expanded={open}
      />
      {open && search.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-paper border border-line rounded-2xl shadow-[0_18px_50px_rgba(62,32,12,0.15)] overflow-hidden z-[95]">
          {hits.length ? (
            <>
              {hits.map((h, i) => (
                <button
                  key={h.slug}
                  onMouseDown={(e) => { e.preventDefault(); go(h.slug); }}
                  onMouseEnter={() => setHi(i)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left ${i === hi ? "bg-sand" : ""}`}
                >
                  {h.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={h.img} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  ) : (
                    <span className="w-10 h-10 rounded-xl bg-sand shrink-0" />
                  )}
                  <span className="flex-1 min-w-0">
                    <b className="block text-[16px] truncate">{h.name}</b>
                    <small className="text-muted text-[14px]">{h.cat}</small>
                  </span>
                  <b className="text-clay text-[15px] shrink-0">৳{Number(h.now).toLocaleString()}</b>
                </button>
              ))}
              <button
                onMouseDown={(e) => { e.preventDefault(); setOpen(false); router.push(`/search?q=${encodeURIComponent(search.trim())}`); }}
                className="w-full text-center text-[15px] font-bold text-clay py-2.5 border-t border-line"
              >
                View all results →
              </button>
            </>
          ) : (
            <p className="px-3.5 py-3 text-[15px] text-muted">{done ? t.noResults : "…"}</p>
          )}
        </div>
      )}
    </div>
  );
}
