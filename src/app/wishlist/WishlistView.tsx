"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";
import ProductCard from "@/components/ProductCard";

export default function WishlistView() {
  const { wishlist } = useShop();
  const { t } = useLang();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.slug));

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <h1 className="font-serif text-4xl">{t.wishlist}</h1>
      <div className="gold-divider" />
      {!items.length ? (
        <div className="text-center py-14">
          <span className="mx-auto w-14 h-14 rounded-full bg-gold-soft grid place-items-center text-forest">
            <Heart size={24} />
          </span>
          <p className="text-muted text-sm mt-4">{t.wishlistEmpty}</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-clay text-white rounded-[35px] px-6 py-3 text-[13px] font-bold mt-4">
            {t.viewShop}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
