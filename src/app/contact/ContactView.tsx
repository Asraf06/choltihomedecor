"use client";

import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { useLang } from "@/lib/lang";
import { useSettings, waLink, telLink } from "@/lib/settings-context";

export default function ContactView() {
  const { t, lang } = useLang();
  const settings = useSettings();
  const cards = [
    { icon: Phone, label: lang === "bn" ? "হটলাইন" : "Hotline", value: settings.hotline, href: telLink(settings) },
    { icon: MessageCircle, label: "WhatsApp", value: settings.hotline, href: waLink(settings) },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
  ];
  const address = lang === "bn" ? settings.address_bn : settings.address_en;

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <h1 className="font-serif text-4xl">{t.contact}</h1>
      <div className="gold-divider" />
      <p className="text-lg text-muted max-w-[560px]">
        {lang === "bn"
          ? "অর্ডার বা যেকোনো প্রশ্নের জন্য কল করুন বা হোয়াটসঅ্যাপে মেসেজ পাঠান।"
          : "Call or message on WhatsApp for orders and any questions."}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <a key={c.label} href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-4 bg-paper border border-line rounded-[20px] p-5 hover:border-gold transition">
            <span className="w-12 h-12 rounded-full bg-gold-soft grid place-items-center text-forest shrink-0">
              <c.icon size={20} />
            </span>
            <span>
              <small className="block text-[15px] text-muted font-bold">{c.label}</small>
              <b className="text-[17px] break-all">{c.value}</b>
            </span>
          </a>
        ))}
        <div className="flex items-center gap-4 bg-paper border border-line rounded-[20px] p-5">
          <span className="w-12 h-12 rounded-full bg-gold-soft grid place-items-center text-forest shrink-0">
            <MapPin size={20} />
          </span>
          <span>
            <small className="block text-[15px] text-muted font-bold">{lang === "bn" ? "ঠিকানা" : "Address"}</small>
            <b className="text-[17px] leading-snug block">{address}</b>
          </span>
        </div>
      </div>
    </main>
  );
}
