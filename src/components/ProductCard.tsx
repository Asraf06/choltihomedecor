"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import type { Product } from "@/lib/data";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";

// Single product card used on home, shop, category, and related lists.
// Primary action is always Add to Cart. Ordering happens once, in the cart drawer.
export default function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish, addToCart, setCartOpen } = useShop();
  const { t } = useLang();
  const wished = wishlist.includes(product.slug);

  const add = () => {
    addToCart(product, 1, "Standard");
    setCartOpen(true);
  };

  return (
    <div className="bg-paper border border-line rounded-[20px] overflow-hidden shadow-[0_18px_50px_rgba(62,32,12,0.10)] hover:-translate-y-1 hover:border-gold transition flex flex-col">
      <div className="relative aspect-square bg-sand">
        <Image src={product.img} alt={product.name} fill className="object-cover" sizes="(max-width:768px)50vw,25vw" loading="lazy" />
        <span className="absolute left-2.5 top-2.5 bg-clay text-white text-[11px] font-extrabold rounded-full px-2.5 py-1">-{product.off}%</span>
        <button
          onClick={() => toggleWish(product.slug)}
          aria-label="wishlist"
          className={`absolute right-2.5 top-2.5 w-8 h-8 rounded-full grid place-items-center border border-line ${wished ? "bg-clay text-white border-clay" : "bg-white text-forest"}`}
        >
          <Heart size={15} />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] tracking-[1.8px] text-gold font-extrabold uppercase">{product.cat}</span>
        <div className="text-[14.5px] font-semibold leading-snug line-clamp-2 min-h-10">{product.name}</div>
        <div className="text-xs text-muted"><span className="stars text-xs">★★★★★</span> {product.rating}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] text-muted line-through">৳{product.old.toLocaleString()}</span>
          <span className="text-base font-extrabold text-clay">৳{product.now.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-2 mt-1.5">
          <button onClick={add} className="w-full inline-flex justify-center items-center gap-1.5 bg-clay text-white rounded-[35px] py-2.5 text-xs font-bold hover:bg-clay-dark">
            <ShoppingCart size={14} />{t.addToCart}
          </button>
          <Link href={`/product/${product.slug}`} className="w-full inline-flex justify-center items-center gap-1.5 bg-white border border-line rounded-[35px] py-2 text-xs font-bold">
            <Eye size={14} />{t.details}
          </Link>
        </div>
      </div>
    </div>
  );
}
