"use client";

import { useEffect, useState } from "react";
import { MessageCircle, PackageCheck, Package } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { clientDb } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang";

const TRACK_MSG = "Assalamu alaikum, I want to track my order.";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; qty: number }[];
};

export default function TrackView() {
  const { t, lang } = useLang();
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
      {user && (
        <div className="mt-8">
          <h2 className="font-serif text-2xl mb-3">
            {lang === "bn" ? "আমার অর্ডার" : "My Orders"}
          </h2>
          {!orders ? (
            <p className="text-sm text-muted">...</p>
          ) : !orders.length ? (
            <p className="text-sm text-muted">
              {lang === "bn" ? "এখনো কোনো অর্ডার নেই।" : "No orders yet."}
            </p>
          ) : (
            <div className="flex flex-col gap-3 max-w-2xl">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center gap-4 bg-paper border border-line rounded-[16px] p-4">
                  <span className="w-10 h-10 rounded-full bg-gold-soft grid place-items-center text-forest shrink-0">
                    <Package size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <b className="text-[13px] block truncate">
                      {o.items.map((it) => `${it.name} x${it.qty}`).join(", ")}
                    </b>
                    <small className="text-muted text-[11px]">
                      {String(o.created_at).slice(0, 10)} • {o.total.toLocaleString()}৳
                    </small>
                  </div>
                  <span className="bg-forest text-white text-[10px] font-extrabold rounded-full px-2.5 py-1 shrink-0">
                    {lang === "bn" && o.status === "pending" ? "পেন্ডিং" : o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
