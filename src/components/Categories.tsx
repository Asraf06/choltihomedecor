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
    <section className="bg-paper border-b border-line pt-6 md:pt-[32px] pb-10 md:pb-[64px]">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-[6px]">
          <div><div className="eyebrow">{t.catEyebrow}</div><h2 className="font-serif text-[26px] md:text-[34px]">{t.catTitleA} <span className="italic-accent">{t.catTitleB}</span></h2><div className="gold-divider" /></div>
          <Link href="/shop" className="text-clay text-[17px] font-bold whitespace-nowrap">{t.viewAll}</Link>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-[18px]">
          {list.map((c) => (
            <Link key={c.name} href={`/shop/${c.id}`} className="text-center group">
              <span className="relative block w-[104px] h-[104px] md:w-[160px] md:h-[160px] mx-auto max-w-full">
                <Image src={c.img} alt={c.name} width={160} height={160} sizes="(max-width:768px)33vw,160px" className="w-[104px] h-[104px] md:w-[160px] md:h-[160px] max-w-full rounded-full object-cover border-2 border-paper outline outline-1 outline-line shadow-[0_18px_50px_rgba(62,32,12,0.10)] group-hover:scale-105 group-hover:outline-gold transition" loading="lazy" />
                {c.badge && <span className="absolute top-1 md:top-2 right-1 md:right-2 bg-clay text-white text-[11px] md:text-[14px] font-extrabold rounded-full px-2 py-0.5">{c.badge}</span>}
              </span>
              <b className="block mt-2 md:mt-3 text-[15px] md:text-lg leading-snug group-hover:text-clay">{c.name}</b><small className="text-[13px] md:text-base text-muted">{c.count}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
