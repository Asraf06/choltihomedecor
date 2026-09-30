// Hero section config. The admin panel manages this same shape in the DB.
// Switch style with HERO_STYLE: "banner" (full-width ads slider) or "boxed" (contained box).

export type HeroStyle = "banner" | "boxed";

export const HERO_STYLE: HeroStyle = "banner";

export type BannerSlide = {
  id: string;
  img: string;
  alt: string;
  badge: { bn: string; en: string };
  eyebrow: { bn: string; en: string };
  title: { bn: string; en: string };
  sub: { bn: string; en: string };
  cta: { bn: string; en: string };
  link: string;
  theme: "clay" | "forest" | "cocoa";
};

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "combo",
    img: U("photo-1555041469-a586c61ea9bc", 800),
    alt: "combo offer sofa",
    badge: { bn: "কম্বো অফার −১৫%", en: "COMBO OFFER −15%" },
    eyebrow: { bn: "সীমিত সময়ের অফার", en: "LIMITED TIME OFFER" },
    title: { bn: "কম্বোতে সাজান পুরো ঘর", en: "Decorate full home in combo" },
    sub: {
      bn: "সোফা কভার + কুশন একসাথে কিনলে ১৫% ছাড়, ক্যাশ অন ডেলিভারি।",
      en: "15% off sofa cover + cushion combo, cash on delivery.",
    },
    cta: { bn: "অফারটি নিন", en: "Grab the offer" },
    link: "#products",
    theme: "clay",
  },
  {
    id: "bedsheet",
    img: U("photo-1522771739844-6a9f6d5f14af", 800),
    alt: "new bedsheet collection",
    badge: { bn: "নতুন কালেকশন", en: "NEW COLLECTION" },
    eyebrow: { bn: "প্রিমিয়াম বেডশিট", en: "PREMIUM BEDSHEET" },
    title: { bn: "ঘুম হবে আরও আরামদায়ক", en: "Sleep more comfortably" },
    sub: {
      bn: "কালার গ্যারান্টি বেডশিট + ২টি পিলো কভার, সারা দেশে ডেলিভারি।",
      en: "Color-guaranteed bedsheet + 2 pillow covers, delivery nationwide.",
    },
    cta: { bn: "কালেকশন দেখুন", en: "View collection" },
    link: "#products",
    theme: "forest",
  },
  {
    id: "cod",
    img: U("photo-1513694203232-719a280e022f", 800),
    alt: "curtain cash on delivery",
    badge: { bn: "অগ্রিম ছাড়াই", en: "NO ADVANCE" },
    eyebrow: { bn: "সহজ অর্ডার", en: "EASY ORDER" },
    title: { bn: "পছন্দের পর্দা, ঘরে বসেই", en: "Favourite curtain, from home" },
    sub: {
      bn: "হোয়াটসঅ্যাপে অর্ডার করুন, পণ্য হাতে পেয়ে টাকা দিন।",
      en: "Order on WhatsApp, pay when you receive it.",
    },
    cta: { bn: "এখনই অর্ডার করুন", en: "Order now" },
    link: "https://wa.me/8801711387707",
    theme: "cocoa",
  },
];
