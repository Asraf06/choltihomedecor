"use client";
import { MessageCircle, Phone, Globe, AtSign } from "lucide-react";
import Link from "next/link";
import { WA_LINK } from "@/lib/data";
import { useLang } from "@/lib/lang";

export function CTA() {
  const { t } = useLang();
  return (
    <div className="bg-cream py-[18px] pb-[58px]">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="rounded-[26px] p-[34px] flex justify-between items-center gap-5 flex-wrap relative overflow-hidden bg-gradient-to-br from-forest-deep to-forest-2">
          <span className="absolute right-5 -top-2.5 text-[80px] text-white/15">✦</span>
          <div><h2 className="text-white text-2xl font-serif max-w-[520px]">{t.ctaTitle}</h2><p className="text-[#c8d7d2] text-xs">{t.ctaSub}</p></div>
          <div className="flex gap-2.5 flex-wrap">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="bg-white text-forest rounded-[35px] px-5 py-3 text-[13px] font-extrabold inline-flex gap-2 items-center"><MessageCircle size={15} />WhatsApp 01711387707</a>
            <a href="tel:+8801711387707" className="bg-white text-forest rounded-[35px] px-5 py-3 text-[13px] font-extrabold inline-flex gap-2 items-center"><Phone size={15} />{t.callNow}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const { lang } = useLang();
  return (
    <footer id="footer" className="bg-[#07382f] text-[#c7d4d0] py-[34px] scroll-mt-[170px]">
      <div className="max-w-[1180px] mx-auto px-5">
        <div className="grid md:grid-cols-3 gap-5">
          <div><div className="flex items-center gap-2.5 text-white"><span className="w-10 h-10 rounded-xl bg-gold text-forest grid place-items-center font-serif font-bold text-xl">C</span><span><b className="font-serif text-xl">Cholti</b><br /><small className="tracking-[2px] text-[10px] text-gold">BETTER HOME BETTER LIFE</small></span></div><p className="text-[13px] mt-3">{lang === "bn" ? "প্রিমিয়াম হোম ডেকোর, সোফা কভার, বেডশিট, কুশন ও পর্দা।" : "Premium home decor, sofa cover, bedsheet, cushion and curtain."}</p></div>
          <div><b className="text-white">Quick Links</b><br /><br /><Link href="/" className="block">Home</Link><Link href="/shop" className="block">Shop</Link><Link href="/about" className="block">About</Link><Link href="/contact" className="block">Contact</Link><Link href="/track-order" className="block">Track Order</Link><br /><span className="text-xs">© {new Date().getFullYear()} Cholti Home Decor</span></div>
          <div><b className="text-white">Contact</b><br /><br /><a href="tel:+8801711387707" className="block">Hotline: 01711-387707</a><a href="mailto:support@cholti.com" className="block">support@cholti.com</a><div className="flex gap-2 mt-3"><a href="#" aria-label="FB" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center text-white"><Globe size={15} /></a><a href="#" aria-label="IG" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center text-white"><AtSign size={15} /></a><a href={WA_LINK} aria-label="WA" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center text-white"><MessageCircle size={15} /></a></div></div>
        </div>
        <div className="border-t border-white/10 mt-[22px] pt-4 flex justify-between flex-wrap gap-3 text-xs"><span>© {new Date().getFullYear()} Cholti, Warm & Elegant • বাংলা + English</span><span>Cash on Delivery • No advance needed</span></div>
      </div>
    </footer>
  );
}

export function FloatingWA() {
  return (
    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="fixed right-[18px] bottom-[18px] w-[54px] h-[54px] rounded-full bg-[#25d366] text-white grid place-items-center border-[3px] border-white shadow-[0_18px_50px_rgba(62,32,12,0.10)] z-[70] before:content-[''] before:absolute before:-inset-1.5 before:rounded-full before:border-2 before:border-[#25d366] before:animate-[tj-ripple_2s_infinite]">
      <MessageCircle size={22} />
    </a>
  );
}
