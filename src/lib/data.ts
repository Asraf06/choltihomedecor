export const WA_NUMBER = "8801711387707";
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export type Product = {
  slug: string;
  name: string;
  bn: string;
  cat: string;
  sub?: string;
  tags: string[];
  old: number;
  now: number;
  off: number;
  rating: string;
  img: string;
  imgs: string[];
  badge?: string;
  description?: string;
  fabricIds?: string[];
  sizeIds?: string[];
  colorIds?: string[];
};

export const CATEGORIES = [
  { id: "sofa", name: "Sofa Cover", bn: "sofa cover", img: U("photo-1555041469-a586c61ea9bc", 400), count: "24 designs", badge: "Popular" },
  { id: "bedsheet", name: "Bedsheet", bn: "bedsheet", img: U("photo-1522771739844-6a9f6d5f14af", 400), count: "18 designs" },
  { id: "cushion", name: "Cushion Cover", bn: "cushion cover", img: U("photo-1616486338812-3dadae4b4ace", 400), count: "32 designs" },
  { id: "cushion", name: "Cushion Premium", bn: "premium cushion", img: U("photo-1567016432779-094069958ea5", 400), count: "15 designs" },
  { id: "curtain", name: "Curtain", bn: "porda", img: U("photo-1513694203232-719a280e022f", 400), count: "12 designs" },
  { id: "sofa", name: "Combo Offer", bn: "combo offer", img: U("photo-1493663284031-b7e3aefcae8e", 400), count: "Save 15%" },
];

export const PRODUCTS: Product[] = [
  { slug: "china-magic-print-floral", name: "China Magic Print Sofa Cover - Floral Touch", bn: "soft o sundor", cat: "sofa", tags: ["best"], old: 2850, now: 2350, off: 17, rating: "5.0 (120)", img: U("photo-1555041469-a586c61ea9bc"), imgs: [U("photo-1555041469-a586c61ea9bc", 1000), U("photo-1493663284031-b7e3aefcae8e", 1000), U("photo-1586023492125-27b2c045efd7", 1000)], badge: "Popular" },
  { slug: "korean-velvet-grey", name: "Korean Velvet Sofa Cover - Modern Grey", bn: "premium velvet", cat: "sofa", tags: ["best"], old: 3500, now: 2990, off: 15, rating: "4.9 (98)", img: U("photo-1493663284031-b7e3aefcae8e"), imgs: [U("photo-1493663284031-b7e3aefcae8e", 1000), U("photo-1555041469-a586c61ea9bc", 1000)] },
  { slug: "fujian-jacquard-gold", name: "Fujian Jacquard Sofa Cover - Royal Gold", bn: "royal look", cat: "sofa", tags: [], old: 4200, now: 3590, off: 15, rating: "4.9 (76)", img: U("photo-1586023492125-27b2c045efd7"), imgs: [U("photo-1586023492125-27b2c045efd7", 1000)] },
  { slug: "premium-bedsheet-rose", name: "Premium Bedsheet + 2 Pillow Cover - Fresh Rose", bn: "norom o aramdayok", cat: "bedsheet", tags: ["best"], old: 1850, now: 1450, off: 22, rating: "4.9 (210)", img: U("photo-1522771739844-6a9f6d5f14af"), imgs: [U("photo-1522771739844-6a9f6d5f14af", 1000), U("photo-1505691938895-1758d7feb511", 1000)] },
  { slug: "cushion-combo-4pc", name: "Cushion Cover 16x16 (4pc Combo) - Elegant Finish", bn: "soft o sundor", cat: "cushion", tags: ["best"], old: 990, now: 790, off: 20, rating: "5.0 (180)", img: U("photo-1616486338812-3dadae4b4ace"), imgs: [U("photo-1616486338812-3dadae4b4ace", 1000)] },
  { slug: "cushion-premium-floral", name: "Cushion Cover Premium - Soft Floral", bn: "premium finishing", cat: "cushion", tags: [], old: 650, now: 520, off: 20, rating: "4.8 (64)", img: U("photo-1567016432779-094069958ea5"), imgs: [U("photo-1567016432779-094069958ea5", 1000)] },
  { slug: "curtain-blue-7ft", name: "Light Blue Curtain (7ft) - Airy Weave", bn: "alo-batash friendly", cat: "curtain", tags: [], old: 1250, now: 990, off: 21, rating: "4.8 (52)", img: U("photo-1513694203232-719a280e022f"), imgs: [U("photo-1513694203232-719a280e022f", 1000)] },
  { slug: "curtain-beige-8ft", name: "Warm Beige Curtain (8ft) - Thick Premium", bn: "mota premium", cat: "curtain", tags: [], old: 1450, now: 1190, off: 18, rating: "4.9 (41)", img: U("photo-1505691938895-1758d7feb511"), imgs: [U("photo-1505691938895-1758d7feb511", 1000)] },
];

export type Review = { t: string; n: string; a: string };

// TBD: add real customer reviews here once the owner provides them.
export const REVIEWS: Review[] = [];

export const FABRICS = ["China Magic Print", "Korean Velvet", "Fujian Jacquard"];
