"use client";

import { Phone, MessageCircle, Mail } from "lucide-react";
import { WA_LINK } from "@/lib/data";
import { useLang } from "@/lib/lang";

export default function ContactView() {
  const { t, lang } = useLang();
  const cards = [
    { icon: Phone, label: lang === "bn" ? "হটলাইন" : "Hotline", value: "01711-387707", href: "tel:+8801711387707" },
    { icon: MessageCircle, label: "WhatsApp", value: "01711-387707", href: WA_LINK },
    { icon: Mail, label: "Email", value: "support@cholti.com", href: "mailto:support@cholti.com" },
  ];

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <h1 className="font-serif text-4xl">{t.contact}</h1>
      <div className="gold-divider" />
      <p className="text-sm text-muted max-w-[560px]">
        {lang === "bn"
          ? "অর্ডার বা যেকোনো প্রশ্নের জন্য কল করুন বা হোয়াটসঅ্যাপে মেসেজ পাঠান।"
          : "Call or message on WhatsApp for orders and any questions."}
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {cards.map((c) => (
          <a key={c.label} href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-4 bg-paper border border-line rounded-[20px] p-5 hover:border-gold transition">
            <span className="w-12 h-12 rounded-full bg-gold-soft grid place-items-center text-forest shrink-0">
              <c.icon size={20} />
            </span>
            <span>
              <small className="block text-[11px] text-muted font-bold">{c.label}</small>
              <b className="text-[15px]">{c.value}</b>
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
