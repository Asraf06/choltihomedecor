"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ShoppingBag, Menu, ChevronDown, Phone, Mail, MessageCircle, Globe, AtSign, Share2, Languages, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { useShop } from "@/lib/store";
import { useLang } from "@/lib/lang";
import { CATEGORIES } from "@/lib/data";
import { useSettings, waLink, telLink } from "@/lib/settings-context";
import type { ShopCategory } from "@/lib/catalog-db";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import SearchBox from "./SearchBox";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <span className="inline-flex items-center bg-sand border border-line rounded-full p-[3px] text-[15px] font-extrabold" role="group" aria-label="Language">
      <Languages size={13} className="mx-1 text-muted" />
      <button onClick={() => setLang("bn")} className={`px-2.5 py-1 rounded-full transition ${lang === "bn" ? "bg-forest text-white" : "text-muted hover:text-ink"}`}>বাং</button>
      <button onClick={() => setLang("en")} className={`px-2.5 py-1 rounded-full transition ${lang === "en" ? "bg-forest text-white" : "text-muted hover:text-ink"}`}>EN</button>
    </span>
  );
}

export default function Header({ categories }: { categories?: ShopCategory[] }) {
  const { search, setSearch, cartCount, setCartOpen, setChromeHidden } = useShop();
  const { user, signOutUser } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const router = useRouter();
  const { t } = useLang();
  const settings = useSettings();
  const browse = categories?.length ? categories : (CATEGORIES as ShopCategory[]);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const closeMenu = () => {
    setOpen(false);
    setPinned(false);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);
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

  // Pinned menu closes on any outside click (fixed backdrop is clipped by the
  // header's hide-on-scroll transform, so listen on document instead).
  useEffect(() => {
    if (!open || !pinned) return;
    const onDown = (e: PointerEvent) => {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, pinned]);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: visible ? "translateY(0)" : "translateY(-102%)" }}
      >
        <div className="bg-forest text-[#FBF7EF] text-[16.5px]">
          <div className="max-w-[1180px] mx-auto px-5 py-2 flex justify-between items-center gap-3">
            <span className="hidden sm:block truncate">{t.welcome}</span>
            <span className="sm:hidden truncate">{t.welcomeShort}</span>
            <div className="flex items-center gap-3 shrink-0">
              <a href={`mailto:${settings.email}`} className="hidden md:inline-flex items-center gap-1.5 opacity-90"><Mail size={14} />{settings.email}</a>
              <a href={telLink(settings)} className="hidden sm:inline-flex items-center gap-1.5"><Phone size={14} />{settings.hotline}</a>
              <span className="hidden md:inline-flex gap-2"><Globe size={14} /><AtSign size={14} /><Share2 size={14} /></span>
            </div>
          </div>
        </div>

        <header className="bg-paper/95 backdrop-blur-xl border-b border-line">
          <div className="max-w-[1180px] mx-auto px-5 h-[70px] flex items-center gap-2 sm:gap-3">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden w-[42px] h-[42px] shrink-0 rounded-full bg-paper border border-line grid place-items-center text-forest dark:text-gold" aria-label="Open menu">
              <Menu size={18} />
            </button>
            <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0" aria-label="Cholti Home Decor">
              <Image src="/logo.png" alt="Cholti Home Decor" width={120} height={40} className="h-11 w-auto rounded-lg object-cover" priority />
              <span className="leading-none hidden min-[400px]:block"><b className="font-serif text-[22px] text-forest dark:text-gold">Cholti</b><small className="block text-[14px] tracking-[2.4px] text-gold font-extrabold">HOME DECOR</small></span>
            </Link>

            <form
              onSubmit={(e) => { e.preventDefault(); if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`); }}
              className="hidden sm:flex flex-1 max-w-[520px] mx-auto items-center bg-sand border border-line rounded-[35px] h-[42px] pl-5 pr-[5px]"
            >
              <SearchBox placeholder={t.searchPh} label="Search products" />
              <button type="submit" className="w-[34px] h-[34px] rounded-full bg-clay text-white grid place-items-center hover:bg-clay-dark shrink-0" aria-label="Search"><Search size={16} /></button>
            </form>

            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
              <span className="hidden sm:inline-flex"><LangToggle /></span>
              <span className="hidden sm:inline-flex"><ThemeToggle /></span>
              <span className="relative">
                <button
                  onClick={() => (user ? setAccountOpen((v) => !v) : router.push("/login"))}
                  className={`relative w-[42px] h-[42px] rounded-full bg-paper border border-line grid place-items-center text-forest dark:text-gold font-extrabold text-lg overflow-hidden ${!user ? "before:content-[''] before:absolute before:-inset-1.5 before:rounded-full before:border-2 before:border-clay before:animate-[tj-ripple_2s_infinite]" : ""}`}
                  aria-label="Account"
                >
                  {user?.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user ? (user.displayName?.[0] ?? user.email?.[0] ?? "U").toUpperCase() : <User size={17} />
                  )}
                </button>
                {user && accountOpen && (
                  <>
                    <button aria-label="Close account menu" onClick={() => setAccountOpen(false)} className="fixed inset-0 z-[90] cursor-default bg-transparent" />
                    <span className="absolute right-0 top-full mt-2 z-[95] min-w-[220px] bg-paper border border-line rounded-2xl shadow-[0_18px_50px_rgba(62,32,12,0.10)] p-3">
                      <span className="flex items-center gap-2.5">
                        {user.photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover shrink-0" />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-sand border border-line grid place-items-center font-extrabold text-lg shrink-0">
                            {(user.displayName?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                          </span>
                        )}
                        <span className="min-w-0">
                          <b className="block text-[17px] truncate">{user.displayName || user.email}</b>
                          {user.displayName && <small className="block text-[15px] text-muted truncate">{user.email}</small>}
                        </span>
                      </span>
                      <Link
                        href="/account"
                        onClick={() => setAccountOpen(false)}
                        className="mt-2 w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[17px] font-bold hover:bg-sand"
                      >
                        <User size={14} />{t.myAccount}
                      </Link>
                      <button
                        onClick={() => { setAccountOpen(false); signOutUser(); }}
                        className="mt-2 w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[17px] font-bold hover:bg-sand"
                      >
                        <LogOut size={14} />{t.signOut}
                      </button>
                    </span>
                  </>
                )}
              </span>
              <button onClick={() => setCartOpen(true)} className="relative w-[42px] h-[42px] rounded-full bg-paper border border-line grid place-items-center text-forest dark:text-gold" aria-label="Cart">
                <ShoppingBag size={18} /><span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-clay text-white text-[15px] font-extrabold grid place-items-center px-1">{cartCount}</span>
              </button>
            </div>
          </div>

          <div className="sm:hidden px-5 pb-2.5">
            <form
              onSubmit={(e) => { e.preventDefault(); if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`); }}
              className="flex flex-1 items-center bg-sand border border-line rounded-[35px] h-[42px] pl-5 pr-[5px]"
            >
              <SearchBox placeholder={t.searchPhM} label="Search mobile" />
              <button type="submit" className="w-[34px] h-[34px] rounded-full bg-clay text-white grid place-items-center shrink-0" aria-label="Search"><Search size={16} /></button>
            </form>
          </div>

          <nav className="hidden lg:block bg-paper border-t border-line">
            <div className="max-w-[1180px] mx-auto px-5 flex items-center gap-[18px]">
              <div
                ref={browseRef}
                className="relative shrink-0"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => {
                  if (!pinned) setOpen(false);
                }}
              >
                <button
                  onClick={() => {
                    if (open && pinned) closeMenu();
                    else {
                      setOpen(true);
                      setPinned(true);
                    }
                  }}
                  aria-expanded={open}
                  className={`inline-flex items-center gap-2 bg-forest text-white rounded-xl px-4 py-2.5 text-[17px] font-bold my-2.5 whitespace-nowrap ${onCategoryPage ? "ring-2 ring-gold" : ""}`}
                >
                  <Menu size={15} />{t.browse}<ChevronDown size={14} />
                </button>
                {open && (
                  <>
                    <button aria-label="Close menu" onClick={closeMenu} className="fixed inset-0 z-[90] cursor-default bg-transparent" />
                    <div className="absolute top-full left-0 bg-paper border border-line rounded-2xl shadow-[0_18px_50px_rgba(62,32,12,0.10)] min-w-[280px] p-2 z-[95]">
                    {browse.slice(0, 6).map((c) => (
                      <Link key={c.name} href={`/shop/${c.id}`} onClick={closeMenu} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sand w-full text-left">
                        <Image src={c.img} alt={c.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover border border-line" loading="lazy" />
                        <span><b className="text-[17px] block">{c.name}</b><small className="text-[15px] text-muted">{c.count}</small></span>
                      </Link>
                    ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-[16px] font-semibold overflow-x-auto whitespace-nowrap flex-1 min-w-0 py-1">
                <Link href="/" className={navCls("/")}>{t.home}</Link>
                <Link href="/shop" className={navCls("/shop")}>{t.shop}</Link>
                <Link href="/#products" className="shrink-0 py-3.5 hover:text-clay transition-colors">{t.topTrending}</Link>
                <Link href="/wishlist" className={navCls("/wishlist")}>{t.wishlist}</Link>
                <Link href="/about" className={navCls("/about")}>{t.about}</Link>
                <Link href="/contact" className={navCls("/contact")}>{t.contact}</Link>
                <Link href="/track-order" className={navCls("/track-order")}>{t.trackOrder}</Link>
                <Link href="/shop/offers" className="shrink-0 py-3.5 hover:text-clay transition-colors">{t.offers}<span className="bg-clay text-white text-[14px] font-extrabold rounded-full px-1.5 py-0.5 ml-1.5">HOT</span></Link>
              </div>
              <div className="ml-auto hidden md:flex shrink-0"><a href={waLink(settings)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-clay text-white rounded-full px-3.5 py-2 text-[16px] font-bold hover:bg-clay-dark my-2 whitespace-nowrap"><MessageCircle size={14} />{t.waOrder}</a></div>
            </div>
          </nav>
        </header>
      </div>
      {/* spacer so content does not jump under fixed header */}
      <div aria-hidden className="h-[165px] sm:h-[161px]" />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
