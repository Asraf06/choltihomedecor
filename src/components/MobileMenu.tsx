"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X, Home, ShoppingBag, Flame, Heart, Info, Phone, Package, Tag, Sun, Moon,
} from "lucide-react";
import { useLang } from "@/lib/lang";
import { useSettings, waLink, telLink } from "@/lib/settings-context";

const LINKS = [
  { href: "/", key: "home", Icon: Home },
  { href: "/shop", key: "shop", Icon: ShoppingBag },
  { href: "/#products", key: "topTrending", Icon: Flame },
  { href: "/wishlist", key: "wishlist", Icon: Heart },
  { href: "/about", key: "about", Icon: Info },
  { href: "/contact", key: "contact", Icon: Phone },
  { href: "/track-order", key: "trackOrder", Icon: Package },
] as const;

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t, lang, setLang } = useLang();
  const settings = useSettings();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (open) setIsDark(document.documentElement.classList.contains("dark"));
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("cholti_theme", dark ? "dark" : "light");
    } catch {}
  };

  return (
    <div className={`fixed inset-0 z-[100] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[84vw] max-w-[320px] bg-paper border-r border-line flex flex-col overflow-y-auto transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-line">
          <span className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-forest text-gold grid place-items-center font-serif font-bold text-lg">C</span>
            <b className="font-serif text-lg">Cholti</b>
          </span>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 grid place-items-center rounded-full border border-line">
            <X size={16} />
          </button>
        </div>

        <nav className="p-3 flex flex-col gap-1">
          {LINKS.map(({ href, key, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href + key}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[16px] font-bold ${active ? "bg-clay text-white" : "hover:bg-sand"}`}
              >
                <Icon size={17} />
                {t[key]}
              </Link>
            );
          })}
          <a
            href="/shop"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-[16px] font-bold hover:bg-sand"
          >
            <Tag size={17} />
            {t.offers}
            <span className="bg-clay text-white text-[14px] font-extrabold rounded-full px-1.5 py-0.5 ml-auto">HOT</span>
          </a>
        </nav>

        <div className="p-4 border-t border-line flex flex-col gap-3 mt-auto">
          <div>
            <small className="block text-[15px] font-bold text-muted mb-1.5">Language / ভাষা</small>
            <span className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-sand border border-line">
              <button onClick={() => setLang("bn")} className={`rounded-xl py-2.5 text-[17px] font-extrabold ${lang === "bn" ? "bg-forest text-white" : "text-muted"}`}>বাংলা</button>
              <button onClick={() => setLang("en")} className={`rounded-xl py-2.5 text-[17px] font-extrabold ${lang === "en" ? "bg-forest text-white" : "text-muted"}`}>English</button>
            </span>
          </div>
          <div>
            <small className="block text-[15px] font-bold text-muted mb-1.5">Theme</small>
            <span className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-sand border border-line">
              <button onClick={() => setTheme(false)} className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[17px] font-extrabold ${!isDark ? "bg-forest text-white" : "text-muted"}`}>
                <Sun size={15} />Light
              </button>
              <button onClick={() => setTheme(true)} className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[17px] font-extrabold ${isDark ? "bg-forest text-white" : "text-muted"}`}>
                <Moon size={15} />Dark
              </button>
            </span>
          </div>
          <a href={waLink(settings)} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-clay text-white rounded-[35px] py-3 text-[17px] font-bold">
            <Phone size={15} />{t.waOrder}
          </a>
          <a href={telLink(settings)} className="text-center text-[16px] font-bold text-muted">Hotline: {settings.hotline}</a>
        </div>
      </aside>
    </div>
  );
}
