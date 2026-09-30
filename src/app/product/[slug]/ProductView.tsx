"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, ShoppingCart, Banknote, Truck, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { PRODUCTS, FABRICS } from "@/lib/data";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";
import { waProductLink } from "@/lib/whatsapp";

export default function ProductView({ slug }: { slug: string }) {
  const { t } = useLang();
  const p = useMemo(() => PRODUCTS.find((x) => x.slug === slug) ?? PRODUCTS[0], [slug]);
  const { addToCart, setCartOpen } = useShop();
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [size, setSize] = useState(p.cat === "bedsheet" ? "King" : p.cat === "curtain" ? "7ft" : "5-seater");
  const [color, setColor] = useState("Terracotta");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  const sizes = p.cat === "bedsheet" ? ["Queen", "King"] : p.cat === "curtain" ? ["7ft", "8ft"] : ["Single 3-seater", "5-seater", "7-seater"];
  const related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 4);

  return (
    <>
      <Header />
      <main className="max-w-[1180px] mx-auto px-5">
        <Link href="/" className="text-[13px] text-muted inline-block mt-4">{t.back}</Link>
        <div className="grid md:grid-cols-2 gap-7 py-7">
          <div>
            <div className="relative w-full h-[320px] md:h-[480px]">
              <Image src={p.imgs[img]} alt={p.name} fill className="object-cover rounded-[20px] border border-line" sizes="(max-width:768px)100vw,50vw" priority />
            </div>
            <div className="flex gap-2.5 mt-2.5">{p.imgs.map((im, i) => (
              <button key={i} onClick={() => setImg(i)} className={`relative w-20 h-20 rounded-xl overflow-hidden border ${i === img ? "outline outline-2 outline-gold" : "border-line"}`}>
                <Image src={im} alt="thumb" fill className="object-cover" sizes="80px" />
              </button>
            ))}</div>
          </div>
          <div>
            <div className="eyebrow">{p.cat}</div>
            <h1 className="font-serif text-[30px] my-2">{p.name}</h1>
            <div className="text-[13px] text-muted"><span className="stars">★★★★★</span> {p.rating}</div>
            <div className="flex gap-2.5 items-center my-3"><span className="line-through text-muted">৳{p.old.toLocaleString()}</span><b className="text-[26px] text-clay">৳{p.now.toLocaleString()}</b><span className="bg-clay-light text-clay rounded-full px-2.5 py-1 text-xs font-extrabold">Save ৳{(p.old - p.now).toLocaleString()}</span></div>
            <div><b className="text-xs">{t.fabric}</b><div className="flex gap-2 flex-wrap my-2">{FABRICS.map((f) => <button key={f} onClick={() => setFabric(f)} className={`border rounded-full px-3.5 py-2 text-xs font-bold ${f === fabric ? "border-clay bg-clay-light text-clay" : "border-line bg-white"}`}>{f}{f === fabric ? " ✓" : ""}</button>)}</div></div>
            <div><b className="text-xs">{t.size}</b><div className="flex gap-2 flex-wrap my-2">{sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`border rounded-full px-3.5 py-2 text-xs font-bold ${s === size ? "border-clay bg-clay-light text-clay" : "border-line bg-white"}`}>{s}</button>)}</div></div>
            <div><b className="text-xs">{t.color}</b><div className="flex gap-2 my-2">{[["Terracotta", "#BC4621"], ["Beige", "#D9C7A7"], ["Sage", "#8A9B7C"], ["Grey", "#8a8a8a"]].map(([n, c]) => <button key={n} title={n} onClick={() => setColor(n)} className={`w-8 h-8 rounded-full border-2 border-white ${n === color ? "outline outline-2 outline-gold" : "outline outline-1 outline-line"}`} style={{ background: c }} />)}</div></div>
            <div className="flex gap-3 items-center my-3.5">
              <span className="flex items-center gap-2 border border-line rounded-full px-2 py-1"><button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-[26px] h-[26px] rounded-full bg-sand border border-line">−</button><b>{qty}</b><button onClick={() => setQty((q) => Math.min(99, q + 1))} className="w-[26px] h-[26px] rounded-full bg-sand border border-line">+</button></span>
              <b className="text-clay">Total: {(p.now * qty).toLocaleString()}৳</b>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <button onClick={() => { addToCart(p, qty, `${fabric} / ${size} / ${color}`); setCartOpen(true); }} className="flex-1 inline-flex justify-center items-center gap-2 bg-clay text-white rounded-[35px] px-5 py-3 text-[13px] font-bold hover:bg-clay-dark"><ShoppingCart size={16} />{t.addToCart}</button>
            </div>
            <div className="flex gap-2.5 mt-2.5">
              <a href={waProductLink(`${p.name} [${fabric}] [${size}] [${color}] x${qty} = ${p.now * qty}tk`)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex justify-center items-center gap-2 bg-white border border-line rounded-[35px] px-4 py-2.5 text-[12px] font-bold"><MessageCircle size={14} />{t.waOrder}</a>
              <a href="tel:+8801711387707" className="inline-flex items-center gap-2 bg-white border border-line rounded-[35px] px-4 py-2.5 text-[12px] font-bold"><Phone size={14} />{t.callNow}</a>
            </div>
            <div className="flex gap-2 flex-wrap my-3.5 text-xs font-bold">
              <span className="inline-flex gap-1.5 items-center bg-white border border-line rounded-full px-3 py-2"><Banknote size={14} />Cash on Delivery</span>
              <span className="inline-flex gap-1.5 items-center bg-white border border-line rounded-full px-3 py-2"><Truck size={14} />Home Delivery All BD</span>
              <span className="inline-flex gap-1.5 items-center bg-white border border-line rounded-full px-3 py-2"><RefreshCcw size={14} />Easy Exchange</span>
            </div>
          </div>
        </div>
        <h2 className="font-serif text-2xl my-3.5">{t.alsoLove} <span className="italic-accent">{t.love}</span></h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} />
          ))}
        </div>
      </main>
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
