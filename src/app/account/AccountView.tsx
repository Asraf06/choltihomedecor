"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Package, Star, Camera, Copy, Check, Trash2 } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, orderBy, limit, getDocs, deleteDoc } from "firebase/firestore";
import { clientAuth, clientDb } from "@/lib/firebase-client";
import { useAuth, publicUserId } from "@/lib/auth-context";
import { useLang } from "@/lib/lang";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; qty: number }[];
};

type Review = {
  id: string;
  product_slug: string;
  rating: number;
  text: string;
  created_at: string;
};

export default function AccountView() {
  const { t } = useLang();
  const { user, loading } = useAuth();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [savedTick, setSavedTick] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.displayName ?? "");
    setPhoto(user.photoURL ?? "");
    setUserId(publicUserId(user.uid));
    getDoc(doc(clientDb, "users", user.uid))
      .then((s) => {
        const d = s.data();
        if (typeof d?.name === "string" && d.name) setName(d.name);
        if (typeof d?.photo === "string" && d.photo) setPhoto(d.photo);
        if (typeof d?.user_id === "string" && d.user_id) setUserId(d.user_id);
      })
      .catch(() => {});
    getDocs(query(collection(clientDb, "users", user.uid, "orders"), orderBy("created_at", "desc"), limit(20)))
      .then((s) => setOrders(s.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Order)))
      .catch(() => setOrders([]));
    getDocs(query(collection(clientDb, "product_reviews"), where("uid", "==", user.uid), limit(20)))
      .then((s) => setReviews(s.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Review)))
      .catch(() => setReviews([]));
  }, [user]);

  if (!loading && !user) {
    return (
      <main className="max-w-[1180px] mx-auto px-5 py-12 text-center">
        <h1 className="font-serif text-4xl">{t.myAccount}</h1>
        <div className="gold-divider" />
        <p className="text-lg text-muted mb-5">{t.signInToAccount}</p>
        <Link href="/login" className="inline-flex bg-clay text-white rounded-[35px] px-7 py-3 text-[17px] font-bold hover:bg-clay-dark">
          {t.signIn}
        </Link>
      </main>
    );
  }
  if (!user) return <main className="max-w-[1180px] mx-auto px-5 py-12"><p className="text-lg text-muted">...</p></main>;

  const saveName = async () => {
    setMsg(null);
    try {
      const v = name.trim().slice(0, 60);
      if (clientAuth.currentUser && v) await updateProfile(clientAuth.currentUser, { displayName: v });
      await setDoc(doc(clientDb, "users", user.uid), { name: v, updated_at: new Date().toISOString() }, { merge: true });
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 2000);
    } catch {
      setMsg(t.uploadFailed);
    }
  };

  const onPhoto = async (f: File | undefined) => {
    if (!f) return;
    setMsg(null);
    if (!f.type.startsWith("image/") || f.size > 2 * 1024 * 1024) {
      setMsg(t.photoTooBig);
      return;
    }
    setUploading(true);
    try {
      const token = await user.getIdToken();
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(String(data.error ?? "upload"));
      const url = String(data.url);
      if (clientAuth.currentUser) await updateProfile(clientAuth.currentUser, { photoURL: url });
      await setDoc(doc(clientDb, "users", user.uid), { photo: url, updated_at: new Date().toISOString() }, { merge: true });
      setPhoto(url);
    } catch (e) {
      const detail = e instanceof Error ? e.message : "";
      setMsg(detail && detail !== "upload" ? `Upload failed: ${detail}` : t.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const delReview = async (id: string) => {
    try {
      await deleteDoc(doc(clientDb, "product_reviews", id));
      setReviews((r) => (r ?? []).filter((x) => x.id !== id));
    } catch {}
  };

  return (
    <main className="max-w-[1180px] mx-auto px-5 py-8">
      <h1 className="font-serif text-4xl">{t.myAccount}</h1>
      <div className="gold-divider" />
      {msg && <p role="alert" className="rounded-xl border border-clay/40 bg-clay-light px-3.5 py-2.5 text-[17px] font-bold text-clay mb-4 max-w-2xl">{msg}</p>}
      <div className="grid md:grid-cols-[300px_1fr] gap-5 items-start">
        <section className="bg-paper border border-line rounded-[20px] p-5 text-center">
          <button onClick={() => fileRef.current?.click()} className="relative mx-auto w-24 h-24 rounded-full overflow-hidden bg-sand border border-line grid place-items-center group" aria-label={t.changePhoto}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={t.profilePhoto} className="w-full h-full object-cover" />
            ) : (
              <b className="font-serif text-4xl text-forest">{(name || user.email || "U")[0]?.toUpperCase()}</b>
            )}
            <span className="absolute inset-0 bg-black/45 text-white hidden group-hover:grid place-items-center">
              <Camera size={22} />
            </span>
            {uploading && <span className="absolute inset-0 bg-black/45 text-white grid place-items-center text-sm font-bold">...</span>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
          <p className="text-[15px] text-muted mt-1.5">{t.tapToChange}</p>
          <button
            onClick={() => { navigator.clipboard?.writeText(userId).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sand border border-line px-3 py-1.5 text-[15px] font-extrabold"
            title={t.copyId}
          >
            {userId || "..."} {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <p className="text-[15px] text-muted mt-1">{t.userId}</p>
          <p className="text-[16px] truncate mt-2">{user.email}</p>
          <label className="block text-left text-base font-bold mt-4">
            {t.displayName}
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="mt-1.5 w-full h-[42px] border border-line bg-sand rounded-xl px-3.5 text-lg font-normal outline-none" />
          </label>
          <button onClick={saveName} className="mt-3 w-full inline-flex justify-center items-center gap-1.5 bg-clay text-white rounded-[35px] py-2.5 text-[17px] font-bold hover:bg-clay-dark">
            {savedTick ? <Check size={15} /> : null}{savedTick ? t.saved : t.saveChanges}
          </button>
        </section>
        <div className="flex flex-col gap-5">
          <section className="bg-paper border border-line rounded-[20px] p-5">
            <h2 className="font-serif text-2xl mb-3">{t.myOrders}</h2>
            {!orders ? (
              <p className="text-lg text-muted">...</p>
            ) : !orders.length ? (
              <p className="text-lg text-muted">{t.noOrders}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center gap-4 bg-sand/60 border border-line rounded-[16px] p-4">
                    <span className="w-10 h-10 rounded-full bg-gold-soft grid place-items-center text-forest shrink-0">
                      <Package size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <b className="text-[17px] block truncate">{o.items.map((it) => `${it.name} x${it.qty}`).join(", ")}</b>
                      <small className="text-muted text-[15px]">{String(o.created_at).slice(0, 10)} • {Number(o.total).toLocaleString()}৳</small>
                    </div>
                    <span className="bg-forest text-white text-[14px] font-extrabold rounded-full px-2.5 py-1 shrink-0">{o.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="bg-paper border border-line rounded-[20px] p-5">
            <h2 className="font-serif text-2xl mb-3">{t.myReviews}</h2>
            {!reviews ? (
              <p className="text-lg text-muted">...</p>
            ) : !reviews.length ? (
              <p className="text-lg text-muted">{t.noReviews}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-sand/60 border border-line rounded-[16px] p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gold text-[15px]">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      <Link href={`/product/${r.product_slug}`} className="text-[15px] font-bold text-clay underline truncate">{r.product_slug}</Link>
                      <button onClick={() => delReview(r.id)} className="ml-auto inline-flex items-center gap-1 text-[14px] font-bold text-clay" aria-label={t.deleteReview}>
                        <Trash2 size={13} />{t.deleteReview}
                      </button>
                    </div>
                    <p className="text-[16px] mt-1.5">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
