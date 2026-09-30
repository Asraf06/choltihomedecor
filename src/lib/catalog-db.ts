import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { PRODUCTS, CATEGORIES, REVIEWS, type Product } from "./data";

const UPLOADS_BASE = process.env.ADMIN_PUBLIC_URL ?? "http://localhost:3001";

let cached: ReturnType<typeof getFirestore> | null = null;

function fsdb() {
  if (!cached) {
    if (!getApps().length) {
      const inline = process.env.FIREBASE_SERVICE_ACCOUNT;
      const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (inline) initializeApp({ credential: cert(JSON.parse(inline)) });
      else if (keyFile) initializeApp({ credential: cert(keyFile) });
      else throw new Error("Firebase credentials are not set");
    }
    cached = getFirestore();
  }
  return cached;
}

export type ShopCategory = { id: string; name: string; bn: string; img: string; count: string; badge?: string };
export type ShopReview = { t: string; n: string; a: string };

const absolutize = (src: string) => (src.startsWith("/uploads/") ? `${UPLOADS_BASE}${src}` : src);

// Categories added without an image get a default interior photo instead of an empty circle.
const DEFAULT_CAT_IMG =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop";

function toProduct(id: string, v: FirebaseFirestore.DocumentData): Product {
  const rawImgs = Array.isArray(v.imgs) && v.imgs.length ? v.imgs : [String(v.img ?? "")];
  const imgs = (rawImgs as string[]).map((s) => (s.trim() ? absolutize(s.trim()) : DEFAULT_CAT_IMG.replace("w=400", "w=800")));
  return {
    slug: id,
    name: String(v.name ?? ""),
    bn: String(v.bn ?? ""),
    cat: String(v.cat ?? ""),
    tags: Array.isArray(v.tags) ? v.tags : [],
    old: Number(v.old ?? 0),
    now: Number(v.now ?? 0),
    off: Number(v.off ?? 0),
    rating: String(v.rating ?? ""),
    img: imgs[0],
    imgs,
    badge: v.badge ? String(v.badge) : undefined,
  };
}

function toCategory(id: string, v: FirebaseFirestore.DocumentData): ShopCategory {
  const img = String(v.img ?? "").trim();
  return {
    id,
    name: String(v.name ?? ""),
    bn: String(v.bn ?? ""),
    img: img ? absolutize(img) : DEFAULT_CAT_IMG,
    count: String(v.count_label ?? ""),
    badge: v.badge ? String(v.badge) : undefined,
  };
}

function toReview(v: FirebaseFirestore.DocumentData): ShopReview {
  return { t: String(v.text ?? ""), n: String(v.name ?? ""), a: String(v.area ?? "") };
}

async function activeDocs(collection: string) {
  const snap = await fsdb().collection(collection).where("active", "==", 1).get();
  return snap.docs
    .map((d) => ({ order: Number(d.data().sort_order ?? 0), doc: d }))
    .sort((a, b) => a.order - b.order)
    .map((x) => x.doc);
}

export async function getProducts(): Promise<Product[]> {
  try {
    const docs = await activeDocs("products");
    if (!docs.length) throw new Error("no products");
    const withOrder = await Promise.all(
      docs.map(async (d) => ({ order: Number(d.data().sort_order ?? 0), p: toProduct(d.id, d.data()) }))
    );
    return withOrder.sort((a, b) => a.order - b.order).map((x) => x.p);
  } catch (e) {
    console.warn("[catalog-db] products fallback:", e instanceof Error ? e.message : e);
    return PRODUCTS;
  }
}

export async function getCategories(): Promise<ShopCategory[]> {
  try {
    const docs = await activeDocs("categories");
    if (!docs.length) throw new Error("no categories");
    const withOrder = docs.map((d) => ({ order: Number(d.data().sort_order ?? 0), c: toCategory(d.id, d.data()) }));
    return withOrder.sort((a, b) => a.order - b.order).map((x) => x.c);
  } catch (e) {
    console.warn("[catalog-db] categories fallback:", e instanceof Error ? e.message : e);
    return CATEGORIES as ShopCategory[];
  }
}

export async function getReviews(): Promise<ShopReview[]> {
  try {
    const docs = await activeDocs("reviews");
    return docs.map((d) => toReview(d.data()));
  } catch (e) {
    console.warn("[catalog-db] reviews fallback:", e instanceof Error ? e.message : e);
    return REVIEWS;
  }
}
