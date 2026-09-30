"use client";

import { useMemo, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";
import { CheckoutSchema, buildOrderMessage, waOrderLink } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { t } = useLang();
  const { cart, updateQty, removeItem, cartOpen, setCartOpen } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState<"80" | "130">("80");
  const [err, setErr] = useState<string | null>(null);

  const { sub, del, total } = useMemo(() => {
    const s = cart.reduce((a, c) => a + c.now * c.qty, 0);
    const d = cart.length ? Number(area) : 0;
    return { sub: s, del: d, total: s + d };
  }, [cart, area]);

  if (!cartOpen) return null;

  const confirm = () => {
    const parsed = CheckoutSchema.safeParse({ name, phone, address, area });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Form thik koro");
      return;
    }
    if (!cart.length) {
      setErr("Cart khali ase");
      return;
    }
    setErr(null);
    const msg = buildOrderMessage(cart, parsed.data, sub, del, total);
    window.open(waOrderLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div onClick={() => setCartOpen(false)} className="fixed inset-0 bg-[#2B2320]/45 z-[80]" />
      <aside className="fixed top-0 right-0 h-dvh w-[min(420px,94vw)] bg-paper z-[90] rounded-l-[20px] border-l border-line flex flex-col">
        <div className="p-[18px] border-b border-line flex justify-between items-center">
          <b className="font-serif text-lg">{t.checkout}</b>
          <button onClick={() => setCartOpen(false)} className="w-[42px] h-[42px] rounded-full bg-paper border border-line grid place-items-center" aria-label="Close"><X size={17} /></button>
        </div>
        <div className="p-[18px] overflow-auto flex-1 flex flex-col gap-3.5">
          {!cart.length ? <p className="text-center text-muted text-sm py-5">{t.cartEmpty}</p> :
            cart.map((c, i) => (
              <div key={i} className="flex gap-3 items-center border border-line rounded-[14px] p-2.5 bg-paper">
                <Image src={c.img} alt={c.name} width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <b className="text-xs block leading-snug text-ink">{c.name}</b>
                  <small className="text-muted">{c.fabric}</small>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="flex items-center gap-2 border border-line rounded-full px-2 py-1">
                      <button onClick={() => updateQty(i, -1)} className="w-[26px] h-[26px] rounded-full border border-line bg-sand" aria-label="dec">−</button><b>{c.qty}</b><button onClick={() => updateQty(i, 1)} className="w-[26px] h-[26px] rounded-full border border-line bg-sand" aria-label="inc">+</button>
                    </span>
                    <b className="text-clay text-[13px]">{(c.now * c.qty).toLocaleString()}৳</b>
                  </div>
                </div>
                <button onClick={() => removeItem(i)} aria-label="remove" className="w-8 h-8 rounded-full border border-line grid place-items-center"><X size={14} /></button>
              </div>
            ))}
          <div><label className="text-xs font-bold block mb-1.5">{t.name}</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fatema Akter" maxLength={60} className="w-full h-[42px] border border-line bg-sand rounded-xl px-3.5 text-sm outline-none" /></div>
          <div><label className="text-xs font-bold block mb-1.5">{t.phone}</label><input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))} placeholder="01XXXXXXXXX" inputMode="numeric" className="w-full h-[42px] border border-line bg-sand rounded-xl px-3.5 text-sm outline-none" /></div>
          <div><label className="text-xs font-bold block mb-1.5">{t.address}</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} maxLength={300} placeholder="Basa, road, area, thana, zilla" className="w-full border border-line bg-sand rounded-xl p-2.5 text-sm outline-none" /></div>
          <div><label className="text-xs font-bold block mb-1.5">{t.delivery}</label><select value={area} onChange={(e) => setArea(e.target.value as "80" | "130")} className="w-full h-[42px] border border-line bg-sand rounded-xl px-3.5 text-sm"><option value="80">{t.dhakaIn}</option><option value="130">{t.dhakaOut}</option></select></div>
          {err && <p className="text-[13px] text-clay font-bold">{err}</p>}
        </div>
        <div className="p-[18px] border-t border-line">
          <div className="flex justify-between text-sm"><span>{t.subtotal}</span><span>{sub.toLocaleString()}৳</span></div>
          <div className="flex justify-between text-sm"><span>{t.delivery}</span><span>{del.toLocaleString()}৳</span></div>
          <div className="flex justify-between text-[17px] font-extrabold text-clay"><span>{t.total}</span><span>{total.toLocaleString()}৳</span></div>
          <button onClick={confirm} className="w-full inline-flex justify-center items-center gap-2 bg-clay text-white rounded-[35px] py-3 text-[13px] font-bold mt-2.5 hover:bg-clay-dark"><MessageCircle size={15} />{t.confirm}</button>
          <p className="text-[11px] text-muted text-center mt-1">{t.codNote}</p>
        </div>
      </aside>
    </>
  );
}
