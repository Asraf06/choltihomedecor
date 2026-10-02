"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { collection, query, where, limit, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { clientDb } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang";

type Review = { id: string; user_name: string; rating: number; text: string; created_at: string; approved?: boolean };

export default function ProductReviews({ slug, productName }: { slug: string; productName: string }) {
  const { t } = useLang();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [canReview, setCanReview] = useState<boolean | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getDocs(query(collection(clientDb, "product_reviews"), where("product_slug", "==", slug), limit(20)))
      .then((s) =>
        setReviews(
          s.docs
            .map((d) => ({ id: d.id, ...(d.data() as object) }) as Review)
            .filter((r) => r.approved !== false)
            .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
        )
      )
      .catch(() => setReviews([]));
  }, [slug]);

  useEffect(() => {
    if (!user) {
      setCanReview(null);
      return;
    }
    getDoc(doc(clientDb, "users", user.uid, "purchased", slug))
      .then((s) => setCanReview(s.exists()))
      .catch(() => setCanReview(false));
  }, [user, slug]);

  const submit = async () => {
    if (!user || !text.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      const snap = await addDoc(collection(clientDb, "product_reviews"), {
        product_slug: slug,
        product_name: productName,
        uid: user.uid,
        user_name: user.displayName || user.email || "Customer",
        rating,
        text: text.trim().slice(0, 600),
        approved: true,
        created_at: new Date().toISOString(),
      });
      setReviews((r) => [
        { id: snap.id, user_name: user.displayName || user.email || "Customer", rating, text: text.trim().slice(0, 600), created_at: new Date().toISOString() },
        ...(r ?? []),
      ]);
      setText("");
      setDone(true);
    } catch {
      setErr(t.uploadFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="my-6 max-w-3xl">
      <h2 className="font-serif text-2xl mb-3">{t.customerReviews}</h2>
      {!reviews ? (
        <p className="text-lg text-muted">...</p>
      ) : !reviews.length ? (
        <p className="text-lg text-muted">{t.noProductReviews}</p>
      ) : (
        <div className="flex flex-col gap-3 mb-5">
          {reviews.map((r) => (
            <div key={r.id} className="bg-paper border border-line rounded-[16px] p-4">
              <div className="flex items-center gap-2">
                <b className="text-[16px]">{r.user_name}</b>
                <span className="text-gold text-[15px]">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <small className="text-muted text-[14px] ml-auto">{String(r.created_at).slice(0, 10)}</small>
              </div>
              <p className="text-[16px] mt-1">{r.text}</p>
            </div>
          ))}
        </div>
      )}
      {!user ? (
        <p className="text-[16px] text-muted">
          {t.signInToReview}{" "}
          <Link href="/login" className="font-bold text-clay underline">{t.signIn}</Link>
        </p>
      ) : canReview === null ? (
        <p className="text-[16px] text-muted">...</p>
      ) : !canReview ? (
        <p className="text-[16px] text-muted">{t.orderFirst}</p>
      ) : done ? (
        <p className="text-[16px] font-bold text-forest">{t.reviewThanks}</p>
      ) : (
        <div className="bg-paper border border-line rounded-[16px] p-4">
          <b className="text-[17px]">{t.writeReview}</b>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[15px] font-bold">{t.yourRating}:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} star`} className={n <= rating ? "text-gold" : "text-line"}>
                <Star size={24} fill="currentColor" />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={600}
            rows={3}
            placeholder={t.yourReview}
            className="mt-2.5 w-full border border-line bg-sand rounded-xl p-3 text-[16px] outline-none"
          />
          {err && <p className="text-[15px] font-bold text-clay mt-1.5">{err}</p>}
          <button disabled={busy || !text.trim()} onClick={submit} className="mt-2.5 inline-flex bg-clay text-white rounded-[35px] px-6 py-2.5 text-[16px] font-bold hover:bg-clay-dark disabled:opacity-50">
            {t.submitReview}
          </button>
        </div>
      )}
    </section>
  );
}
