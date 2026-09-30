"use client";

import { MessageCircle, PackageCheck } from "lucide-react";
import { useLang } from "@/lib/lang";

const TRACK_MSG = "Assalamu alaikum, I want to track my order.";

export default function TrackView() {
  const { t, lang } = useLang();
  const steps =
    lang === "bn"
      ? ["হোয়াটসঅ্যাপে অর্ডার করুন", "কনফার্মেশন মেসেজ সংরক্ষণ করুন", "মেসেজ পাঠালেই ডেলিভারি আপডেট পাবেন"]
      : ["Order on WhatsApp", "Save your confirmation message", "Message us anytime for a delivery update"];

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <h1 className="font-serif text-4xl">{t.trackOrder}</h1>
      <div className="gold-divider" />
      <p className="text-sm text-muted max-w-[560px]">
        {lang === "bn"
          ? "অর্ডারের পর ২-৪ দিনে ডেলিভারি পাবেন। আপডেট জানতে নিচের বাটনে মেসেজ করুন।"
          : "Delivery arrives in 2-4 days after ordering. Message below anytime for an update."}
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-4 bg-paper border border-line rounded-[20px] p-5">
            <span className="w-10 h-10 rounded-full bg-forest text-white grid place-items-center font-serif font-bold shrink-0">
              {i + 1}
            </span>
            <b className="text-sm">{s}</b>
          </div>
        ))}
      </div>
      <a
        href={`https://wa.me/8801711387707?text=${encodeURIComponent(TRACK_MSG)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-clay text-white rounded-[35px] px-6 py-3 text-[13px] font-bold mt-6"
      >
        <MessageCircle size={15} />
        {lang === "bn" ? "হোয়াটসঅ্যাপে ট্র্যাক করুন" : "Track on WhatsApp"}
      </a>
      <p className="flex items-center gap-2 text-[12px] text-muted mt-3">
        <PackageCheck size={14} />
        {lang === "bn" ? "ডেলিভারির সময় পণ্য হাতে পেয়ে টাকা দিন।" : "Pay cash when the delivery arrives."}
      </p>
    </main>
  );
}
