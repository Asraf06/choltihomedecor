import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { BANNER_SLIDES, HERO_STYLE, type BannerSlide, type HeroStyle } from "./hero";

const UPLOADS_BASE = process.env.ADMIN_PUBLIC_URL ?? "http://localhost:3001";

let cached: ReturnType<typeof getFirestore> | null = null;

function fsdb() {
  if (!cached) {
    if (!getApps().length) {
      const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (!keyFile) throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set");
      initializeApp({ credential: cert(keyFile) });
    }
    cached = getFirestore();
  }
  return cached;
}

type HeroPayload = { style: HeroStyle; slides: BannerSlide[] };

type Row = {
  id: string; title_bn: string; title_en: string;
  sub_bn: string; sub_en: string; eyebrow_bn: string; eyebrow_en: string;
  cta_bn: string; cta_en: string; link: string; image: string;
  theme: string; badge_bn: string; badge_en: string;
  starts_at: string | null; ends_at: string | null;
};

const absolutize = (src: string) => (src.startsWith("/uploads/") ? `${UPLOADS_BASE}${src}` : src);

function toSlide(id: string, r: Row): BannerSlide {
  return {
    id,
    img: absolutize(r.image),
    alt: r.title_en,
    badge: { bn: r.badge_bn, en: r.badge_en },
    eyebrow: { bn: r.eyebrow_bn, en: r.eyebrow_en },
    title: { bn: r.title_bn, en: r.title_en },
    sub: { bn: r.sub_bn, en: r.sub_en },
    cta: { bn: r.cta_bn, en: r.cta_en },
    link: r.link,
    theme: r.theme === "forest" || r.theme === "cocoa" ? r.theme : "clay",
  };
}

function inWindow(starts: unknown, ends: unknown, t: string) {
  if (typeof starts === "string" && starts && t < starts) return false;
  if (typeof ends === "string" && ends && t > ends) return false;
  return true;
}

// Reads hero straight from Firestore. Static fallback keeps the site up if Firebase is down.
export async function getHero(): Promise<HeroPayload> {
  try {
    const db = fsdb();
    const [cfg, snap] = await Promise.all([
      db.doc("hero_config/main").get(),
      db.collection("hero_slides").where("active", "==", 1).orderBy("sort_order").get(),
    ]);
    const style = cfg.data()?.style;
    if (style !== "banner" && style !== "editorial") throw new Error("bad style");
    const now = new Date().toISOString();
    const slides = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as object) }) as Row & { id: string })
      .filter((r) => inWindow(r.starts_at, r.ends_at, now))
      .map((r) => toSlide(r.id, r));
    if (!slides.length) throw new Error("no slides");
    return { style, slides };
  } catch (e) {
    console.warn("[hero-db] Firestore unreachable, static fallback:", e instanceof Error ? e.message : e);
    return { style: HERO_STYLE, slides: BANNER_SLIDES };
  }
}
