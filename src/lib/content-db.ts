import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { ttlCache } from "./ttl-cache";

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

export type BrandContent = {
  title_en: string;
  title_bn: string;
  text_en: string;
  text_bn: string;
  img: string;
  points_en: string[];
  points_bn: string[];
};

export type AboutContent = {
  title_en: string;
  title_bn: string;
  body_en: string;
  body_bn: string;
};

const DEFAULT_BRAND: BrandContent = {
  title_en: "Better Home, Better Life",
  title_bn: "সুন্দর ঘর, সুন্দর জীবন",
  text_en:
    "Cholti Home Decor brings premium sofa covers, bedsheets, cushion covers and curtains to homes across Bangladesh — beautiful design, honest quality and cash on delivery.",
  text_bn:
    "চলতি হোম ডেকোর সারা বাংলাদেশে পৌঁছে দিচ্ছে প্রিমিয়াম সোফা কভার, বেডশিট, কুশন কভার ও পর্দা — সুন্দর ডিজাইন, সৎ কোয়ালিটি আর ক্যাশ অন ডেলিভারি।",
  img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&q=80&auto=format&fit=crop",
  points_en: ["Premium Fabric", "Cash on Delivery", "Easy Exchange"],
  points_bn: ["প্রিমিয়াম ফেব্রিক", "ক্যাশ অন ডেলিভারি", "সহজ এক্সচেঞ্জ"],
};

const DEFAULT_ABOUT: AboutContent = {
  title_en: "About Cholti Home Decor",
  title_bn: "চলতি হোম ডেকোর সম্পর্কে",
  body_en:
    "Cholti Home Decor started with one simple goal: make every home in Bangladesh beautiful without breaking the budget.\nWe handpick fabrics, check every stitch, and deliver to your door with cash on delivery and easy exchange.",
  body_bn:
    "চলতি হোম ডেকোরের শুরু একটাই লক্ষ্য নিয়ে: বাজেটের মধ্যে বাংলাদেশের প্রতিটা ঘর সুন্দর করা।\nআমরা ফেব্রিক বেছে নিই, প্রতিটা সেলাই চেক করি, আর ক্যাশ অন ডেলিভারি ও সহজ এক্সচেঞ্জসহ আপনার দরজায় পৌঁছে দিই।",
};

const absolutize = (src: string) => (src.startsWith("/uploads/") ? `${UPLOADS_BASE}${src}` : src);

function strList(v: unknown): string[] {
  return Array.isArray(v) ? (v as unknown[]).filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];
}

export async function getBrand(): Promise<BrandContent> {
  return ttlCache("content:brand", 60_000, async () => {
    try {
      const snap = await fsdb().doc("content/brand").get();
      if (!snap.exists) throw new Error("no brand");
      const v = snap.data() ?? {};
      return {
        title_en: String(v.title_en ?? DEFAULT_BRAND.title_en),
        title_bn: String(v.title_bn ?? DEFAULT_BRAND.title_bn),
        text_en: String(v.text_en ?? DEFAULT_BRAND.text_en),
        text_bn: String(v.text_bn ?? DEFAULT_BRAND.text_bn),
        img: String(v.img ?? "").trim() ? absolutize(String(v.img).trim()) : DEFAULT_BRAND.img,
        points_en: strList(v.points_en).length ? strList(v.points_en) : DEFAULT_BRAND.points_en,
        points_bn: strList(v.points_bn).length ? strList(v.points_bn) : DEFAULT_BRAND.points_bn,
      };
    } catch {
      return DEFAULT_BRAND;
    }
  });
}

export async function getAbout(): Promise<AboutContent> {
  return ttlCache("content:about", 60_000, async () => {
    try {
      const snap = await fsdb().doc("content/about").get();
      if (!snap.exists) throw new Error("no about");
      const v = snap.data() ?? {};
      return {
        title_en: String(v.title_en ?? DEFAULT_ABOUT.title_en),
        title_bn: String(v.title_bn ?? DEFAULT_ABOUT.title_bn),
        body_en: String(v.body_en ?? DEFAULT_ABOUT.body_en),
        body_bn: String(v.body_bn ?? DEFAULT_ABOUT.body_bn),
      };
    } catch {
      return DEFAULT_ABOUT;
    }
  });
}
