"use client";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data";
import type { ShopCategory } from "@/lib/catalog-db";
import { useLang } from "@/lib/lang";

export default function Categories({ initial }: { initial?: ShopCategory[] }) {
  const { t } = useLang();
  const list = initial?.length ? initial : (CATEGORIES as ShopCategory[]);
  return (
    <section className="bg-paper border-b border-line py-[64px]">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="flex justify-between items-end mb-[26px]">
          <div><div className="eyebrow">{t.catEyebrow}</div><h2 className="font-serif text-[26px] md:text-[34px]">{t.catTitleA} <span className="italic-accent">{t.catTitleB}</span></h2><div className="gold-divider" /></div>
          <Link href="/shop" className="text-clay text-[13px] font-bold whitespace-nowrap">{t.viewAll}</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[18px]">
          {list.map((c) => (
            <Link key={c.name} href={`/category/${c.id}`} className="text-center group">
              <span className="relative block w-[160px] h-[160px] mx-auto max-w-full">
                <Image src={c.img} alt={c.name} width={160} height={160} className="w-[160px] h-[160px] max-w-full rounded-full object-cover border-2 border-white outline outline-1 outline-line shadow-[0_18px_50px_rgba(62,32,12,0.10)] group-hover:scale-105 group-hover:outline-gold transition" loading="lazy" />
                {c.badge && <span className="absolute top-2 right-2 bg-clay text-white text-[10px] font-extrabold rounded-full px-2 py-0.5">{c.badge}</span>}
              </span>
              <b className="block mt-3 text-sm group-hover:text-clay">{c.name}</b><small className="text-xs text-muted">{c.count}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
