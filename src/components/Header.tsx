"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ShoppingBag, Menu, ChevronDown, Phone, Mail, MessageCircle, Globe, AtSign, Share2, Languages } from "lucide-react";
import Image from "next/image";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";
import { WA_LINK, CATEGORIES } from "@/lib/data";
import type { ShopCategory } from "@/lib/catalog-db";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <span className="inline-flex items-center bg-sand border border-line rounded-full p-[3px] text-[11px] font-extrabold" role="group" aria-label="Language">
      <Languages size={13} className="mx-1 text-muted" />
      <button onClick={() => setLang("bn")} className={`px-2.5 py-1 rounded-full transition ${lang === "bn" ? "bg-forest text-white" : "text-muted hover:text-ink"}`}>বাং</button>
      <button onClick={() => setLang("en")} className={`px-2.5 py-1 rounded-full transition ${lang === "en" ? "bg-forest text-white" : "text-muted hover:text-ink"}`}>EN</button>
    </span>
  );
}

export default function Header({ categories }: { categories?: ShopCategory[] }) {
  const { search, setSearch, cartCount, setCartOpen, setChromeHidden } = useShop();
  const { t } = useLang();
  const browse = categories?.length ? categories : (CATEGORIES as ShopCategory[]);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const pathname = usePathname();

  // The link matching the current route gets clay text and an underline.
  const navCls = (href: string) =>
    pathname === href
      ? "shrink-0 text-clay py-3.5 relative after:absolute after:left-0 after:right-0 after:bottom-2 after:h-[2px] after:bg-clay"
      : "shrink-0 py-3.5 hover:text-clay transition-colors";
  const onCategoryPage = pathname.startsWith("/category");

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y <= 80) {
          setVisible(true);
        } else if (y > lastY.current) {
          // Scrolling down hides the full header for a fullscreen view.
          setVisible(false);
        } else if (y < lastY.current) {
          // Scrolling up brings the header back.
          setVisible(true);
        }
        lastY.current = y;
        ticking = false;
      });
    };
    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setChromeHidden(!visible);
  }, [visible, setChromeHidden]);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: visible ? "translateY(0)" : "translateY(-102%)" }}
      >
        <div className="bg-forest text-[#FBF7EF] text-[12.5px]">
          <div className="max-w-[1180px] mx-auto px-5 py-2 flex justify-between items-center gap-3">
            <span className="hidden sm:block truncate">{t.welcome}</span>
            <span className="sm:hidden truncate">{t.welcomeShort}</span>
            <div className="flex items-center gap-3 shrink-0">
              <a href="mailto:support@cholti.com" className="hidden md:inline-flex items-center gap-1.5 opacity-90"><Mail size={14} />support@cholti.com</a>
              <a href="tel:+8801711387707" className="hidden sm:inline-flex items-center gap-1.5"><Phone size={14} />+8801711387707</a>
              <span className="hidden md:inline-flex gap-2"><Globe size={14} /><AtSign size={14} /><Share2 size={14} /></span>
            </div>
          </div>
        </div>

        <header className="bg-white/95 backdrop-blur-xl border-b border-line">
          <div className="max-w-[1180px] mx-auto px-5 h-[70px] flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="w-10 h-10 rounded-xl bg-forest text-gold grid place-items-center font-serif font-bold text-[22px]">C</span>
              <span className="leading-none"><b className="font-serif text-[22px] text-forest">Cholti</b><small className="block text-[10px] tracking-[2.4px] text-gold font-extrabold">HOME DECOR</small></span>
            </Link>

            <div className="hidden sm:flex flex-1 max-w-[520px] mx-auto items-center bg-sand border border-line rounded-[35px] h-[42px] pl-5 pr-[5px]">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPh} className="flex-1 bg-transparent outline-none text-sm" aria-label="Search products" maxLength={60} />
              <button className="w-[34px] h-[34px] rounded-full bg-clay text-white grid place-items-center hover:bg-clay-dark" aria-label="Search"><Search size={16} /></button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <LangToggle />
              <button onClick={() => setCartOpen(true)} className="relative w-[42px] h-[42px] rounded-full bg-white border border-line grid place-items-center text-forest" aria-label="Cart">
                <ShoppingBag size={18} /><span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-clay text-white text-[11px] font-extrabold grid place-items-center px-1">{cartCount}</span>
              </button>
            </div>
          </div>

          <div className="sm:hidden px-5 pb-2.5">
            <div className="flex flex-1 items-center bg-sand border border-line rounded-[35px] h-[42px] pl-5 pr-[5px]">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPhM} className="flex-1 bg-transparent outline-none text-sm" aria-label="Search mobile" maxLength={60} />
              <button className="w-[34px] h-[34px] rounded-full bg-clay text-white grid place-items-center" aria-label="Search"><Search size={16} /></button>
            </div>
          </div>

          <nav className="bg-white border-t border-line">
            <div className="max-w-[1180px] mx-auto px-5 flex items-center gap-[18px]">
              <div className="relative shrink-0">
                <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className={`inline-flex items-center gap-2 bg-forest text-white rounded-xl px-4 py-2.5 text-[13px] font-bold my-2.5 whitespace-nowrap ${onCategoryPage ? "ring-2 ring-gold" : ""}`}><Menu size={15} />{t.browse}<ChevronDown size={14} /></button>
                {open && (
                  <>
                    <button aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-[90] cursor-default bg-transparent" />
                    <div className="absolute top-full left-0 bg-paper border border-line rounded-2xl shadow-[0_18px_50px_rgba(62,32,12,0.10)] min-w-[280px] p-2 z-[95]">
                    {browse.slice(0, 6).map((c) => (
                      <Link key={c.name} href={`/category/${c.id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sand w-full text-left">
                        <Image src={c.img} alt={c.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover border border-line" loading="lazy" />
                        <span><b className="text-[13px] block">{c.name}</b><small className="text-[11px] text-muted">{c.count}</small></span>
                      </Link>
                    ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-5 text-[13px] font-semibold overflow-x-auto whitespace-nowrap flex-1 min-w-0 py-1">
                <Link href="/" className={navCls("/")}>{t.home}</Link>
                <Link href="/shop" className={navCls("/shop")}>{t.shop}</Link>
                <Link href="/#products" className="shrink-0 py-3.5 hover:text-clay transition-colors">{t.topTrending}</Link>
                <Link href="/wishlist" className={navCls("/wishlist")}>{t.wishlist}</Link>
                <Link href="/about" className={navCls("/about")}>{t.about}</Link>
                <Link href="/contact" className={navCls("/contact")}>{t.contact}</Link>
                <Link href="/track-order" className={navCls("/track-order")}>{t.trackOrder}</Link>
                <Link href="/shop" className="shrink-0 py-3.5 hover:text-clay transition-colors">{t.offers}<span className="bg-clay text-white text-[10px] font-extrabold rounded-full px-1.5 py-0.5 ml-1.5">HOT</span></Link>
              </div>
              <div className="ml-auto hidden md:flex shrink-0"><a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-clay text-white rounded-full px-3.5 py-2 text-[12px] font-bold hover:bg-clay-dark my-2 whitespace-nowrap"><MessageCircle size={14} />{t.waOrder}</a></div>
            </div>
          </nav>
        </header>
      </div>
      {/* spacer so content does not jump under fixed header */}
      <div aria-hidden className="h-[213px] sm:h-[161px]" />
    </>
  );
}
