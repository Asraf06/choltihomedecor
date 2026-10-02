"use client";
import { MessageCircle, Phone, Globe, AtSign, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WA_LINK } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { useSettings, waLink, telLink } from "@/lib/settings-context";
import ChatWidget from "./ChatWidget";

export function CTA() {
  const { t } = useLang();
  const settings = useSettings();
  return (
    <div className="bg-cream py-[18px] pb-[58px]">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="rounded-[26px] p-[34px] flex justify-between items-center gap-5 flex-wrap relative overflow-hidden bg-gradient-to-br from-forest-deep to-forest-2">
          <span className="absolute right-5 -top-2.5 text-[80px] text-white/15">✦</span>
          <div><h2 className="text-white text-2xl font-serif max-w-[520px]">{t.ctaTitle}</h2><p className="text-[#c8d7d2] text-base">{t.ctaSub}</p></div>
          <div className="flex gap-2.5 flex-wrap">
            <a href={waLink(settings)} target="_blank" rel="noopener noreferrer" className="bg-white text-forest rounded-[35px] px-5 py-3 text-[17px] font-extrabold inline-flex gap-2 items-center"><MessageCircle size={15} />WhatsApp {settings.hotline.replace(/\D/g, "").replace(/^880/, "0")}</a>
            <a href={telLink(settings)} className="bg-white text-forest rounded-[35px] px-5 py-3 text-[17px] font-extrabold inline-flex gap-2 items-center"><Phone size={15} />{t.callNow}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const { lang } = useLang();
  const settings = useSettings();
  const address = lang === "bn" ? settings.address_bn : settings.address_en;
  return (
    <footer id="footer" className="bg-[#07382f] text-[#c7d4d0] py-[34px] scroll-mt-[170px]">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="grid md:grid-cols-3 gap-5">
          <div><div className="flex items-center gap-2.5 text-white"><Image src="/logo.png" alt="Cholti Home Decor" width={120} height={40} className="h-14 w-auto rounded-lg object-cover" /></div><p className="text-[17px] mt-3">{lang === "bn" ? "প্রিমিয়াম হোম ডেকোর, সোফা কভার, বেডশিট, কুশন ও পর্দা।" : "Premium home decor, sofa cover, bedsheet, cushion and curtain."}</p></div>
          <div><b className="text-white">Quick Links</b><br /><br /><Link href="/" className="block">Home</Link><Link href="/shop" className="block">Shop</Link><Link href="/about" className="block">About</Link><Link href="/contact" className="block">Contact</Link><Link href="/track-order" className="block">Track Order</Link><br /><span className="text-base">© {new Date().getFullYear()} Cholti Home Decor</span></div>
          <div><b className="text-white">Contact</b><br /><br /><a href={telLink(settings)} className="block">Hotline: {settings.hotline}</a><a href={`mailto:${settings.email}`} className="block">{settings.email}</a><span className="flex gap-1.5 mt-1.5 text-[17px]"><MapPin size={14} className="shrink-0 mt-0.5" />{address}</span><div className="flex gap-2 mt-3"><a href="#" aria-label="FB" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center text-white"><Globe size={15} /></a><a href="#" aria-label="IG" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center text-white"><AtSign size={15} /></a><a href={waLink(settings)} aria-label="WA" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center text-white"><MessageCircle size={15} /></a></div></div>
        </div>
        <div className="border-t border-white/10 mt-[22px] pt-4 flex justify-between flex-wrap gap-3 text-base"><span>© {new Date().getFullYear()} Cholti, Warm & Elegant • বাংলা + English</span><span>Cash on Delivery • No advance needed</span></div>
      </div>
    </footer>
  );
}

export function FloatingWA() {
  return <ChatWidget />;
}

export { ChatWidget };
