"use client";

import { useEffect, useState } from "react";
import { MessageCircle, PackageCheck, Package } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { clientDb } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang";
import { useSettings } from "@/lib/settings-context";

const TRACK_MSG = "Assalamu alaikum, I want to track my order.";

const STEPS = [
  { key: "new", en: "Placed", bn: "অর্ডার হয়েছে" },
  { key: "confirmed", en: "Confirmed", bn: "কনফার্ম" },
  { key: "delivering", en: "On the way", bn: "পথে আছে" },
  { key: "delivered", en: "Delivered", bn: "ডেলিভারি হয়েছে" },
];

function stageOf(status: string): number {
  if (status === "confirmed") return 1;
  if (status === "delivering") return 2;
  if (status === "delivered") return 3;
  return 0;
}

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; qty: number }[];
};

export default function TrackView() {
  const { t, lang } = useLang();
  const settings = useSettings();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const steps =
    lang === "bn"
      ? ["হোয়াটসঅ্যাপে অর্ডার করুন", "কনফার্মেশন মেসেজ সংরক্ষণ করুন", "মেসেজ পাঠালেই ডেলিভারি আপডেট পাবেন"]
      : ["Order on WhatsApp", "Save your confirmation message", "Message us anytime for a delivery update"];

  useEffect(() => {
    if (!user) {
      setOrders(null);
      return;
    }
    getDocs(query(collection(clientDb, "users", user.uid, "orders"), orderBy("created_at", "desc"), limit(10)))
      .then((snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Order)))
      .catch(() => setOrders([]));
  }, [user]);

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <h1 className="font-serif text-4xl">{t.trackOrder}</h1>
      <div className="gold-divider" />
      <p className="text-lg text-muted max-w-[560px]">
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
            <b className="text-lg">{s}</b>
          </div>
        ))}
      </div>
      {user && (
        <div className="mt-8">
          <h2 className="font-serif text-xl md:text-2xl mb-3">
            {lang === "bn" ? "আমার অর্ডার" : "My Orders"}
          </h2>
          {!orders ? (
            <p className="text-lg text-muted">...</p>
          ) : !orders.length ? (
            <p className="text-lg text-muted">
              {lang === "bn" ? "এখনো কোনো অর্ডার নেই।" : "No orders yet."}
            </p>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl">
              {orders.map((o) => {
                const stage = stageOf(o.status);
                const cancelled = o.status === "cancelled";
                return (
                <div key={o.id} className="bg-paper border border-line rounded-[16px] p-4">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-gold-soft grid place-items-center text-forest shrink-0">
                      <Package size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <b className="text-[17px] block truncate">
                        {o.items.map((it) => `${it.name} x${it.qty}`).join(", ")}
                      </b>
                      <small className="text-muted text-[15px]">
                        {String(o.created_at).slice(0, 10)} • {o.total.toLocaleString()}৳
                      </small>
                    </div>
                    <span className={`${cancelled ? "bg-clay" : "bg-forest"} text-white text-[14px] font-extrabold rounded-full px-2.5 py-1 shrink-0`}>
                      {cancelled ? (lang === "bn" ? "বাতিল" : "Cancelled") : lang === "bn" ? STEPS[stage].bn : STEPS[stage].en}
                    </span>
                  </div>
                  {!cancelled && (
                    <div className="flex items-center mt-3" aria-hidden>
                      {STEPS.map((s, i) => (
                        <div key={s.key} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                          <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-extrabold shrink-0 ${i <= stage ? "bg-forest text-white" : "bg-sand border border-line text-muted"}`}>
                            {i <= stage ? "✓" : ""}
                          </span>
                          <small className={`ml-1 mr-2 text-[13px] font-bold whitespace-nowrap ${i <= stage ? "" : "text-muted"}`}>
                            {lang === "bn" ? s.bn : s.en}
                          </small>
                          {i < STEPS.length - 1 && <span className={`flex-1 h-0.5 mx-0.5 ${i < stage ? "bg-forest" : "bg-line"}`} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <a
        href={`https://wa.me/${settings.wa_number}?text=${encodeURIComponent(TRACK_MSG)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-clay text-white rounded-[35px] px-6 py-3 text-[17px] font-bold mt-6"
      >
        <MessageCircle size={15} />
        {lang === "bn" ? "হোয়াটসঅ্যাপে ট্র্যাক করুন" : "Track on WhatsApp"}
      </a>
      <p className="flex items-center gap-2 text-[16px] text-muted mt-3">
        <PackageCheck size={14} />
        {lang === "bn" ? "ডেলিভারির সময় পণ্য হাতে পেয়ে টাকা দিন।" : "Pay cash when the delivery arrives."}
      </p>
    </main>
  );
}
