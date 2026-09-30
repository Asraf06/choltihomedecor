"use client";

import Link from "next/link";
import ShopGrid from "@/components/ShopGrid";
import { useLang } from "@/lib/lang";

const NAMES: Record<string, { bn: string; en: string }> = {
  sofa: { bn: "সোফা কভার", en: "Sofa Cover" },
  bedsheet: { bn: "বেডশিট", en: "Bedsheet" },
  cushion: { bn: "কুশন কভার", en: "Cushion Cover" },
  curtain: { bn: "পর্দা", en: "Curtain" },
};

export default function CategoryView({ cat }: { cat: string }) {
  const { lang, t } = useLang();
  const name = NAMES[cat] ? (lang === "bn" ? NAMES[cat].bn : NAMES[cat].en) : cat;

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <Link href="/shop" className="text-[13px] text-muted inline-block mb-3">{t.back}</Link>
      <div className="max-w-[640px] mb-5">
        <h1 className="font-serif text-4xl">{name}</h1>
        <div className="gold-divider" />
      </div>
      <ShopGrid fixedCat={cat} />
    </main>
  );
}
