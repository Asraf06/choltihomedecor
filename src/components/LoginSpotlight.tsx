"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Truck } from "lucide-react";
import { useLang } from "@/lib/lang";

// Left panel of the login page.
// Desktop: headline + all 3 benefits shown together (static).
// Mobile: compact — short headline + ONE rotating benefit section only,
// so the login form stays near the top.
export default function LoginSpotlight() {
  const { t } = useLang();
  const benefits = [
    { Icon: Heart, title: t.benWT, sub: t.benWS },
    { Icon: ShoppingBag, title: t.benCT, sub: t.benCS },
    { Icon: Truck, title: t.benTT, sub: t.benTS },
  ];
  const [shown, setShown] = useState(0);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Auto-rotate every 3.5s with a soft fade + rise transition (mobile card).
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setLeaving(true);
      setTimeout(() => {
        setShown((s) => (s + 1) % benefits.length);
        setLeaving(false);
      }, 300);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, benefits.length]);

  const go = (i: number) => {
    if (i === shown) return;
    setLeaving(true);
    setTimeout(() => {
      setShown(i);
      setLeaving(false);
    }, 300);
  };

  const current = benefits[shown];

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-forest-deep via-forest to-forest-2 text-white p-5 md:p-7 flex flex-col justify-center gap-4 md:gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span aria-hidden className="absolute -right-8 -top-10 text-[140px] md:text-[180px] leading-none text-white/10 select-none">
        ✦
      </span>
      <div className="relative">
        <span className="inline-flex items-center gap-2">
          <Image src="/logo.png" alt="Cholti Home Decor" width={120} height={40} className="h-11 w-auto rounded-lg object-cover" />
        </span>
        <h2 className="font-serif text-[20px] md:text-[27px] leading-[1.15] mt-3 md:mt-3 max-w-[380px]">{t.spotTitle}</h2>
        <p className="hidden md:block text-[16px] text-[#c8d7d2] mt-1.5 max-w-[360px]">{t.spotSub}</p>
      </div>

      {/* Desktop: all benefits together, static */}
      <div className="relative hidden md:flex flex-col gap-2.5 mt-1">
        {benefits.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2.5 backdrop-blur">
            <span className="w-10 h-10 rounded-xl bg-gold text-forest grid place-items-center shrink-0">
              <Icon size={18} />
            </span>
            <span>
              <b className="block text-[16px]">{title}</b>
              <small className="block text-[15px] text-[#e2d9c8]">{sub}</small>
            </span>
          </div>
        ))}
      </div>

      {/* Mobile only: single rotating benefit section */}
      <div className="relative md:hidden">
        <div
          className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl p-3 backdrop-blur transition-all duration-300 ease-out"
          style={{
            transform: leaving ? "translateY(14px)" : "translateY(0)",
            opacity: leaving ? 0 : 1,
          }}
        >
          <span className="w-10 h-10 rounded-xl bg-gold text-forest grid place-items-center shrink-0">
            <current.Icon size={18} />
          </span>
          <span className="min-w-0">
            <b className="block text-[17px] truncate">{current.title}</b>
            <small className="block text-[15px] text-[#e2d9c8] truncate">{current.sub}</small>
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5">
          {benefits.map((b, i) => (
            <button
              key={b.title}
              onClick={() => go(i)}
              aria-label={`Show benefit ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === shown ? "w-6 bg-gold" : "w-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
